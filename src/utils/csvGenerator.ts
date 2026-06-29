import { CreditSimulationResult } from "../types";
import { CREDIT_TYPES } from "./creditCalculator";

/**
 * Generates and downloads a CSV file representing the complete credit simulation and amortization plan.
 * Fully compatible with Microsoft Excel and Google Sheets.
 */
export function downloadCreditCSV(simulation: CreditSimulationResult) {
  const creditType = CREDIT_TYPES.find((c) => c.id === simulation.input.tipoCredito) || CREDIT_TYPES[0];

  // Title & Metadata header rows
  const infoRows = [
    ["BANCO STARTUP - REPORTE DE SIMULACION DE CREDITO"],
    ["Fecha de Generación", new Date().toLocaleString("es-CO")],
    [],
    ["1. DATOS GENERALES DEL CRÉDITO"],
    ["Tipo de Crédito", creditType.nombre],
    ["Monto Solicitado", simulation.input.monto],
    ["Plazo (Meses)", simulation.input.plazoMeses],
    ["Plazo (Años)", (simulation.input.plazoMeses / 12).toFixed(1)],
    ["Tasa Mensual Vencida (M.V.)", `${(simulation.tasaMensual * 100).toFixed(4)}%`],
    ["Tasa Efectiva Anual (E.A.)", `${(simulation.tasaAnualEquivalente * 100).toFixed(4)}%`],
    [],
    ["2. RESUMEN DE PAGOS"],
    ["Cuota Mensual Estimada (Total)", Math.round(simulation.cuotaMensualTotal)],
    ["Cuota Base (Capital + Interés)", Math.round(simulation.cuotaBase)],
    ["Seguro de Vida deudores Mensual", Math.round(simulation.valorSeguroMensual)],
    ["Total de Intereses a Pagar", Math.round(simulation.interesesTotales)],
    ["Total de Seguros a Pagar", Math.round(simulation.segurosTotales)],
    ["Monto Total a Devolver", Math.round(simulation.montoTotalPagar)],
    [],
    ["3. PLAN DE AMORTIZACIÓN DETALLADO"],
    ["Cuota N°", "Abono Capital", "Intereses", "Seguro de Vida", "Valor de la Cuota", "Saldo Pendiente"]
  ];

  // Add amortization rows
  const dataRows = simulation.planCuotas.map((row) => [
    row.numeroCuota,
    Math.round(row.capital),
    Math.round(row.interes),
    Math.round(row.seguro),
    Math.round(row.cuotaTotal),
    Math.round(row.saldoPendiente)
  ]);

  const allRows = [...infoRows, ...dataRows];

  // Map to CSV format, handling escaping and commas.
  const csvContent = allRows
    .map((row) =>
      row
        .map((val) => {
          if (val === undefined || val === null) return "";
          const strVal = String(val);
          // If the value contains commas, quotes, semicolons or newlines, wrap in quotes and escape quotes
          if (strVal.includes(",") || strVal.includes('"') || strVal.includes("\n") || strVal.includes(";")) {
            return `"${strVal.replace(/"/g, '""')}"`;
          }
          return strVal;
        })
        .join(",")
    )
    .join("\n");

  // Create a Blob with UTF-8 BOM so Excel opens it with correct encoding
  const blob = new Blob(["\uFEFF" + csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement("a");
  const safeTypeName = creditType.nombre.replace(/\s+/g, "_");
  link.setAttribute("href", url);
  link.setAttribute("download", `Banco_Startup_Plan_Amortizacion_${safeTypeName}_$${simulation.input.monto}.csv`);
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
