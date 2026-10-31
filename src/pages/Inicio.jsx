import { ArrowRight, BarChart3, BookMarked, CalendarClock, ClipboardCheck, Clock, DoorOpen, Hourglass } from 'lucide-react'
import { useApp } from '../context/AppContext.jsx'
import { AVISOS } from '../data/mockData.js'
import { fmtHora, fmtTempo, media, previaHorarios, useAgora } from '../utils.js'
import { Badge, Card } from '../components/ui.jsx'

const acoes = () => [
  { id: 'horarios', icon: CalendarClock, titulo: 'Horários de Aula', previa: previaHorarios() },
  { id: 'notas', icon: BarChart3, titulo: 'Notas Acadêmicas', previa: `Média Semestral: ${media('nota')}` },
  { id: 'frequencias', icon: ClipboardCheck, titulo: 'Frequência', previa: `Presença Geral: ${media('freq')}%` },
  { id: 'regras', icon: BookMarked, titulo: 'Regras da Biblioteca', previa: 'Tolerância: 10 min' },
]

const Chip = ({ children }) => (
  <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1.5 text-sm font-semibold backdrop-blur">{children}</span>
)

function BannerReserva() {
  const { reserva, salas, setPagina } = useApp()
  const agora = useAgora()
  if (!reserva) return null
  const { nome } = salas.find((s) => s.id === reserva.salaId)
  return (
    <div role="status" className="sticky top-16 z-10 flex flex-col gap-3 rounded-2xl border border-emerald-300 bg-emerald-50/95 p-4 shadow-lg backdrop-blur dark:border-emerald-500/40 dark:bg-emerald-950/80 sm:flex-row sm:items-center sm:justify-between">
      <p className="flex items-center gap-2 text-sm font-semibold text-emerald-900 dark:text-emerald-200">
        <span className="h-2.5 w-2.5 shrink-0 animate-pulse rounded-full bg-emerald-500" />
        <span>Você possui uma reserva em andamento na {nome} (Restam {fmtTempo(reserva.endsAt - agora, false)} min)</span>
      </p>
      <button onClick={() => setPagina('reserva')} className="shrink-0 rounded-xl bg-emerald-600 px-4 py-2 text-sm font-bold text-white hover:bg-emerald-700">
        Gerenciar Reserva
      </button>
    </div>
  )
}

export default function Inicio() {
  const { setPagina, salas, totalLivres, proximaLiberacao, usuario } = useApp()
  const ocupadas = salas.length - totalLivres
  const proxima = proximaLiberacao != null && fmtHora(new Date(Date.now() + proximaLiberacao * 60000))

  return (
    <div className="space-y-8">
      <BannerReserva />

      <header className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-2xl font-extrabold sm:text-3xl">Olá, {usuario.nome}</h2>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Engenharia de Software • 4º Período | Matrícula: {usuario.matricula}</p>
        </div>
        <span className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300">
          Semestre Ativo • 2026/2
        </span>
      </header>

      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#005CA9] to-[#003B73] p-6 text-white shadow-xl shadow-inatel/20 sm:p-10">
        <div aria-hidden className="pointer-events-none absolute -right-16 -top-20 h-72 w-72 rounded-full border border-white/20 bg-white/5" />
        <div aria-hidden className="pointer-events-none absolute -bottom-24 right-24 h-56 w-56 rounded-full border border-white/15" />
        <div className="relative max-w-2xl">
          <span className="inline-block rounded-full bg-white/15 px-3 py-1 text-[11px] font-bold tracking-widest">NOVIDADE • BIBLIOTECA INATEL</span>
          <h3 className="mt-4 text-2xl font-extrabold leading-tight sm:text-4xl">Inatel StudyHub — Salas de Estudo em Tempo Real</h3>
          <p className="mt-3 text-sm text-white/85 sm:text-base">
            Consulte a disponibilidade de salas equipadas (TV, Ar, Lousa) e garanta seu espaço de estudo sem filas na recepção.
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            <Chip><span className="h-2 w-2 rounded-full bg-emerald-400" /> {totalLivres} Salas Livres Agora</Chip>
            <Chip><Hourglass size={14} /> {proxima ? `Próxima desocupação às ${proxima}` : 'Sem desocupações previstas'}</Chip>
          </div>
          <button
            onClick={() => setPagina(usuario.reserva ? 'reserva' : 'studyhub')}
            className="group mt-6 inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3.5 text-sm font-extrabold text-inatel shadow-lg transition hover:-translate-y-0.5 hover:shadow-xl active:scale-[0.98]"
          >
            {usuario.reserva ? 'Gerenciar minha reserva' : 'Reservar uma Sala Agora'}
            <ArrowRight size={18} className="transition group-hover:translate-x-1" />
          </button>
        </div>
      </section>

      <section aria-label="Ações rápidas" className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {acoes().map(({ id, icon: Icon, titulo, previa }) => (
          <button
            key={id}
            onClick={() => setPagina(id)}
            className="group rounded-2xl border border-slate-200 bg-white p-4 text-left transition duration-200 hover:-translate-y-1 hover:border-inatel/40 hover:shadow-lg dark:border-slate-800 dark:bg-slate-900 dark:hover:border-sky-400/40 sm:p-5"
          >
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-inatel/10 text-inatel transition group-hover:bg-inatel group-hover:text-white dark:bg-sky-400/10 dark:text-sky-300">
              <Icon size={22} />
            </span>
            <p className="mt-4 text-sm font-bold">{titulo}</p>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{previa}</p>
          </button>
        ))}
      </section>

      <div className="grid gap-6 lg:grid-cols-5">
        <section className="lg:col-span-3">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-lg font-extrabold">Quadro de Avisos Institucionais</h3>
            <button onClick={() => setPagina('avisos')} className="text-xs font-bold text-inatel hover:underline dark:text-sky-400">Ver todos</button>
          </div>
          <ul className="space-y-3">
            {AVISOS.map((a) => (
              <Card as="li" key={a.t} className="p-4">
                <div className="flex items-center justify-between gap-2">
                  <Badge tom={a.cor} className="px-2.5 py-0.5 text-[11px]">{a.tag}</Badge>
                  <span className="text-xs text-slate-400">{a.data}</span>
                </div>
                <p className="mt-2 text-sm font-bold">{a.t}</p>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{a.d}</p>
              </Card>
            ))}
          </ul>
        </section>

        <aside className="lg:col-span-2">
          <h3 className="mb-3 text-lg font-extrabold">Status da Biblioteca Hoje</h3>
          <Card as="div" className="space-y-5 p-5">
            <div className="flex items-center gap-3">
              <Clock size={20} className="text-inatel dark:text-sky-400" />
              <div>
                <p className="text-xs text-slate-500 dark:text-slate-400">Horário de funcionamento</p>
                <p className="text-lg font-extrabold">07:30 às 22:30</p>
              </div>
            </div>
            <div>
              <div className="mb-2 flex items-center justify-between text-sm">
                <span className="flex items-center gap-2 font-semibold"><DoorOpen size={16} /> Ocupação das salas</span>
                <b>{Math.round((ocupadas / salas.length) * 100)}% ocupadas</b>
              </div>
              <div className="grid grid-cols-6 gap-1.5" aria-label={`${ocupadas} de ${salas.length} salas ocupadas`}>
                {salas.map((s) => (
                  <div key={s.id} title={`${s.nome}: ${s.status}`} className={`h-8 rounded-md ${s.status === 'Livre' ? 'bg-emerald-400/80' : 'bg-red-400/80'}`} />
                ))}
              </div>
              <p className="mt-2 flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400"><Hourglass size={12} /> {totalLivres} livres • {ocupadas} ocupadas</p>
            </div>
            <button onClick={() => setPagina('studyhub')} className="flex w-full items-center justify-between rounded-xl bg-slate-50 px-4 py-3 text-sm font-bold text-inatel hover:bg-slate-100 dark:bg-slate-800 dark:text-sky-300 dark:hover:bg-slate-700">
              Ver todas as {salas.length} salas <ArrowRight size={16} />
            </button>
          </Card>
        </aside>
      </div>
    </div>
  )
}
