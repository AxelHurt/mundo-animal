import { formatMoney } from "../../utils/formatters";

interface Props {
  totales: { ingresos: number; egresos: number; balance: number };
  filtroFecha: string;
  setFiltroFecha: (f: any) => void;
}

export default function DashboardCaja({
  totales,
  filtroFecha,
  setFiltroFecha,
}: Props) {
  return (
    // CAMBIO: p-3 (antes p-5) y mb-4 (antes mb-6)
    <div className="bg-white p-3 rounded-xl shadow border border-slate-200 mb-4">
      {/* 1. Header con Filtros (Más compacto) */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-2 gap-2">
        <h2 className="text-sm font-bold text-slate-700 flex items-center gap-2">
          📊 Rendimiento
          <span className="text-[10px] font-normal text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded-full hidden sm:inline-block">
            {filtroFecha === "hoy"
              ? "Hoy"
              : filtroFecha === "semana"
              ? "Esta semana"
              : filtroFecha === "mes"
              ? "Este mes"
              : "Histórico"}
          </span>
        </h2>

        <div className="flex bg-slate-100 p-0.5 rounded-md">
          {["hoy", "semana", "mes", "todos"].map((f) => (
            <button
              key={f}
              onClick={() => setFiltroFecha(f)}
              // CAMBIO: px-2 py-0.5 (botones más finos)
              className={`px-2 py-0.5 text-[10px] font-bold rounded transition-all uppercase ${
                filtroFecha === f
                  ? "bg-white text-emerald-700 shadow-sm"
                  : "text-slate-400 hover:text-slate-600"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* 2. Tarjetas de Métricas (Compactas) */}
      <div className="grid grid-cols-3 gap-2">
        {/* INGRESOS */}
        {/* CAMBIO: p-2 (antes p-4) */}
        <div className="p-2 rounded-lg bg-emerald-50 border border-emerald-100 flex flex-col justify-center">
          <p className="text-[10px] font-bold text-emerald-600 uppercase mb-0 leading-none">
            Ingresos
          </p>
          <div className="flex items-center justify-between mt-1">
            {/* CAMBIO: text-lg (antes text-2xl) */}
            <h3 className="text-lg font-bold text-emerald-800 leading-none">
              {formatMoney(totales.ingresos)}
            </h3>
            <span className="text-sm opacity-50">💰</span>
          </div>
        </div>

        {/* EGRESOS */}
        <div className="p-2 rounded-lg bg-red-50 border border-red-100 flex flex-col justify-center">
          <p className="text-[10px] font-bold text-red-600 uppercase mb-0 leading-none">
            Gastos
          </p>
          <div className="flex items-center justify-between mt-1">
            <h3 className="text-lg font-bold text-red-800 leading-none">
              {formatMoney(totales.egresos)}
            </h3>
            <span className="text-sm opacity-50">💸</span>
          </div>
        </div>

        {/* BALANCE */}
        <div
          className={`p-2 rounded-lg border flex flex-col justify-center ${
            totales.balance >= 0
              ? "bg-blue-50 border-blue-100"
              : "bg-orange-50 border-orange-100"
          }`}
        >
          <p
            className={`text-[10px] font-bold uppercase mb-0 leading-none ${
              totales.balance >= 0 ? "text-blue-600" : "text-orange-600"
            }`}
          >
            Balance
          </p>
          <div className="flex items-center justify-between mt-1">
            <h3
              className={`text-lg font-bold leading-none ${
                totales.balance >= 0 ? "text-blue-800" : "text-orange-800"
              }`}
            >
              {totales.balance > 0 ? "+" : ""}
              {formatMoney(totales.balance)}
            </h3>
            <span className="text-sm opacity-50">⚖️</span>
          </div>
        </div>
      </div>
    </div>
  );
}
