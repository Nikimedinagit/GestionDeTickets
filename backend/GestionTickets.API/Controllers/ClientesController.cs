using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using GestionTickets.Models.Generales;
using System.Security.Claims;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Authorization;

namespace GestionTickets.API.Controllers
{
    [Authorize(Roles = "ADMINISTRADOR")]
    [Route("api/[controller]")]
    [ApiController]
    public class ClientesController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly RoleManager<IdentityRole> _roleManager;


        public ClientesController(ApplicationDbContext context, UserManager<ApplicationUser> userManager, RoleManager<IdentityRole> roleManager)
        {
            _context = context;
            _userManager = userManager;
            _roleManager = roleManager;
        }


        ////////////////////////////////////////////////////////////////////////////////////////////////////////
        /// METODO PARA OBTENER UN CLIENTE QUE ESTE ACTIVO O DESACTIVO ///////////////////////////
        ////////////////////////////////////////////////////////////////////////////////////////////////////////
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Cliente>>> GetCliente([FromQuery] ClienteFiltrar filtro, [FromQuery] bool? estado)
        {
            var userId = HttpContext.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            var obtenerCliente = _context.Clientes.Where(c => c.UsuarioClienteId == userId).AsQueryable();

            if (estado.HasValue)
            {
                obtenerCliente = obtenerCliente.Where(a => a.Estado == estado.Value);
            }

            if (filtro != null && !string.IsNullOrEmpty(filtro.NombreDni))
            {
                obtenerCliente = obtenerCliente.Where(l =>
                    l.NombreCompleto.Contains(filtro.NombreDni) ||
                    l.Dni.ToString().Contains(filtro.NombreDni)
                );
            }

            return await obtenerCliente.OrderBy(a => a.NombreCompleto).ToListAsync();
        }


        ////////////////////////////////////////////////////////////////////////////////////////////////////////
        /// METODO PARA CREAR UN CLIENTE NUEVO/////////////////////////////////////////////////////
        ////////////////////////////////////////////////////////////////////////////////////////////////////////
        [HttpPost]
        public async Task<ActionResult<Cliente>> PostCliente(Cliente nuevoCliente)
        {
            nuevoCliente.NombreCompleto = nuevoCliente.NombreCompleto.Trim().ToUpper();
            nuevoCliente.Observacion = nuevoCliente.Observacion.Trim().ToUpper() ?? "";
            nuevoCliente.Email = nuevoCliente.Email.Trim().ToLower();
            nuevoCliente.UsuarioClienteId = HttpContext.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (await _context.Clientes.AnyAsync(a => a.Dni == nuevoCliente.Dni))
                return Conflict(new { codigo = 0, campo = "DNI", mensaje = "Ya se encuentra registrado." });
            var usuarioExistente = await _userManager.FindByEmailAsync(nuevoCliente.Email);

            if (usuarioExistente != null)
                return Conflict(new { codigo = 0, campo = "EMAIL", mensaje = "Ya está registrado en el sistema." });

            _context.Clientes.Add(nuevoCliente);
            await _context.SaveChangesAsync();

            var nuevoUsuario = new ApplicationUser
            {
                UserName = nuevoCliente.Email,
                Email = nuevoCliente.Email,
                NombreCompleto = nuevoCliente.NombreCompleto
            };

            var resultadoCreacion = await _userManager.CreateAsync(nuevoUsuario, nuevoCliente.Dni.ToString());

            if (!resultadoCreacion.Succeeded)
            {
                return BadRequest(new
                {
                    codigo = 0,
                    mensaje = "Error al registrar las credenciales del cliente.",
                    errores = resultadoCreacion.Errors.Select(e => e.Description)
                });
            }

            if (!await _roleManager.RoleExistsAsync("CLIENTE"))
            {
                await _roleManager.CreateAsync(new IdentityRole("CLIENTE"));
            }

            var resultadoRol = await _userManager.AddToRoleAsync(nuevoUsuario, "CLIENTE");

            if (!resultadoRol.Succeeded)
            {
                return BadRequest(new
                {
                    mensaje = "Error al asignar el rol al usuario.",
                    errores = resultadoRol.Errors.Select(e => e.Description)
                });
            }

            return CreatedAtAction(nameof(GetCliente), new { id = nuevoCliente.ClienteID }, nuevoCliente);
        }


        ////////////////////////////////////////////////////////////////////////////////////////////////////////
        /// METODO PARA MODIFICAR UN CLIENTE///////////////////////////////////////////////////////
        ////////////////////////////////////////////////////////////////////////////////////////////////////////
        [HttpPut("{id}")]
        public async Task<IActionResult> PutCliente(int id, Cliente clienteEditada)
        {
            if (id != clienteEditada.ClienteID) return BadRequest();

            var cliente = await _context.Clientes.FindAsync(id);

            cliente.NombreCompleto = clienteEditada.NombreCompleto?.Trim().ToUpper();
            cliente.Observacion = clienteEditada.Observacion?.Trim().ToUpper() ?? "";
            cliente.Telefono = clienteEditada.Telefono;
            cliente.Estado = clienteEditada.Estado;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!await _context.Clientes.AnyAsync(a => a.ClienteID == id)) return NotFound();
                throw;
            }

            return NoContent();
        }

        ////////////////////////////////////////////////////////////////////////////////////////////////////////
        /// METODO PARA ELIMINAR UNA CLIENTE/////////////////////////////////////////////////////////
        ////////////////////////////////////////////////////////////////////////////////////////////////////////
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCliente(int id)
        {
            var Cliente = await _context.Clientes.FindAsync(id);
            if (Cliente == null) return NotFound();

            var usuarioCliente = await _context.Users.FirstOrDefaultAsync(u => u.Email == Cliente.Email);

            var tieneTicket = await _context.Ticket.AnyAsync(t =>
                t.UsuarioClienteId == usuarioCliente.Id &&
                (t.Estado == EstadoDeLosTickets.ABIERTO || t.Estado == EstadoDeLosTickets.EN_PROCESO));

            if (tieneTicket)
            {
                return BadRequest("No se puede eliminar esta Cliente porque está asociada a un Ticket.");
            }

            Cliente.Estado = false;
            await _context.SaveChangesAsync();

            return NoContent();
        }


        /////////////////////////////////////////////////////////////////////////////////////////
        /// METODO PARA RESTAURAR UN CLIENTE ELIMINADO ////////////////////////////////////////////////////////////
        /// ////////////////////////////////////////////////////////////////////////////////////////
        [HttpPut("restaurar/{id}")]
        public async Task<IActionResult> RestaurarCliente(int id)
        {
            var Cliente = await _context.Clientes.FindAsync(id);
            if (Cliente == null) return NotFound();

            Cliente.Estado = true;
            await _context.SaveChangesAsync();

            return NoContent();
        }


        ////////////////////////////////////////////////////////////////////////////////////////////////////////
        /// METODO PARA OBTENER UN CLIENTE POR ID //////////////////////////////////////////////////
        ////////////////////////////////////////////////////////////////////////////////////////////////////////
        [HttpGet("{id}")]
        public async Task<ActionResult<Cliente>> GetCliente(int id)
        {
            var Cliente = await _context.Clientes.FindAsync(id);

            if (Cliente == null)
            {
                return NotFound();
            }

            return Cliente;
        }

        private bool ClienteExists(int id)
        {
            return _context.Clientes.Any(e => e.ClienteID == id);
        }
    }
}
