/** Keep the decorative domain palette; use its contrast-safe companion for text. */
export function domainInk(color) {
  return /^var\(--(self|inter|comm|well)\)$/.test(color)
    ? color.replace(")", "-ink)")
    : "var(--brand)";
}
