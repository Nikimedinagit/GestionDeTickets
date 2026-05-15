using GestionTickets.Usuarios;
using IssueTrackAPI.Models.Usuario;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace GestionTickets.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly RoleManager<IdentityRole> _roleManager; 
        private readonly IConfiguration _config;

        public AuthController(
            UserManager<ApplicationUser> userManager,
            RoleManager<IdentityRole> roleManager, 
            IConfiguration config)
        {
            _userManager = userManager;
            _roleManager = roleManager;
            _config = config;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterModel model)
        {
            var user = new ApplicationUser
            {
                UserName = model.Email,
                Email = model.Email,
                NombreCompleto = model.NombreCompleto.ToUpper()
            };

            var result = await _userManager.CreateAsync(user, model.Password);

            if (!result.Succeeded)
            {
                return BadRequest(new AuthResponse
                {
                    IsSuccess = false,
                    Message = string.Join(", ", result.Errors.Select(x => x.Description))
                });
            }

            if (!await _roleManager.RoleExistsAsync("ADMINISTRADOR"))
            {
                await _roleManager.CreateAsync(new IdentityRole("ADMINISTRADOR"));
            }

            await _userManager.AddToRoleAsync(user, "ADMINISTRADOR");

            return Ok(new AuthResponse
            {
                IsSuccess = true,
                Message = "Usuario registrado con éxito"
            });
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginModel model)
        {
            var user = await _userManager.FindByNameAsync(model.Username);

            if (user != null && await _userManager.CheckPasswordAsync(user, model.Password))
            {
                var roles = await _userManager.GetRolesAsync(user);
                var token = GenerarToken(user, roles);

                return Ok(new AuthResponse
                {
                    IsSuccess = true,
                    Token = token,
                    Username = user.UserName,
                    Message = "Acceso concedido"
                });
            }

            return Unauthorized(new AuthResponse
            {
                IsSuccess = false,
                Message = "Usuario o contraseña incorrectos"
            });
        }

        private string GenerarToken(ApplicationUser user, IList<string> roles)
        {
            var jwtKey = _config.GetSection("Jwt:Key").Value;
            var keyBytes = Encoding.UTF8.GetBytes(jwtKey);

            var claims = new List<Claim> {
            new Claim(ClaimTypes.Name, user.UserName),
            new Claim(ClaimTypes.Email, user.Email),
            new Claim(ClaimTypes.NameIdentifier, user.Id),
            new Claim("nombreCompleto", user.NombreCompleto),
            new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
        };

            foreach (var role in roles)
            {
                claims.Add(new Claim(ClaimTypes.Role, role));
            }

            var key = new SymmetricSecurityKey(keyBytes);
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims),
                Expires = DateTime.UtcNow.AddHours(8),
                SigningCredentials = creds
            };

            var tokenHandler = new JwtSecurityTokenHandler();
            var tokenConfig = tokenHandler.CreateToken(tokenDescriptor);

            return tokenHandler.WriteToken(tokenConfig);
        }
    }
}