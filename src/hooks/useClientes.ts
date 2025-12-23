import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { clientesService } from "../services/clientes";
import toast from "react-hot-toast"; // <--- 1. Importamos la librería

const initialFormState = { nombre: "", telefono: "", descripcion: "" };

export function useClientes() {
  const queryClient = useQueryClient();
  const [formCliente, setFormCliente] = useState(initialFormState);

  // 1. Fetch con Caché
  const { data: clientes = [], isLoading: loadingClientes } = useQuery({
    queryKey: ["clientes"],
    queryFn: clientesService.getAll,
  });

  // 2. Crear Cliente
  const crearMutation = useMutation({
    mutationFn: clientesService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clientes"] });
      setFormCliente(initialFormState);
      // ✅ 2. Mensaje de Éxito bonito
      toast.success("¡Cliente registrado correctamente!", {
        icon: "👤", // Icono opcional para darle estilo
      });
    },
    onError: () => {
      // ❌ 3. Mensaje de Error
      toast.error("Error al guardar el cliente. Intenta nuevamente.");
    },
  });

  const handleCrearCliente = (e: React.FormEvent) => {
    e.preventDefault();

    // ⚠️ 4. Validación con Toast en lugar de Alert
    if (!formCliente.nombre) return toast.error("El nombre es obligatorio");

    crearMutation.mutate({
      nombre: formCliente.nombre,
      telefono: formCliente.telefono,
      descripcion: formCliente.descripcion,
    });
  };

  return {
    clientes,
    loading: loadingClientes || crearMutation.isPending,
    formCliente,
    setFormCliente,
    handleCrearCliente,
  };
}
