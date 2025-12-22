import { formatMoney, formatDate } from "../../utils/formatters";
import type { Movimiento } from "../../types";

interface Props {
  movimientos: Movimiento[];
  onDelete: (id: number) => void;
}

export default function MovimientoTable({ movimientos, onDelete }: Props) {
  return (
    <div className="bg-white rounded-xl shadow border border-slate-200 overflow-hidden">
      <table className="w-full text-sm text-left">
        <thead className="bg-slate-50 border-b">
          <tr>
            <th className="px-4 py-3">Fecha</th>
            <th className="px-4 py-3">Movimiento</th>
            <th className="px-4 py-3 text-right">Monto</th>
            <th className="px-4 py-3 text-center">x</th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {movimientos.map((mov) => (
            <tr key={mov.id}>
              <td className="px-4 py-3 text-xs text-slate-500">
                {formatDate(mov.created_at)}
              </td>
              <td className="px-4 py-3">
                <span
                  className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded mr-2
                  ${
                    mov.tipo === "Venta"
                      ? "bg-emerald-100 text-emerald-700"
                      : mov.tipo === "Gasto"
                      ? "bg-red-100 text-red-700"
                      : mov.tipo === "Cobro"
                      ? "bg-blue-100 text-blue-700"
                      : "bg-orange-100 text-orange-700"
                  }`}
                >
                  {mov.tipo}
                </span>
                <span className="font-medium">{mov.descripcion}</span>
                {mov.cliente_nombre !== "-" && (
                  <div className="text-xs text-slate-500 mt-1 ml-1">
                    👤 {mov.cliente_nombre}
                  </div>
                )}
              </td>
              <td
                className={`px-4 py-3 text-right font-bold ${
                  mov.tipo === "Gasto" ? "text-red-500" : "text-emerald-700"
                }`}
              >
                {mov.tipo === "Gasto" ? "-" : ""} {formatMoney(mov.monto)}
              </td>
              <td className="px-4 py-3 text-center">
                <button
                  onClick={() => onDelete(mov.id)}
                  className="text-slate-300 hover:text-red-500"
                >
                  ✕
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
