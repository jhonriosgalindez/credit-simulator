export interface CreditSimulationInput {
  monto: number;       // Amount in COP (1,000,000 to 1,000,000,000)
  plazoMeses: number;  // Term in months (1 to 360)
  tipoCredito: string; // Type of credit for realistic rates
}

export interface AmortizationRow {
  numeroCuota: number;
  cuotaBase: number;
  interes: number;
  capital: number;
  seguro: number;
  cuotaTotal: number;
  saldoPendiente: number;
}

export interface CreditSimulationResult {
  input: CreditSimulationInput;
  cuotaMensualTotal: number;
  cuotaBase: number; // Principal + Interest
  valorSeguroMensual: number;
  tasaMensual: number;
  tasaAnualEquivalente: number;
  montoTotalPagar: number;
  interesesTotales: number;
  segurosTotales: number;
  planCuotas: AmortizationRow[];
}

export interface CreditType {
  id: string;
  nombre: string;
  tasaMesVencido: number; // Monthly interest rate (e.g. 0.012 = 1.2% MV)
  tasaAnualEquivalente: number; // EA rate (e.g. 15.39%)
  descripcion: string;
  icono: string;
}
