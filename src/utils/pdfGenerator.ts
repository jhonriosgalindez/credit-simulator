import { jsPDF } from "jspdf";
import { CreditSimulationResult } from "../types";
import { formatCOP, CREDIT_TYPES } from "./creditCalculator";

/**
 * Generates and downloads a polished PDF report summarizing the credit simulation.
 */
export function downloadCreditPDF(simulation: CreditSimulationResult) {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  // Page dimensions: 210mm width x 297mm height
  const pageWidth = 210;
  const marginX = 15;
  const printableWidth = pageWidth - (marginX * 2); // 180mm

  // Get credit type name
  const creditType = CREDIT_TYPES.find((c) => c.id === simulation.input.tipoCredito) || CREDIT_TYPES[0];

  // Helper: Draw a horizontal line
  const drawLine = (y: number, strokeColor = [226, 232, 240], thickness = 0.2) => {
    doc.setDrawColor(strokeColor[0], strokeColor[1], strokeColor[2]);
    doc.setLineWidth(thickness);
    doc.line(marginX, y, marginX + printableWidth, y);
  };

  // -------------------------------------------------------------
  // HEADER BAND (Decorative top bar)
  // -------------------------------------------------------------
  doc.setFillColor(16, 185, 129); // Emerald 500
  doc.rect(0, 0, pageWidth, 5, "F");

  // -------------------------------------------------------------
  // COORPORATE IDENTITY
  // -------------------------------------------------------------
  let currentY = 16;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.setTextColor(15, 23, 42); // Slate 900
  doc.text("Banco Startup", marginX, currentY);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139); // Slate 500
  doc.text("Banca Digital • Soluciones de Crédito Inteligentes", marginX, currentY + 4.5);

  // Metadata: right-aligned date and time
  const today = new Date();
  const dateStr = today.toLocaleDateString("es-CO", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  const timeStr = today.toLocaleTimeString("es-CO", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);
  doc.text(`Fecha: ${dateStr}`, pageWidth - marginX, currentY, { align: "right" });
  doc.text(`Hora: ${timeStr}`, pageWidth - marginX, currentY + 4.5, { align: "right" });

  currentY += 12;
  drawLine(currentY);

  // TITLE OF THE DOCUMENT
  currentY += 10;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.setTextColor(15, 23, 42);
  doc.text("REPORTE DE SIMULACIÓN DE CRÉDITO", marginX, currentY);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(100, 116, 139);
  doc.text("Proyección preliminar bajo el Sistema de Amortización Francés", marginX, currentY + 4.5);

  // -------------------------------------------------------------
  // SECTION 1: GENERAL REQUEST DATA
  // -------------------------------------------------------------
  currentY += 12;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(15, 23, 42);
  doc.text("1. Datos Generales del Crédito", marginX, currentY);

  currentY += 3;
  // Background box for request data
  doc.setFillColor(248, 250, 252); // Slate 50
  doc.setDrawColor(226, 232, 240); // Slate 200
  doc.setLineWidth(0.3);
  doc.rect(marginX, currentY, printableWidth, 24, "FD");

  // Grid labels and values
  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);
  doc.text("Tipo de Crédito:", marginX + 6, currentY + 7);
  doc.text("Monto Solicitado:", marginX + 6, currentY + 16);

  doc.text("Plazo:", marginX + 96, currentY + 7);
  doc.text("Tasa de Interés:", marginX + 96, currentY + 16);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(15, 23, 42);
  doc.text(creditType.nombre, marginX + 34, currentY + 7);
  doc.text(formatCOP(simulation.input.monto), marginX + 34, currentY + 16);

  doc.text(`${simulation.input.plazoMeses} Meses (${(simulation.input.plazoMeses / 12).toFixed(1)} Años)`, marginX + 124, currentY + 7);
  
  const tasaMVStr = `${(simulation.tasaMensual * 100).toFixed(2)}% M.V.`;
  const tasaEAStr = `${(simulation.tasaAnualEquivalente * 100).toFixed(2)}% E.A.`;
  doc.text(`${tasaMVStr} (${tasaEAStr})`, marginX + 124, currentY + 16);

  // -------------------------------------------------------------
  // SECTION 2: COSTS & PAYMENT STRUCTURE (KPI CARDS)
  // -------------------------------------------------------------
  currentY += 34;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(15, 23, 42);
  doc.text("2. Estructura de Pagos y Costos", marginX, currentY);

  currentY += 4;
  const cardWidth = 56;
  const cardHeight = 25;
  const cardGap = 6;

  // Card 1: Cuota Mensual Total
  doc.setFillColor(240, 253, 250); // Emerald 50
  doc.setDrawColor(204, 251, 241); // Emerald 100
  doc.rect(marginX, currentY, cardWidth, cardHeight, "FD");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(7.5);
  doc.setTextColor(5, 150, 105); // Emerald 600
  doc.text("CUOTA MENSUAL ESTIMADA", marginX + 4, currentY + 6);

  doc.setFontSize(11);
  doc.setTextColor(6, 78, 59); // Emerald 900
  doc.text(formatCOP(simulation.cuotaMensualTotal), marginX + 4, currentY + 14);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(7);
  doc.setTextColor(5, 150, 105);
  doc.text("Incluye seguro obligatorio de vida", marginX + 4, currentY + 20);

  // Card 2: Intereses Totales
  doc.setFillColor(254, 242, 242); // Red 50
  doc.setDrawColor(254, 226, 226); // Red 100
  doc.rect(marginX + cardWidth + cardGap, currentY, cardWidth, cardHeight, "FD");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(7.5);
  doc.setTextColor(225, 29, 72); // Red 600
  doc.text("INTERESES TOTALES", marginX + cardWidth + cardGap + 4, currentY + 6);

  doc.setFontSize(11);
  doc.setTextColor(159, 18, 57); // Red 900
  doc.text(formatCOP(simulation.interesesTotales), marginX + cardWidth + cardGap + 4, currentY + 14);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(7);
  doc.setTextColor(225, 29, 72);
  doc.text("Generados sobre saldos pendientes", marginX + cardWidth + cardGap + 4, currentY + 20);

  // Card 3: Monto Total a Pagar
  doc.setFillColor(241, 245, 249); // Slate 100
  doc.setDrawColor(226, 232, 240); // Slate 200
  doc.rect(marginX + (cardWidth * 2) + (cardGap * 2), currentY, cardWidth, cardHeight, "FD");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(7.5);
  doc.setTextColor(71, 85, 105); // Slate 600
  doc.text("TOTAL DEVOLUCIÓN ESTIMADO", marginX + (cardWidth * 2) + (cardGap * 2) + 4, currentY + 6);

  doc.setFontSize(11);
  doc.setTextColor(15, 23, 42); // Slate 900
  doc.text(formatCOP(simulation.montoTotalPagar), marginX + (cardWidth * 2) + (cardGap * 2) + 4, currentY + 14);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(7);
  doc.setTextColor(100, 116, 139);
  doc.text("Suma de capital, interés y seguro", marginX + (cardWidth * 2) + (cardGap * 2) + 4, currentY + 20);

  // -------------------------------------------------------------
  // SECTION 3: INSURANCE DETAILS
  // -------------------------------------------------------------
  currentY += 32;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(15, 23, 42);
  doc.text("3. Desglose Detallado de Rubros Adicionales", marginX, currentY);

  currentY += 3;
  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(241, 245, 249);
  doc.setLineWidth(0.2);
  doc.rect(marginX, currentY, printableWidth, 14, "F");

  doc.setFontSize(8);
  doc.setTextColor(71, 85, 105);
  doc.text("• Cuota mensual sin seguro (Amortización + Interés):", marginX + 4, currentY + 5);
  doc.text("• Seguro de vida obligatorio mensual:", marginX + 4, currentY + 10);

  doc.setFont("helvetica", "bold");
  doc.setTextColor(15, 23, 42);
  doc.text(formatCOP(simulation.cuotaBase), marginX + 90, currentY + 5);
  doc.text(formatCOP(simulation.valorSeguroMensual), marginX + 90, currentY + 10);

  doc.setFont("helvetica", "normal");
  doc.setTextColor(71, 85, 105);
  doc.text("• Seguro total proyectado (plazo completo):", marginX + 115, currentY + 7);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(15, 23, 42);
  doc.text(formatCOP(simulation.segurosTotales), marginX + 172, currentY + 7);

  // -------------------------------------------------------------
  // SECTION 4: AMORTIZATION SUMMARY TABLE (COMPLETE)
  // -------------------------------------------------------------
  currentY += 21;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(15, 23, 42);
  doc.text("4. Proyección Mensual de Amortización Completa", marginX, currentY);

  currentY += 4;
  // Table columns definition (X offsets)
  const colX = {
    cuota: marginX + 4,
    capital: marginX + 28,
    interes: marginX + 62,
    seguro: marginX + 92,
    total: marginX + 122,
    saldo: marginX + 152,
  };

  const drawTableHeader = (y: number) => {
    // Draw Table Header Background
    doc.setFillColor(15, 23, 42); // Slate 900
    doc.rect(marginX, y, printableWidth, 7, "F");

    // Table Header Labels
    doc.setFont("helvetica", "bold");
    doc.setFontSize(7.5);
    doc.setTextColor(255, 255, 255);
    doc.text("Cuota N°", colX.cuota, y + 5);
    doc.text("Abono Capital", colX.capital + 18, y + 5, { align: "right" });
    doc.text("Intereses", colX.interes + 18, y + 5, { align: "right" });
    doc.text("Seguro Vida", colX.seguro + 18, y + 5, { align: "right" });
    doc.text("Valor Cuota", colX.total + 18, y + 5, { align: "right" });
    doc.text("Saldo Pendiente", colX.saldo + 22, y + 5, { align: "right" });
  };

  drawTableHeader(currentY);
  currentY += 7;

  let pageNum = 1;
  const rowHeight = 6.2;
  const pageLimitY = 232; // Safe vertical limit for rows to allow disclaimer/footers comfortably

  const drawFooter = (page: number, isLast: boolean) => {
    const footerLineY = 264;
    drawLine(footerLineY, [226, 232, 240], 0.2);

    if (isLast) {
      // Draw disclaimer on the last page in the reserved space between pageLimitY and footerLineY
      let disclaimerY = 236;
      doc.setFont("helvetica", "bold");
      doc.setFontSize(6.2);
      doc.setTextColor(100, 116, 139);
      doc.text("AVISO DE EXCLUSIÓN DE RESPONSABILIDAD (DISCLAIMER) Y CONDICIONES COMERCIALES:", marginX, disclaimerY);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(5.5);
      doc.setTextColor(148, 163, 184);
      const disclaimerText = [
        "1. Esta proyección es de carácter meramente preliminar, comercial e informativo. No representa de ninguna forma una oferta contractual ni obliga a Banco Startup a realizar el desembolso.",
        "2. Las tasas de interés definitivas, montos aprobados y la viabilidad del crédito están sujetos estrictamente al estudio de riesgo de crédito, historial financiero y validación de ingresos de la entidad.",
        "3. El seguro de vida deudores es obligatorio de acuerdo a la legislación local para amparar el saldo insoluto de la deuda durante todo el periodo de vigencia de la obligación.",
        "4. Los cálculos están redondeados al peso entero más cercano y asumen pagos en las fechas límite establecidas mensualmente sin incurrir en mora ni amortizaciones extraordinarias."
      ];

      disclaimerText.forEach((line) => {
        disclaimerY += 2.6;
        doc.text(line, marginX, disclaimerY);
      });
    }

    // Stamp / Copyright & Page indicator
    const copyrightY = 272;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(6.5);
    doc.setTextColor(100, 116, 139);
    doc.text("© Banco Startup. Reporte generado digitalmente en cumplimiento con la Ley de Transparencia Financiera.", marginX, copyrightY);
    doc.text(`Página ${page}`, pageWidth - marginX, copyrightY, { align: "right" });
  };

  // Draw Table Body Rows
  simulation.planCuotas.forEach((row, index) => {
    // Check if we need a new page before drawing the row
    if (currentY + rowHeight > pageLimitY) {
      // Close current page table border
      drawLine(currentY, [15, 23, 42], 0.3);

      // Draw footer for current page (never last inside loop)
      drawFooter(pageNum, false);

      // Add a new page
      doc.addPage();
      pageNum++;

      // Decorative band on top of new pages
      doc.setFillColor(16, 185, 129); // Emerald 500
      doc.rect(0, 0, pageWidth, 4, "F");

      // Compact header on subsequent pages
      doc.setFont("helvetica", "bold");
      doc.setFontSize(8);
      doc.setTextColor(15, 23, 42);
      doc.text("Banco Startup • Reporte de Simulación de Crédito", marginX, 11);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(7.5);
      doc.setTextColor(100, 116, 139);
      doc.text(`Detalle de Amortización - ${creditType.nombre}`, marginX + 68, 11);
      drawLine(13, [226, 232, 240], 0.2);

      // Reset coordinates for table on new page
      currentY = 18;
      drawTableHeader(currentY);
      currentY += 7;
    }

    const isEven = index % 2 === 0;
    if (isEven) {
      doc.setFillColor(248, 250, 252); // Slate 50 zebra
      doc.rect(marginX, currentY, printableWidth, rowHeight, "F");
    }
    
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.5);
    doc.setTextColor(51, 65, 85); // Slate 700

    // Cuota N°
    doc.setFont("helvetica", "bold");
    doc.text(String(row.numeroCuota), colX.cuota + 4, currentY + 4.5);
    doc.setFont("helvetica", "normal");

    // Numbers
    doc.text(formatCOP(row.capital), colX.capital + 18, currentY + 4.5, { align: "right" });
    doc.text(formatCOP(row.interes), colX.interes + 18, currentY + 4.5, { align: "right" });
    doc.text(formatCOP(row.seguro), colX.seguro + 18, currentY + 4.5, { align: "right" });
    
    doc.setFont("helvetica", "bold");
    doc.setTextColor(6, 95, 70); // Emerald 800
    doc.text(formatCOP(row.cuotaTotal), colX.total + 18, currentY + 4.5, { align: "right" });
    
    doc.setFont("helvetica", "normal");
    doc.setTextColor(100, 116, 139);
    doc.text(formatCOP(row.saldoPendiente), colX.saldo + 22, currentY + 4.5, { align: "right" });

    currentY += rowHeight;
  });

  // Border bottom of table on final page
  drawLine(currentY, [15, 23, 42], 0.3);

  // -------------------------------------------------------------
  // FOOTER & DISCLAIMER ON THE FINAL PAGE
  // -------------------------------------------------------------
  drawFooter(pageNum, true);

  // Save/Download PDF
  const filename = `Banco_Startup_Simulacion_${creditType.nombre.replace(/\s+/g, "_")}_${simulation.input.monto}.pdf`;
  doc.save(filename);
}
