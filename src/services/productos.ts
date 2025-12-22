import { supabase } from "../supabase/client";
import type { Producto } from "../types";

export const productosService = {
  // Obtener todos los productos
  async getAll() {
    const { data, error } = await supabase
      .from("productos")
      .select("*")
      .order("id", { ascending: false });

    if (error) throw error;
    return data as Producto[];
  },

  // Crear un producto nuevo
  async create(producto: Omit<Producto, "id" | "created_at">) {
    const { data, error } = await supabase.from("productos").insert([producto]);
    if (error) throw error;
    return data;
  },

  // Actualizar un producto existente
  async update(id: number, producto: Partial<Producto>) {
    const { data, error } = await supabase
      .from("productos")
      .update(producto)
      .eq("id", id);
    if (error) throw error;
    return data;
  },

  // Eliminar un producto
  async delete(id: number) {
    const { error } = await supabase.from("productos").delete().eq("id", id);
    if (error) throw error;
  },
};
