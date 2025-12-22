import { supabase } from "../supabase/client";
import type { Movimiento } from "../types";

export const movimientosService = {
  // Obtener movimientos (y cruzar con nombres de clientes)
  async getAll() {
    // 1. Traemos los movimientos
    const { data: movs, error } = await supabase
      .from("movimientos")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(50);

    if (error) throw error;
    if (!movs) return [];

    // 2. Traemos nombres de clientes para mostrar en la tabla
    // (Optimizacion: Podriamos hacer esto con un join nativo de supabase, pero asi es facil de entender)
    const { data: cli } = await supabase.from("clientes").select("id, nombre");

    const movimientosConNombre = movs.map((m: any) => {
      const nombreCliente =
        cli?.find((c) => c.id === m.cliente_id)?.nombre || "-";
      return { ...m, cliente_nombre: nombreCliente };
    });

    return movimientosConNombre as Movimiento[];
  },

  // Crear un movimiento
  async create(movimiento: Omit<Movimiento, "id" | "created_at">) {
    const { error } = await supabase.from("movimientos").insert([movimiento]);
    if (error) throw error;
  },

  // Eliminar movimiento
  async delete(id: number) {
    const { error } = await supabase.from("movimientos").delete().eq("id", id);
    if (error) throw error;
  },
};
