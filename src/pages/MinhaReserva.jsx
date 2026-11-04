import { useEffect, useState } from 'react'
import { Hourglass, PlusCircle, Undo2, X } from 'lucide-react'
import { useApp, LIMITE_EXTRA_MIN } from '../context/AppContext.jsx'
import { ListaRecursos } from '../components/RecursoBadge.jsx'
import { Badge, Button, Card, PageHeader, Vazio } from '../components/ui.jsx'
import { fmtTempo, useAgora } from '../utils.js'

/** Tela 4: gerenciar minha reserva */
export default function MinhaReserva() {
  const { reserva, salas, aumentarTempoReserva, devolverSala, setPagina } = useApp()
  const [opcoes, setOpcoes] = useState(false)
  const agora = useAgora()
  const restante = reserva ? reserva.endsAt - agora : 0
  const sala = reserva ? salas.find((s) => s.numero === reserva.salaNumero) : null

  useEffect(() => {
    if (reserva && restante <= 0) devolverSala(sala, true)
  }, [reserva, restante]) // eslint-disable-line react-hooks/exhaustive-deps

  const header = <PageHeader titulo="Gerenciar Minha Reserva" onVoltar={() => setPagina('studyhub')} voltarLabel="Ver salas" />
  if (!reserva || !sala) {
    return <div className="mx-auto max-w-xl">{header}<Vazio>Você não possui nenhuma reserva ativa.</Vazio></div>
  }

  const restanteExtra = LIMITE_EXTRA_MIN - reserva.extraTotal

  return (
    <div className="mx-auto max-w-xl">
      {header}
      <div className="space-y-5">
        <Card className="p-6 shadow-sm">
          <h3 className="text-sm font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">Minha Reserva Ativa:</h3>
          <Badge tom="green" className="mt-3 inline-flex items-center gap-2 px-3 py-1 text-xs font-extrabold tracking-wide">
            <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" /> EM ANDAMENTO
          </Badge>
          <h4 className="mt-3 text-2xl font-extrabold">
            Sala {sala.numero}{sala.descricao && <span className="text-base font-semibold text-slate-500"> – {sala.descricao}</span>}
          </h4>
          <p className="text-sm text-slate-500 dark:text-slate-400">Permanência: {sala.horarioEntrada} às {sala.horarioSaida} · {sala.capacidade} alunos</p>
          <div className="mt-3 flex flex-wrap gap-2"><ListaRecursos sala={sala} grande /></div>
        </Card>

        <Card className="p-6 text-center shadow-sm">
          <h3 className="flex items-center justify-center gap-2 text-sm font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400"><Hourglass size={14} /> Tempo Restante</h3>
          <p className={`mt-3 font-mono text-5xl font-extrabold tabular-nums sm:text-6xl ${restante < 5 * 60000 ? 'text-red-500' : 'text-inatel dark:text-sky-400'}`}>
            {fmtTempo(restante)}
          </p>
        </Card>

        <div className="grid grid-cols-2 gap-3">
          <Button variant="danger" onClick={() => devolverSala(sala, false)} className="flex items-center justify-center gap-2 bg-white px-3 py-4 dark:bg-slate-900">
            <Undo2 size={16} className="shrink-0" /> Finalizar / Devolver Sala
          </Button>
          <Button onClick={() => setOpcoes((o) => !o)} aria-expanded={opcoes} className="flex items-center justify-center gap-2 px-3 py-4 shadow-lg shadow-inatel/30">
            <PlusCircle size={16} className="shrink-0" /> Aumentar Tempo de Reserva
          </Button>
        </div>

        {opcoes && (
          <Card className="p-6 shadow-sm">
            <div className="mb-3 flex items-center justify-between">
              <p className="text-sm font-bold">Quanto tempo deseja adicionar?</p>
              <button onClick={() => setOpcoes(false)} aria-label="Fechar"><X size={16} /></button>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {[5, 15, 30].map((m) => (
                <Button
                  key={m}
                  disabled={m > restanteExtra}
                  onClick={() => { aumentarTempoReserva(sala, m); setOpcoes(false) }}
                  className="py-3 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400 dark:disabled:bg-slate-800"
                >
                  +{m} min
                </Button>
              ))}
            </div>
            <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">
              Máximo de {LIMITE_EXTRA_MIN} minutos adicionais por reserva. Restante: <b>{restanteExtra} min</b>.
            </p>
          </Card>
        )}
      </div>
    </div>
  )
}
