import React from "react";
import { Calculator } from "lucide-react";

export default function Header() {
  return (
    <header className="border-b border-slate-100 bg-white/80 backdrop-blur-md sticky top-0 z-30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-md shadow-emerald-200">
              <Calculator className="h-5.5 w-5.5" />
            </div>
            <div>
              <span className="font-display text-lg font-bold tracking-tight text-slate-900">
                Banco Startup
              </span>
              <span className="text-xs font-semibold text-emerald-600 block leading-none">
                Simulador Digital
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
