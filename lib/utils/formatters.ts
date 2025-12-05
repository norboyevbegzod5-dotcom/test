export const formatDimension = (value: number) => `${Math.round(value)} мм`;

export const formatArea = (value: number) => `${value.toFixed(2)} м²`;

export const formatCurrency = (value: number, currency = "₽") =>
  new Intl.NumberFormat("ru-RU", { style: "currency", currency: currency === "₽" ? "RUB" : currency }).format(
    value,
  );
