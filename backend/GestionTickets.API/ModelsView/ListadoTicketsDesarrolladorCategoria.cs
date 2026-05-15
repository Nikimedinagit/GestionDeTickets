    public class ListadoTicketsDesarrolladorCategoria
    {
        public int DesarrolladorId { get; set; }
        public string Nombre { get; set; }
        public int TotalTicketsCerrados { get; set; }
        public double PorcentajeCriticos { get; set; }
        public double PorcentajeIntermedios { get; set; }
        public double PorcentajeBajos { get; set; }
        public string UltimoTicketCreado { get; set; }
        public List<ListadoDesarrolladorCategoria> Categorias { get; set; }
    }

    public class ListadoDesarrolladorCategoria
    {
        public int CategoriaId { get; set; }
        public string Nombre { get; set; }
        public int TotalTicketsCerrados { get; set; }
        public double PorcentajeCriticos { get; set; }
        public double PorcentajeIntermedios { get; set; }
        public double PorcentajeBajos { get; set; }
        public string UltimoTicketCreado { get; set; }
    }


    
public class InformeEstadisticoPorDesarrolladorPuestoCategoria
    {
        public int CategoriaId { get; set; }
        public string Nombre { get; set; }
        public int TotalTicketsCerrados { get; set; }
        public double PorcentajeCriticos { get; set; }
        public double PorcentajeIntermedios { get; set; }
        public double PorcentajeBajos { get; set; }
        public string UltimoTicketCreado { get; set; }
    }


        public class FiltroEstadisticaDesarrolladorCategoria
    {
        public DateTime? FechaInicio { get; set; }
        public DateTime? FechaFin { get; set; }
    }
