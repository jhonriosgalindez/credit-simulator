import { CreditSimulationInput, CreditSimulationResult, AmortizationRow, CreditType } from "../types";

export const CREDIT_TYPES: CreditType[] = [
  {
    id: "libre_inversion",
    nombre: "Libre Inversión",
    tasaMesVencido: 0.0155, // 1.55% MV
    tasaAnualEquivalente: 0.2023, // 20.23% EA
    descripcion: "Para viajes, estudios, tecnología o lo que desees sin restricciones.",
    icono: "Sparkles",
  },
  {
    id: "vivienda",
    nombre: "Crédito de Vivienda",
    tasaMesVencido: 0.0092, // 0.92% MV
    tasaAnualEquivalente: 0.1161, // 11.61% EA
    descripcion: "Adquiere vivienda nueva o usada con tasas de interés preferenciales.",
    icono: "Home",
  },
  {
    id: "vehiculo",
    nombre: "Crédito de Vehículo",
    tasaMesVencido: 0.0118, // 1.18% MV
    tasaAnualEquivalente: 0.1511, // 15.11% EA
    descripcion: "Financia el carro o moto de tus sueños, nuevo o usado.",
    icono: "Car",
  },
];

/**
 * Formats a number as COP currency
 */
export function formatCOP(value: number): string {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

/**
 * Format interest rate to friendly string
 */
export function formatRate(monthlyRate: number, annualRate: number): string {
  const mvPercent = (monthlyRate * 100).toFixed(2);
  const eaPercent = (annualRate * 100).toFixed(2);
  return `${mvPercent}% M.V. (${eaPercent}% E.A.)`;
}

/**
 * Performs full credit simulation based on French Amortization system
 */
export function simulateCredit(input: CreditSimulationInput): CreditSimulationResult {
  const { monto, plazoMeses, tipoCredito } = input;
  
  // Find selected credit type rate
  const creditType = CREDIT_TYPES.find((c) => c.id === tipoCredito) || CREDIT_TYPES[0];
  const r = creditType.tasaMesVencido;
  
  // Insurance monthly calculation: e.g., 700 COP per million COP of initial debt
  // Minimum insurance of 1,000 COP for very small credits
  const valorSeguroMensual = Math.max(1000, Math.round((monto / 1000000) * 750));
  
  // Calculate base monthly payment (Principal + Interest)
  let cuotaBase = 0;
  if (r === 0) {
    cuotaBase = monto / plazoMeses;
  } else {
    cuotaBase = (monto * r * Math.pow(1 + r, plazoMeses)) / (Math.pow(1 + r, plazoMeses) - 1);
  }
  
  cuotaBase = Math.round(cuotaBase);
  const cuotaMensualTotal = cuotaBase + valorSeguroMensual;
  
  const planCuotas: AmortizationRow[] = [];
  let saldoPendiente = monto;
  let interesesTotales = 0;
  let segurosTotales = 0;
  
  for (let i = 1; i <= plazoMeses; i++) {
    const interes = Math.round(saldoPendiente * r);
    let capital = cuotaBase - interes;
    
    // In the last month, adjust capital to pay exactly the remaining balance
    if (i === plazoMeses) {
      capital = saldoPendiente;
    }
    
    saldoPendiente -= capital;
    // Prevent negative balances due to rounding
    if (saldoPendiente < 0 || i === plazoMeses) {
      saldoPendiente = 0;
    }
    
    interesesTotales += interes;
    segurosTotales += valorSeguroMensual;
    
    planCuotas.push({
      numeroCuota: i,
      cuotaBase: Math.round(capital + interes),
      interes,
      capital: Math.round(capital),
      seguro: valorSeguroMensual,
      cuotaTotal: Math.round(capital + interes + valorSeguroMensual),
      saldoPendiente: Math.round(saldoPendiente),
    });
  }
  
  const montoTotalPagar = monto + interesesTotales + segurosTotales;
  
  return {
    input,
    cuotaMensualTotal,
    cuotaBase,
    valorSeguroMensual,
    tasaMensual: r,
    tasaAnualEquivalente: creditType.tasaAnualEquivalente,
    montoTotalPagar,
    interesesTotales,
    segurosTotales,
    planCuotas,
  };
}
