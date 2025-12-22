import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { movimientosService } from "../services/movimientos";
import { clientesService } from "../services/clientes";
import { formatMoney } from "../utils/formatters";
// Si no moviste el type, defínelo aquí:
type TipoMovimiento = "Venta" | "Fiado" | "Gasto" | "Cobro";

const initialFormState = {
  descripcion: "",
  monto: "",
  tipo: "Venta" as TipoMovimiento,
  cliente_id: "",
};

export function useCaja() {
  const queryClient = useQueryClient();
  const [formMov, setFormMov] = useState(initialFormState);

  // 1. Cargar Movimientos
  const { data: movimientos = [], isLoading: loadingMovs } = useQuery({
    queryKey: ["movimientos"],
    queryFn: movimientosService.getAll,
  });

  // 2. Cargar Clientes (Reutiliza la caché de useClientes automáticamente!)
  const { data: clientes = [], isLoading: loadingCli } = useQuery({
    queryKey: ["clientes"],
    queryFn: clientesService.getAll,
  });

  // 3. Guardar Movimiento (Lógica compleja)
  const nuevaTransaccionMutation = useMutation({
    mutationFn: async (datos: any) => {
      const { monto, tipo, cliente_id, descripcion } = datos;

      // A. Crear movimiento
      await movimientosService.create({ descripcion, monto, tipo, cliente_id });

      // B. Actualizar deuda si aplica
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
      // Invalidamos AMBAS listas para que se refresquen
      queryClient.invalidateQueries({ queryKey: ["movimientos"] });
      queryClient.invalidateQueries({ queryKey: ["clientes"] });
      setFormMov(initialFormState);
    },
    onError: (err: any) => alert("Error: " + err.message),
  });

  const deleteMutation = useMutation({
    mutationFn: movimientosService.delete,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["movimientos"] }),
    onError: () => alert("Error al eliminar"),
  });

  const handleMovimientoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formMov.monto) return alert("Ingresa un monto");

    const monto = parseFloat(formMov.monto);
    const tipo = formMov.tipo;
    const clienteId = formMov.cliente_id ? parseInt(formMov.cliente_id) : null;

    if ((tipo === "Fiado" || tipo === "Cobro") && !clienteId) {
      return alert("Selecciona un cliente");
    }

    // Alerta Saldo a Favor
    if (tipo === "Cobro" && clienteId) {
      const cliente = clientes.find((c) => c.id === clienteId);
      if (cliente) {
        const deudaFutura = cliente.deuda - monto;
        if (deudaFutura < 0) {
          const confirmar = window.confirm(
            `⚠️ El cliente quedará con SALDO A FAVOR de ${formatMoney(
              Math.abs(deudaFutura)
            )}.\n¿Confirmar?`
          );
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

  const handleDelete = (id: number) => {
    if (confirm("¿Eliminar?")) deleteMutation.mutate(id);
  };

  // Cálculos
  const totalCaja = movimientos.reduce((acc, mov) => {
    if (mov.tipo === "Venta" || mov.tipo === "Cobro") return acc + mov.monto;
    if (mov.tipo === "Gasto") return acc - mov.monto;
    return acc;
  }, 0);

  const totalFiado = clientes.reduce(
    (acc, cli) => (cli.deuda > 0 ? acc + cli.deuda : acc),
    0
  );

  return {
    movimientos,
    clientes,
    formMov,
    setFormMov,
    loading:
      loadingMovs ||
      loadingCli ||
      nuevaTransaccionMutation.isPending ||
      deleteMutation.isPending,
    totalCaja,
    totalFiado,
    handleMovimientoSubmit,
    handleDelete,
  };
}
