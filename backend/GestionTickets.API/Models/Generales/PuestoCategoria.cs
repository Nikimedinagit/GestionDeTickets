using System.ComponentModel.DataAnnotations.Schema;

namespace GestionTickets.Models.Generales
{   
    // Tabla de PuestosCategroia Para la Base de Datos
    public partial class PuestoCategoria
    {
        public int PuestoCategoriaID { get; set; }
        public int PuestoID { get; set; }
        public virtual Puesto Puesto { get; set; }
        public int CategoriaID { get; set; }
        public virtual Categoria Categoria { get; set; }

    }
}