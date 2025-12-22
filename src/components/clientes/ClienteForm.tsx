interface Props {
  formCliente: { nombre: string; telefono: string; descripcion: string };
  setFormCliente: (data: any) => void;
  onSubmit: (e: React.FormEvent) => void;
  loading: boolean;
}

export default function ClienteForm({
  formCliente,
  setFormCliente,
  onSubmit,
  loading,
}: Props) {
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormCliente({ ...formCliente, [e.target.name]: e.target.value });
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow h-fit sticky top-24">
      <h2 className="text-lg font-bold mb-4 text-emerald-800 border-b pb-2">
        Nuevo Cliente
      </h2>
      <form onSubmit={onSubmit} className="space-y-3">
        <div>
          <label className="text-xs font-bold text-slate-500">Nombre *</label>
          <input
            name="nombre"
            value={formCliente.nombre}
            onChange={handleChange}
            placeholder="Ej: Juan Pérez"
            className="w-full border p-2 rounded focus:ring-2 ring-emerald-500 outline-none"
          />
        </div>
        <div>
          <label className="text-xs font-bold text-slate-500">Teléfono</label>
          <input
            name="telefono"
            value={formCliente.telefono}
            onChange={handleChange}
            placeholder="Ej: 3482..."
            className="w-full border p-2 rounded focus:ring-2 ring-emerald-500 outline-none"
          />
        </div>
        <div>
          <label className="text-xs font-bold text-slate-500">
            Nota / Descripción
          </label>
          <textarea
            name="descripcion"
            value={formCliente.descripcion}
            onChange={handleChange}
            placeholder="Ej: Vive a la vuelta..."
            className="w-full border p-2 rounded focus:ring-2 ring-emerald-500 outline-none h-20 resize-none"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-emerald-600 text-white py-2 rounded font-bold hover:bg-emerald-700"
        >
          {loading ? "Guardando..." : "Crear Cliente"}
        </button>
      </form>
    </div>
  );
}
