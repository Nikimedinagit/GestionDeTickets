using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using GestionTickets.Models.Generales;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;

namespace GestionTickets.API.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class CategoriasController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public CategoriasController(ApplicationDbContext context)
        {
            _context = context;
        }


        ////////////////////////////////////////////////////////////////////////////////////////////////////////
        /// METODO PARA OBTENER UNA CATEGORIA QUE ESTE ACTIVO O DESACTIVO ///////////////////////////
        ////////////////////////////////////////////////////////////////////////////////////////////////////////
        [Authorize(Roles = "ADMINISTRADOR,DESARROLLADOR,CLIENTE")]
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Categoria>>> GetCategorias([FromQuery] CategoriaFiltrar filtro, [FromQuery] bool? estado)
        {
            var consultaCategorias = _context.Categoria.AsQueryable();

            var rolUsuario = HttpContext.User.FindFirst(ClaimTypes.Role)?.Value;
            var idUsuarioActual = HttpContext.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (rolUsuario == "DESARROLLADOR")
            {
                var puestoId = await _context.Users
                    .Where(u => u.Id == idUsuarioActual)
                    .Join(_context.Desarrollador,
                        usuario => usuario.Email.ToLower(),
                        desarrollador => desarrollador.Email.ToLower(),
                        (usuario, desarrollador) => desarrollador.PuestoID)
                    .FirstOrDefaultAsync();

                if (puestoId != 0)
                {
                    var idsCategoriasPermitidas = _context.PuestoCategoria
                        .Where(pc => pc.PuestoID == puestoId)
                        .Select(pc => pc.CategoriaID);

                    consultaCategorias = consultaCategorias.Where(c =>
                        idsCategoriasPermitidas.Contains(c.CategoriaID) &&
                        _context.Ticket.Any(t => t.CategoriaID == c.CategoriaID));
                }
            }
            else if (rolUsuario == "CLIENTE")
            {
                var idsCategoriasConTicketsPropios = _context.Ticket
                    .Where(t => t.UsuarioClienteId == idUsuarioActual)
                    .Select(t => t.CategoriaID)
                    .Distinct();

                consultaCategorias = consultaCategorias.Where(c => idsCategoriasConTicketsPropios.Contains(c.CategoriaID));
            }

            if (estado.HasValue)
            {
                consultaCategorias = consultaCategorias.Where(c => c.Estado == estado.Value);
            }

            if (filtro != null && !string.IsNullOrWhiteSpace(filtro.Descripcion))
            {
                consultaCategorias = consultaCategorias.Where(c => c.Descripcion.Contains(filtro.Descripcion));
            }

            return await consultaCategorias
                .OrderBy(c => c.Descripcion)
                .ToListAsync();
        }

        ////////////////////////////////////////////////////////////////////////////////////////////////////////
        /// METODO PARA OBTENER TODAS LAS CATEGORIAS QUE ESTEN ACTIVA///////////////////////////////////////////
        ////////////////////////////////////////////////////////////////////////////////////////////////////////    
        [Authorize(Roles = "ADMINISTRADOR,DESARROLLADOR,CLIENTE")]
        [HttpGet("activas")]
        public async Task<IActionResult> GetCategoriasActivas()
        {
            var categorias = await _context.Categoria
                .Where(c => c.Estado)
                .OrderBy(c => c.Descripcion)
                .Select(c => new
                {
                    c.CategoriaID,
                    c.Descripcion
                })
                .ToListAsync();

            return Ok(categorias);
        }


        ////////////////////////////////////////////////////////////////////////////////////////////////////////
        /// METODO PARA CREAR UNA CATEGORIA NUEVA/////////////////////////////////////////////////////
        ////////////////////////////////////////////////////////////////////////////////////////////////////////
        [Authorize(Roles = "ADMINISTRADOR")]
        [HttpPost]
        public async Task<ActionResult<Categoria>> PostCategoria(Categoria nuevaCategoria)
        {
            nuevaCategoria.Descripcion = nuevaCategoria.Descripcion.Trim().ToUpper();

            if (await _context.Categoria.AnyAsync(a => a.Descripcion == nuevaCategoria.Descripcion))
                return Conflict(new { codigo = 0, mensaje = "Ya se encuentra registrada." });

            _context.Categoria.Add(nuevaCategoria);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetCategoria), new { id = nuevaCategoria.CategoriaID }, nuevaCategoria);
        }


        ////////////////////////////////////////////////////////////////////////////////////////////////////////
        /// METODO PARA MODIFICAR UNA CATEGORIA///////////////////////////////////////////////////////
        ////////////////////////////////////////////////////////////////////////////////////////////////////////
        [Authorize(Roles = "ADMINISTRADOR")]
        [HttpPut("{id}")]
        public async Task<IActionResult> PutCategoria(int id, Categoria categoriaEditada)
        {
            if (id != categoriaEditada.CategoriaID) return BadRequest();

            categoriaEditada.Descripcion = categoriaEditada.Descripcion.Trim().ToUpper();

            if (await _context.Categoria.AnyAsync(a => a.Descripcion == categoriaEditada.Descripcion && a.CategoriaID != id))
                return Conflict(new { mensaje = "Ya se encuentra registrada." });

            _context.Entry(categoriaEditada).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!await _context.Categoria.AnyAsync(a => a.CategoriaID == id)) return NotFound();
                throw;
            }

            return NoContent();
        }


        ////////////////////////////////////////////////////////////////////////////////////////////////////////
        /// METODO PARA ELIMINAR UNA CATEGORIA/////////////////////////////////////////////////////////
        ////////////////////////////////////////////////////////////////////////////////////////////////////////
        [Authorize(Roles = "ADMINISTRADOR")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCategoria(int id)
        {
            var categoria = await _context.Categoria.FindAsync(id);
            if (categoria == null)
                return NotFound();

            var tieneTicket = await _context.Ticket
                .AnyAsync(t => t.CategoriaID == id);

            if (tieneTicket)
            {
                return BadRequest("No se puede eliminar esta Categoría porque está asociada a un Ticket.");
            }

            var tienePuesto = await _context.PuestoCategoria
                .AnyAsync(pc => pc.CategoriaID == id);

            if (tienePuesto)
            {
                return BadRequest("No se puede eliminar esta Categoría porque está asociada a un Puesto.");
            }

            categoria.Estado = false;
            await _context.SaveChangesAsync();

            return NoContent();
        }


        /////////////////////////////////////////////////////////////////////////////////////////
        /// METODO PARA RESTAURAR UNA CATEGORIA ELIMINADA ////////////////////////////////////////////////////////////
        /// ////////////////////////////////////////////////////////////////////////////////////////
        [Authorize(Roles = "ADMINISTRADOR")]
        [HttpPut("restaurar/{id}")]
        public async Task<IActionResult> RestaurarCategoria(int id)
        {
            var Categoria = await _context.Categoria.FindAsync(id);
            if (Categoria == null) return NotFound();

            Categoria.Estado = true;
            await _context.SaveChangesAsync();

            return NoContent();
        }


        ////////////////////////////////////////////////////////////////////////////////////////////////////////
        /// METODO PARA OBTENER UN CATEGORIA POR ID //////////////////////////////////////////////////
        ////////////////////////////////////////////////////////////////////////////////////////////////////////
        [Authorize(Roles = "ADMINISTRADOR")]
        [HttpGet("{id}")]
        public async Task<ActionResult<Categoria>> GetCategoria(int id)
        {
            var Categoria = await _context.Categoria.FindAsync(id);

            if (Categoria == null)
            {
                return NotFound();
            }

            return Categoria;
        }


        private bool CategoriaExists(int id)
        {
            return _context.Categoria.Any(e => e.CategoriaID == id);
        }
    }
}
