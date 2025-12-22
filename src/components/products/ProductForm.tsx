// src/components/products/ProductForm.tsx
import React from "react";

// Definimos qué necesita este componente para funcionar
interface Props {
  formData: any;
  setFormData: (data: any) => void;
  onSubmit: (e: React.FormEvent) => void;
  loading: boolean;
  editingId: number | null;
  onCancelEdit: () => void;
}

export default function ProductForm({
  formData,
  setFormData,
  onSubmit,
  loading,
  editingId,
  onCancelEdit,
}: Props) {
  // Helper local para actualizar el estado del form limpiamente
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="bg-white p-5 rounded-xl shadow border border-slate-200 sticky top-24">
      <h2 className="text-lg font-bold mb-4 text-emerald-800 border-b pb-2">
        {editingId ? "Editar Producto" : "Nuevo Producto"}
      </h2>
      <form onSubmit={onSubmit} className="space-y-3">
        <input
          name="nombre"
          placeholder="Nombre Producto"
          value={formData.nombre}
          onChange={handleChange}
          className="w-full border p-2 rounded focus:ring-2 ring-emerald-500 outline-none"
        />
        <div className="grid grid-cols-2 gap-2">
          <select
            name="categoria"
            value={formData.categoria}
            onChange={handleChange}
            className="border p-2 rounded bg-white"
          >
            <option value="Perros">Perros</option>
            <option value="Gatos">Gatos</option>
            <option value="Granja">Granja</option>
          </select>
          <input
            name="stock"
            type="number"
            placeholder="Stock"
            value={formData.stock}
            onChange={handleChange}
            className="border p-2 rounded"
          />
        </div>

        {/* Precios Compactos */}
        <div className="grid grid-cols-2 gap-2 bg-slate-50 p-2 rounded border">
          <input
            name="costo"
            type="number"
            step="0.01"
            placeholder="Costo $"
            value={formData.costo}
            onChange={handleChange}
            className="border border-red-200 p-1 rounded text-sm"
          />
          <input
            name="precio_publico"
            type="number"
            step="0.01"
            placeholder="P. Público $"
            value={formData.precio_publico}
            onChange={handleChange}
            className="border border-emerald-300 font-bold text-emerald-800 p-1 rounded text-sm"
          />
          <input
            name="precio_x_kg"
            type="number"
            step="0.01"
            placeholder="Precio KG"
            value={formData.precio_x_kg}
            onChange={handleChange}
            className="border border-emerald-300 p-1 rounded text-sm"
          />
          <input
            name="kg_bolsa"
            type="number"
            step="0.01"
            placeholder="Kg Bolsa"
            value={formData.kg_bolsa}
            onChange={handleChange}
            className="border p-1 rounded text-sm"
          />
        </div>

        <div className="flex gap-2">
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-600 text-white py-2 rounded hover:bg-emerald-700 font-bold"
          >
            {editingId ? "Actualizar" : "Guardar"}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={onCancelEdit}
              className="bg-slate-200 px-3 rounded text-slate-600"
            >
              X
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
