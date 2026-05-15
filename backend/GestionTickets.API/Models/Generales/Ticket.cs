using System.ComponentModel.DataAnnotations;
using GestionTickets.Generales;

namespace GestionTickets.Models.Generales
{
    // Tabla de Tickets Para la Base de Datos
    public class Ticket
    {
        [Key]
        public int TicketID { get; set; }
        public string Titulo { get; set; }
        public string Descripcion { get; set; }
        public EstadoDeLosTickets Estado { get; set; }
        public PrioridadDeLosTickets Prioridad { get; set; }
        public DateTime? FechaDeCreacion { get; set; }
        public DateTime? FechaDeCierre { get; set; }
        public DateTime? FechaDeComienzo { get; set; }
        public string UsuarioClienteId { get; set; }
        public string UsuarioFinalizadorID { get; set; }
        public virtual ApplicationUser UsuarioFinalizador { get; set; }

        public int CategoriaID { get; set; }
        public virtual Categoria Categoria { get; set; }
        public virtual ICollection<ComentarioTicket> Comentarios { get; set; }
    }

    public class TicketComentarioDTO
    {
        public string Comentario { get; set; }
    }

    // Cramos esta clase de ESTADO que representa datos fijos
    public enum EstadoDeLosTickets
    {
        ABIERTO = 1,
        EN_PROCESO,
        CERRADO,
        CANCELADO
    }


    // Cramos esta clase de PRIORIDAD que representa datos fijos
    public enum PrioridadDeLosTickets
    {
        BAJA = 1,
        MEDIA,
        ALTA
    }

    // para filtrar en la vista de tickets
    public class FiltrarTicket
    {
        public int? CategoriaID { get; set; }
        public int? Estado { get; set; }
        public int? Prioridad { get; set; }
        public DateTime? FechaInicio { get; set; }
        public DateTime? FechaFin { get; set; }
        public string Titulo { get; set; }
        public int? GrupoEstado { get; set; }
    }

}

