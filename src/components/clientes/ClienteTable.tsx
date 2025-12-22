import type { Cliente } from "../../types";
import { formatMoney } from "../../utils/formatters";

interface Props {
  clientes: Cliente[];
}

export default function ClienteTable({ clientes }: Props) {
  return (
    <div className="bg-white rounded-xl shadow overflow-hidden">
      <div className="p-4 bg-slate-50 border-b font-bold text-slate-600">
        Directorio de Clientes
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-slate-100 uppercase text-xs font-bold text-slate-500">
            <tr>
              <th className="px-4 py-3">Cliente</th>
              <th className="px-4 py-3">Contacto</th>
              <th className="px-4 py-3 text-right">Estado de Cuenta</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {clientes.map((c) => (
              <tr key={c.id} className="hover:bg-slate-50">
                <td className="px-4 py-3">
                  <div className="font-bold text-slate-800">{c.nombre}</div>
                  {c.descripcion && (
                    <div className="text-xs text-slate-500 italic">
                      {c.descripcion}
                    </div>
                  )}
                </td>
                <td className="px-4 py-3 text-slate-600">
                  {c.telefono ? (
                    `📞 ${c.telefono}`
                  ) : (
                    <span className="text-slate-300">-</span>
                  )}
                </td>
                <td className="px-4 py-3 text-right">
                  {c.deuda > 0 ? (
                    <span className="inline-block px-3 py-1 bg-red-100 text-red-700 rounded-full font-bold text-xs">
                      Debe {formatMoney(c.deuda)}
                    </span>
                  ) : c.deuda < 0 ? (
                    <span className="inline-block px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full font-bold text-xs">
                      A favor {formatMoney(Math.abs(c.deuda))}
                    </span>
                  ) : (
                    <span className="inline-block px-3 py-1 bg-slate-100 text-slate-500 rounded-full font-bold text-xs">
                      Al día
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
