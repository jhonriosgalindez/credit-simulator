import React from "react";
import { X, Info, ArrowLeft } from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from "recharts";
import { CreditSimulationResult } from "../types";
import { formatCOP } from "../utils/creditCalculator";

// Custom chart tooltip for formatting COP currency values elegantly inside the chart component
const CustomChartTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-900 text-white p-3 rounded-xl border border-slate-800 text-xs shadow-xl space-y-1">
        <p className="font-bold text-slate-300 border-b border-slate-800 pb-1 mb-1">{label}</p>
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex items-center gap-4 justify-between">
            <span className="flex items-center gap-1.5 font-medium">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }}></span>
              {entry.name}:
            </span>
            <span className="font-extrabold text-slate-100">{formatCOP(entry.value)}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

interface ChartModalProps {
  isOpen: boolean;
  onClose: () => void;
  simulation: CreditSimulationResult | null;
  onOpenPlan: () => void;
}

export default function ChartModal({
  isOpen,
  onClose,
  simulation,
  onOpenPlan,
}: ChartModalProps) {
  if (!isOpen || !simulation) return null;

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto"
      aria-labelledby="modal-chart-title"
      role="dialog"
      aria-modal="true"
      id="modal-analisis-grafico"
    >
      {/* Backdrop layer */}
      <div className="flex min-h-screen items-center justify-center p-4 text-center sm:p-0">
        <div
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
          onClick={onClose}
        ></div>

        {/* Modal Content Wrapper */}
        <div className="relative transform overflow-hidden rounded-2xl bg-white text-left shadow-2xl transition-all sm:my-4 sm:w-full sm:max-w-3xl border border-slate-100 flex flex-col max-h-[94vh]">
          
          {/* Modal Header */}
          <div className="px-6 py-5 border-b border-slate-100 bg-slate-50 flex items-center justify-between sticky top-0 z-10">
            <div>
              <h3 className="font-display text-lg font-bold text-slate-900" id="modal-chart-title">
                Análisis de Evolución Mensual (Amortización)
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Comportamiento del abono a capital versus cobro de intereses a lo largo de las {simulation.input.plazoMeses} cuotas
              </p>
            </div>
            
            {/* Close Button */}
            <button
              type="button"
              id="btn-close-chart-modal-x"
              onClick={onClose}
              className="rounded-lg p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-200/50 transition-colors cursor-pointer"
              aria-label="Cerrar"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Informative text & stats card inside modal */}
          <div className="px-6 py-4 bg-slate-50/50 border-b border-slate-100">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white p-3 rounded-xl border border-slate-200">
                <span className="text-slate-400 block text-[10px] font-bold uppercase tracking-wider">Monto Solicitado</span>
                <span className="font-bold text-slate-900 text-xs sm:text-sm">{formatCOP(simulation.input.monto)}</span>
              </div>
              <div className="bg-white p-3 rounded-xl border border-slate-200">
                <span className="text-slate-400 block text-[10px] font-bold uppercase tracking-wider">Intereses Totales</span>
                <span className="font-bold text-rose-600 text-xs sm:text-sm">+{formatCOP(simulation.interesesTotales)}</span>
              </div>
              <div className="bg-white p-3 rounded-xl border border-slate-200">
                <span className="text-slate-400 block text-[10px] font-bold uppercase tracking-wider">Cuota Mensual Promedio</span>
                <span className="font-bold text-emerald-800 text-xs sm:text-sm">{formatCOP(simulation.cuotaMensualTotal)}</span>
              </div>
            </div>
          </div>

          {/* Stacked Bar Chart Visualization with full height */}
          <div className="p-6 flex-1 overflow-y-auto">
            <div className="bg-white rounded-xl border border-slate-100 p-4 shadow-xs">
              <div className="h-64 sm:h-80 w-full text-xs">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={simulation.planCuotas.map(row => ({
                      name: `Cuota ${row.numeroCuota}`,
                      Capital: row.capital,
                      "Interés": row.interes,
                      "Seguro": row.seguro
                    }))}
                    margin={{ top: 15, right: 15, left: 5, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                    <XAxis 
                      dataKey="name" 
                      stroke="#94a3b8" 
                      fontSize={10} 
                      tickLine={false} 
                      interval="preserveStartEnd"
                      minTickGap={25}
                    />
                    <YAxis 
                      stroke="#94a3b8" 
                      fontSize={10} 
                      tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
                      tickLine={false}
                      axisLine={false}
                    />
                    <Tooltip content={<CustomChartTooltip />} />
                    <Legend iconSize={10} iconType="circle" wrapperStyle={{ fontSize: '11px', paddingTop: '12px' }} />
                    <Bar dataKey="Capital" stackId="a" fill="#10b981" name="Abono Capital" />
                    <Bar dataKey="Interés" stackId="a" fill="#f43f5e" name="Intereses" />
                    <Bar dataKey="Seguro" stackId="a" fill="#64748b" radius={[4, 4, 0, 0]} name="Seguro" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="mt-4 bg-emerald-50/50 border border-emerald-100 rounded-xl p-4 text-xs text-emerald-900 space-y-1.5">
              <p className="font-bold flex items-center gap-1.5 text-emerald-800">
                <Info className="h-4 w-4" />
                ¿Qué muestra este gráfico?
              </p>
              <p className="text-slate-600 leading-relaxed">
                Al inicio del crédito (primeras cuotas), el abono a capital es menor porque la mayoría de la cuota se destina a pagar los intereses sobre el saldo pendiente. A medida que avanza el tiempo, el saldo de deuda disminuye y con él los intereses, permitiendo que un porcentaje mayor de tu cuota se destine a amortizar el capital. El seguro se mantiene fijo durante todo el plazo.
              </p>
            </div>
          </div>

          {/* Modal Footer Controls */}
          <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex flex-col sm:flex-row items-center justify-between gap-3 sticky bottom-0 z-10">
            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenPlan();
              }}
              className="w-full sm:w-auto bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-bold py-2.5 px-4 rounded-xl text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <ArrowLeft className="h-4 w-4" />
              Ver Tabla de Amortización
            </button>
            
            <button
              type="button"
              id="btn-close-chart-modal-footer"
              onClick={onClose}
              className="w-full sm:w-auto bg-slate-900 hover:bg-slate-800 text-white font-bold py-2.5 px-5 rounded-xl transition-all text-xs cursor-pointer text-center"
            >
              Entendido, cerrar
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
