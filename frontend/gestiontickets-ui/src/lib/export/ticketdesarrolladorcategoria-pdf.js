import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { format } from "date-fns";

export const exportarDesarrolladorCategoriaPDF = (data) => {
  const doc = new jsPDF({
    orientation: "landscape",
    unit: "mm",
    format: "a4",
  });

  const primary = [15, 23, 42]; 

    doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.setTextColor(...primary);
  doc.text("REPORTE DE ESTADÍSTICAS POR DESARROLLADOR Y CATEGORÍA", 14, 18);

  doc.setDrawColor(226, 232, 240);
  doc.line(14, 22, 283, 22);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(100);
  doc.text(`Generado el ${format(new Date(), "dd/MM/yyyy HH:mm")}`, 14, 28);
  doc.text(`Desarrolladores activos analizados: ${data.length}`, 283, 28, { align: "right" });

  const rows = [];
  
  data.forEach((desarrollador) => {
    rows.push({
      isDesarrollador: true,
      nombre: desarrollador.nombre?.toUpperCase() || "-",
      cerrados: desarrollador.totalTicketsCerrados,
      bajos: `${desarrollador.porcentajeBajos}%`,
      medios: `${desarrollador.porcentajeIntermedios}%`,
      criticos: `${desarrollador.porcentajeCriticos}%`,
      ultimoCerrado: desarrollador.ultimoTicketCreado || "AÚN NO TIENE", 
    });

    desarrollador.categorias?.forEach((cat) => {
      rows.push({
        isDesarrollador: false,
        nombre: `   • ${cat.nombre?.toUpperCase() || "GENERAL"}`, 
        cerrados: cat.totalTicketsCerrados,
        bajos: `${cat.porcentajeBajos}%`,
        medios: `${cat.porcentajeIntermedios}%`,
        criticos: `${cat.porcentajeCriticos}%`,
        ultimoCerrado: cat.ultimoTicketCreado || "AÚN NO TIENE",
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
      nombre: { cellWidth: 105 },
      cerrados: { cellWidth: 30, halign: "center" },
      bajos: { cellWidth: 30, halign: "center" },
      medios: { cellWidth: 30, halign: "center" },
      criticos: { cellWidth: 30, halign: "center" },
      ultimoCerrado: { cellWidth: 44, halign: "center" },
    },
    columns: [
      { header: "DESARROLLADOR / CATEGORÍA", dataKey: "nombre" },
      { header: "TICKETS CERRADOS", dataKey: "cerrados" },
      { header: "% BAJOS", dataKey: "bajos" },
      { header: "% MEDIOS", dataKey: "medios" },
      { header: "% CRÍTICOS", dataKey: "criticos" },
      { header: "ÚLTIMO CERRADO", dataKey: "ultimoCerrado" },
    ],
    body: rows,
    
    willDrawCell: (data) => {
      const rowData = data.row.raw;
      if (rowData && rowData.isDesarrollador) {
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