import { X } from 'lucide-react'
import { useApp } from '../context/AppContext.jsx'
import { RECURSOS } from '../data/mockData.js'
import { recursosDe } from '../components/RecursoBadge.jsx'
import { Button, Vazio } from '../components/ui.jsx'

const rotuloDe = Object.fromEntries(RECURSOS.map((r) => [r.key, r.label]))

const formatarHorasMin = (min) => {
  if (min == null) return '00:00'
  const h = String(Math.floor(min / 60)).padStart(2, '0')
  const m = String(min % 60).padStart(2, '0')
  return `${h}:${m}`
}

function SalaCard({ sala }) {
  const { consultarSala } = useApp()
  const livre = sala.status === true
  const recursos = recursosDe(sala).map((r) => rotuloDe[r])
  const inlineRecurso = recursos.length === 1 && sala.numero === 1

  return (
    <article className="sala-card">
      <div className="sala-card__topo">
        <h3 className="sala-card__nome">Sala {sala.numero}</h3>
        <p className="sala-status">
          Status:{' '}
          <span className={livre ? 'sala-status--livre' : 'sala-status--ocupada'}>
            {livre ? 'Livre' : 'Ocupada'}
          </span>
        </p>
      </div>

      <div className="sala-card__corpo">
        <span className="sala-card__rotulo">Destaque de recursos:</span>
        {inlineRecurso ? (
          <span> {recursos[0]}</span>
        ) : (
          <ul className="mt-0.5 space-y-0.5">
            {recursos.map((r) => (
              <li key={r}>{r}</li>
            ))}
          </ul>
        )}
      </div>

      <p className="sala-card__capacidade">
        <span className="sala-card__rotulo">Capacidade de Alunos:</span>{' '}
        {sala.capacidade > 2 ? 'Estudo em grupo' : sala.capacidade}
      </p>

      {livre ? (
        <Button onClick={() => consultarSala(sala)} className="sala-card__acao">
          Reservar
        </Button>
      ) : (
        <p className="sala-card__ocupada">
          Término Previsto: {sala.horarioSaida}:00 horas
        </p>
      )}
    </article>
  )
}

/** Tela 1: consulta de salas em tempo real (wireframe + identidade visual do app) */
export default function StudyHub() {
  const { setPagina, salasFiltradas, totalLivres, proximaLiberacao, filtroAplicado, limparFiltro, usuario } = useApp()
  const livresNoFiltro = salasFiltradas.filter((s) => s.status === true).length

  return (
    <div className="pb-4">
      {usuario.reserva && (
        <button onClick={() => setPagina('reserva')} className="studyhub-reserva-banner">
          Você tem uma reserva em andamento. Toque para gerenciar →
        </button>
      )}

      <section className="sh-painel">
        <h2 className="sh-painel__titulo">Verifique as Salas Disponíveis</h2>
        <p className="sh-painel__linha">Total de Salas livres: <b>{totalLivres}</b></p>
        <p className="sh-painel__linha">
          Novas Salas Disponíveis em: <b>{formatarHorasMin(proximaLiberacao)} horas</b>
        </p>
      </section>

      <button onClick={() => setPagina('filtro')} className="studyhub-filter-btn">
        Filtrar por Recursos
      </button>

      {filtroAplicado && (
        <div className="studyhub-info">
          <span><b>{salasFiltradas.length}</b> sala(s) correspondem ao filtro, sendo <b>{livresNoFiltro}</b> livre(s).</span>
          <button onClick={limparFiltro} className="flex shrink-0 items-center gap-1 font-bold text-[#0066cc]"><X size={14} /> Limpar</button>
        </div>
      )}

      {salasFiltradas.length === 0 ? (
        <div className="px-4 pt-6"><Vazio>Nenhuma sala atende aos filtros selecionados.</Vazio></div>
      ) : (
        <section className="sh-lista">
          {salasFiltradas.map((s) => <SalaCard key={s.numero} sala={s} />)}
        </section>
      )}
    </div>
  )
}
