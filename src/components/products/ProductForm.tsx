import React from "react";

interface Props {
  formData: any;
  setFormData: (data: any) => void;
  onSubmit: (e: React.FormEvent) => void;
  loading: boolean;
  editingId: number | null;
  onCancelEdit: () => void;
  onDelete: (id: number) => void;
}

export default function ProductForm({
  formData,
  setFormData,
  onSubmit,
  loading,
  editingId,
  onCancelEdit,
  onDelete,
}: Props) {
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleDeleteClick = () => {
    if (editingId) {
      onDelete(editingId);
    }
  };

  return (
    // AJUSTE 1: p-5 (antes p-6) y top-4 para subirlo un poco
    <div className="bg-white p-5 rounded-xl shadow-lg border border-slate-200 sticky top-4">
      {/* HEADER: mb-4 (antes mb-6) */}
      <div className="flex justify-between items-center mb-4 border-b pb-3">
        <h2 className="text-xl font-bold text-slate-800">
          {editingId ? "✏️ Editar Producto" : "✨ Nuevo Producto"}
        </h2>
        {editingId && (
          <span className="text-xs bg-amber-100 text-amber-700 px-2 py-1 rounded-full font-bold">
            ID: {editingId}
          </span>
        )}
      </div>

      {/* AJUSTE 2: space-y-4 (antes space-y-6) - Esto ahorra mucho espacio */}
      <form onSubmit={onSubmit} className="space-y-4">
        {/* --- SECCIÓN 1: DATOS BÁSICOS --- */}
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-bold text-slate-500 mb-1 uppercase tracking-wide">
              Nombre
            </label>
            {/* AJUSTE 3: p-2.5 (antes p-3) */}
            <input
              name="nombre"
              placeholder="Ej: Alimento Pedigree"
              value={formData.nombre}
              onChange={handleChange}
              className="w-full border border-slate-300 p-2.5 rounded-lg focus:ring-2 ring-emerald-500 outline-none font-medium text-slate-700"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1">
                Categoría
              </label>
              <select
                name="categoria"
                value={formData.categoria}
                onChange={handleChange}
                className="w-full border border-slate-300 p-2.5 rounded-lg bg-white focus:ring-2 ring-emerald-500 outline-none"
              >
                <option value="Perros">🐶 Perros</option>
                <option value="Gatos">🐱 Gatos</option>
                <option value="Granja">🐮 Granja</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1">
                Stock
              </label>
              <input
                name="stock"
                type="number"
                placeholder="0"
                value={formData.stock}
                onChange={handleChange}
                className="w-full border border-slate-300 p-2.5 rounded-lg focus:ring-2 ring-emerald-500 outline-none"
              />
            </div>
          </div>
        </div>

        {/* --- SECCIÓN 2: ECONOMÍA --- */}
        {/* AJUSTE 4: p-3 (antes p-4) y space-y-3 */}
        <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-3">
          <p className="text-xs font-bold text-slate-400 uppercase border-b border-slate-200 pb-1">
            Detalles Económicos
          </p>

          <div className="grid grid-cols-2 gap-4">
            {/* Costo */}
            <div>
              <label className="block text-xs font-bold text-red-400 mb-1">
                Costo
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2 text-red-300 font-bold">
                  $
                </span>
                <input
                  name="costo"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={formData.costo}
                  onChange={handleChange}
                  className="w-full border border-red-100 bg-white p-2 pl-6 rounded-lg text-red-600 font-medium focus:ring-2 ring-red-200 outline-none"
                />
              </div>
            </div>

            {/* Precio Venta */}
            <div>
              <label className="block text-xs font-bold text-emerald-600 mb-1">
                P. Venta
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2 text-emerald-500 font-bold">
                  $
                </span>
                <input
                  name="precio_publico"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={formData.precio_publico}
                  onChange={handleChange}
                  className="w-full border-2 border-emerald-400 bg-emerald-50/30 p-2 pl-6 rounded-lg text-emerald-800 font-bold focus:ring-4 ring-emerald-100 outline-none shadow-sm"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-1">
            <div>
              <label className="block text-xs font-bold text-slate-400 mb-1">
                Peso
              </label>
              <div className="relative">
                <input
                  name="kg_bolsa"
                  type="number"
                  step="0.01"
                  placeholder="0"
                  value={formData.kg_bolsa}
                  onChange={handleChange}
                  className="w-full border border-slate-200 p-2 rounded-lg text-sm focus:border-emerald-500 outline-none"
                />
                <span className="absolute right-3 top-2 text-slate-400 text-xs font-bold">
                  KG
                </span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 mb-1">
                Precio x Kg
              </label>
              <div className="relative">
                <span className="absolute left-2 top-2 text-slate-400 text-xs">
                  $
                </span>
                <input
                  name="precio_x_kg"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={formData.precio_x_kg}
                  onChange={handleChange}
                  className="w-full border border-slate-200 p-2 pl-5 rounded-lg text-sm focus:border-emerald-500 outline-none"
                />
              </div>
            </div>
          </div>
        </div>

        {/* --- BOTONES DE ACCIÓN --- */}
        {/* AJUSTE 5: pt-2 (antes pt-4) */}
        <div className="pt-2 space-y-2">
          <button
            type="submit"
            disabled={loading}
            // AJUSTE 6: py-2.5 (antes py-3)
            className={`w-full py-2.5 rounded-lg text-white font-bold shadow-md transition-all active:scale-95
              ${
                editingId
                  ? "bg-blue-600 hover:bg-blue-700"
                  : "bg-emerald-600 hover:bg-emerald-700"
              }`}
          >
            {loading
              ? "Procesando..."
              : editingId
              ? "Actualizar Producto"
              : "Guardar Producto"}
          </button>

          {editingId && (
            <div className="flex gap-3">
              <button
                type="button"
                onClick={handleDeleteClick}
                className="flex-1 py-2 rounded-lg bg-red-50 text-red-600 font-bold hover:bg-red-100 border border-red-200 transition-colors flex items-center justify-center gap-2"
              >
                <span>🗑️</span> Eliminar
              </button>
              <button
                type="button"
                onClick={onCancelEdit}
                className="flex-1 py-2 rounded-lg bg-slate-100 text-slate-600 font-bold hover:bg-slate-200 border border-slate-200 transition-colors"
              >
                Cancelar
              </button>
            </div>
          )}
        </div>
      </form>
    </div>
  );
}
