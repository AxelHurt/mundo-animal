import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { movimientosService } from "../services/movimientos";
import { clientesService } from "../services/clientes";
import { formatMoney } from "../utils/formatters";
import toast from "react-hot-toast";
import { confirmarAccion } from "../utils/alerts";

export type TipoMovimiento = "Venta" | "Fiado" | "Gasto" | "Cobro";
export type FiltroFecha = "hoy" | "semana" | "mes" | "todos"; // <--- Nuevo Tipo

const initialFormState = {
  descripcion: "",
  monto: "",
  tipo: "Venta" as TipoMovimiento,
  cliente_id: "",
};

export function useCaja() {
  const queryClient = useQueryClient();

  // Estado del Formulario
  const [formMov, setFormMov] = useState(initialFormState);

  // Estado del Filtro de Fecha (Nuevo) 📅
  const [filtroFecha, setFiltroFecha] = useState<FiltroFecha>("hoy");

  // 1. Cargar Movimientos
  const { data: movimientos = [], isLoading: loadingMovs } = useQuery({
    queryKey: ["movimientos"],
    queryFn: movimientosService.getAll,
  });

  // 2. Cargar Clientes
  const { data: clientes = [], isLoading: loadingCli } = useQuery({
    queryKey: ["clientes"],
    queryFn: clientesService.getAll,
  });

  // --- LÓGICA DE FILTRADO (DASHBOARD) ---
  const esFechaValida = (fechaIso: string) => {
    if (filtroFecha === "todos") return true;

    const fecha = new Date(fechaIso);
    const hoy = new Date();

    // Normalizamos a las 00:00:00 para comparar solo días, no horas
    const fechaDia = new Date(fecha.setHours(0, 0, 0, 0));
    const hoyDia = new Date(hoy.setHours(0, 0, 0, 0));

    if (filtroFecha === "hoy") {
      return fechaDia.getTime() === hoyDia.getTime();
    }

    if (filtroFecha === "semana") {
      // Obtenemos el lunes de esta semana
      const diaSemana = hoy.getDay(); // 0 es domingo
      const diff = hoy.getDate() - diaSemana + (diaSemana === 0 ? -6 : 1); // ajustar si lunes es 1
      const lunes = new Date(hoy.setDate(diff));
      lunes.setHours(0, 0, 0, 0);
      return fechaDia >= lunes;
    }

    if (filtroFecha === "mes") {
      // Mismo mes y mismo año
      return (
        new Date(fechaIso).getMonth() === new Date().getMonth() &&
        new Date(fechaIso).getFullYear() === new Date().getFullYear()
      );
    }

    return true;
  };

  // Aplicamos el filtro a la lista
  const movimientosFiltrados = movimientos.filter((m) =>
    esFechaValida(m.created_at)
  );

  // --- CÁLCULOS DEL DASHBOARD (Sobre los filtrados) ---
  const ingresos = movimientosFiltrados
    .filter((m) => m.tipo === "Venta" || m.tipo === "Cobro")
    .reduce((acc, m) => acc + m.monto, 0);

  const egresos = movimientosFiltrados
    .filter((m) => m.tipo === "Gasto")
    .reduce((acc, m) => acc + m.monto, 0);

  const balance = ingresos - egresos;

  // Calculamos el total fiado histórico (siempre es el total, no depende de la fecha)
  const totalFiado = clientes.reduce(
    (acc, cli) => (cli.deuda > 0 ? acc + cli.deuda : acc),
    0
  );

  // --- MUTACIONES (Igual que antes) ---
  const nuevaTransaccionMutation = useMutation({
    mutationFn: async (datos: any) => {
      const { monto, tipo, cliente_id, descripcion } = datos;
      await movimientosService.create({ descripcion, monto, tipo, cliente_id });
      if (cliente_id && (tipo === "Fiado" || tipo === "Cobro")) {
        const cliente = clientes.find((c) => c.id === cliente_id);
        if (cliente) {
          let nuevaDeuda = cliente.deuda;
          if (tipo === "Fiado") nuevaDeuda += monto;
          if (tipo === "Cobro") nuevaDeuda -= monto;
          await clientesService.updateDeuda(cliente_id, nuevaDeuda);
        }
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["movimientos"] });
      queryClient.invalidateQueries({ queryKey: ["clientes"] });
      setFormMov(initialFormState);
      toast.success("Movimiento registrado correctamente");
    },
    onError: (err: any) => {
      console.error(err);
      toast.error("Error al guardar: " + err.message);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: movimientosService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["movimientos"] });
      toast.success("Movimiento eliminado", { icon: "🗑️" });
    },
    onError: () => toast.error("No se pudo eliminar el movimiento"),
  });

  // --- HANDLERS ---
  const handleMovimientoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formMov.monto) return toast.error("Ingresa un monto válido");

    const monto = parseFloat(formMov.monto);
    const tipo = formMov.tipo;
    const clienteId = formMov.cliente_id ? parseInt(formMov.cliente_id) : null;

    if ((tipo === "Fiado" || tipo === "Cobro") && !clienteId) {
      return toast.error("Debes seleccionar un cliente");
    }

    if (tipo === "Cobro" && clienteId) {
      const cliente = clientes.find((c) => c.id === clienteId);
      if (cliente) {
        const deudaFutura = cliente.deuda - monto;
        if (deudaFutura < 0) {
          const confirmar = await confirmarAccion({
            titulo: "⚠️ Saldo a Favor",
            texto: `El cliente quedará con un saldo a favor de ${formatMoney(
              Math.abs(deudaFutura)
            )}. ¿Confirmar?`,
            confirmText: "Sí, registrar",
            color: "#059669",
          });
          if (!confirmar) return;
        }
      }
    }

    nuevaTransaccionMutation.mutate({
      ...formMov,
      monto,
      cliente_id: clienteId,
    });
  };

  const handleDelete = async (id: number) => {
    const confirmado = await confirmarAccion({
      titulo: "¿Borrar movimiento?",
      texto: "Esto afectará el total de la caja y no se puede deshacer.",
      confirmText: "Sí, borrar",
    });

    if (confirmado) deleteMutation.mutate(id);
  };

  // --- RETORNO FINAL ---
  return {
    movimientos: movimientosFiltrados, // ⚠️ Ahora devolvemos la lista filtrada a la tabla
    clientes,
    formMov,
    setFormMov,
    loading:
      loadingMovs ||
      loadingCli ||
      nuevaTransaccionMutation.isPending ||
      deleteMutation.isPending,
    // Nuevas propiedades para el Dashboard:
    totales: { ingresos, egresos, balance },
    totalFiado,
    filtroFecha,
    setFiltroFecha,
    handleMovimientoSubmit,
    handleDelete,
  };
}
