import { X } from 'lucide-react'
import { useApp } from '../context/AppContext.jsx'
import { RECURSOS } from '../data/mockData.js'
import { recursosDe } from '../components/RecursoBadge.jsx'
import { Button, Vazio } from '../components/ui.jsx'

const rotuloDe = Object.fromEntries(RECURSOS.map((r) => [r.key, r.label]))

function SalaCard({ sala }) {
  const { consultarSala, filaEspera, alternarFilaEspera } = useApp()
  const livre = sala.status === true
  const naFila = filaEspera.includes(sala.numero)
  const recursos = recursosDe(sala).map((r) => rotuloDe[r])

  return (
    <article className={`sala-card ${livre ? 'sala-card--livre' : 'sala-card--ocupada'}`}>
      <div className="sala-card__topo">
        <h3 className="sala-card__nome">Sala {sala.numero}</h3>
        <span className={livre ? 'sala-status--livre' : 'sala-status--ocupada'}>
          <span className={livre ? 'sala-status__dot--livre' : 'sala-status__dot--ocupada'} />
          Status: {livre ? 'Livre' : 'Ocupada'}
        </span>
      </div>

      <div className="my-3 space-y-2">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="sala-card__rotulo">Destaque de recursos:</span>
          {recursos.map((r) => (
            <span key={r} className="sala-card__recurso">
              {r}
            </span>
          ))}
        </div>

        <p className="flex items-center gap-1.5">
          <span className="sala-card__rotulo">Capacidade de Alunos:</span>
          <span className="sala-card__capacidade">
            {sala.capacidade > 2 ? 'Estudo em grupo' : sala.capacidade}
          </span>
        </p>
      </div>

      {livre ? (
        <Button onClick={() => consultarSala(sala)} className="sala-card__acao">
          Reservar
        </Button>
      ) : (
        <button
          type="button"
          onClick={() => alternarFilaEspera(sala)}
          className={`sala-card__fila ${naFila ? 'sala-card__fila--ativa' : ''}`}
        >
          {naFila ? (
            <>
              <span className="h-2 w-2 rounded-full bg-[#0066cc]" />
              Na fila de espera (Cancelar aviso)
            </>
          ) : (
            `Entrar na fila de espera (Libera às ${sala.horarioSaida})`
          )}
        </button>
      )}
    </article>
  )
}

/** Tela 1: consulta de salas em tempo real (wireframe + identidade visual do app) */
export default function StudyHub() {
  const {
    setPagina,
    salas,
    salasFiltradas,
    totalLivres,
    proximaLiberacao,
    filtroAplicado,
    limparFiltro,
    aplicarSugestaoHorario,
    usuario,
  } = useApp()
  const livresFiltradas = salasFiltradas.filter((s) => s.status === true)
  const ocupadasFiltradas = salasFiltradas.filter((s) => s.status !== true)

  return (
    <div className="px-4 pb-4 pt-4">
      {usuario.reserva && (
        <button onClick={() => setPagina('reserva')} className="studyhub-reserva-banner mb-4">
          Você tem uma reserva em andamento. Toque para gerenciar →
        </button>
      )}

      <section className="sh-painel">
        <h2 className="sh-painel__titulo">Verifique as Salas Disponíveis</h2>

        <p className="mt-1.5 text-lg font-bold text-white">
          <span className="text-2xl font-extrabold text-[#0066cc]">{totalLivres}</span> de {salas.length} salas livres
        </p>

        <p className="mt-1 text-xs text-zinc-400">
          Próxima liberação em:{' '}
          <span className="font-semibold text-zinc-300">
            {proximaLiberacao != null ? `${proximaLiberacao} min` : '—'}
          </span>
        </p>

        <button
          type="button"
          onClick={() => aplicarSugestaoHorario('08:00', '10:00')}
          className="sh-sugestao-btn mt-3"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-[#0066cc]" />
          Sugestão: Próxima janela livre (08:00 - 10:00)
        </button>

        <button onClick={() => setPagina('filtro')} className="studyhub-filter-btn">
          Filtrar por Recursos
        </button>
      </section>

      {filtroAplicado && (
        <div className="studyhub-info">
          <span><b>{salasFiltradas.length}</b> sala(s) correspondem ao filtro, sendo <b>{livresFiltradas.length}</b> livre(s).</span>
          <button onClick={limparFiltro} className="flex shrink-0 items-center gap-1 font-bold text-[#0066cc]"><X size={14} /> Limpar</button>
        </div>
      )}

      {salasFiltradas.length === 0 ? (
        <div className="pt-4"><Vazio>Nenhuma sala atende aos filtros selecionados.</Vazio></div>
      ) : (
        <div className="space-y-5">
          {livresFiltradas.length > 0 && (
            <section className="sh-lista">
              <h3 className="sh-secao-header__titulo">Salas Disponíveis</h3>
              {livresFiltradas.map((s) => <SalaCard key={s.numero} sala={s} />)}
            </section>
          )}

          {ocupadasFiltradas.length > 0 && (
            <section className="sh-lista">
              <h3 className="sh-secao-header__titulo">Salas Ocupadas</h3>
              {ocupadasFiltradas.map((s) => <SalaCard key={s.numero} sala={s} />)}
            </section>
          )}
        </div>
      )}
    </div>
  )
}
