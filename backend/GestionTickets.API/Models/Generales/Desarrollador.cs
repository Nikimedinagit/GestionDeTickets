using System.ComponentModel.DataAnnotations;

namespace GestionTickets.Models.Generales
{
    // Tabla de Desarrollador Para la Base de Datos
    public class Desarrollador
    {
        [Key]
        public int DesarrolladorID { get; set; }
        public string NombreCompleto { get; set; }
        public long Dni { get; set; }
        public string Email { get; set; }
        public string Telefono { get; set; }
        public string Observacion { get; set; }
        public bool Estado { get; set; }
        public int PuestoID { get; set; }
        public virtual Puesto Puesto { get; set; }
    }

    // Para filtrar por los datos del desarrollador
    public class DesarrolladorFiltrar
    {
        public string NombreDniPuesto { get; set; }
    }
}