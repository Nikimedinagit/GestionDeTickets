using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using GestionTickets.Models.Generales;
using Microsoft.AspNetCore.Authorization;

namespace GestionTickets.API.Controllers
{
    [Authorize (Roles = "ADMINISTRADOR")]
    [Route("api/[controller]")]
    [ApiController]
    public class PuestosController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public PuestosController(ApplicationDbContext context)
        {
            _context = context;
        }


        ////////////////////////////////////////////////////////////////////////////////////////////////////////
        /// METODO PARA OBTENER UN PUESTO  QUE ESTE ACTIVO O DESACTIVO ///////////////////////////
        ////////////////////////////////////////////////////////////////////////////////////////////////////////
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Puesto>>> GetPuesto([FromQuery] PuestoFiltrar filtro, [FromQuery] bool? estado)
        {
            var obtenerPuesto = _context.Puesto.AsQueryable();

            if (estado.HasValue)
            {
                obtenerPuesto = obtenerPuesto.Where(a => a.Estado == estado.Value);
            }

            if (filtro != null && !string.IsNullOrEmpty(filtro.Descripcion))
            {
                obtenerPuesto = obtenerPuesto.Where(l =>l.Descripcion.Contains(filtro.Descripcion));
            }

            return await obtenerPuesto.OrderBy(a => a.Descripcion).ToListAsync();
        }


        ////////////////////////////////////////////////////////////////////////////////////////////////////////
        /// METODO PARA CREAR UN PUESTO NUEVA/////////////////////////////////////////////////////
        ////////////////////////////////////////////////////////////////////////////////////////////////////////
        [HttpPost]
        public async Task<ActionResult<Puesto>> PostPuesto(Puesto nuevoPuesto)
        {
            nuevoPuesto.Descripcion = nuevoPuesto.Descripcion.Trim().ToUpper();

            if (await _context.Puesto.AnyAsync(a => a.Descripcion == nuevoPuesto.Descripcion))
                return Conflict(new { codigo = 0, mensaje = "Ya se encuentra registrado." });

            _context.Puesto.Add(nuevoPuesto);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetPuesto), new { id = nuevoPuesto.PuestoID }, nuevoPuesto);
        }


        ////////////////////////////////////////////////////////////////////////////////////////////////////////
        /// METODO PARA MODIFICAR UN PUESTO///////////////////////////////////////////////////////
        ////////////////////////////////////////////////////////////////////////////////////////////////////////
        [HttpPut("{id}")]
        public async Task<IActionResult> PutPuesto(int id, Puesto puestoEditada)
        {
            if (id != puestoEditada.PuestoID) return BadRequest();

            puestoEditada.Descripcion = puestoEditada.Descripcion.Trim().ToUpper();

            if (await _context.Puesto.AnyAsync(a => a.Descripcion == puestoEditada.Descripcion && a.PuestoID != id))
                return Conflict(new { mensaje = "Ya se encuentra registrado." });

            _context.Entry(puestoEditada).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!await _context.Puesto.AnyAsync(a => a.PuestoID == id)) return NotFound();
                throw;
            }

            return NoContent();
        }


        ////////////////////////////////////////////////////////////////////////////////////////////////////////
        /// METODO PARA ELIMINAR UN PUESTO/////////////////////////////////////////////////////////
        ////////////////////////////////////////////////////////////////////////////////////////////////////////
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePuesto(int id)
        {
            var Puesto = await _context.Puesto.FindAsync(id);
            if (Puesto == null) return NotFound();

            var tieneDesarrollador = await _context.Desarrollador
                .AnyAsync(a => a.PuestoID == id);

            if (tieneDesarrollador)
            {
                return BadRequest("No se puede eliminar esta Puesto porque está asociada a un Desarrollador.");
            }

            Puesto.Estado = false;
            await _context.SaveChangesAsync();

            return NoContent();
        }


        /////////////////////////////////////////////////////////////////////////////////////////
        /// METODO PARA RESTAURAR UN PUESTO ELIMINADO ////////////////////////////////////////////////////////////
        /// ////////////////////////////////////////////////////////////////////////////////////////
        [HttpPut("restaurar/{id}")]
        public async Task<IActionResult> RestaurarPuesto(int id)
        {
            var Puesto = await _context.Puesto.FindAsync(id);
            if (Puesto == null) return NotFound();

            Puesto.Estado = true;
            await _context.SaveChangesAsync();

            return NoContent();
        }


        ////////////////////////////////////////////////////////////////////////////////////////////////////////
        /// METODO PARA OBTENER UN Puesto POR ID //////////////////////////////////////////////////
        ////////////////////////////////////////////////////////////////////////////////////////////////////////
        [HttpGet("{id}")]
        public async Task<ActionResult<Puesto>> GetPuesto(int id)
        {
            var Puesto = await _context.Puesto.FindAsync(id);

            if (Puesto == null)
            {
                return NotFound();
            }

            return Puesto;
        }


        private bool PuestoExists(int id)
        {
            return _context.Puesto.Any(e => e.PuestoID == id);
        }
    }
}
