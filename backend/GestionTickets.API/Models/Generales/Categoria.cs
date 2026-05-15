using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace GestionTickets.Models.Generales

{
    // Tabla de Categorias Para la Base de Datos
    public class Categoria
    {
        [Key]
        public int CategoriaID { get; set; }
        public string Descripcion { get; set; }
        public bool Estado { get; set; }

        [JsonIgnore]
        public virtual ICollection<Ticket> Tickets { get; set; }
        public ICollection<PuestoCategoria> PuestosCategorias { get; set; }

    }


    // Para filtrar por el nombre de la categoria
    public class CategoriaFiltrar
    {
        public string Descripcion { get; set; }
    }

}