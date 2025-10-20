export const fmtCOP = (n) =>
  new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(n)

export const nowISO = () => new Date().toISOString()

export const uid = () => Math.random().toString(36).slice(2) + Date.now().toString(36)
