export const formatMoney = (amount: number | null) => {
  if (amount === null || amount === undefined) return "-";
  // Truco visual: Si es negativo (saldo a favor), le quitamos el signo menos para mostrarlo bonito en la UI si queremos
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    minimumFractionDigits: 2,
  }).format(amount);
};

export const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("es-AR", {
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const parseNumber = (value: string) =>
  value === "" ? null : parseFloat(value);
