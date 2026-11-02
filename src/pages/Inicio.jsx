import { ArrowRight, DoorOpen, Hourglass, Timer, Tv } from 'lucide-react'
import { useApp } from '../context/AppContext.jsx'
import { ATALHOS } from '../atalhos.js'
import { AVISOS, TEMPO_MEDIO_USO } from '../data/mockData.js'
import { fmtHora, fmtTempo, media, useAgora } from '../utils.js'
import { Badge, Card } from '../components/ui.jsx'

const PREVIAS = () => ({
  horarios: 'Aula às 19:00',
  notas: `Média Semestral: ${media('nota')}`,
  frequencias: `Presença Geral: ${media('freq')}%`,
  regras: 'Tolerância: 10 min',
})

const Chip = ({ children }) => (
  <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1.5 text-sm font-semibold backdrop-blur">{children}</span>
)

function BannerReserva() {
  const { reserva, salas, setPagina } = useApp()
  const agora = useAgora()
  if (!reserva) return null
  const { nome } = salas.find((s) => s.id === reserva.salaId)
  return (
    <div role="status" className="flex flex-col gap-3 rounded-2xl border border-emerald-300 bg-emerald-50 p-4 shadow-lg dark:border-emerald-500/40 dark:bg-emerald-950/80 sm:flex-row sm:items-center sm:justify-between">
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
  const previas = PREVIAS()
  const comRecursos = salas.filter((s) => s.status === 'Livre' && (s.tv || s.lousa)).length
  const proxima = proximaLiberacao != null && fmtHora(new Date(Date.now() + proximaLiberacao * 60000))

  return (
    <div className="space-y-8">
      <BannerReserva />

      <header>
        <p className="text-sm font-semibold text-inatel dark:text-sky-400">Olá, {usuario.nome} • Matrícula {usuario.matricula} • Semestre 2026/2</p>
        <h2 className="mt-1 text-3xl font-extrabold sm:text-4xl">Reserve seu espaço de estudo no Inatel</h2>
        <p className="text-sm font-semibold text-inatel dark:text-sky-400">Engenharia de Software • 4º Período • Matrícula {usuario.matricula} • Semestre 2026/2</p>
        <h2 className="mt-1 text-3xl font-extrabold sm:text-4xl">Olá, {usuario.nome}</h2>
        <div className="mt-5 grid gap-3 md:grid-cols-3">
          {[
            { icon: DoorOpen, rotulo: 'Salas Livres', valor: `${totalLivres} de ${salas.length}` },
            { icon: Tv, rotulo: 'Espaços com TV/Lousa', valor: `${comRecursos} livres` },
            { icon: Timer, rotulo: 'Tempo Médio de Uso', valor: TEMPO_MEDIO_USO },
          ].map(({ icon: Icon, rotulo, valor }) => (
            <Card key={rotulo} as="div" className="flex items-center gap-4 p-4 shadow-sm">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-inatel/10 text-inatel dark:bg-sky-400/10 dark:text-sky-300"><Icon size={22} /></span>
              <div>
                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">{rotulo}</p>
                <p className="text-xl font-extrabold">{valor}</p>
              </div>
            </Card>
          ))}
        </div>
      </header>

      <section
        className="relative overflow-hidden rounded-2xl bg-cover bg-center bg-no-repeat p-6 text-white shadow-xl sm:p-10"
        style={{ backgroundImage: "linear-gradient(rgba(15, 23, 42, 0.8), rgba(15, 23, 42, 0.92)), url('biblioteca.jpg')" }}
      >
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

      <section aria-labelledby="acesso-rapido">
        <h3 id="acesso-rapido" className="mb-3 text-lg font-extrabold">Acesso rápido</h3>
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {ATALHOS.map(({ id, icon: Icon, titulo }) => (
          <button
            key={id}
            onClick={() => setPagina(id)}
            className="group rounded-2xl border border-slate-200 bg-white p-4 text-left transition duration-200 hover:-translate-y-1 hover:border-inatel/40 hover:shadow-lg dark:border-slate-800 dark:bg-slate-900 dark:hover:border-sky-400/40 sm:p-5"
          >
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-inatel/10 text-inatel transition group-hover:bg-inatel group-hover:text-white dark:bg-sky-400/10 dark:text-sky-300">
              <Icon size={22} />
            </span>
            <p className="mt-4 text-sm font-bold">{titulo}</p>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{previas[id]}</p>
          </button>
        ))}
        </div>
      </section>

      <div>
        <section>
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

      </div>
    </div>
  )
}
