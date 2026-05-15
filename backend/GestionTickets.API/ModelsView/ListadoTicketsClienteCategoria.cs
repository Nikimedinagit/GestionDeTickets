public class ListadoTicketsClienteCategoria
    {
        public int ClienteId { get; set; }
        public string Nombre { get; set; }
        public string Email { get; set; }
        public int TotalTickets { get; set; }
        public int TicketsAbiertos { get; set; }
        public int TicketsCerrados { get; set; }
        public double PorcentajeCriticos { get; set; }
        public string UltimoTicketCreado { get; set; }
        public string UltimoTicketCerrado { get; set; }
        public List<ListadoTicketsCategoria> Categorias { get; set; }
    }


    public class ListadoTicketsCategoria
    {
        public int CategoriaId { get; set; }
        public string Descripcion { get; set; }
        public int TotalTickets { get; set; }
        public int TicketsAbiertos { get; set; }
        public int TicketsCerrados { get; set; }
        public double PorcentajeCriticos { get; set; }
        public string UltimoTicketCreado { get; set; }
        public string UltimoTicketCerrado { get; set; }
    }

