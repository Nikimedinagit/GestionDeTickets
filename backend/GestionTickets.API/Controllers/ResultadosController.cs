using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using System.Globalization;
using GestionTickets.API.Models.ModelsView;
using GestionTickets.Models.Generales;

namespace IssueTrackAPI.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class ResultadosController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public ResultadosController(ApplicationDbContext context)
        {
            _context = context;
        }

        ////////////////////////////////////////////////////////////////////////////////////////////////////////
        /// METODO PARA OBTENER EL GRAFICO DE TICKETS POR CATEGORIA //////////////////////////////////////
        ////////////////////////////////////////////////////////////////////////////////////////////////////////
        [Authorize(Roles = "ADMINISTRADOR, CLIENTE, DESARROLLADOR")]
        [HttpPost("GraficoTortaCategoria")]
        public async Task<ActionResult<IEnumerable<FiltrarGraficoTicketPorCategoria>>> FiltrarGraficoTicketPorCategoria([FromBody] FiltrarTicket filtro)
        {
            var obtenerTickets = _context.Ticket.AsQueryable();

            var rol = HttpContext.User.FindFirst(ClaimTypes.Role)?.Value;
            var userId = HttpContext.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (filtro.CategoriaID > 0)
                obtenerTickets = obtenerTickets.Where(t => t.CategoriaID == filtro.CategoriaID);

            if (filtro.Estado.HasValue)
                obtenerTickets = obtenerTickets.Where(t => (int)t.Estado == filtro.Estado);

            if (filtro.Prioridad.HasValue)
                obtenerTickets = obtenerTickets.Where(t => (int)t.Prioridad == filtro.Prioridad);

            if (filtro.FechaInicio.HasValue && filtro.FechaFin.HasValue)
            {
                var fechaInicio = filtro.FechaInicio.Value.Date;
                var fechaFin = filtro.FechaFin.Value.Date.AddDays(1).AddTicks(-1);

                obtenerTickets = obtenerTickets.Where(t => t.FechaDeCreacion >= fechaInicio && t.FechaDeCreacion <= fechaFin);
            }

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


            var resultadoAgrupado = await obtenerTickets
                .GroupBy(t => new { t.CategoriaID, NombreCategoria = t.Categoria.Descripcion })
                .Select(g => new FiltrarGraficoTicketPorCategoria
                {
                    Id = g.Key.CategoriaID,
                    Descripcion = g.Key.NombreCategoria,
                    Cantidad = g.Count()
                })
                .OrderByDescending(r => r.Cantidad)
                .ToListAsync();

            return Ok(resultadoAgrupado);
        }


        ////////////////////////////////////////////////////////////////////////////////////////////////////////
        /// METODO PARA OBTENER EL GRAFICO DE TICKETS CERRADO POR MES //////////////////////////////////////
        ////////////////////////////////////////////////////////////////////////////////////////////////////////
        [Authorize(Roles = "ADMINISTRADOR, CLIENTE, DESARROLLADOR")]
        [HttpPost("GraficoBarraTicketsCerrados")]
        public async Task<ActionResult<IEnumerable<FiltrarGraficoTicketPorMes>>> TicketsPorMes()
        {
            var rol = HttpContext.User.FindFirst(ClaimTypes.Role)?.Value;
            var userId = HttpContext.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            var fechaHoy = DateTime.Now;
            var mesesRango = Enumerable.Range(0, 4)
                .Select(i => new DateTime(fechaHoy.Year, fechaHoy.Month, 1).AddMonths(-i))
                .OrderBy(f => f)
                .ToList();

            var fechaMin = mesesRango.First();

            var obtenerTickets = _context.Ticket
                .Where(t => t.Estado == EstadoDeLosTickets.CERRADO
                            && t.FechaDeCierre.HasValue
                            && t.FechaDeCierre.Value >= fechaMin);

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

            var ticketsPorMes = await obtenerTickets
                .GroupBy(t => new { t.FechaDeCierre.Value.Year, t.FechaDeCierre.Value.Month })
                .Select(g => new
                {
                    g.Key.Year,
                    g.Key.Month,
                    Cantidad = g.Count()
                })
                .ToListAsync();

            var listaDeMeses = mesesRango
                .Select(f => new FiltrarGraficoTicketPorMes
                {
                    Mes = f.ToString("MMMM"),
                    CantidadCerrados = ticketsPorMes
                        .Where(x => x.Year == f.Year && x.Month == f.Month)
                        .Select(x => x.Cantidad)
                        .FirstOrDefault()
                })
                .ToList();

            return Ok(listaDeMeses);
        }


        ////////////////////////////////////////////////////////////////////////////////////////////////////////
        /// METODO PARA OBTENER EL GRAFICO COMPARATIVO DE TICKETS CREADOS Y CERRADOS POR MES //////////////////////////////////////
        ////////////////////////////////////////////////////////////////////////////////////////////////////////
        [Authorize(Roles = "ADMINISTRADOR, CLIENTE, DESARROLLADOR")]
        [HttpPost("GraficoBarraTicketsCreadosCerrados")]
        public async Task<ActionResult<IEnumerable<FiltrarGraficoTicketPorMes>>> TicketsPorMesCreadosCerrados()
        {
            var rol = HttpContext.User.FindFirst(ClaimTypes.Role)?.Value;
            var userId = HttpContext.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            var fechaHoy = DateTime.Now;

            var listaDeMeses = new List<FiltrarGraficoTicketPorMes>();
            for (int i = 6; i >= 0; i--)
            {
                listaDeMeses.Add(new FiltrarGraficoTicketPorMes
                {
                    Mes = fechaHoy.AddMonths(-i).ToString("MMMM"),
                    CantidadCreados = 0,
                    CantidadCerrados = 0
                });
            }

            var ticketsQuery = _context.Ticket.AsQueryable();

            if (rol == "CLIENTE")
            {
                ticketsQuery = ticketsQuery.Where(t => t.UsuarioClienteId == userId);
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

                ticketsQuery = ticketsQuery.Where(t => categoriasPermitidas.Contains(t.CategoriaID));
            }

            var tickets = await ticketsQuery.ToListAsync();

            foreach (var ticket in tickets)
            {
                if (ticket.FechaDeCreacion.HasValue)
                {
                    string mesCreacion = ticket.FechaDeCreacion.Value.ToString("MMMM");
                    var mesExistente = listaDeMeses.SingleOrDefault(m => m.Mes == mesCreacion);
                    if (mesExistente != null)
                        mesExistente.CantidadCreados++;
                }

                if (ticket.FechaDeCierre.HasValue)
                {
                    string mesCierre = ticket.FechaDeCierre.Value.ToString("MMMM");
                    var mesExistente = listaDeMeses.SingleOrDefault(m => m.Mes == mesCierre);
                    if (mesExistente != null)
                        mesExistente.CantidadCerrados++;
                }
            }

            return Ok(listaDeMeses);
        }

        /////////////////////////////////////////////////////////////////////////////////////////////////////
        /// METODO PARA OBTENER LAS ESTADISTICAS DE TICKETS POR CLIENTE Y POR CATEGORIA, OBTENIENDO LOS  /////7
        /// TOTALES, ABIERTOS, CERRADOS, PORCENTAJE CRITICO , ULTIMO CREADO Y ULTIMO CERRADO POR CATEGORIA E CLIENTE ///
        /////////////////////////////////////////////////////////////////////////////////////////////////////
        [HttpPost("EstadisticaTicketsPorClientesyCategorias")]
        public async Task<ActionResult<IEnumerable<ListadoTicketsClienteCategoria>>> EstadisticaTicketsPorClientesyCategorias()
        {
            var clientes = await _context.Clientes.Where(c => c.Estado).ToListAsync();
            var clientesEmail = clientes.Select(c => c.Email.Trim().ToLower()).ToList();
            var usuarios = await _context.Users
                .Where(u => clientesEmail.Contains(u.Email.ToLower()))
                .ToListAsync();

            var usuarioId = usuarios.Select(u => u.Id).ToList();

            var tickets = await _context.Ticket
                .Include(t => t.Categoria)
                .Where(t => usuarioId.Contains(t.UsuarioClienteId))
                .ToListAsync();

            var resultadoMostrar = new List<ListadoTicketsClienteCategoria>();

            foreach (var cliente in clientes)
            {
                var usuario = usuarios.FirstOrDefault(u => u.Email.ToLower() == cliente.Email.ToLower());

                var ticketsDelCliente = tickets.Where(t => t.UsuarioClienteId == usuario.Id).ToList();

                var total = ticketsDelCliente.Count();
                var abiertos = ticketsDelCliente.Count(t => t.Estado == EstadoDeLosTickets.ABIERTO || t.Estado == EstadoDeLosTickets.EN_PROCESO);
                var cerrados = ticketsDelCliente.Count(t => t.Estado == EstadoDeLosTickets.CERRADO);
                var criticos = ticketsDelCliente.Count(t => t.Prioridad == PrioridadDeLosTickets.ALTA);
                var porcentajeCriticos = total > 0 ? Math.Round((double)criticos / total * 100, 2) : 0;
                var ultimoCreado = ticketsDelCliente.OrderByDescending(t => t.FechaDeCreacion).FirstOrDefault();
                var ultimoCerrado = ticketsDelCliente
                    .Where(t => t.Estado == EstadoDeLosTickets.CERRADO && t.FechaDeCierre.HasValue)
                    .OrderByDescending(t => t.FechaDeCierre)
                    .FirstOrDefault();


                if (ticketsDelCliente.Any())
                {
                    resultadoMostrar.Add(new ListadoTicketsClienteCategoria
                    {
                        ClienteId = cliente.ClienteID,
                        Nombre = cliente.NombreCompleto,
                        Email = cliente.Email,
                        TotalTickets = total,
                        TicketsAbiertos = abiertos,
                        TicketsCerrados = cerrados,
                        PorcentajeCriticos = porcentajeCriticos,
                        UltimoTicketCreado = ultimoCreado?.FechaDeCreacion?.ToString("dd/MM/yyyy HH:mm"),
                        UltimoTicketCerrado = ultimoCerrado?.FechaDeCierre?.ToString("dd/MM/yyyy HH:mm"),
                        Categorias = ticketsDelCliente
                            .GroupBy(t => new { t.CategoriaID, t.Categoria.Descripcion })
                            .Select(g => new ListadoTicketsCategoria
                            {
                                CategoriaId = g.Key.CategoriaID,
                                Descripcion = g.Key.Descripcion,
                                TotalTickets = g.Count(),
                                TicketsAbiertos = g.Count(t => t.Estado == EstadoDeLosTickets.ABIERTO),
                                TicketsCerrados = g.Count(t => t.Estado == EstadoDeLosTickets.CERRADO),
                                PorcentajeCriticos = g.Count(t => t.Prioridad == PrioridadDeLosTickets.ALTA) > 0 ? Math.Round((double)g.Count(t => t.Prioridad == PrioridadDeLosTickets.ALTA) / g.Count() * 100, 2) : 0,
                                UltimoTicketCreado = g.OrderByDescending(t => t.FechaDeCreacion).FirstOrDefault()?.FechaDeCreacion?.ToString("dd/MM/yyyy HH:mm"),
                                UltimoTicketCerrado = g.OrderByDescending(t => t.FechaDeCierre).FirstOrDefault()?.FechaDeCierre?.ToString("dd/MM/yyyy HH:mm")
                            }).ToList()
                    });
                }
                ;

            }

            return Ok(resultadoMostrar);
        }



       [HttpPost("EstadisticaPorDesarrolladorCategoria")]
        public async Task<ActionResult<IEnumerable<ListadoTicketsDesarrolladorCategoria>>> EstadisticaTicketsPorDesarrolladorCategoria([FromBody] FiltroEstadisticaDesarrolladorCategoria filtro)
        {
            var resultadoMostrar = new List<ListadoTicketsDesarrolladorCategoria>();

            var desarrolladores = await _context.Desarrollador
                .Include(d => d.Puesto)
                .Where(d => d.Estado)
                .ToListAsync();

            var obtenerTickets = _context.Ticket.Include(t => t.Categoria).AsQueryable();

            if (filtro.FechaInicio.HasValue && filtro.FechaFin.HasValue)
            {
                var fechaInicio = filtro.FechaInicio.Value.Date;
                var fechaFin = filtro.FechaFin.Value.Date.AddDays(1).AddTicks(-1);
                obtenerTickets = obtenerTickets.Where(t => t.FechaDeCierre >= fechaInicio && t.FechaDeCierre <= fechaFin);
            }

            var ticketsFiltrados = await obtenerTickets.ToListAsync();


            foreach (var desarrollador in desarrolladores)
            {
                var categoriasDelPuesto = await _context.PuestoCategoria
                    .Where(pc => pc.PuestoID == desarrollador.PuestoID)
                    .Select(pc => pc.CategoriaID)
                    .ToListAsync();

                var ticketsDelDesarrollador = ticketsFiltrados
                    .Where(t => categoriasDelPuesto.Contains(t.CategoriaID) && t.Estado == EstadoDeLosTickets.CERRADO)
                    .ToList();

                var totalCerrados = ticketsDelDesarrollador.Count;
                var ticketsCriticosPuesto = ticketsDelDesarrollador.Count(t => t.Prioridad == PrioridadDeLosTickets.ALTA);
                var ticketsIntermediosPuesto = ticketsDelDesarrollador.Count(t => t.Prioridad == PrioridadDeLosTickets.MEDIA);
                var ticketsBajosPuesto = ticketsDelDesarrollador.Count(t => t.Prioridad == PrioridadDeLosTickets.BAJA);

                double porcentajeCriticos = 0, porcentajeIntermedios = 0, porcentajeBajos = 0;
                if (totalCerrados > 0)
                {
                    porcentajeCriticos = Math.Round(ticketsCriticosPuesto * 100.0 / totalCerrados, 2);
                    porcentajeIntermedios = Math.Round(ticketsIntermediosPuesto * 100.0 / totalCerrados, 2);
                    porcentajeBajos = Math.Round(ticketsBajosPuesto * 100.0 / totalCerrados, 2);
                }

                var ultimoTicket = ticketsDelDesarrollador
                    .OrderByDescending(t => t.FechaDeCierre)
                    .FirstOrDefault()?.FechaDeCierre?.ToString("dd/MM/yyyy HH:mm");

                var resultados = new ListadoTicketsDesarrolladorCategoria
                {
                    DesarrolladorId = desarrollador.DesarrolladorID,
                    Nombre = desarrollador.NombreCompleto,
                    TotalTicketsCerrados = totalCerrados,
                    PorcentajeCriticos = porcentajeCriticos,
                    PorcentajeIntermedios = porcentajeIntermedios,
                    PorcentajeBajos = porcentajeBajos,
                    UltimoTicketCreado = ultimoTicket,
                    Categorias = new List<ListadoDesarrolladorCategoria>()
                };

                var categoriasAgrupadas = ticketsDelDesarrollador
                        .GroupBy(t => t.CategoriaID)
                        .Select(g =>
                        {
                            var categoriaTickets = g.ToList();
                            var totalCategorias = categoriaTickets.Count;

                            double porcentajeCatCriticos = 0, porcentajeCatIntermedios = 0, porcentajeCatBajos = 0;
                            if (totalCategorias > 0)
                            {
                                porcentajeCatCriticos = Math.Round(categoriaTickets.Count(t => t.Prioridad == PrioridadDeLosTickets.ALTA) * 100.0 / totalCategorias, 2);
                                porcentajeCatIntermedios = Math.Round(categoriaTickets.Count(t => t.Prioridad == PrioridadDeLosTickets.MEDIA) * 100.0 / totalCategorias, 2);
                                porcentajeCatBajos = Math.Round(categoriaTickets.Count(t => t.Prioridad == PrioridadDeLosTickets.BAJA) * 100.0 / totalCategorias, 2);
                            }

                            return new InformeEstadisticoPorDesarrolladorPuestoCategoria
                            {
                                CategoriaId = g.Key,
                                Nombre = categoriaTickets.First().Categoria.Descripcion,
                                TotalTicketsCerrados = totalCategorias,
                                PorcentajeCriticos = porcentajeCatCriticos,
                                PorcentajeIntermedios = porcentajeCatIntermedios,
                                PorcentajeBajos = porcentajeCatBajos,
                                UltimoTicketCreado = categoriaTickets
                                    .OrderByDescending(t => t.FechaDeCierre)
                                    .FirstOrDefault()?.FechaDeCierre?.ToString("dd/MM/yyyy HH:mm")
                            };
                        })
                        .ToList();

                            resultados.Categorias = categoriasAgrupadas.Select(c => new ListadoDesarrolladorCategoria
                            {
                                CategoriaId = c.CategoriaId,
                                Nombre = c.Nombre,
                                TotalTicketsCerrados = c.TotalTicketsCerrados,
                                PorcentajeCriticos = c.PorcentajeCriticos,
                                PorcentajeIntermedios = c.PorcentajeIntermedios,
                                PorcentajeBajos = c.PorcentajeBajos,
                                UltimoTicketCreado = c.UltimoTicketCreado
                            }).ToList();

                            resultadoMostrar.Add(resultados);

                        }

            return Ok(resultadoMostrar);

        }

    }
}