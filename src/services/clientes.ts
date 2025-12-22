import { supabase } from "../supabase/client";
import type { Cliente } from "../types";

export const clientesService = {
  // 1. OBTENER TODOS
  // Trae la lista ordenada por deuda descendente (los que más deben aparecen primero)
  async getAll() {
    const { data, error } = await supabase
      .from("clientes")
      .select("*")
      .order("deuda", { ascending: false });

    if (error) throw error;
    return data as Cliente[];
  },

  // 2. CREAR CLIENTE
  // Recibe los datos básicos. Forzamos la deuda inicial en 0.
  async create(cliente: Omit<Cliente, "id" | "deuda">) {
    const { data, error } = await supabase
      .from("clientes")
      .insert([{ ...cliente, deuda: 0 }])
      .select();

    if (error) throw error;
    return data[0];
  },

  // 3. ACTUALIZAR DEUDA (Crítico para la Caja)
  // Esta función es llamada desde 'CajaView' cuando hay un Fiado o Cobro
  async updateDeuda(id: number, nuevaDeuda: number) {
    const { error } = await supabase
      .from("clientes")
      .update({ deuda: nuevaDeuda })
      .eq("id", id);

    if (error) throw error;
  },

  // 4. ACTUALIZAR DATOS DEL CLIENTE (Opcional)
  // Por si quieres editar nombre/teléfono en el futuro
  async update(id: number, datos: Partial<Cliente>) {
    const { error } = await supabase
      .from("clientes")
      .update(datos)
      .eq("id", id);

    if (error) throw error;
  },

  // 5. ELIMINAR CLIENTE (Opcional)
  async delete(id: number) {
    const { error } = await supabase.from("clientes").delete().eq("id", id);

    if (error) throw error;
  },
};
