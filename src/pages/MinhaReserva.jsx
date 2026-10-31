import { useEffect, useState } from 'react'
import { Hourglass, PlusCircle, Undo2, X } from 'lucide-react'
import { useApp, pad, LIMITE_EXTRA_MIN } from '../context/AppContext.jsx'
import { RecursoBadge, recursosDe } from '../components/RecursoBadge.jsx'
import { PageHeader } from './StudyHub.jsx'

const fmt = (ms) => {
  const s = Math.max(0, Math.floor(ms / 1000))
  return `${pad(Math.floor(s / 3600))}:${pad(Math.floor((s % 3600) / 60))}:${pad(s % 60)}`
}

/** TELA 4: Gerenciar Minha Reserva (conforme wireframe) */
export default function MinhaReserva() {
  const { reserva, salas, aumentarTempo, finalizarReserva, setPagina } = useApp()
  const [agora, setAgora] = useState(Date.now())
  const [opcoes, setOpcoes] = useState(false)

  useEffect(() => {
    const t = setInterval(() => setAgora(Date.now()), 1000)
    return () => clearInterval(t)
  }, [])

  const restante = reserva ? reserva.endsAt - agora : 0
  useEffect(() => {
    if (reserva && restante <= 0) finalizarReserva(true)
  }, [reserva, restante]) // eslint-disable-line react-hooks/exhaustive-deps

  if (!reserva) {
    return (
      <div className="mx-auto max-w-xl">
        <PageHeader titulo="Gerenciar Minha Reserva" onVoltar={() => setPagina('studyhub')} voltarLabel="Ver salas" />
        <p className="rounded-2xl border border-dashed border-slate-300 p-10 text-center text-slate-500 dark:border-slate-700">Você não possui nenhuma reserva ativa.</p>
      </div>
    )
  }

  const sala = salas.find((s) => s.id === reserva.salaId)
  const critico = restante < 5 * 60000
  const restanteExtra = LIMITE_EXTRA_MIN - (reserva.extraTotal || 0)
  const card = 'rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900'

  return (
    <div className="mx-auto max-w-xl">
      <PageHeader titulo="Gerenciar Minha Reserva" onVoltar={() => setPagina('studyhub')} voltarLabel="Ver salas" />

      <div className="space-y-5">
        <section className={card}>
          <h3 className="text-sm font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">Minha Reserva Ativa:</h3>
          <span className="mt-3 inline-flex items-center gap-2 rounded-full bg-emerald-100 px-3 py-1 text-xs font-extrabold tracking-wide text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300">
            <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" /> EM ANDAMENTO
          </span>
          <h4 className="mt-3 text-2xl font-extrabold">
            {sala.nome}{sala.descricao ? <span className="text-base font-semibold text-slate-500"> – {sala.descricao}</span> : null}
          </h4>
          <p className="text-sm text-slate-500 dark:text-slate-400">Permanência: {reserva.inicio} às {reserva.fim} · {sala.capacidade} alunos</p>
          <div className="mt-3 flex flex-wrap gap-2">{recursosDe(sala).map((r) => <RecursoBadge key={r} tipo={r} grande />)}</div>
        </section>

        <section className={`${card} text-center`}>
          <h3 className="flex items-center justify-center gap-2 text-sm font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400"><Hourglass size={14} /> Tempo Restante</h3>
          <p className={`mt-3 font-mono text-5xl font-extrabold tabular-nums sm:text-6xl ${critico ? 'text-red-500' : 'text-inatel dark:text-sky-400'}`}>
            {fmt(restante)}
          </p>
        </section>

        <div className="grid grid-cols-2 gap-3">
          <button onClick={() => finalizarReserva(false)} className="flex items-center justify-center gap-2 rounded-xl border border-red-300 bg-white px-3 py-4 text-sm font-bold text-red-600 hover:bg-red-50 dark:border-red-500/40 dark:bg-slate-900 dark:text-red-300 dark:hover:bg-red-500/10">
            <Undo2 size={16} className="shrink-0" /> Finalizar / Devolver Sala
          </button>
          <button onClick={() => setOpcoes((o) => !o)} aria-expanded={opcoes} className="flex items-center justify-center gap-2 rounded-xl bg-inatel px-3 py-4 text-sm font-bold text-white shadow-lg shadow-inatel/30 hover:bg-inatel-dark">
            <PlusCircle size={16} className="shrink-0" /> Aumentar Tempo de Reserva
          </button>
        </div>

        {opcoes && (
          <section className={card}>
            <div className="mb-3 flex items-center justify-between">
              <p className="text-sm font-bold">Quanto tempo deseja adicionar?</p>
              <button onClick={() => setOpcoes(false)} aria-label="Fechar"><X size={16} /></button>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {[5, 15, 30].map((m) => (
                <button
                  key={m}
                  disabled={m > restanteExtra}
                  onClick={() => { aumentarTempo(m); setOpcoes(false) }}
                  className="rounded-xl bg-inatel py-3 text-sm font-bold text-white hover:bg-inatel-dark disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400 dark:disabled:bg-slate-800"
                >
                  +{m} min
                </button>
              ))}
            </div>
            <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">
              Máximo de {LIMITE_EXTRA_MIN} minutos adicionais por reserva. Restante: <b>{restanteExtra} min</b>.
            </p>
          </section>
        )}
      </div>
    </div>
  )
}
