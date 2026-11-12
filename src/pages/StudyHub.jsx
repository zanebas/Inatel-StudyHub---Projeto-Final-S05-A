import { useState } from 'react'
import { ChevronRight, Clock, X } from 'lucide-react'
import { useApp } from '../context/AppContext.jsx'
import { RECURSOS } from '../data/mockData.js'
import { recursosDe } from '../components/RecursoBadge.jsx'
import { Button, Vazio } from '../components/ui.jsx'

const rotuloDe = Object.fromEntries(RECURSOS.map((r) => [r.key, r.label]))

const LARGURA_BARRA = ['w-0', 'w-1/6', 'w-2/6', 'w-3/6', 'w-4/6', 'w-5/6', 'w-full']

function SalaCard({ sala }) {
  const { consultarSala, filaEspera, alternarFilaEspera, reservaAtiva, notificar } = useApp()
  const livre = sala.status === true
  const naFila = filaEspera.includes(sala.numero)
  const bloqueadaPorReserva = reservaAtiva !== null
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
        bloqueadaPorReserva ? (
          <button
            type="button"
            onClick={() =>
              notificar('Você já possui uma reserva ativa. Finalize ou devolva a sala atual antes de reservar outra.', 'erro')
            }
            className="sala-card__acao--bloqueada"
          >
            Você já possui uma reserva ativa
          </button>
        ) : (
          <Button onClick={() => consultarSala(sala)} className="sala-card__acao">
            Reservar
          </Button>
        )
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
    reservaAtiva,
    historicoSessao,
  } = useApp()
  const [apenasLivres, setApenasLivres] = useState(false)

  const livresFiltradas = salasFiltradas.filter((s) => s.status === true)
  const ocupadasFiltradas = apenasLivres ? [] : salasFiltradas.filter((s) => s.status !== true)
  const larguraProgresso = LARGURA_BARRA[Math.min(6, Math.max(0, totalLivres))]

  return (
    <div className="px-4 pb-4 pt-4">
      {reservaAtiva && (
        <button
          type="button"
          onClick={() => setPagina('reserva')}
          className="studyhub-reserva-banner"
        >
          <Clock size={18} className="mt-0.5 shrink-0 text-amber-400" />
          <div className="min-w-0 flex-1 text-left">
            <p className="text-xs font-bold text-amber-300">
              Reserva Ativa: Sala {reservaAtiva.salaNumero} (Toque para gerenciar)
            </p>
            <p className="mt-0.5 text-[11px] text-amber-200/90">
              Status:{' '}
              {reservaAtiva.statusCheckin === 'pendente'
                ? 'Aguardando check-in QR Code'
                : 'Em andamento'}
            </p>
          </div>
          <ChevronRight size={18} className="shrink-0 text-amber-400" />
        </button>
      )}

      <section className="sh-painel">
        <h2 className="sh-painel__titulo">Verifique as Salas Disponíveis</h2>

        <p className="mt-1.5 text-lg font-bold text-white">
          <span className="text-2xl font-extrabold text-[#0066cc]">{totalLivres}</span> de {salas.length} salas livres
        </p>

        <div className="sh-painel__progress-track">
          <div className={`sh-painel__progress-bar ${larguraProgresso}`} />
        </div>

        <p className="mt-2 text-xs text-zinc-400">
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

      {salasFiltradas.length === 0 || (apenasLivres && livresFiltradas.length === 0) ? (
        <div className="pt-4"><Vazio>Nenhuma sala disponível atende aos filtros selecionados.</Vazio></div>
      ) : (
        <div className="space-y-5">
          {livresFiltradas.length > 0 && (
            <section className="sh-lista">
              <div className="mb-2 flex items-center justify-between px-1">
                <h3 className="sh-secao-header__titulo mb-0 px-0">Salas Disponíveis</h3>
                <button
                  type="button"
                  aria-pressed={apenasLivres}
                  onClick={() => setApenasLivres((v) => !v)}
                  className={`sh-toggle-livres ${apenasLivres ? 'sh-toggle-livres--ativo' : ''}`}
                >
                  Apenas livres
                </button>
              </div>
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

      {historicoSessao.length > 0 && (
        <section className="sh-historico">
          <h3 className="sh-secao-header__titulo">Atividade Recente Nesta Sessão</h3>
          <div className="rounded-lg border border-zinc-800 bg-zinc-950 px-3.5 py-1">
            {historicoSessao.map((item) => (
              <div key={item.id} className="sh-historico-row">
                <span>
                  <b className="text-zinc-200">{item.salaNome}</b> ({item.horario})
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${
                      item.status === 'Devolvida' ? 'bg-emerald-500' : 'bg-amber-400'
                    }`}
                  />
                  {item.status} às {item.encerradoEm}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
