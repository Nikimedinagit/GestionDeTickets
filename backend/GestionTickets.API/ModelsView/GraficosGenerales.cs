    namespace GestionTickets.API.Models.ModelsView;


    // CLASE PARA EL GRAFICO DE RESULTADO FILTRANDO TICKETS POR CATEGORIA
    public class FiltrarGraficoTicketPorCategoria
    {
        public int Id { get; set; }
        public string Descripcion { get; set; }

        public int Cantidad { get; set; }

    }


    // CLASE PARA EL GRAFICO DE RESULTADO FILTRANDO TICKETS CERRADOS POR MES Y COMPARATIVO DE TICKETS CREADOS Y CERRADOS POR MES
    public class FiltrarGraficoTicketPorMes
    {
        public string Mes { get; set; } = string.Empty;

        public int? CantidadCerrados { get; set; }

        public int? CantidadCreados { get; set; }

    }