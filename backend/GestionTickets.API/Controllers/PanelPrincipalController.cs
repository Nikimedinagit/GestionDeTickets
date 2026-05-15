using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using GestionTickets.Models.Generales;

namespace IssueTrackAPI.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class PanelPrincipalController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public PanelPrincipalController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet("Estadisticas")]
        public async Task<IActionResult> ObtenerEstadisticas()
        {
            var rol = HttpContext.User.FindFirst(ClaimTypes.Role)?.Value;
            var userId = HttpContext.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            IQueryable<Ticket> obtenerTickets = _context.Ticket.AsQueryable();

            if (rol == "CLIENTE")
            {
                obtenerTickets = obtenerTickets.Where(t => t.UsuarioClienteId == userId);
            }
            else if (rol == "DESARROLLADOR")
            {
                var email = (await _context.Users.FindAsync(userId))?.Email?.Trim().ToLower();
                var puestoId = (await _context.Desarrollador.FirstOrDefaultAsync(d => d.Email.ToLower() == email))?.PuestoID ?? 0;
                var categorias = await _context.PuestoCategoria
                    .Where(pc => pc.PuestoID == puestoId)
                    .Select(pc => pc.CategoriaID)
                    .ToListAsync();
                obtenerTickets = obtenerTickets.Where(t => categorias.Contains(t.CategoriaID));
            }

            var tickets = await obtenerTickets.ToListAsync();

            return Ok(new
            {
                Total = new
                {
                    Hoy = tickets.Count(t => t.FechaDeCreacion.HasValue && t.FechaDeCreacion.Value.Date == DateTime.Today),
                    Semana = tickets.Count(t => t.FechaDeCreacion.HasValue && t.FechaDeCreacion.Value >= DateTime.Today.AddDays(-7)),
                    Sistema = tickets.Count
                },
                Estados = new
                {
                    Abiertos = tickets.Count(t => t.Estado == EstadoDeLosTickets.ABIERTO),
                    Proceso = tickets.Count(t => t.Estado == EstadoDeLosTickets.EN_PROCESO),
                    Cerrados = tickets.Count(t => t.Estado == EstadoDeLosTickets.CERRADO)
                },
                Prioridades = new
                {
                    Alta = tickets.Count(t => t.Prioridad == PrioridadDeLosTickets.ALTA),
                    Media = tickets.Count(t => t.Prioridad == PrioridadDeLosTickets.MEDIA),
                    Baja = tickets.Count(t => t.Prioridad == PrioridadDeLosTickets.BAJA)
                }
            });
        }

        [HttpGet("UltimosTickets")]
        public async Task<IActionResult> ObtenerUltimosTickets()
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
                var email = (await _context.Users.FindAsync(userId))?.Email?.Trim().ToLower();
                var puestoId = (await _context.Desarrollador.FirstOrDefaultAsync(d => d.Email.ToLower() == email))?.PuestoID ?? 0;
                var categorias = await _context.PuestoCategoria
                    .Where(pc => pc.PuestoID == puestoId)
                    .Select(pc => pc.CategoriaID)
                    .ToListAsync();
                obtenerTickets = obtenerTickets.Where(t => categorias.Contains(t.CategoriaID));
            }

            var ultimos = await obtenerTickets
                .OrderByDescending(t => t.FechaDeCreacion)
                .Take(4)
                .ToListAsync();

            var usuarioIds = ultimos.Select(t => t.UsuarioClienteId).Distinct();
            var usuarios = await _context.Users
                .Where(u => usuarioIds.Contains(u.Id))
                .ToDictionaryAsync(u => u.Id, u => u.NombreCompleto);

            var resultado = ultimos.Select(t => new
            {
                t.TicketID,
                t.Titulo,
                t.Estado,
                t.FechaDeCreacion,
                Cliente = usuarios.GetValueOrDefault(t.UsuarioClienteId, "Desconocido")
            });

            return Ok(resultado);
        }
    }
}