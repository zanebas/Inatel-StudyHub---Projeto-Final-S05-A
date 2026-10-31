import { AirVent, Monitor, PenLine, Tv } from 'lucide-react'

export const ICONES = { arCondicionado: AirVent, tv: Tv, lousa: PenLine, computador: Monitor }
export const ROTULOS = { arCondicionado: 'Ar-Condicionado', tv: 'TV', lousa: 'Lousa', computador: 'Computador' }

export function RecursoBadge({ tipo, grande }) {
  const Icon = ICONES[tipo]
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full bg-slate-100 font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300 ${grande ? 'px-3 py-1.5 text-sm' : 'px-2 py-0.5 text-[11px]'}`}>
      <Icon size={grande ? 14 : 12} /> {ROTULOS[tipo]}
    </span>
  )
}

export const recursosDe = (sala) => Object.keys(ROTULOS).filter((k) => sala[k])

export function Voltar({ onClick, children }) {
  return (
    <button onClick={onClick} className="text-sm font-semibold text-inatel hover:underline dark:text-sky-400">
      {children}
    </button>
  )
}

