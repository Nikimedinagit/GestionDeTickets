using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;

namespace GestionTickets.Controllers
{
    [Authorize(Roles = "ADMINISTRADOR,CLIENTE,DESARROLLADOR")]
    [Route("api/[controller]")]
    [ApiController]
    public class HistorialTicketsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public HistorialTicketsController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetHistorialTickets(int ticketId)
        {
            var historial = await _context.HistorialTicket
                .Where(h => h.TicketID == ticketId)
                .AsNoTracking()
                .OrderByDescending(h => h.FechaCambio)
                .ToListAsync();

            return Ok(historial);
        }
    }
}
