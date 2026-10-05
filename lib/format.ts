const usd = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 2,
});

/** Formats integer cents as a USD string. Prices are stored as cents everywhere. */
export function formatPrice(cents: number): string {
  return usd.format(cents / 100);
}