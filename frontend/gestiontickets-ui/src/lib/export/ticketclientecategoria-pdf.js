import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { format } from "date-fns";

export const exportarTicketClienteCategoriaPDF = (data) => {
  const doc = new jsPDF({
    orientation: "landscape",
    unit: "mm",
    format: "a4",
  });

  const primary = [15, 23, 42]; 

  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.setTextColor(...primary);
  doc.text("REPORTE DE ESTADÍSTICAS DE TICKETS", 14, 18);

  doc.setDrawColor(226, 232, 240);
  doc.line(14, 22, 283, 22);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(100);
  doc.text(`Generado el ${format(new Date(), "dd/MM/yyyy HH:mm")}`, 14, 28);
  doc.text(`Clientes activos analizados: ${data.length}`, 283, 28, { align: "right" });

 
  const rows = [];
  
  data.forEach((cliente) => {
    rows.push({
      isCliente: true,
      nombre: cliente.nombre?.toUpperCase() || "-",
      total: cliente.totalTickets,
      abiertos: cliente.ticketsAbiertos,
      cerrados: cliente.ticketsCerrados,
      criticos: `${cliente.porcentajeCriticos}%`,
      creado: cliente.ultimoTicketCreado || "AÚN NO TIENE",
      cerrado: cliente.ultimoTicketCerrado || "AÚN NO TIENE",
    });

    cliente.categorias?.forEach((cat) => {
      rows.push({
        isCliente: false,
        nombre: `   • ${cat.descripcion?.toUpperCase() || "GENERAL"}`, 
        total: cat.totalTickets,
        abiertos: cat.ticketsAbiertos,
        cerrados: cat.ticketsCerrados,
        criticos: `${cat.porcentajeCriticos}%`,
        creado: cat.ultimoTicketCreado || "AÚN NO TIENE",
        cerrado: cat.ultimoTicketCerrado || "AÚN NO TIENE",
      });
    });
  });

  
  autoTable(doc, {
    startY: 36,
    theme: "grid",
    headStyles: {
      fillColor: primary,
      textColor: [255, 255, 255],
      fontSize: 9,
      fontStyle: "bold",
      halign: "left",
    },
    styles: {
      fontSize: 8,
      cellPadding: 2.5,
      valign: "middle",
      font: "helvetica",
    },
    columnStyles: {
      nombre: { cellWidth: 95 },
      total: { cellWidth: 22, halign: "center" },
      abiertos: { cellWidth: 25, halign: "center" },
      cerrados: { cellWidth: 25, halign: "center" },
      criticos: { cellWidth: 25, halign: "center" },
      creado: { cellWidth: 38, halign: "center" },
      cerrado: { cellWidth: 38, halign: "center" },
    },
    columns: [
      { header: "CLIENTE / CATEGORÍA", dataKey: "nombre" },
      { header: "TOTAL", dataKey: "total" },
      { header: "ABIERTOS", dataKey: "abiertos" },
      { header: "CERRADOS", dataKey: "cerrados" },
      { header: "% CRÍTICOS", dataKey: "criticos" },
      { header: "ÚLTIMO CREADO", dataKey: "creado" },
      { header: "ÚLTIMO CERRADO", dataKey: "cerrado" },
    ],
    body: rows,
    
    willDrawCell: (data) => {
      const rowData = data.row.raw;
      if (rowData && rowData.isCliente) {
        data.cell.styles.fillColor = [233, 236, 239]; 
        data.cell.styles.fontStyle = "bold";
        data.cell.styles.textColor = [30, 41, 59];
      }
    },
    
    didDrawPage: (data) => {
      doc.setFontSize(8);
      doc.setTextColor(120);
      doc.text(
        `Página ${data.pageNumber}`,
        doc.internal.pageSize.width / 2,
        doc.internal.pageSize.height - 6,
        { align: "center" }
      );
    },
  });


  window.open(doc.output("bloburl"), "_blank");
};