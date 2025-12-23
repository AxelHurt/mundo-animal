import type { Producto } from "../../types";
import { formatMoney } from "../../utils/formatters";

interface Props {
  productos: Producto[];
  onEdit: (prod: Producto) => void;
  // Eliminamos onDelete de aquí porque lo moverás al Formulario
}

export default function ProductTable({ productos, onEdit }: Props) {
  const getCategoryBadge = (cat: string | null) => {
    switch (cat) {
      case "Perros":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "Gatos":
        return "bg-orange-100 text-orange-700 border-orange-200";
      case "Granja":
        return "bg-amber-100 text-amber-700 border-amber-200";
      default:
        return "bg-slate-100 text-slate-600 border-slate-200";
    }
  };

  const getStockStatus = (stock: number | null) => {
    if (stock === null)
      return { color: "bg-slate-100 text-slate-400", label: "-" };
    if (stock === 0)
      return { color: "bg-red-100 text-red-700 font-bold", label: "0" };
    if (stock < 5)
      return {
        color: "bg-red-50 text-red-600 font-bold",
        label: stock?.toString(),
      };
    return {
      color: "bg-emerald-50 text-emerald-600",
      label: stock?.toString(),
    };
  };

  if (productos.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow p-8 text-center border border-slate-200">
        <div className="text-4xl mb-2">📦</div>
        <h3 className="text-lg font-bold text-slate-700">No hay productos</h3>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow border border-slate-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-slate-50 text-slate-500 uppercase text-xs font-bold tracking-wider border-b">
            <tr>
              {/* Encabezados ordenados según tu pedido */}
              <th className="px-4 py-3">Producto</th>
              <th className="px-4 py-3 text-right">Peso</th>
              <th className="px-4 py-3 text-center opacity-60">Stock</th>
              <th className="px-4 py-3 text-right opacity-60">Costo</th>
              <th className="px-4 py-3 text-right">P. Venta</th>
              <th className="px-4 py-3 text-center">Editar</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {productos.map((prod) => {
              const stockInfo = getStockStatus(prod.stock);

              return (
                <tr
                  key={prod.id}
                  className="hover:bg-slate-50 transition-colors duration-150 group"
                >
                  {/* 1. PRODUCTO */}
                  <td className="px-4 py-3">
                    <div className="font-bold text-slate-800">
                      {prod.nombre}
                    </div>
                    <span
                      className={`text-[10px] font-bold px-1.5 py-0.5 rounded border mt-1 inline-block ${getCategoryBadge(
                        prod.categoria
                      )}`}
                    >
                      {prod.categoria || "Gral."}
                    </span>
                  </td>

                  {/* 2. PESO (kg) */}
                  <td className="px-4 py-3 text-right">
                    {prod.kg_bolsa ? (
                      <span className="font-medium text-slate-600">
                        {prod.kg_bolsa} kg
                      </span>
                    ) : (
                      <span className="text-slate-300">-</span>
                    )}
                  </td>

                  {/* 3. STOCK (Menos importante visualmente) */}
                  <td className="px-4 py-3 text-center">
                    <span
                      className={`text-xs px-2 py-0.5 rounded ${stockInfo.color}`}
                    >
                      {stockInfo.label}
                    </span>
                  </td>

                  {/* 4. COSTO (Menos importante visualmente) */}
                  <td className="px-4 py-3 text-right">
                    <span className="text-slate-400 text-xs tabular-nums">
                      {prod.costo ? formatMoney(prod.costo) : "-"}
                    </span>
                  </td>

                  {/* 5. PRECIO VENTA (Destacado) */}
                  <td className="px-4 py-3 text-right">
                    <span className="text-emerald-700 font-bold tabular-nums">
                      {formatMoney(prod.precio_publico)}
                    </span>
                  </td>

                  {/* 6. ACCIÓN (Solo Editar) */}
                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={() => onEdit(prod)}
                      className="text-blue-400 hover:text-blue-600 hover:bg-blue-50 p-2 rounded-full transition-all"
                      title="Modificar"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                        />
                      </svg>
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
