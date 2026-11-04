import { AirVent, Monitor, PenLine, Tv } from 'lucide-react'
import { RECURSOS } from '../data/mockData.js'

export const ICONES = { arCondicionado: AirVent, tv: Tv, lousa: PenLine, computador: Monitor }
const ROTULOS = Object.fromEntries(RECURSOS.map((r) => [r.key, r.label]))

export function RecursoBadge({ tipo, grande }) {
  const Icon = ICONES[tipo]
  return (
    <span className={`recurso-badge ${grande ? 'recurso-badge--lg' : 'recurso-badge--sm'}`}>
      <Icon size={grande ? 14 : 12} /> {ROTULOS[tipo]}
    </span>
  )
}

export const recursosDe = (sala) => RECURSOS.map((r) => r.key).filter((k) => sala[k])

export const ListaRecursos = ({ sala, grande }) =>
  recursosDe(sala).map((r) => <RecursoBadge key={r} tipo={r} grande={grande} />)
