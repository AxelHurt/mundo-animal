import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { productosService } from "../services/productos";
import { parseNumber } from "../utils/formatters";
import type { Producto } from "../types";
import toast from "react-hot-toast"; // <--- IMPORTAR TOAST
import { confirmarAccion } from "../utils/alerts"; // <--- IMPORTAR SWEETALERT

const initialProductState = {
  nombre: "",
  categoria: "Perros",
  stock: "",
  kg_bolsa: "",
  costo: "",
  precio_publico: "",
  precio_x_kg: "",
};

export function useProductos() {
  const queryClient = useQueryClient();
  const [formProd, setFormProd] = useState(initialProductState);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [filtroCategoria, setFiltroCategoria] = useState("Todos");

  const { data: productos = [], isLoading: loading } = useQuery({
    queryKey: ["productos"],
    queryFn: productosService.getAll,
  });

  const mutationGuardar = useMutation({
    mutationFn: async (datos: any) => {
      if (editingId) return productosService.update(editingId, datos);
      return productosService.create(datos);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["productos"] });
      setFormProd(initialProductState);
      setEditingId(null);
      // MENSAJE DE ÉXITO 🚀
      toast.success(
        editingId
          ? "Producto actualizado correctamente"
          : "Producto creado con éxito!"
      );
    },
    onError: () => {
      // MENSAJE DE ERROR ❌
      toast.error("Ocurrió un error al guardar");
    },
  });

  const mutationEliminar = useMutation({
    mutationFn: productosService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["productos"] });
      // MENSAJE DE ÉXITO 🗑️
      toast.success("Producto eliminado", { icon: "🗑️" });
    },
    onError: () => toast.error("No se pudo eliminar"),
  });

  const handleProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Validación simple con Toast
    if (!formProd.nombre) return toast.error("El nombre es obligatorio");
    if (!formProd.precio_publico)
      return toast.error("El precio es obligatorio");

    const prodData = {
      nombre: formProd.nombre,
      categoria: formProd.categoria,
      stock: parseNumber(formProd.stock),
      kg_bolsa: parseNumber(formProd.kg_bolsa),
      costo: parseNumber(formProd.costo),
      precio_publico: parseNumber(formProd.precio_publico),
      precio_x_kg: parseNumber(formProd.precio_x_kg),
    };
    mutationGuardar.mutate(prodData);
  };

  const handleDeleteProduct = async (id: number) => {
    // CONFIRMACIÓN VISUAL ⚠️
    const confirmado = await confirmarAccion({
      titulo: "¿Eliminar producto?",
      texto: "Esto borrará el producto del inventario permanentemente.",
      confirmText: "Sí, borrar",
    });

    if (confirmado) {
      mutationEliminar.mutate(id);
    }
  };

  // ... resto de funciones (handleEditClick, cancelEdit, etc) ...
  const handleEditClick = (prod: Producto) => {
    setEditingId(prod.id);
    setFormProd({
      nombre: prod.nombre,
      categoria: prod.categoria || "Perros",
      stock: prod.stock?.toString() || "",
      kg_bolsa: prod.kg_bolsa?.toString() || "",
      costo: prod.costo?.toString() || "",
      precio_publico: prod.precio_publico?.toString() || "",
      precio_x_kg: prod.precio_x_kg?.toString() || "",
    });
    // Toast informativo opcional
    toast("Modo edición activado", { icon: "✏️" });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setFormProd(initialProductState);
    toast("Edición cancelada", { icon: "↩️" });
  };

  const productosFiltrados = productos.filter((p) =>
    filtroCategoria === "Todos" ? true : p.categoria === filtroCategoria
  );

  return {
    productos: productosFiltrados,
    loading: loading || mutationGuardar.isPending || mutationEliminar.isPending,
    formProd,
    setFormProd,
    editingId,
    filtroCategoria,
    setFiltroCategoria,
    handleProductSubmit,
    handleDeleteProduct,
    handleEditClick,
    cancelEdit,
  };
}
