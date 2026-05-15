using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using GestionTickets.Models.Generales;
using Microsoft.AspNetCore.Identity;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;

namespace GestionTickets.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DesarrolladoresController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly RoleManager<IdentityRole> _roleManager;


        public DesarrolladoresController(ApplicationDbContext context, UserManager<ApplicationUser> userManager, RoleManager<IdentityRole> roleManager)
        {
            _context = context;
            _userManager = userManager;
            _roleManager = roleManager;
        }


        ////////////////////////////////////////////////////////////////////////////////////////////////////////
        /// METODO PARA OBTENER UN DESARROLLADOR QUE ESTE ACTIVO O DESACTIVO ///////////////////////////
        ////////////////////////////////////////////////////////////////////////////////////////////////////////
        [Authorize(Roles = "ADMINISTRADOR,DESARROLLADOR,CLIENTE")]
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Desarrollador>>> GetDesarrollador([FromQuery] DesarrolladorFiltrar filtro, [FromQuery] bool? estado)
        {
            var rol = HttpContext.User.FindFirst(ClaimTypes.Role)?.Value;
            var userId = HttpContext.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            var obtenerDesarrollador = _context.Desarrollador.Include(a => a.Puesto).AsQueryable();

            if (rol == "CLIENTE")
            {
                var categoriasDelCliente = _context.Ticket
                    .Where(t => t.UsuarioClienteId == userId)
                    .Select(t => t.CategoriaID);

                var puestosIdsValidos = _context.PuestoCategoria
                    .Where(pc => categoriasDelCliente.Contains(pc.CategoriaID))
                    .Select(pc => pc.PuestoID);

                obtenerDesarrollador = obtenerDesarrollador.Where(d => puestosIdsValidos.Contains(d.PuestoID));
            }

            if (estado.HasValue)
            {
                obtenerDesarrollador = obtenerDesarrollador.Where(a => a.Estado == estado.Value);
            }

            if (filtro != null && !string.IsNullOrEmpty(filtro.NombreDniPuesto))
            {
                var busqueda = filtro.NombreDniPuesto.ToLower();
                obtenerDesarrollador = obtenerDesarrollador.Where(l =>
                    l.NombreCompleto.ToLower().Contains(busqueda) ||
                    l.Dni.ToString().Contains(busqueda) ||
                    l.Puesto.Descripcion.ToLower().Contains(busqueda)
                );
            }

            return await obtenerDesarrollador
                .OrderBy(a => a.NombreCompleto)
                .ThenBy(a => a.Dni)
                .ToListAsync();
        }


        ////////////////////////////////////////////////////////////////////////////////////////////////////////
        /// METODO PARA CREAR UN DESARROLLADOR NUEVO/////////////////////////////////////////////////////
        ////////////////////////////////////////////////////////////////////////////////////////////////////////
        [Authorize(Roles = "ADMINISTRADOR")]
        [HttpPost]
        public async Task<ActionResult<Desarrollador>> PostDesarrollador(Desarrollador nuevoDesarrollador)
        {
            nuevoDesarrollador.NombreCompleto = nuevoDesarrollador.NombreCompleto.Trim().ToUpper();
            nuevoDesarrollador.Observacion = nuevoDesarrollador.Observacion?.Trim().ToUpper() ?? "";
            nuevoDesarrollador.Email = nuevoDesarrollador.Email.Trim().ToLower();

            if (await _context.Desarrollador.AnyAsync(a => a.Dni == nuevoDesarrollador.Dni))
                return Conflict(new { codigo = 0, campo = "DNI", mensaje = "Ya se encuentra registrado." });

            var usuarioExistente = await _userManager.FindByEmailAsync(nuevoDesarrollador.Email);

            if (usuarioExistente != null)
                return Conflict(new { codigo = 0, campo = "EMAIL", mensaje = "Ya está registrado en el sistema." });

            _context.Desarrollador.Add(nuevoDesarrollador);
            await _context.SaveChangesAsync();

            var nuevoUsuario = new ApplicationUser
            {
                UserName = nuevoDesarrollador.Email,
                Email = nuevoDesarrollador.Email,
                NombreCompleto = nuevoDesarrollador.NombreCompleto
            };

            var resultadoCreacion = await _userManager.CreateAsync(nuevoUsuario, nuevoDesarrollador.Dni.ToString());

            if (!resultadoCreacion.Succeeded)
            {
                return BadRequest(new
                {
                    codigo = 0,
                    mensaje = "Error al registrar las credenciales del desarrollador.",
                    errores = resultadoCreacion.Errors.Select(e => e.Description)
                });
            }

            if (!await _roleManager.RoleExistsAsync("DESARROLLADOR"))
            {
                await _roleManager.CreateAsync(new IdentityRole("DESARROLLADOR"));
            }

            var resultadoRol = await _userManager.AddToRoleAsync(nuevoUsuario, "DESARROLLADOR");

            if (!resultadoRol.Succeeded)
            {
                return BadRequest(new
                {
                    mensaje = "Error al asignar el rol al usuario.",
                    errores = resultadoRol.Errors.Select(e => e.Description)
                });
            }

            return CreatedAtAction(nameof(GetDesarrollador), new { id = nuevoDesarrollador.DesarrolladorID }, nuevoDesarrollador);
        }


        ////////////////////////////////////////////////////////////////////////////////////////////////////////
        /// METODO PARA MODIFICAR UN DESARROLLADOR///////////////////////////////////////////////////////
        ////////////////////////////////////////////////////////////////////////////////////////////////////////
        [Authorize(Roles = "ADMINISTRADOR")]
        [HttpPut("{id}")]
        public async Task<IActionResult> PutDesarrollador(int id, Desarrollador desarrolladorEditada)
        {
            if (id != desarrolladorEditada.DesarrolladorID) return BadRequest();

            var desarrollador = await _context.Desarrollador.FindAsync(id);

            desarrollador.NombreCompleto = desarrolladorEditada.NombreCompleto.Trim().ToUpper();
            desarrollador.Observacion = desarrolladorEditada.Observacion.Trim().ToUpper() ?? "";
            desarrollador.Telefono = desarrolladorEditada.Telefono;
            desarrollador.PuestoID = desarrolladorEditada.PuestoID;
            desarrollador.Estado = desarrolladorEditada.Estado;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!await _context.Desarrollador.AnyAsync(a => a.DesarrolladorID == id)) return NotFound();
                throw;
            }

            return NoContent();
        }


        ////////////////////////////////////////////////////////////////////////////////////////////////////////
        /// METODO PARA ELIMINAR UN DESARROLLADOR/////////////////////////////////////////////////////////
        ////////////////////////////////////////////////////////////////////////////////////////////////////////
        [Authorize(Roles = "ADMINISTRADOR")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteDesarrollador(int id)
        {
            var Desarrollador = await _context.Desarrollador.FindAsync(id);
            if (Desarrollador == null) return NotFound();

            var puestoId = Desarrollador.PuestoID;

            var categoriasDelDesarrollador = await _context.PuestoCategoria
                .Where(pc => pc.PuestoID == puestoId)
                .Select(pc => pc.CategoriaID)
                .ToListAsync();


            var tieneTicket = await _context.Ticket
                .AnyAsync(t =>
                    categoriasDelDesarrollador.Contains(t.CategoriaID) &&
                    (t.Estado == EstadoDeLosTickets.ABIERTO || t.Estado == EstadoDeLosTickets.EN_PROCESO));

            if (tieneTicket)
            {
                return BadRequest("No se puede eliminar este Desarrollador porque está asociada a un Ticket.");
            }

            Desarrollador.Estado = false;
            await _context.SaveChangesAsync();

            return NoContent();
        }


        /////////////////////////////////////////////////////////////////////////////////////////
        /// METODO PARA RESTAURAR UN DESARROLALDOR ELIMINADO ////////////////////////////////////////////////////////////
        /// ////////////////////////////////////////////////////////////////////////////////////////
        [Authorize(Roles = "ADMINISTRADOR")]
        [HttpPut("restaurar/{id}")]
        public async Task<IActionResult> RestaurarDesarrollador(int id)
        {
            var Desarrollador = await _context.Desarrollador.FindAsync(id);
            if (Desarrollador == null) return NotFound();

            Desarrollador.Estado = true;
            await _context.SaveChangesAsync();

            return NoContent();
        }


        ////////////////////////////////////////////////////////////////////////////////////////////////////////
        /// METODO PARA OBTENER UN DESARROLLADOR POR ID //////////////////////////////////////////////////
        ////////////////////////////////////////////////////////////////////////////////////////////////////////
        [Authorize(Roles = "ADMINISTRADOR")]
        [HttpGet("{id}")]
        public async Task<ActionResult<Desarrollador>> GetDesarrollador(int id)
        {
            var Desarrollador = await _context.Desarrollador.FindAsync(id);

            if (Desarrollador == null)
            {
                return NotFound();
            }

            return Desarrollador;
        }


        private bool DesarrolladorExists(int id)
        {
            return _context.Desarrollador.Any(e => e.DesarrolladorID == id);
        }
    }
}
