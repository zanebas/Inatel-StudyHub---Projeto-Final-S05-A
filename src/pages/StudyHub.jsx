import { Clock, DoorOpen, Filter, Users, X } from 'lucide-react'
import { useApp } from '../context/AppContext.jsx'
import { ListaRecursos } from '../components/RecursoBadge.jsx'
import { Badge, Button, Card, PageHeader, Vazio } from '../components/ui.jsx'

function SalaCard({ sala }) {
  const { iniciarReserva } = useApp()
  const livre = sala.status === 'Livre'
  return (
    <Card as="article" className="flex flex-col p-5 shadow-sm transition hover:shadow-md">
      <div className="flex items-start justify-between gap-2">
        <div>
          <h3 className="text-lg font-bold">{sala.nome}</h3>
          {sala.descricao && <p className="text-xs text-slate-500 dark:text-slate-400">{sala.descricao}</p>}
        </div>
        {livre ? (
          <Badge tom="green" className="flex items-center gap-1.5 px-2.5 py-1 text-xs">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
            </span>
            Livre
          </Badge>
        ) : (
          <Badge tom="red" className="px-2.5 py-1 text-xs">Ocupada</Badge>
        )}
      </div>

      <div className="mt-4 flex flex-wrap gap-1.5"><ListaRecursos sala={sala} /></div>
      <p className="mt-4 flex items-center gap-1.5 text-sm text-slate-600 dark:text-slate-400">
        <Users size={14} /> {sala.capacidade} alunos
      </p>

      {livre ? (
        <Button onClick={() => iniciarReserva(sala)} className="mt-5 py-2.5 focus:outline-none focus:ring-4 focus:ring-inatel/30">
          Reservar
        </Button>
      ) : (
        <button disabled className="mt-5 flex items-center justify-center gap-1.5 rounded-xl bg-slate-100 py-2.5 text-sm font-semibold text-slate-400 dark:bg-slate-800 dark:text-slate-500">
          <Clock size={14} /> Término previsto: {sala.horarioLiberacao}
        </button>
      )}
    </Card>
  )
}

const Kpi = ({ icon: Icon, rotulo, valor, sufixo }) => (
  <div className="flex items-center gap-3">
    <Icon size={28} className="shrink-0 opacity-90" />
    <div>
      <p className="text-xs uppercase tracking-wide text-white/80">{rotulo}</p>
      <p className="text-3xl font-extrabold">{valor}{sufixo && <span className="text-base font-semibold text-white/70"> {sufixo}</span>}</p>
    </div>
  </div>
)

/** Tela 1: consulta de salas em tempo real */
export default function StudyHub() {
  const { setPagina, salas, salasFiltradas, totalLivres, proximaLiberacao, filtroAplicado, limparFiltro, usuario } = useApp()
  const livresNoFiltro = salasFiltradas.filter((s) => s.status === 'Livre').length

  return (
    <div className="pb-24">
      <PageHeader titulo="Inatel StudyHub" subtitulo="Verifique as salas disponíveis" onVoltar={() => setPagina('inicio')} />

      {usuario.reserva && (
        <button onClick={() => setPagina('reserva')} className="mb-4 w-full rounded-xl border border-emerald-300 bg-emerald-50 p-3 text-left text-sm font-semibold text-emerald-800 dark:border-emerald-500/40 dark:bg-emerald-500/10 dark:text-emerald-300">
          Você tem uma reserva em andamento. Toque para gerenciar →
        </button>
      )}

      <section className="grid gap-4 rounded-2xl bg-gradient-to-br from-inatel to-inatel-light p-5 text-white sm:grid-cols-2">
        <Kpi icon={DoorOpen} rotulo="Total de Salas Livres" valor={totalLivres} sufixo={`/ ${salas.length}`} />
        <Kpi icon={Clock} rotulo="Novas Salas Disponíveis em" valor={proximaLiberacao ?? '—'} sufixo={proximaLiberacao != null && 'min'} />
      </section>

      {filtroAplicado && (
        <div className="mt-4 flex items-center justify-between gap-3 rounded-xl border border-amber-300 bg-amber-50 p-3 text-sm dark:border-amber-500/40 dark:bg-amber-500/10">
          <span><b>{salasFiltradas.length}</b> sala(s) correspondem ao filtro, sendo <b>{livresNoFiltro}</b> livre(s).</span>
          <button onClick={limparFiltro} className="flex shrink-0 items-center gap-1 font-bold text-amber-700 dark:text-amber-300"><X size={14} /> Limpar</button>
        </div>
      )}

      {salasFiltradas.length === 0 ? (
        <div className="mt-10"><Vazio>Nenhuma sala atende aos filtros selecionados.</Vazio></div>
      ) : (
        <section className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {salasFiltradas.map((s) => <SalaCard key={s.id} sala={s} />)}
        </section>
      )}

      <div className="fixed inset-x-0 bottom-0 z-20 flex justify-center bg-gradient-to-t from-slate-50 via-slate-50/90 to-transparent px-4 pb-4 pt-8 dark:from-slate-950 dark:via-slate-950/90 lg:pl-64">
        <button onClick={() => setPagina('filtro')} className="flex w-full max-w-md items-center justify-center gap-2 rounded-full bg-slate-900 px-6 py-3.5 text-sm font-bold text-white shadow-xl transition hover:bg-slate-700 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200">
          <Filter size={16} /> Filtrar por Recursos
        </button>
      </div>
    </div>
  )
}
