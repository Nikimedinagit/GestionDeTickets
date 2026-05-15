
using GestionTickets.Generales;
using GestionTickets.Models.Generales;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;


using Microsoft.EntityFrameworkCore;


public class ApplicationDbContext : IdentityDbContext<ApplicationUser>
{

    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options)
    {
    }


    public DbSet<Categoria> Categoria { get; set; } = null!;

    public DbSet<Ticket> Ticket { get; set; } = null!;

    public DbSet<Cliente> Clientes { get; set; } = null!;

    public DbSet<HistorialTicket> HistorialTicket { get; set; } = null!;

    public DbSet<Puesto> Puesto { get; set; } = null!;
    
    public DbSet<Desarrollador> Desarrollador { get; set; } = null!;

    public DbSet<PuestoCategoria> PuestoCategoria { get; set; }
    public DbSet<ComentarioTicket> ComentarioTicket { get; set; }

}
