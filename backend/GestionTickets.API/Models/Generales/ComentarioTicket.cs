
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;
using GestionTickets.Models.Generales;

namespace GestionTickets.Generales
{
    public class ComentarioTicket
    {
        [Key]
        public int ComentarioTicketID { get; set; }
        public int TicketID { get; set; }
        
        [JsonIgnore]
        public virtual Ticket Ticket { get; set; }
        public string UsuarioId { get; set; }
        
        [ForeignKey("UsuarioId")]
        public virtual ApplicationUser ApplicationUser { get; set; }
        public string Mensaje { get; set; }
        public DateTime Fecha { get; set; }
    }
}
