// --- TIPOS DE DATOS ---
export interface Producto {
  id: number;
  nombre: string;
  categoria: string | null;
  stock: number | null;
  kg_bolsa: number | null;
  costo: number | null;
  precio_publico: number | null;
  precio_x_kg: number | null;
}

export interface Cliente {
  id: number;
  nombre: string;
  telefono: string | null;
  descripcion: string | null; // Nueva columna
  deuda: number; // Positivo = DEBE, Negativo = SALDO A FAVOR
}

export interface Movimiento {
  id: number;
  created_at: string;
  descripcion: string | null;
  monto: number;
  tipo: "Venta" | "Fiado" | "Gasto" | "Cobro";
  cliente_id: number | null;
  cliente_nombre?: string;
}
