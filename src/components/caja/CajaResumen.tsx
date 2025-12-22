import { formatMoney } from "../../utils/formatters";

export default function CajaResumen({
  caja,
  fiado,
}: {
  caja: number;
  fiado: number;
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-2">
      <div className="bg-white p-4 rounded-xl shadow border-l-4 border-emerald-500">
        <p className="text-xs font-bold text-emerald-500 uppercase">
          Caja (Efectivo)
        </p>
        <p className="text-2xl font-bold text-slate-800">{formatMoney(caja)}</p>
      </div>
      <div className="bg-white p-4 rounded-xl shadow border-l-4 border-orange-400">
        <p className="text-xs font-bold text-orange-400 uppercase">
          Total Fiado
        </p>
        <p className="text-2xl font-bold text-slate-800">
          {formatMoney(fiado)}
        </p>
      </div>
    </div>
  );
}
