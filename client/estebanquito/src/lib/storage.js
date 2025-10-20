// Simula "backend" en localStorage.
// Esquema: users[], accounts[], transactions[], loans[]
const KEY = 'estebanquito_db_v1'

function load() {
  const raw = localStorage.getItem(KEY)
  if (raw) return JSON.parse(raw)
  // Seed inicial
  const seedUserId = 'u_demo'
  const db = {
    users: [
      { id: seedUserId, nombre: 'Usuario Demo', email: 'demo@estebanquito.co', password: '123456' }
    ],
    accounts: [
      { id: 'a1', userId: seedUserId, numero: '3001234567', tipo: 'ahorros', saldo: 1_500_000 },
      { id: 'a2', userId: seedUserId, numero: '3001234568', tipo: 'corriente', saldo: 500_000 }
    ],
    transactions: [
      { id: 't1', cuenta_id: 'a1', tipo: 'depósito', monto: 200_000, fecha: new Date().toISOString(), meta: {} },
    ],
    loans: []
  }
  localStorage.setItem(KEY, JSON.stringify(db))
  return db
}

function save(db) { localStorage.setItem(KEY, JSON.stringify(db)) }

export const dbGet = () => load()

export function registerUser({ nombre, email, password, numero='NA' }) {
  const db = load()
  if (db.users.some(u => u.email === email)) throw new Error('El email ya está registrado.')
  const id = crypto.randomUUID?.() || Math.random().toString(36).slice(2)
  db.users.push({ id, nombre, email, password })
  // Crear cuenta de ahorros por defecto
  db.accounts.push({ id: 'a_' + id, userId: id, numero, tipo: 'ahorros', saldo: 0 })
  save(db)
  return { id, nombre, email }
}

export function login({ email, password }) {
  const db = load()
  const user = db.users.find(u => u.email === email && u.password === password)
  if (!user) throw new Error('Credenciales inválidas.')
  return { id: user.id, nombre: user.nombre, email: user.email }
}

export function getUserAccounts(userId) {
  const db = load()
  return db.accounts.filter(a => a.userId === userId)
}

export function getAccount(id) {
  const db = load()
  return db.accounts.find(a => a.id === id)
}

export function addTransaction({ cuenta_id, tipo, monto, fecha, meta={} }) {
  const db = load()
  const acc = db.accounts.find(a => a.id === cuenta_id)
  if (!acc) throw new Error('Cuenta no encontrada.')

  // reglas de saldo
  if (tipo === 'depósito') acc.saldo += monto
  else if (tipo === 'retiro') {
    if (acc.saldo < monto) throw new Error('Saldo insuficiente.')
    acc.saldo -= monto
  } else if (tipo === 'transferencia') {
    const { destino_id } = meta
    if (!destino_id) throw new Error('Falta cuenta destino.')
    if (acc.saldo < monto) throw new Error('Saldo insuficiente.')
    const destino = db.accounts.find(a => a.id === destino_id)
    if (!destino) throw new Error('Cuenta destino no encontrada.')
    acc.saldo -= monto
    destino.saldo += monto
  }
  const id = crypto.randomUUID?.() || Math.random().toString(36).slice(2)
  db.transactions.push({ id, cuenta_id, tipo, monto, fecha, meta })
  save(db)
}

export function getTransactionsByUser(userId) {
  const db = load()
  const accIds = db.accounts.filter(a => a.userId === userId).map(a => a.id)
  return db.transactions
    .filter(t => accIds.includes(t.cuenta_id))
    .sort((a,b) => new Date(b.fecha) - new Date(a.fecha))
}

export function createLoan({ usuario_id, monto, plazo_meses }) {
  const db = load()
  const id = crypto.randomUUID?.() || Math.random().toString(36).slice(2)
  const loan = { id, usuario_id, monto, plazo: plazo_meses, estado: 'pendiente', fecha_solicitud: new Date().toISOString() }
  db.loans.push(loan)
  // Acredita a la primera cuenta del usuario
  const acc = db.accounts.find(a => a.userId === usuario_id)
  if (acc) {
    acc.saldo += monto
    db.transactions.push({
      id: 'loan_' + id,
      cuenta_id: acc.id, tipo: 'depósito', monto,
      fecha: new Date().toISOString(), meta: { origen: 'préstamo' }
    })
  }
  save(db)
  return loan
}

export function getLoans(usuario_id) {
  const db = load()
  return db.loans.filter(l => l.usuario_id === usuario_id)
}

export function getReports(usuario_id) {
  const tx = getTransactionsByUser(usuario_id)
  const ingresos = tx
    .filter(t => t.tipo === 'depósito' || (t.tipo === 'transferencia' && t.meta?.destino_es_mio))
    .reduce((s, t) => s + Number(t.monto || 0), 0)
  const egresos = tx
    .filter(t => t.tipo === 'retiro' || (t.tipo === 'transferencia' && !t.meta?.destino_es_mio))
    .reduce((s, t) => s + Number(t.monto || 0), 0)
  const deudas = getLoans(usuario_id)
    .filter(l => l.estado !== 'rechazado')
    .reduce((s, l) => s + Number(l.monto || 0), 0)
  return { ingresos, egresos, deudas }
}
