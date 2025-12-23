import { useProductos } from "../hooks/useProductos"; // <--- Importamos el cerebro
import ProductForm from "../components/products/ProductForm";
import ProductTable from "../components/products/ProductTable";

export default function InventarioView() {
  // Extraemos toda la lógica del hook
  const {
    productos,
    loading,
    formProd,
    setFormProd,
    editingId,
    filtroCategoria,
    setFiltroCategoria,
    handleProductSubmit,
    handleDeleteProduct,
    handleEditClick,
    cancelEdit,
  } = useProductos();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-fade-in">
      {/* SECCIÓN FORMULARIO */}
      <div className="lg:col-span-4">
        <ProductForm
          formData={formProd}
          setFormData={setFormProd}
          onSubmit={handleProductSubmit}
          loading={loading}
          editingId={editingId}
          onCancelEdit={cancelEdit}
          onDelete={handleDeleteProduct}
        />
      </div>

      {/* SECCIÓN TABLA */}
      <div className="lg:col-span-8">
        {/* Filtros */}
        <div className="flex gap-1 mb-2">
          {["Todos", "Perros", "Gatos", "Granja"].map((cat) => (
            <button
              key={cat}
              onClick={() => setFiltroCategoria(cat)}
              className={`px-4 py-1 rounded-full text-xs font-bold transition ${
                filtroCategoria === cat
                  ? "bg-emerald-600 text-white"
                  : "bg-white text-slate-500 hover:bg-slate-200"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Tabla */}
        <ProductTable
          productos={productos} // Ya vienen filtrados del hook
          onEdit={handleEditClick}
        />
      </div>
    </div>
  );
}
