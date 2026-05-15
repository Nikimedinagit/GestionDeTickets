using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;
using GestionTickets.Models.Generales;

namespace GestionTickets.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PuestosyCategoriasController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public PuestosyCategoriasController(ApplicationDbContext context)
        {
            _context = context;
        }


        ////////////////////////////////////////////////////////////////////////////////////////////////////////
        /// METODO PARA OBTENER LAS CATEGORIAS ASOCIADAS A UN PUESTO ESPECIFICO ////////////////////////////////
        ////////////////////////////////////////////////////////////////////////////////////////////////////////
        [HttpGet("{puestoId}")]
        public async Task<ActionResult> GetCategoriasPorPuesto(int puestoId)
        {
            var obtenerCategorias = await _context.PuestoCategoria
                .Include(pc => pc.Categoria)
                .Where(pc => pc.PuestoID == puestoId)
                .Select(pc => new
                {
                    puestoCategoriaID = pc.PuestoCategoriaID,
                    puestoID = pc.PuestoID,
                    categoriaID = pc.CategoriaID,
                    categoria = new
                    {
                        categoriaID = pc.Categoria.CategoriaID,
                        descripcion = pc.Categoria.Descripcion
                    }
                })
                .ToListAsync();

            return Ok(obtenerCategorias);
        }


        ////////////////////////////////////////////////////////////////////////////////////////////////////////
        /// METODO PARA OBTENER UN REGISTRO DE PUESTOCATEGORIA POR SU ID //////////////////////////////////////
        ////////////////////////////////////////////////////////////////////////////////////////////////////////
        [HttpGet("Categoria/{id}")]
        public async Task<ActionResult<PuestoCategoria>> GetPuestoCategoria(int id)
        {
            var obtenerPuestoCategoria = await _context.PuestoCategoria
                .Include(pc => pc.Categoria)
                .Include(pc => pc.Puesto)
                .FirstOrDefaultAsync(pc => pc.PuestoCategoriaID == id);

            if (obtenerPuestoCategoria == null)
            {
                return NotFound();
            }

            return Ok(obtenerPuestoCategoria);
        }


        ////////////////////////////////////////////////////////////////////////////////////////////////////////
        /// METODO PARA CREAR UNA NUEVA RELACION ENTRE PUESTO Y CATEGORIA //////////////////////////////////////
        ////////////////////////////////////////////////////////////////////////////////////////////////////////
        [HttpPost]
        public async Task<ActionResult> PostPuestoCategoria(PuestoCategoria nuevaRelacion)
        {
            if (await _context.PuestoCategoria.AnyAsync(pc =>
                pc.PuestoID == nuevaRelacion.PuestoID &&
                pc.CategoriaID == nuevaRelacion.CategoriaID))
            {
                return Conflict(new { codigo = 0, mensaje = "Ya se encuentra registrado." });
            }

            _context.PuestoCategoria.Add(nuevaRelacion);
            await _context.SaveChangesAsync();

            return Ok(nuevaRelacion);
        }


        ////////////////////////////////////////////////////////////////////////////////////////////////////////
        /// METODO PARA ELIMINAR (FISICAMENTE) UNA RELACION DE PUESTOCATEGORIA /////////////////////////////////
        ////////////////////////////////////////////////////////////////////////////////////////////////////////
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePuestoCategoria(int id)
        {
            var eliminarPuestoCategoria = await _context.PuestoCategoria.FindAsync(id);

            if (eliminarPuestoCategoria == null)
            {
                return NotFound();
            }

            _context.PuestoCategoria.Remove(eliminarPuestoCategoria);
            await _context.SaveChangesAsync();

            return NoContent();
        }


        private bool PuestoCategoriaExists(int id)
        {
            return _context.PuestoCategoria.Any(e => e.PuestoCategoriaID == id);
        }
    }
}