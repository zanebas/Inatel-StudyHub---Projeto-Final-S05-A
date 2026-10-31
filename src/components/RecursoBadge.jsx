import { AirVent, Monitor, PenLine, Tv } from 'lucide-react'
import { RECURSOS } from '../data/mockData.js'

export const ICONES = { arCondicionado: AirVent, tv: Tv, lousa: PenLine, computador: Monitor }
const ROTULOS = Object.fromEntries(RECURSOS.map((r) => [r.key, r.label]))

export function RecursoBadge({ tipo, grande }) {
  const Icon = ICONES[tipo]
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full bg-slate-100 font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300 ${grande ? 'px-3 py-1.5 text-sm' : 'px-2 py-0.5 text-[11px]'}`}>
      <Icon size={grande ? 14 : 12} /> {ROTULOS[tipo]}
    </span>
  )
}

export const recursosDe = (sala) => RECURSOS.map((r) => r.key).filter((k) => sala[k])

export const ListaRecursos = ({ sala, grande }) =>
  recursosDe(sala).map((r) => <RecursoBadge key={r} tipo={r} grande={grande} />)
