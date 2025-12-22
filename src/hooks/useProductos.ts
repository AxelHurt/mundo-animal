import { useState } from "react";
// Importamos los hooks de React Query
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { productosService } from "../services/productos";
import { parseNumber } from "../utils/formatters";
import type { Producto } from "../types";

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
  const queryClient = useQueryClient(); // Para invalidar caché
  const [formProd, setFormProd] = useState(initialProductState);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [filtroCategoria, setFiltroCategoria] = useState("Todos");

  // 1. LECTURA (Reemplaza al useEffect de carga)
  const { data: productos = [], isLoading: loading } = useQuery({
    queryKey: ["productos"], // La "etiqueta" de estos datos en caché
    queryFn: productosService.getAll,
  });

  // 2. MUTACIONES (Para Crear/Editar)
  const mutationGuardar = useMutation({
    mutationFn: async (datos: any) => {
      if (editingId) return productosService.update(editingId, datos);
      return productosService.create(datos);
    },
    onSuccess: () => {
      // Cuando termina, avisamos que la lista 'productos' es vieja y debe recargarse
      queryClient.invalidateQueries({ queryKey: ["productos"] });
      setFormProd(initialProductState);
      setEditingId(null);
    },
    onError: () => alert("Error al guardar producto"),
  });

  // 3. MUTACIÓN (Para Eliminar)
  const mutationEliminar = useMutation({
    mutationFn: productosService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["productos"] });
    },
    onError: () => alert("Error al eliminar"),
  });

  // --- HANDLERS (Ahora son más simples) ---
  const handleProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const prodData = {
      nombre: formProd.nombre,
      categoria: formProd.categoria,
      stock: parseNumber(formProd.stock),
      kg_bolsa: parseNumber(formProd.kg_bolsa),
      costo: parseNumber(formProd.costo),
      precio_publico: parseNumber(formProd.precio_publico),
      precio_x_kg: parseNumber(formProd.precio_x_kg),
    };
    mutationGuardar.mutate(prodData); // Ejecutamos la mutación
  };

  const handleDeleteProduct = (id: number) => {
    if (confirm("¿Borrar producto?")) {
      mutationEliminar.mutate(id);
    }
  };

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
  };

  const cancelEdit = () => {
    setEditingId(null);
    setFormProd(initialProductState);
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
