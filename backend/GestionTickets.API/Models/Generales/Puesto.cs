using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace GestionTickets.Models.Generales
{
    // Tabla de Puestos Para la Base de Datos
    public class Puesto
    {
        [Key]
        public int PuestoID { get; set; }
        public string Descripcion { get; set; }
        public bool Estado { get; set; }
        
        [JsonIgnore]
        public virtual ICollection<Desarrollador> Desarrollador { get; set; }
        public ICollection<PuestoCategoria> PuestosCategorias { get; set; }

    }

    // Para filtrar por el nombre deL puesto
    public class PuestoFiltrar
    {
        public string Descripcion { get; set; }

    }
}