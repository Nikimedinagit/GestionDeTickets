import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { format } from "date-fns";

export const exportarTicketsPDF = (
  tickets,
  {
    estadoVista,
    busqueda,
    filtros,
    categorias = [],
  }
) => {
  const doc = new jsPDF({
    orientation: "landscape",
    unit: "mm",
    format: "a4",
  });

  const primary = [15, 23, 42];

  // =====================================================
  // HEADER
  // =====================================================

  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.setTextColor(...primary);

  doc.text("REPORTE DE TICKETS", 14, 18);

  doc.setDrawColor(226, 232, 240);
  doc.line(14, 22, 283, 22);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(100);

  doc.text(
    `Generado el ${format(new Date(), "dd/MM/yyyy HH:mm")}`,
    14,
    28
  );

  doc.text(
    `Registros encontrados: ${tickets.length}`,
    283,
    28,
    { align: "right" }
  );

  // =====================================================
  // FILTROS APLICADOS
  // =====================================================

  const filtrosAplicados = [];

  // Vista actual
  filtrosAplicados.push(
    estadoVista === "activos"
      ? "Vista: Tickets Activos"
      : "Vista: Tickets Finalizados"
  );

  // Categoría
  if (filtros?.CategoriaID) {
    const categoria = categorias.find(
      (x) => x.categoriaID === filtros.CategoriaID
    );

    filtrosAplicados.push(
      `Categoría: ${categoria?.descripcion || "S/D"}`
    );
  }

  // Estado
  if (filtros?.Estado) {
    filtrosAplicados.push(
      `Estado: ${obtenerNombreEstado(filtros.Estado)}`
    );
  }

  // Prioridad
  if (filtros?.Prioridad) {
    filtrosAplicados.push(
      `Prioridad: ${obtenerNombrePrioridad(filtros.Prioridad)}`
    );
  }

  // Fecha inicio
  if (filtros?.FechaInicio) {
    filtrosAplicados.push(
      `Desde: ${format(
        new Date(filtros.FechaInicio),
        "dd/MM/yyyy"
      )}`
    );
  }

  // Fecha fin
  if (filtros?.FechaFin) {
    filtrosAplicados.push(
      `Hasta: ${format(
        new Date(filtros.FechaFin),
        "dd/MM/yyyy"
      )}`
    );
  }

  // Búsqueda
  if (busqueda?.trim()) {
    filtrosAplicados.push(`Búsqueda: ${busqueda}`);
  }

  // =====================================================
  // SECCIÓN FILTROS
  // =====================================================

  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(...primary);

  doc.text("FILTROS APLICADOS", 14, 40);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(80);

  if (filtrosAplicados.length === 1) {
    doc.text("No se aplicaron filtros.", 14, 47);
  } else {
    filtrosAplicados.forEach((filtro, index) => {
      doc.text(`• ${filtro}`, 14, 47 + index * 6);
    });
  }

  // =====================================================
  // POSICIÓN DINÁMICA TABLA
  // =====================================================

  const startTableY =
    filtrosAplicados.length === 1
      ? 58
      : 52 + filtrosAplicados.length * 6;

  // =====================================================
  // DATOS TABLA
  // =====================================================

  const rows = tickets.map((t) => {
    let fecha = "-";

    if (t.estado === 3) {
      fecha = t.fechaDeCierre
        ? format(new Date(t.fechaDeCierre), "dd/MM/yyyy")
        : "-";
    } else if (t.estado === 2) {
      fecha = t.fechaDeComienzo
        ? format(new Date(t.fechaDeComienzo), "dd/MM/yyyy")
        : "-";
    } else {
      fecha = t.fechaDeCreacion
        ? format(new Date(t.fechaDeCreacion), "dd/MM/yyyy")
        : "-";
    }

    return {
      titulo: t.titulo?.toUpperCase() || "-",
      categoria:
        t.categoria?.descripcion?.toUpperCase() || "GENERAL",
      estado: obtenerNombreEstado(t.estado),
      prioridad: obtenerNombrePrioridad(t.prioridad),
      fecha,
    };
  });

  // =====================================================
  // TABLA
  // =====================================================

  autoTable(doc, {
    startY: startTableY,

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
      cellPadding: 3,
      valign: "middle",
      font: "helvetica",
    },

    alternateRowStyles: {
      fillColor: [248, 250, 252],
    },

    columnStyles: {
      titulo: {
        cellWidth: 110,
      },

      categoria: {
        cellWidth: 55,
      },

      estado: {
        cellWidth: 35,
        halign: "center",
      },

      prioridad: {
        cellWidth: 35,
        halign: "center",
      },

      fecha: {
        cellWidth: 35,
        halign: "center",
      },
    },

    columns: [
      {
        header: "TÍTULO",
        dataKey: "titulo",
      },

      {
        header: "CATEGORÍA",
        dataKey: "categoria",
      },

      {
        header: "ESTADO",
        dataKey: "estado",
      },

      {
        header: "PRIORIDAD",
        dataKey: "prioridad",
      },

      {
        header: "FECHA",
        dataKey: "fecha",
      },
    ],

    body: rows,

    didDrawPage: (data) => {
      doc.setFontSize(8);

      doc.setTextColor(120);

      doc.text(
        `Página ${data.pageNumber}`,
        doc.internal.pageSize.width / 2,
        doc.internal.pageSize.height - 6,
        {
          align: "center",
        }
      );
    },
  });

  // =====================================================
  // VISTA PREVIA PDF
  // =====================================================

  window.open(doc.output("bloburl"), "_blank");
};

// =====================================================
// HELPERS
// =====================================================

const obtenerNombreEstado = (e) => {
  const nombres = {
    1: "ABIERTO",
    2: "EN PROCESO",
    3: "CERRADO",
    4: "CANCELADO",
  };

  return nombres[e] || "S/D";
};

const obtenerNombrePrioridad = (p) => {
  const nombres = {
    1: "BAJA",
    2: "MEDIA",
    3: "ALTA",
  };

  return nombres[p] || "S/D";
};