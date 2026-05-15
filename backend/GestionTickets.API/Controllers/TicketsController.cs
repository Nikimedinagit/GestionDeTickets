using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using GestionTickets.Models.Generales;
using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.Tokens;
using System.Globalization;
using GestionTickets.Generales;

namespace GestionTickets.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TicketsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly UserManager<ApplicationUser> _userManager;


        public TicketsController(ApplicationDbContext context, UserManager<ApplicationUser> userManager)
        {
            _context = context;
            _userManager = userManager;
        }


        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        /// METODO PARA OBTENER TICKETS SEGUN SU ESTADO ACTIVO(ABIETO Y PROCESO) O FINALZIADO (CERRADO Y CANCELADO) ///////////////////////////
        /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        [Authorize(Roles = "ADMINISTRADOR,CLIENTE,DESARROLLADOR")]
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Ticket>>> GetTickets([FromQuery] FiltrarTicket filtro)
        {
            var rolUsuario = HttpContext.User.FindFirst(ClaimTypes.Role)?.Value;
            var idUsuario = HttpContext.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var emailUsuario = HttpContext.User.FindFirst(ClaimTypes.Email)?.Value;

            var obtenerTicket = _context.Ticket
                    .Include(t => t.Categoria)
                    .Include(t => t.UsuarioFinalizador)
                    .Include(t => t.Comentarios)
                        .ThenInclude(c => c.ApplicationUser)
                    .AsNoTracking()
                    .AsQueryable();

            if (rolUsuario == "DESARROLLADOR")
            {
                var desarrollador = await _context.Desarrollador
                    .AsNoTracking()
                    .FirstOrDefaultAsync(d => d.Email.ToLower() == emailUsuario.ToLower());

                if (desarrollador != null)
                {
                    var categoriasPermitidas = await _context.PuestoCategoria
                        .Where(pc => pc.PuestoID == desarrollador.PuestoID)
                        .Select(pc => pc.CategoriaID)
                        .ToListAsync();

                    obtenerTicket = obtenerTicket.Where(t => categoriasPermitidas.Contains(t.CategoriaID));
                }
            }
            else if (rolUsuario == "CLIENTE")
            {
                obtenerTicket = obtenerTicket.Where(t => t.UsuarioClienteId == idUsuario);
            }

            if (filtro != null)
            {
                if (filtro.GrupoEstado.HasValue)
                {
                    if (filtro.GrupoEstado == 1)
                    {
                        obtenerTicket = obtenerTicket.Where(t =>
                            t.Estado == EstadoDeLosTickets.ABIERTO ||
                            t.Estado == EstadoDeLosTickets.EN_PROCESO);
                    }

                    if (filtro.GrupoEstado == 2)
                    {
                        obtenerTicket = obtenerTicket.Where(t =>
                            t.Estado == EstadoDeLosTickets.CERRADO ||
                            t.Estado == EstadoDeLosTickets.CANCELADO);
                    }
                }

                if (!string.IsNullOrWhiteSpace(filtro.Titulo))
                {
                    var busqueda = filtro.Titulo.Trim().ToLower();
                    obtenerTicket = obtenerTicket.Where(t => t.Titulo.ToLower().Contains(busqueda));
                }

                if (filtro.CategoriaID > 0)
                    obtenerTicket = obtenerTicket.Where(t => t.CategoriaID == filtro.CategoriaID);

                if (filtro.Estado.HasValue && filtro.Estado > 0)
                    obtenerTicket = obtenerTicket.Where(t => (int)t.Estado == filtro.Estado);

                if (filtro.Prioridad.HasValue && filtro.Prioridad > 0)
                    obtenerTicket = obtenerTicket.Where(t => (int)t.Prioridad == filtro.Prioridad);

                if (filtro.FechaInicio.HasValue && filtro.FechaFin.HasValue)
                {
                    var inicio = filtro.FechaInicio.Value.Date;
                    var fin = filtro.FechaFin.Value.Date.AddDays(1).AddTicks(-1);

                    obtenerTicket = obtenerTicket.Where(t =>
                        t.FechaDeCreacion >= inicio && t.FechaDeCreacion <= fin);
                }

                // if (filtro.ClienteID.HasValue)
                //     obtenerTicket = obtenerTicket.Where(t => t.UsuarioClienteId == filtro.ClienteID.ToString());
            }

            if (filtro?.GrupoEstado == 1)
            {
                return await obtenerTicket
                    .OrderByDescending(t => t.Prioridad)
                    .ThenBy(t => t.Estado)
                    .ThenByDescending(t => t.FechaDeCreacion)
                    .ToListAsync();
            }

            if (filtro?.GrupoEstado == 2)
            {
                return await obtenerTicket
                    .OrderByDescending(t => t.FechaDeCierre)
                    .ThenBy(t => t.Estado)
                    .ThenByDescending(t => t.Prioridad)
                    .ToListAsync();
            }

            return await obtenerTicket
                .OrderByDescending(t => t.FechaDeCreacion)
                .ToListAsync();
        }



        ////////////////////////////////////////////////////////////////////////////////////////////////////////
        /// METODO PARA CREAR UN TICKET NUEVO/////////////////////////////////////////////////////
        ////////////////////////////////////////////////////////////////////////////////////////////////////////
        [Authorize(Roles = "ADMINISTRADOR,CLIENTE")]
        [HttpPost]
        public async Task<ActionResult<Ticket>> PostTicket(Ticket nuevoTickets)
        {
            var userId = HttpContext.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            nuevoTickets.Titulo = nuevoTickets.Titulo.Trim().ToUpper();
            nuevoTickets.Descripcion = nuevoTickets.Descripcion.Trim().ToUpper();

            nuevoTickets.Estado = EstadoDeLosTickets.ABIERTO;
            nuevoTickets.FechaDeCreacion = DateTime.Now;
            nuevoTickets.FechaDeCierre = null;
            nuevoTickets.UsuarioClienteId = userId;

            _context.Ticket.Add(nuevoTickets);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetTickets), new { id = nuevoTickets.TicketID }, nuevoTickets);
        }


        ////////////////////////////////////////////////////////////////////////////////////////////////////////
        /// METODO PARA MODIFICAR UN TICKETS EXISTEN Y GENERAR UN HISTORIAL /////////////////////////////////////////////////////
        ////////////////////////////////////////////////////////////////////////////////////////////////////////
        [Authorize(Roles = "ADMINISTRADOR,CLIENTE")]
        [HttpPut("{id}")]
        public async Task<IActionResult> PutTicket(int id, Ticket ticketEditada)
        {
            if (id != ticketEditada.TicketID) return BadRequest();

            var userId = HttpContext.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            var ticketOriginal = await _context.Ticket
                .Include(t => t.Categoria)
                .FirstOrDefaultAsync(t => t.TicketID == id);

            if (ticketOriginal == null) return NotFound();

            var categoriaNueva = await _context.Categoria
                .FirstOrDefaultAsync(c => c.CategoriaID == ticketEditada.CategoriaID);

            ticketEditada.Titulo = ticketEditada.Titulo.Trim().ToUpper();
            ticketEditada.Descripcion = ticketEditada.Descripcion.Trim().ToUpper();

            var listaCambios = new List<(string Campo, string ValorAnterior, string ValorNuevo)>
                {
                    ("Titulo", ticketOriginal.Titulo, ticketEditada.Titulo),
                    ("Descripcion", ticketOriginal.Descripcion, ticketEditada.Descripcion),
                    ("Prioridad", ticketOriginal.Prioridad.ToString(), ticketEditada.Prioridad.ToString()),
                    ("Categoria", ticketOriginal.Categoria?.Descripcion ?? "SIN CATEGORÍA", categoriaNueva?.Descripcion ?? "SIN CATEGORÍA")
                };

            foreach (var cambio in listaCambios.Where(c => c.ValorAnterior != c.ValorNuevo))
            {
                _context.HistorialTicket.Add(new HistorialTicket
                {
                    TicketID = ticketOriginal.TicketID,
                    CampoModificado = cambio.Campo,
                    ValorAnterior = cambio.ValorAnterior,
                    ValorNuevo = cambio.ValorNuevo,
                    FechaCambio = DateTime.Now,
                    UsuarioClienteId = userId
                });
            }

            ticketOriginal.Titulo = ticketEditada.Titulo;
            ticketOriginal.Descripcion = ticketEditada.Descripcion;
            ticketOriginal.Prioridad = ticketEditada.Prioridad;
            ticketOriginal.CategoriaID = ticketEditada.CategoriaID;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!await _context.Ticket.AnyAsync(a => a.TicketID == id))
                    return NotFound();

                throw;
            }

            return NoContent();
        }


        /////////////////////////////////////////////////////////////////////////////////////////
        /// METODO PARA INICAR UN TICKET  ////////////////////////////////////////////////////////////
        /// ////////////////////////////////////////////////////////////////////////////////////////
        [Authorize(Roles = "DESARROLLADOR")]
        [HttpPut("proceso/{id}")]
        public async Task<IActionResult> IniciarTicket(int id)
        {
            var ticket = await _context.Ticket.FindAsync(id);
            if (ticket == null) return NotFound();

            ticket.Estado = EstadoDeLosTickets.EN_PROCESO;
            ticket.FechaDeComienzo = DateTime.Now;
            ticket.UsuarioFinalizadorID = null;

            await _context.SaveChangesAsync();

            return NoContent();
        }


        /////////////////////////////////////////////////////////////////////////////////////////
        /// METODO PARA CERRAR UN TICKET  ////////////////////////////////////////////////////////////
        /// ////////////////////////////////////////////////////////////////////////////////////////
        [Authorize(Roles = "DESARROLLADOR")]
        [HttpPut("cerrar/{id}")]
        public async Task<IActionResult> CerrarTicket(int id, [FromBody] TicketComentarioDTO dto)
        {
            var ticket = await _context.Ticket.FindAsync(id);
            if (ticket == null) return NotFound();

            var userId = HttpContext.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var usuario = await _context.Users.FirstOrDefaultAsync(u => u.Id == userId);

            ticket.Estado = EstadoDeLosTickets.CERRADO;
            ticket.FechaDeCierre = DateTime.Now;
            ticket.UsuarioFinalizadorID = usuario.Id;

            if (!string.IsNullOrWhiteSpace(dto?.Comentario))
            {
                var comentario = new ComentarioTicket
                {
                    TicketID = ticket.TicketID,
                    Mensaje = dto.Comentario,
                    UsuarioId = usuario.Id,
                    Fecha = DateTime.Now
                };

                _context.ComentarioTicket.Add(comentario);
            }

            await _context.SaveChangesAsync();

            return NoContent();
        }

        /////////////////////////////////////////////////////////////////////////////////////////
        /// METODO PARA CANCELAR UN TICKET  ////////////////////////////////////////////////////////////
        /// ////////////////////////////////////////////////////////////////////////////////////////
        [Authorize(Roles = "CLIENTE, ADMINISTRADOR")]
        [HttpPut("cancelar/{id}")]
        public async Task<IActionResult> CancelarTicket(int id)
        {
            var ticket = await _context.Ticket.FindAsync(id);
            if (ticket == null) return NotFound();

            var userId = HttpContext.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            ticket.Estado = EstadoDeLosTickets.CANCELADO;
            ticket.FechaDeCierre = DateTime.Now;
            ticket.UsuarioFinalizadorID = userId;

            await _context.SaveChangesAsync();

            return NoContent();
        }


        /////////////////////////////////////////////////////////////////////////////////////////
        /// METODO PARA OBTENER LOS TICKETS POR ESTADO  ////////////////////////////////////////////////////////////
        /// ////////////////////////////////////////////////////////////////////////////////////////
        [Authorize(Roles = "ADMINISTRADOR,CLIENTE,DESARROLLADOR")]
        [HttpPost("TareasPorEstados")]
        public async Task<ActionResult> TareasPorEstados()
        {
            var rol = HttpContext.User.FindFirst(ClaimTypes.Role)?.Value;
            var userId = HttpContext.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            IQueryable<Ticket> obtenerTickets = _context.Ticket.Include(t => t.Categoria);

            if (rol == "CLIENTE")
            {
                obtenerTickets = obtenerTickets.Where(t => t.UsuarioClienteId == userId);
            }
            else if (rol == "DESARROLLADOR")
            {
                var usuario = await _context.Users.FindAsync(userId);
                var email = usuario?.Email?.Trim().ToLower();
                var puestoId = (await _context.Desarrollador.FirstOrDefaultAsync(d => d.Email.ToLower() == email))?.PuestoID ?? 0;
                var categoriasPermitidas = await _context.PuestoCategoria
                    .Where(pc => pc.PuestoID == puestoId)
                    .Select(pc => pc.CategoriaID)
                    .ToListAsync();

                obtenerTickets = obtenerTickets.Where(t => categoriasPermitidas.Contains(t.CategoriaID));
            }

            var vistaTickets = await obtenerTickets
                .OrderBy(t => t.Estado)
                .ThenByDescending(t => t.FechaDeCreacion)
                .Select(t => new
                {
                    t.TicketID,
                    t.Titulo,
                    t.Descripcion,
                    t.FechaDeCreacion,
                    t.FechaDeComienzo,
                    t.FechaDeCierre,
                    t.Estado,
                    t.Prioridad,
                    Categoria = new
                    {
                        Descripcion = t.Categoria.Descripcion
                    }
                })
                .ToListAsync();

            return Ok(vistaTickets);
        }

        private bool TicketExists(int id)
        {
            return _context.Ticket.Any(e => e.TicketID == id);
        }
    }
}
