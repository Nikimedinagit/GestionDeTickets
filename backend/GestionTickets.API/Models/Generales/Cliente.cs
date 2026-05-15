using System.ComponentModel.DataAnnotations;

namespace GestionTickets.Models.Generales
{
    // Tabla de Cliente Para la Base de Datos
    public class Cliente
    {
        [Key]
        public int ClienteID { get; set; }
        public string NombreCompleto { get; set; }
        public long Dni { get; set; }
        public string Email { get; set; }
        public string Telefono { get; set; }
        public string Observacion { get; set; }
        public string UsuarioClienteId { get; set; }
        public bool Estado { get; set; }

    }


    // Para filtrar por los datos del cliente
    public class ClienteFiltrar
    {
        public string NombreDni { get; set; }

    }

}