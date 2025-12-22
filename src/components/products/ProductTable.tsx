// src/components/products/ProductTable.tsx
import type { Producto } from "../../types";
import { formatMoney } from "../../utils/formatters";

interface Props {
  productos: Producto[];
  onEdit: (prod: Producto) => void;
  onDelete: (id: number) => void;
}

export default function ProductTable({ productos, onEdit, onDelete }: Props) {
  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <table className="w-full text-sm text-left">
        <thead className="bg-slate-100 text-slate-500 uppercase text-xs">
          <tr>
            <th className="px-4 py-3">Producto</th>
            <th className="px-4 py-3 text-center">Stock</th>
            <th className="px-4 py-3 text-right">Precio</th>
            <th className="px-4 py-3 text-center">Acción</th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {productos.map((prod) => (
            <tr key={prod.id} className="hover:bg-slate-50">
              <td className="px-4 py-2">
                <div className="font-bold text-slate-700">{prod.nombre}</div>
                <div className="text-xs text-slate-400">
                  {prod.categoria} • {prod.kg_bolsa ? prod.kg_bolsa + "kg" : ""}
                </div>
              </td>
              <td className="px-4 py-2 text-center">
                <span
                  className={`px-2 py-1 rounded font-bold text-xs ${
                    prod.stock && prod.stock < 5
                      ? "bg-red-100 text-red-600"
                      : "bg-slate-100 text-slate-600"
                  }`}
                >
                  {prod.stock ?? "-"}
                </span>
              </td>
              <td className="px-4 py-2 text-right font-bold text-emerald-700">
                {formatMoney(prod.precio_publico)}
              </td>
              <td className="px-4 py-2 text-center">
                <button
                  onClick={() => onEdit(prod)}
                  className="text-blue-600 mr-2 hover:scale-110 transition"
                >
                  ✏️
                </button>
                <button
                  onClick={() => onDelete(prod.id)}
                  className="text-red-600 hover:scale-110 transition"
                >
                  🗑️
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
