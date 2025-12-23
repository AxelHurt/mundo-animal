import type { Cliente } from "../../types";
import type { TipoMovimiento } from "../../hooks/useCaja";

interface Props {
  formMov: any;
  setFormMov: (data: any) => void;
  onSubmit: (e: React.FormEvent) => void;
  loading: boolean;
  clientes: Cliente[];
}

export default function MovimientoForm({
  formMov,
  setFormMov,
  onSubmit,
  loading,
  clientes,
}: Props) {
  return (
    <div className="bg-white p-5 rounded-lg shadow border border-slate-200 sticky top-24">
      <h3 className="font-bold text-slate-700 mb-4 pb-2 border-b">
        Registrar Movimiento
      </h3>

      <form onSubmit={onSubmit} className="space-y-4">
        {/* 1. TIPOS DE MOVIMIENTO (Botones simples) */}
        <div className="grid grid-cols-4 gap-2">
          {["Venta", "Fiado", "Gasto", "Cobro"].map((type) => (
            <button
              key={type}
              type="button"
              onClick={() =>
                setFormMov({
                  ...formMov,
                  tipo: type as TipoMovimiento,
                  cliente_id: "",
                })
              }
              className={`py-2 rounded text-xs font-bold border transition-colors ${
                formMov.tipo === type
                  ? "bg-slate-800 text-white border-slate-800"
                  : "bg-white text-slate-500 border-slate-200 hover:bg-slate-50"
              }`}
            >
              {type}
            </button>
          ))}
        </div>

        {/* 2. MONTO (Simple y Claro) */}
        <div>
          <label className="text-xs font-bold text-slate-800 mb-1 block">
            Monto
          </label>
          <div className="flex items-center border rounded-md p-2 bg-white focus-within:border-emerald-500 focus-within:ring-2 ring-emerald-100 transition-all">
            <span className="text-slate-400 text-lg font-bold mr-2">$</span>
            <input
              type="number"
              step="0.01"
              placeholder="0.00"
              value={formMov.monto}
              onChange={(e) =>
                setFormMov({ ...formMov, monto: e.target.value })
              }
              className="w-full text-lg font-bold text-slate-800 outline-none placeholder-slate-300"
            />
          </div>
        </div>

        {/* 3. DESCRIPCIÓN (Discreta y pequeña) */}
        <input
          type="text"
          value={formMov.descripcion}
          onChange={(e) =>
            setFormMov({ ...formMov, descripcion: e.target.value })
          }
          className="w-full border p-2 rounded border-slate-300  text-sm bg-slate-50 text-slate-700 focus:bg-white focus:border-emerald-500 outline-none"
          placeholder="Escribe una descripción (Opcional)..."
        />

        {/* 4. SELECTOR DE CLIENTE (Solo si es necesario) */}
        {(formMov.tipo === "Fiado" || formMov.tipo === "Cobro") && (
          <div
            className={`p-2 rounded border ${
              formMov.tipo === "Cobro"
                ? "bg-blue-50 border-blue-200"
                : "bg-orange-50 border-orange-200"
            }`}
          >
            <label className="text-xs font-bold text-slate-500 block mb-1">
              {formMov.tipo === "Cobro"
                ? "Cliente que Paga:"
                : "Cliente a Fiar:"}
            </label>
            <select
              className="w-full p-2 border rounded bg-white font-bold text-slate-700"
              value={formMov.cliente_id}
              onChange={(e) =>
                setFormMov({ ...formMov, cliente_id: e.target.value })
              }
              required
            >
              <option value="">-- Buscar Cliente --</option>
              {clientes.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.nombre} •{" "}
                  {c.deuda > 0
                    ? `Debe $${c.deuda}`
                    : c.deuda < 0
                    ? `Favor $${Math.abs(c.deuda)}`
                    : "Al día"}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* 5. BOTÓN CONFIRMAR (Grande y claro) */}
        <button
          type="submit"
          disabled={loading}
          className={`w-full py-3 rounded-lg text-white font-bold shadow transition-transform active:scale-95
             ${
               formMov.tipo === "Gasto"
                 ? "bg-red-500 hover:bg-red-600"
                 : formMov.tipo === "Fiado"
                 ? "bg-orange-500 hover:bg-orange-600"
                 : formMov.tipo === "Cobro"
                 ? "bg-blue-600 hover:bg-blue-700"
                 : "bg-emerald-600 hover:bg-emerald-700"
             }`}
        >
          {loading ? "Guardando..." : "CONFIRMAR"}
        </button>
      </form>
    </div>
  );
}
