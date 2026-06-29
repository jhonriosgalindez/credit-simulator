import React from "react";
import { X, TrendingUp, ChevronRight } from "lucide-react";
import { CreditSimulationResult } from "../types";
import { formatCOP } from "../utils/creditCalculator";

interface PlanCuotasModalProps {
  isOpen: boolean;
  onClose: () => void;
  simulation: CreditSimulationResult | null;
  onOpenChart: () => void;
}

export default function PlanCuotasModal({
  isOpen,
  onClose,
  simulation,
  onOpenChart,
}: PlanCuotasModalProps) {
  if (!isOpen || !simulation) return null;

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
      id="modal-plan-cuotas"
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
              <h3 className="font-display text-lg font-bold text-slate-900" id="modal-title">
                Plan de Amortización Mensual
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Proyección detallada para un crédito de <span className="font-bold text-slate-800">{formatCOP(simulation.input.monto)}</span> a {simulation.input.plazoMeses} meses
              </p>
            </div>
            
            {/* Close Button requested */}
            <button
              type="button"
              id="btn-close-modal-x"
              onClick={onClose}
              className="rounded-lg p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-200/50 transition-colors cursor-pointer"
              aria-label="Cerrar"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Summary Stats Inside Modal */}
          <div className="px-6 py-4 bg-emerald-50/50 border-b border-slate-100 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
            <div>
              <span className="text-slate-500 block">Número de cuotas:</span>
              <span className="font-bold text-slate-900 text-sm">{simulation.input.plazoMeses} Meses</span>
            </div>
            <div>
              <span className="text-slate-500 block">Valor cuota (promedio):</span>
              <span className="font-bold text-emerald-800 text-sm">{formatCOP(simulation.cuotaMensualTotal)}</span>
            </div>
            <div>
              <span className="text-slate-500 block">Tasa MV aplicada:</span>
              <span className="font-bold text-slate-900 text-sm">
                {(simulation.tasaMensual * 100).toFixed(2)}% MV
              </span>
            </div>
            <div>
              <span className="text-slate-500 block">Seguro de Vida mensual:</span>
              <span className="font-bold text-slate-900 text-sm">{formatCOP(simulation.valorSeguroMensual)}</span>
            </div>
          </div>

          {/* Link to Chart Modal Banner */}
          <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-emerald-100 rounded-lg text-emerald-700">
                <TrendingUp className="h-4 w-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-800">¿Prefieres ver el comportamiento en un gráfico interactivo?</h4>
                <p className="text-[11px] text-slate-500">Visualiza de forma clara la distribución mensual de capital, intereses y seguro.</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenChart();
              }}
              className="bg-slate-900 hover:bg-slate-800 text-white font-bold py-2 px-4 rounded-xl text-xs transition-all flex items-center gap-1.5 cursor-pointer self-start sm:self-center"
            >
              Ver Análisis Gráfico
              <ChevronRight className="h-3 w-3" />
            </button>
          </div>

          {/* Table Installment Schedule requested */}
          <div className="flex-1 overflow-y-auto px-6 pb-4 pt-0 min-h-[220px] max-h-[45vh] relative overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse min-w-[620px] sm:min-w-full">
              <thead className="sticky top-0 z-10 bg-white border-b border-slate-100">
                <tr className="text-slate-400 font-bold uppercase text-[10px] tracking-wider bg-white">
                  <th className="py-3 px-3 bg-white">Cuota N°</th>
                  <th className="py-3 px-3 bg-white">Abono Capital</th>
                  <th className="py-3 px-3 bg-white">Intereses</th>
                  <th className="py-3 px-3 bg-white">Seguro</th>
                  <th className="py-3 px-3 text-right bg-white">Valor de la Cuota</th>
                  <th className="py-3 px-3 text-right bg-white">Saldo Pendiente</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {simulation.planCuotas.map((row) => (
                  <tr key={row.numeroCuota} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-2 px-3 font-bold text-slate-900">
                      {row.numeroCuota}
                    </td>
                    <td className="py-2 px-3 text-slate-600">
                      {formatCOP(row.capital)}
                    </td>
                    <td className="py-2 px-3 text-rose-600 font-normal">
                      {formatCOP(row.interes)}
                    </td>
                    <td className="py-2 px-3 text-slate-500 font-normal">
                      {formatCOP(row.seguro)}
                    </td>
                    <td className="py-2 px-3 text-right font-bold text-emerald-800">
                      {formatCOP(row.cuotaTotal)}
                    </td>
                    <td className="py-2 px-3 text-right text-slate-500">
                      {formatCOP(row.saldoPendiente)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Modal Footer Controls */}
          <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex items-center justify-end sticky bottom-0 z-10">
            <div className="flex flex-wrap items-center justify-end gap-2.5 w-full sm:w-auto">
              {/* Secondary close button to return requested */}
              <button
                type="button"
                id="btn-close-modal-footer"
                onClick={onClose}
                className="bg-slate-900 hover:bg-slate-800 text-white font-bold py-2 px-5 rounded-xl transition-all text-xs cursor-pointer w-full sm:w-auto justify-center"
              >
                Regresar a la simulación
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
