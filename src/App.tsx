import React, { useState, useEffect } from "react";
import {
  ArrowLeft,
  Calculator,
  Calendar,
  ChevronRight,
  Coins,
  Info,
  Percent,
  ShieldCheck,
  Sparkles,
  X,
  DollarSign,
  TrendingUp,
  Download,
  AlertCircle,
  HelpCircle,
  PiggyBank,
  FileSpreadsheet
} from "lucide-react";
import { simulateCredit, formatCOP, formatRate, CREDIT_TYPES } from "./utils/creditCalculator";
import { CreditSimulationInput, CreditSimulationResult } from "./types";
import Header from "./components/Header";
import PlanCuotasModal from "./components/PlanCuotasModal";
import ChartModal from "./components/ChartModal";
import { downloadCreditPDF } from "./utils/pdfGenerator";
import { downloadCreditCSV } from "./utils/csvGenerator";

export default function App() {
  // Navigation & Simulation state
  const [view, setView] = useState<"form" | "results">("form");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isChartModalOpen, setIsChartModalOpen] = useState(false);
  
  // Form inputs
  const [monto, setMonto] = useState<number>(45000000);
  const [plazoMeses, setPlazoMeses] = useState<number>(60);
  const [tipoCredito, setTipoCredito] = useState<string>("libre_inversion");
  
  // Custom manual text inputs to support smooth editing
  const [montoInputString, setMontoInputString] = useState<string>("45.000.000");
  
  // Active Simulation Result
  const [simulation, setSimulation] = useState<CreditSimulationResult | null>(null);

  // Synchronize manual string input with number value
  useEffect(() => {
    setMontoInputString(new Intl.NumberFormat("es-CO").format(monto));
  }, [monto]);

  // Handle manual input typing for Amount
  const handleMontoTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/\D/g, "");
    const numericValue = rawValue ? parseInt(rawValue, 10) : 0;
    
    // Store temporarily in input string
    setMontoInputString(rawValue ? new Intl.NumberFormat("es-CO").format(numericValue) : "");
    
    // Set numeric value within range limit caps to avoid UI breakage during typing
    setMonto(numericValue);
  };

  // Blur validation to ensure boundaries are kept
  const handleMontoBlur = () => {
    let finalValue = monto;
    if (monto < 1000000) {
      finalValue = 1000000;
    } else if (monto > 1000000000) {
      finalValue = 1000000000;
    }
    setMonto(finalValue);
    setMontoInputString(new Intl.NumberFormat("es-CO").format(finalValue));
  };

  // Run simulation on form submit
  const handleSimular = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Double validation
    let validMonto = monto;
    if (monto < 1000000) validMonto = 1000000;
    if (monto > 1000000000) validMonto = 1000000000;
    
    let validPlazo = plazoMeses;
    if (plazoMeses < 1) validPlazo = 1;
    if (plazoMeses > 360) validPlazo = 360;

    setMonto(validMonto);
    setPlazoMeses(validPlazo);

    const inputData: CreditSimulationInput = {
      monto: validMonto,
      plazoMeses: validPlazo,
      tipoCredito,
    };

    const result = simulateCredit(inputData);
    setSimulation(result);
    setView("results");
  };

  // Quick preset buttons for user convenience
  const applyPresetMonto = (amount: number) => {
    setMonto(amount);
  };

  const applyPresetPlazo = (months: number) => {
    setPlazoMeses(months);
  };

  const currentCreditTypeData = CREDIT_TYPES.find((c) => c.id === tipoCredito) || CREDIT_TYPES[0];

  // Calculate percentages for sliders to render as filled progress bars
  const minMonto = 1000000;
  const maxMonto = 1000000000;
  const pctMonto = Math.min(100, Math.max(0, ((monto - minMonto) / (maxMonto - minMonto)) * 100));

  const minPlazo = 1;
  const maxPlazo = 360;
  const pctPlazo = Math.min(100, Math.max(0, ((plazoMeses - minPlazo) / (maxPlazo - minPlazo)) * 100));

  return (
    <div className="min-h-screen bg-slate-50 font-sans flex flex-col antialiased selection:bg-emerald-100 selection:text-emerald-900" id="app-root">
      {/* Top Banner / Premium Header */}
      <Header />

      {/* Main Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col justify-start">
        
        {/* Banner Informativo */}
        <div className="mb-8 bg-gradient-to-r from-slate-900 to-slate-800 rounded-2xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden" id="hero-banner">
          <div className="absolute right-0 bottom-0 top-0 w-1/3 opacity-10 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-emerald-400 via-emerald-600 to-slate-900 hidden md:block rounded-r-2xl"></div>
          <div className="relative z-10 max-w-2xl">
            <span className="bg-emerald-500/20 text-emerald-300 text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider inline-block mb-3 border border-emerald-500/30">
              Simulador Multiproducto COP
            </span>
            <h1 className="font-display text-2xl sm:text-3.5xl font-extrabold tracking-tight leading-tight">
              Proyecta tu salud financiera con <span className="text-emerald-400">seguridad</span>
            </h1>
            <p className="text-slate-300 text-sm sm:text-base mt-2 max-w-xl">
              Calcule cuotas, tasas aplicadas y seguros obligatorios según el sistema de amortización francés. Transparente, rápido y sin compromiso.
            </p>
          </div>
        </div>

        {/* View 1: Input Form */}
        {view === "form" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start" id="view-form-container">
            
            {/* Form Column */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm lg:col-span-7" id="form-card">
              <div className="flex items-center gap-3 mb-6 border-b border-slate-100 pb-4">
                <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
                  <Calculator className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="font-display text-xl font-bold text-slate-900">Configura tu solicitud</h2>
                  <p className="text-slate-500 text-xs">Completa los datos para obtener una cotización real</p>
                </div>
              </div>

              <form onSubmit={handleSimular} className="space-y-6">
                
                {/* 1. Tipo de Crédito */}
                <div className="space-y-2.5">
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">
                    ¿Qué tipo de crédito buscas?
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {CREDIT_TYPES.map((type) => {
                      const isSelected = tipoCredito === type.id;
                      return (
                        <button
                          key={type.id}
                          type="button"
                          id={`btn-credit-type-${type.id}`}
                          onClick={() => setTipoCredito(type.id)}
                          className={`flex flex-col text-left p-3.5 rounded-xl border transition-all relative ${
                            isSelected
                              ? "border-emerald-600 bg-emerald-50/40 ring-1 ring-emerald-600"
                              : "border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                          }`}
                        >
                          <div className="flex items-center justify-between w-full mb-1">
                            <span className="text-xs font-bold text-slate-800">{type.nombre}</span>
                            {isSelected && (
                              <div className="h-2 w-2 rounded-full bg-emerald-600" />
                            )}
                          </div>
                          <span className="text-[10px] text-slate-400 block mb-1.5 leading-tight">{type.descripcion}</span>
                          <span className="text-xs font-bold text-emerald-700 mt-auto">
                            {(type.tasaAnualEquivalente * 100).toFixed(2)}% E.A.
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 2. ¿Cuánto dinero necesitas? */}
                <div className="space-y-3 p-4 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">
                      ¿Cuánto dinero necesitas?
                    </label>
                    <span className="text-xs font-semibold text-emerald-700">
                      Rango: $1M - $1,000M COP
                    </span>
                  </div>

                  <div className="relative rounded-lg shadow-xs">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                      <span className="text-slate-400 font-semibold text-sm">COP ($)</span>
                    </div>
                    <input
                      type="text"
                      id="monto-text-input"
                      value={montoInputString}
                      onChange={handleMontoTextChange}
                      onBlur={handleMontoBlur}
                      className="block w-full rounded-xl border border-slate-200 bg-white py-3 pl-20 pr-4 text-lg font-bold text-slate-900 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all"
                      placeholder="Ingrese el monto"
                    />
                  </div>

                  {/* Input Slider for Monto (Progress Bar styled) */}
                  <div className="pt-2">
                    <input
                      type="range"
                      id="monto-slider"
                      min={1000000}
                      max={1000000000}
                      step={500000}
                      value={monto}
                      onChange={(e) => setMonto(parseInt(e.target.value, 10))}
                      className="w-full h-2 rounded-lg appearance-none cursor-pointer focus:outline-none transition-all"
                      style={{
                        background: `linear-gradient(to right, #10b981 0%, #10b981 ${pctMonto}%, #cbd5e1 ${pctMonto}%, #cbd5e1 100%)`
                      }}
                    />
                    <div className="flex justify-between text-[10px] font-bold text-slate-400 mt-1.5 uppercase tracking-wide">
                      <span>Min: $1 Millón</span>
                      <span>Max: $1,000 Millones</span>
                    </div>
                  </div>

                  {/* Preset Quick Buttons */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    <span className="text-[10px] font-semibold text-slate-400 flex items-center mr-1">Rápidos:</span>
                    {[10000000, 50000000, 150000000, 500000000].map((preset) => (
                      <button
                        key={preset}
                        type="button"
                        id={`btn-preset-monto-${preset}`}
                        onClick={() => applyPresetMonto(preset)}
                        className={`text-[10px] font-bold px-2.5 py-1 rounded-md border transition-all ${
                          monto === preset
                            ? "bg-slate-900 text-white border-slate-900"
                            : "bg-white text-slate-600 border-slate-200 hover:border-slate-300"
                        }`}
                      >
                        {formatCOP(preset)}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 3. ¿A cuántos meses? */}
                <div className="space-y-3 p-4 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">
                      ¿A cuántos meses?
                    </label>
                    <span className="text-xs font-semibold text-emerald-700">
                      Plazo máximo: 30 años (360 meses)
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
                    <div className="sm:col-span-5 relative rounded-lg">
                      <input
                        type="number"
                        id="plazo-number-input"
                        min={1}
                        max={360}
                        value={plazoMeses}
                        onChange={(e) => {
                          const val = e.target.value ? parseInt(e.target.value, 10) : 1;
                          setPlazoMeses(val > 360 ? 360 : val < 1 ? 1 : val);
                        }}
                        className="block w-full rounded-xl border border-slate-200 bg-white py-3 px-4 font-bold text-slate-900 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all text-center"
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400">
                        Meses
                      </span>
                    </div>
                    <div className="sm:col-span-7 text-xs text-slate-500 bg-white border border-slate-200 px-4 py-3 rounded-xl flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-emerald-600 flex-shrink-0" />
                      <div>
                        Equivale a: <span className="font-bold text-slate-900">{(plazoMeses / 12).toFixed(1)} años</span>
                      </div>
                    </div>
                  </div>

                  {/* Input Slider for Plazo (Progress Bar styled) */}
                  <div className="pt-2">
                    <input
                      type="range"
                      id="plazo-slider"
                      min={1}
                      max={360}
                      value={plazoMeses}
                      onChange={(e) => setPlazoMeses(parseInt(e.target.value, 10))}
                      className="w-full h-2 rounded-lg appearance-none cursor-pointer focus:outline-none transition-all"
                      style={{
                        background: `linear-gradient(to right, #10b981 0%, #10b981 ${pctPlazo}%, #cbd5e1 ${pctPlazo}%, #cbd5e1 100%)`
                      }}
                    />
                    <div className="flex justify-between text-[10px] font-bold text-slate-400 mt-1.5 uppercase tracking-wide">
                      <span>1 Mes (Corto plazo)</span>
                      <span>360 Meses (30 Años)</span>
                    </div>
                  </div>

                  {/* Preset Quick Buttons for Years */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    <span className="text-[10px] font-semibold text-slate-400 flex items-center mr-1">Años:</span>
                    {[12, 36, 60, 120, 240, 360].map((preset) => (
                      <button
                        key={preset}
                        type="button"
                        id={`btn-preset-plazo-${preset}`}
                        onClick={() => applyPresetPlazo(preset)}
                        className={`text-[10px] font-bold px-2.5 py-1 rounded-md border transition-all ${
                          plazoMeses === preset
                            ? "bg-slate-900 text-white border-slate-900"
                            : "bg-white text-slate-600 border-slate-200 hover:border-slate-300"
                        }`}
                      >
                        {preset / 12} {preset / 12 === 1 ? "Año" : "Años"} ({preset}M)
                      </button>
                    ))}
                  </div>
                </div>

                {/* Simulate Button */}
                <button
                  type="submit"
                  id="btn-simular-submit"
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-emerald-200 transition-all active:scale-98 flex items-center justify-center gap-2 text-base cursor-pointer"
                >
                  <TrendingUp className="h-5 w-5" />
                  Simular Crédito
                </button>
              </form>
            </div>

            {/* Information Column */}
            <div className="lg:col-span-5 space-y-6" id="form-info-column">
              
              {/* Card - Why choose Banco Startup */}
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                <h3 className="font-display font-bold text-slate-900 text-base mb-3 flex items-center gap-2">
                  <ShieldCheck className="h-5 w-5 text-emerald-600" />
                  Garantías del Simulador
                </h3>
                <ul className="space-y-3.5 text-xs text-slate-600">
                  <li className="flex items-start gap-2.5">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 font-bold text-[10px] mt-0.5 flex-shrink-0">✓</span>
                    <span><strong>Tasa fija garantizada:</strong> No sufrirás variaciones imprevistas; tus cuotas mensuales permanecerán estables.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 font-bold text-[10px] mt-0.5 flex-shrink-0">✓</span>
                    <span><strong>Seguro de deudores incluido:</strong> Protege a tu familia y liquida el saldo en caso de fallecimiento o incapacidad total.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 font-bold text-[10px] mt-0.5 flex-shrink-0">✓</span>
                    <span><strong>Amortización Francesa:</strong> Abonas más capital a medida que pasan los meses, reduciendo los intereses generados.</span>
                  </li>
                </ul>
              </div>

              {/* Card - Financial Education */}
              <div className="bg-slate-900 rounded-2xl p-6 text-white shadow-md relative overflow-hidden">
                <div className="absolute right-0 bottom-0 opacity-10">
                  <PiggyBank className="h-32 w-32 -mr-6 -mb-6 text-emerald-400" />
                </div>
                <div className="relative z-10">
                  <h3 className="font-display font-bold text-slate-100 text-base mb-2 flex items-center gap-2">
                    <Info className="h-4 w-4 text-emerald-400" />
                    ¿Sabías qué?
                  </h3>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Al elegir un plazo menor, aunque la cuota mensual de tu crédito sea más alta, ahorrarás millones de pesos en los intereses totales pagados al final del préstamo. ¡Compara variando el plazo antes de decidir!
                  </p>
                  <div className="mt-4 pt-3 border-t border-slate-800 flex justify-between items-center text-[10px] text-slate-400">
                    <span>Banco Startup Educación Financiera</span>
                    <span className="text-emerald-400 font-semibold">Tasa actual: {currentCreditTypeData.nombre}</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* View 2: Credit Simulation Results Dashboard */}
        {view === "results" && simulation && (
          <div className="space-y-6 max-w-4xl mx-auto w-full" id="view-results-container">
            
            {/* Nav Back Button */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <button
                onClick={() => setView("form")}
                id="btn-back-to-form"
                className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 font-semibold text-sm transition-colors py-1.5 px-3 rounded-lg hover:bg-slate-100 cursor-pointer self-start"
              >
                <ArrowLeft className="h-4 w-4" />
                Ajustar parámetros del crédito
              </button>

              <div className="flex flex-wrap items-center gap-2.5 self-end sm:self-auto">
                <button
                  type="button"
                  onClick={() => downloadCreditCSV(simulation)}
                  id="btn-download-csv"
                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-1.5 px-4 rounded-xl transition-all text-xs inline-flex items-center gap-1.5 cursor-pointer shadow-md hover:shadow-emerald-600/10 active:scale-95"
                >
                  <FileSpreadsheet className="h-3.5 w-3.5 text-emerald-100" />
                  Exportar a Excel / CSV
                </button>
                <button
                  type="button"
                  onClick={() => downloadCreditPDF(simulation)}
                  id="btn-download-pdf"
                  className="bg-slate-900 hover:bg-slate-800 text-white font-bold py-1.5 px-4 rounded-xl transition-all text-xs inline-flex items-center gap-1.5 cursor-pointer shadow-md hover:shadow-slate-900/10 active:scale-95"
                >
                  <Download className="h-3.5 w-3.5 text-emerald-400" />
                  Descargar PDF
                </button>
                <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wider">
                  Simulación Completada
                </span>
              </div>
            </div>

            {/* Main Information Screen */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden" id="results-card">
              
              {/* Header section requested */}
              <div className="bg-slate-900 px-6 sm:px-8 py-6 text-white flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h2 className="font-display text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center gap-2" id="results-header-title">
                    <Coins className="h-6 w-6 text-emerald-400" />
                    Así será tu crédito
                  </h2>
                  <p className="text-slate-400 text-xs sm:text-sm mt-1">
                    Cálculo basado en una solicitud de {formatCOP(simulation.input.monto)} para {currentCreditTypeData.nombre}
                  </p>
                </div>
                <div className="bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 flex items-center gap-3">
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 block font-semibold uppercase tracking-wider">Plazo Solicitado</span>
                    <span className="text-sm font-extrabold text-emerald-400">{simulation.input.plazoMeses} Meses</span>
                  </div>
                  <div className="h-8 w-[1px] bg-slate-700"></div>
                  <div className="text-left">
                    <span className="text-[10px] text-slate-400 block font-semibold uppercase tracking-wider">Años</span>
                    <span className="text-sm font-bold text-slate-100">{(simulation.input.plazoMeses / 12).toFixed(1)}</span>
                  </div>
                </div>
              </div>

              {/* Bento Grid layout representing requested metrics */}
              <div className="p-6 sm:p-8 space-y-6">
                
                {/* 1. Primary Highlight Metric: Monthly installment */}
                <div className="bg-slate-50 border border-slate-200/60 rounded-2xl p-6 sm:p-8 relative overflow-hidden" id="metric-monthly-payment">
                  <div className="absolute right-4 top-4 opacity-5 bg-slate-900 rounded-full p-4 hidden sm:block">
                    <DollarSign className="h-10 w-10 text-slate-900" />
                  </div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">
                    Valor de la cuota mensual estimada
                  </p>
                  
                  <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-3">
                    <h3 className="text-3.5xl sm:text-4.5xl font-black text-slate-900 tracking-tight" id="text-cuota-mensual">
                      {formatCOP(simulation.cuotaMensualTotal)}
                    </h3>
                    <span className="text-slate-500 font-semibold text-sm sm:text-base">
                      / mes por {simulation.input.plazoMeses} meses
                    </span>
                  </div>

                  <div className="mt-4 pt-4 border-t border-slate-200/60 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-500">
                    <div>
                      <span className="font-semibold text-slate-700">Cuota Base (Capital + Interés):</span>{" "}
                      {formatCOP(simulation.cuotaBase)}
                    </div>
                    <div>
                      <span className="font-semibold text-slate-700">Seguro Obligatorio de Deudores:</span>{" "}
                      {formatCOP(simulation.valorSeguroMensual)} / mes
                    </div>
                  </div>
                </div>

                {/* Sub metrics grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  
                  {/* Metric: Tasa aplicada */}
                  <div className="bg-white p-5 rounded-2xl border border-slate-200 hover:shadow-xs transition-shadow flex flex-col justify-between" id="metric-applied-rate">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Tasa Aplicada</span>
                        <Percent className="h-4 w-4 text-emerald-600" />
                      </div>
                      <p className="text-2xl font-black text-slate-900 leading-none">
                        {(simulation.input.tipoCredito === "libre_inversion" ? 1.55 : simulation.input.tipoCredito === "vivienda" ? 0.92 : 1.18)}% <span className="text-xs font-semibold text-slate-500">M.V.</span>
                      </p>
                    </div>
                    <div className="mt-4 pt-2.5 border-t border-slate-100">
                      <span className="text-[10px] text-slate-500 block leading-tight">
                        Tasa Efectiva Anual:
                      </span>
                      <span className="text-xs font-bold text-slate-800">
                        {(simulation.tasaAnualEquivalente * 100).toFixed(2)}% E.A.
                      </span>
                    </div>
                  </div>

                  {/* Metric: Valor del seguro */}
                  <div className="bg-white p-5 rounded-2xl border border-slate-200 hover:shadow-xs transition-shadow flex flex-col justify-between" id="metric-monthly-insurance">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Valor del Seguro</span>
                        <ShieldCheck className="h-4 w-4 text-emerald-600" />
                      </div>
                      <p className="text-2xl font-black text-slate-900 leading-none">
                        {formatCOP(simulation.valorSeguroMensual)}
                      </p>
                    </div>
                    <div className="mt-4 pt-2.5 border-t border-slate-100">
                      <span className="text-[10px] text-slate-500 block leading-tight">
                        Seguro acumulado total:
                      </span>
                      <span className="text-xs font-bold text-slate-800">
                        {formatCOP(simulation.segurosTotales)}
                      </span>
                    </div>
                  </div>

                  {/* Metric: Monto solicitado */}
                  <div className="bg-white p-5 rounded-2xl border border-slate-200 hover:shadow-xs transition-shadow flex flex-col justify-between" id="metric-requested-monto">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Capital Solicitado</span>
                        <Coins className="h-4 w-4 text-emerald-600" />
                      </div>
                      <p className="text-2xl font-black text-slate-900 leading-none">
                        {formatCOP(simulation.input.monto)}
                      </p>
                    </div>
                    <div className="mt-4 pt-2.5 border-t border-slate-100">
                      <span className="text-[10px] text-slate-500 block leading-tight">
                        Intereses proyectados:
                      </span>
                      <span className="text-xs font-bold text-rose-600">
                        +{formatCOP(simulation.interesesTotales)}
                      </span>
                    </div>
                  </div>

                </div>

                {/* Final Total Cost Panel requested */}
                <div className="bg-emerald-950 text-white rounded-2xl p-6 relative overflow-hidden shadow-md" id="metric-total-payment">
                  <div className="absolute right-0 bottom-0 opacity-10 bg-[radial-gradient(circle_at_bottom_right,_var(--tw-gradient-stops))] from-white via-transparent to-transparent h-full w-full pointer-events-none"></div>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 relative z-10">
                    <div>
                      <span className="text-[10px] font-extrabold text-emerald-300 uppercase tracking-widest mb-1 block">
                        Monto total a pagar al final del crédito
                      </span>
                      <h4 className="text-3xl font-black text-white tracking-tight" id="text-total-pagar">
                        {formatCOP(simulation.montoTotalPagar)}
                      </h4>
                      <p className="text-emerald-300/80 text-[11px] mt-1">
                        Incluye intereses calculados + seguros colectivos obligatorios contratados.
                      </p>
                    </div>

                    {/* View Plan & Chart Triggers requested */}
                    <div className="flex flex-col sm:flex-row gap-3 self-start sm:self-center">
                      <button
                        type="button"
                        id="btn-ver-grafico-cuotas"
                        onClick={() => setIsChartModalOpen(true)}
                        className="bg-slate-800 hover:bg-slate-700 text-white font-bold py-3.5 px-6 rounded-xl transition-all shadow-md hover:shadow-slate-900/20 active:scale-95 text-sm inline-flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <TrendingUp className="h-4 w-4 text-emerald-400" />
                        Ver análisis gráfico
                      </button>

                      <button
                        type="button"
                        id="btn-ver-plan-cuotas"
                        onClick={() => setIsModalOpen(true)}
                        className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold py-3.5 px-6 rounded-xl transition-all shadow-md hover:shadow-emerald-500/20 active:scale-95 text-sm inline-flex items-center justify-center gap-2 cursor-pointer"
                      >
                        Ver plan de cuotas
                        <ChevronRight className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Summary Table Overview */}
                <div className="border border-slate-200/80 rounded-2xl p-4 bg-slate-50/50">
                  <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Desglose de Costos de Financiación</h4>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                    <div className="bg-white p-3 rounded-lg border border-slate-200">
                      <span className="text-slate-400 block text-[10px]">Monto del Préstamo</span>
                      <span className="font-bold text-slate-900">{formatCOP(simulation.input.monto)}</span>
                    </div>
                    <div className="bg-white p-3 rounded-lg border border-slate-200">
                      <span className="text-slate-400 block text-[10px]">Intereses Generados</span>
                      <span className="font-bold text-slate-900">{formatCOP(simulation.interesesTotales)}</span>
                    </div>
                    <div className="bg-white p-3 rounded-lg border border-slate-200">
                      <span className="text-slate-400 block text-[10px]">Costo de Seguros</span>
                      <span className="font-bold text-slate-900">{formatCOP(simulation.segurosTotales)}</span>
                    </div>
                    <div className="bg-white p-3 rounded-lg border border-slate-200">
                      <span className="text-slate-400 block text-[10px]">Carga Financiera Total</span>
                      <span className="font-bold text-emerald-700">
                        {((simulation.interesesTotales / simulation.input.monto) * 100).toFixed(1)}% del préstamo
                      </span>
                    </div>
                  </div>
                </div>

              </div>
            </div>

            {/* Educational disclaimer banner */}
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex gap-3 text-xs text-amber-900">
              <AlertCircle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-bold">Aviso legal simulador comercial:</span> Esta proyección es informativa y comercial. Las tasas y aprobaciones definitivas están sujetas al estudio de crédito de riesgo crediticio del solicitante, validación de ingresos y condiciones vigentes en la fecha de desembolso formal.
              </div>
            </div>

          </div>
        )}

      </main>

      {/* View 3: Installment Schedule Modal (Plan de cuotas) requested */}
      {/* View 3: Installment Schedule Modal (Plan de cuotas) requested */}
      <PlanCuotasModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        simulation={simulation}
        onOpenChart={() => setIsChartModalOpen(true)}
      />

      {/* View 4: Chart Modal (Evolución mensual interactiva) */}
      <ChartModal
        isOpen={isChartModalOpen}
        onClose={() => setIsChartModalOpen(false)}
        simulation={simulation}
        onOpenPlan={() => setIsModalOpen(true)}
      />


    </div>
  );
}
