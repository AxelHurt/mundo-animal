import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);

// Función reutilizable para preguntar "¿Estás seguro?"
export const confirmarAccion = async ({
  titulo = "¿Estás seguro?",
  texto = "No podrás revertir esta acción",
  confirmText = "Sí, eliminar",
  cancelText = "Cancelar",
  color = "#d33", // Rojo por defecto para peligros
}: {
  titulo?: string;
  texto?: string;
  confirmText?: string;
  cancelText?: string;
  color?: string;
}) => {
  const result = await MySwal.fire({
    title: titulo,
    text: texto,
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: color,
    cancelButtonColor: "#94a3b8", // Slate 400
    confirmButtonText: confirmText,
    cancelButtonText: cancelText,
    reverseButtons: true, // Pone el cancelar a la izquierda (mejor UX)
    customClass: {
      popup: "rounded-xl", // Bordes redondeados
    },
  });

  return result.isConfirmed;
};
