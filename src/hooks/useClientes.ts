import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { clientesService } from "../services/clientes";

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
    },
    onError: () => alert("Error al crear cliente"),
  });

  const handleCrearCliente = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formCliente.nombre) return alert("El nombre es obligatorio");

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
