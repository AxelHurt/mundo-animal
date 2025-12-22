import type { Cliente } from "../../types";
import type { TipoMovimiento } from "../../hooks/useCaja"; // O puedes redefinir el tipo aquí

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
    <div className="bg-white p-6 rounded-xl shadow border border-slate-200 sticky top-24">
      <h3 className="font-bold text-slate-700 mb-4 border-b pb-2">
        Registrar Movimiento
      </h3>
      <form onSubmit={onSubmit} className="space-y-4">
        {/* Tipos */}
        <div className="grid grid-cols-2 gap-2">
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
              className={`py-2 rounded text-sm font-bold border transition ${
                formMov.tipo === type
                  ? "bg-slate-800 text-white border-slate-800"
                  : "bg-white text-slate-500 border-slate-200"
              }`}
            >
              {type}
            </button>
          ))}
        </div>

        {/* Monto */}
        <div>
          <label className="text-xs font-bold text-slate-400">Monto ($)</label>
          <input
            type="number"
            step="0.01"
            autoFocus
            value={formMov.monto}
            onChange={(e) => setFormMov({ ...formMov, monto: e.target.value })}
            className="w-full text-2xl font-bold text-slate-800 border-b-2 border-slate-200 focus:border-emerald-500 outline-none p-1"
          />
        </div>

        {/* Descripción */}
        <input
          value={formMov.descripcion}
          onChange={(e) =>
            setFormMov({ ...formMov, descripcion: e.target.value })
          }
          className="w-full border p-2 rounded text-sm"
          placeholder="Descripción (Opcional)"
        />

        {/* Select Cliente */}
        {(formMov.tipo === "Fiado" || formMov.tipo === "Cobro") && (
          <div
            className={`p-3 rounded border ${
              formMov.tipo === "Cobro"
                ? "bg-blue-50 border-blue-200"
                : "bg-orange-50 border-orange-200"
            }`}
          >
            <label className="text-xs font-bold text-slate-600 mb-1 block">
              {formMov.tipo === "Cobro" ? "¿Quién paga?" : "¿Quién fía?"}
            </label>
            <select
              className="w-full p-2 border rounded bg-white font-bold text-slate-700"
              value={formMov.cliente_id}
              onChange={(e) =>
                setFormMov({ ...formMov, cliente_id: e.target.value })
              }
              required
            >
              <option value="">-- Seleccionar --</option>
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

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-3 rounded-lg text-white font-bold shadow-md transition
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
          {loading
            ? "Procesando..."
            : `CONFIRMAR ${formMov.tipo.toUpperCase()}`}
        </button>
      </form>
    </div>
  );
}
