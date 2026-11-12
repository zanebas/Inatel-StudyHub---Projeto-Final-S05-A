import { useEffect, useState } from 'react'
import { X } from 'lucide-react'
import { useApp, LIMITE_EXTRA_MIN } from '../context/AppContext.jsx'
import { RECURSOS } from '../data/mockData.js'
import { recursosDe } from '../components/RecursoBadge.jsx'
import { Button, Card, PageHeader, Vazio } from '../components/ui.jsx'
import { fmtTempo, useAgora } from '../utils.js'

const rotuloDe = Object.fromEntries(RECURSOS.map((r) => [r.key, r.label]))

/** Tela 4: gerenciar minha reserva (wireframe + identidade visual do app) */
export default function MinhaReserva() {
  const { reserva, salas, confirmarCheckin, aumentarTempoReserva, devolverSala, setPagina } = useApp()
  const [opcoes, setOpcoes] = useState(false)
  const agora = useAgora()
  const restante = reserva ? reserva.endsAt - agora : 0
  const checkinPendente = reserva?.statusCheckin === 'pendente'
  const checkinRestante = checkinPendente && reserva?.checkinExpiresAt ? reserva.checkinExpiresAt - agora : 0
  const sala = reserva ? salas.find((s) => s.numero === reserva.salaNumero) : null

  useEffect(() => {
    if (!reserva) return
    if (checkinPendente && checkinRestante <= 0) {
      devolverSala(
        sala,
        true,
        'Tempo limite de 10 minutos para check-in presencial esgotado. Reserva cancelada automaticamente.',
      )
      return
    }
    if (restante <= 0) devolverSala(sala, true)
  }, [reserva, restante, checkinPendente, checkinRestante]) // eslint-disable-line react-hooks/exhaustive-deps

  const header = <PageHeader titulo="Gerenciar Minha Reserva" onVoltar={() => setPagina('studyhub')} />
  if (!reserva || !sala) {
    return <div>{header}<div className="mt-5"><Vazio>Você não possui nenhuma reserva ativa.</Vazio></div></div>
  }

  const restanteExtra = LIMITE_EXTRA_MIN - reserva.extraTotal
  const participantes = reserva.participantes ?? []
  const totalAlunos = 1 + participantes.length

  return (
    <div>
      {header}
      <Card className="mx-auto mt-6 max-w-[330px] border-zinc-800 bg-zinc-950 p-5">
        <div className="flex items-center justify-between gap-2">
          <h3 className="reserva-card__titulo">Minha Reserva Ativa:</h3>
          {!checkinPendente && (
            <span className="sala-status--livre">
              <span className="sala-status__dot--livre" />
              Check-in realizado
            </span>
          )}
        </div>

        <p className="mt-4 text-[17px] font-bold text-white">Sala {sala.numero}</p>

        <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-[14px] text-white">
          <span>
            <span className="reserva-card__rotulo">Permanência:</span> {sala.horarioEntrada} às {sala.horarioSaida}
          </span>
          <span>
            <span className="reserva-card__rotulo">Total de Alunos:</span> {totalAlunos}/{sala.capacidade}
          </span>
        </div>

        {participantes.length > 0 && (
          <p className="mt-2.5 text-xs text-zinc-300">
            <span className="reserva-card__rotulo">Participantes adicionais:</span>{' '}
            {participantes.map((m) => `Mat. ${m}`).join(', ')}
          </p>
        )}

        <p className="mt-3 text-[14px] text-white">
          <span className="reserva-card__rotulo">Recursos:</span>{' '}
          {recursosDe(sala).map((r) => rotuloDe[r]).join(', ')}
        </p>
      </Card>

      {checkinPendente ? (
        <Card className="checkin-card mx-auto mt-6 max-w-[330px]">
          <h3 className="text-base font-bold text-white">Validação Presencial (QR Code)</h3>
          <p className="mt-1 text-xs text-zinc-400">
            Apresente ou escaneie o código na recepção da biblioteca para confirmar sua presença.
          </p>

          <div className="checkin-qr-frame">
            <img
              src="qrcode-inatel.png"
              alt="QR Code Inatel StudyHub"
              className="mx-auto h-44 w-auto object-contain select-none"
            />
          </div>

          <div className="mt-3">
            <p className="text-xs text-zinc-400">Tolerância restante para check-in:</p>
            <p className={`checkin-timer ${checkinRestante < 2 * 60000 ? 'text-rose-400' : 'text-white'}`}>
              {fmtTempo(checkinRestante, false)}
            </p>
          </div>

          <button
            type="button"
            onClick={confirmarCheckin}
            className="checkin-confirm-btn mt-4"
          >
            Confirmar Check-in Presencial
          </button>

          <button
            type="button"
            onClick={() => devolverSala(sala, false, `${sala.nome} liberada. Reserva cancelada com sucesso!`)}
            className="checkin-cancel-btn mt-2.5"
          >
            Cancelar Reserva
          </button>
        </Card>
      ) : (
        <>
          <Card className="mx-auto mt-6 max-w-[330px] border-zinc-800 bg-zinc-950 p-5 text-center">
            <h3 className="text-[16px] font-bold text-[#0066cc]">Tempo Restante</h3>
            <p className={`reserva-tempo ${restante < 5 * 60000 ? 'reserva-tempo--critico' : ''}`}>
              {fmtTempo(restante)}
            </p>
          </Card>

          <div className="mx-auto mt-8 grid max-w-[350px] grid-cols-2 gap-4">
            <Button variant="outline" onClick={() => devolverSala(sala, false)} className="px-3 py-4 text-xs sm:text-sm">
              Finalizar / Devolver Sala
            </Button>
            <Button onClick={() => setOpcoes((o) => !o)} aria-expanded={opcoes} className="border border-zinc-700 px-3 py-4 text-xs sm:text-sm">
              Aumentar Tempo de Reserva
            </Button>
          </div>
        </>
      )}

      {opcoes && (
        <div role="dialog" aria-modal="true" onClick={() => setOpcoes(false)} className="popup-backdrop">
          <div onClick={(e) => e.stopPropagation()} className="popup-card">
            <div className="popup-card__header">
              <span>Aumentar Tempo de Reserva</span>
              <button onClick={() => setOpcoes(false)} aria-label="Fechar" className="text-white/80 hover:text-white">
                <X size={16} />
              </button>
            </div>
            <div className="popup-card__body">
              <p className="mb-3 text-sm font-semibold text-white">Quanto tempo deseja adicionar?</p>
              <div className="grid grid-cols-3 gap-2.5">
                {[5, 15, 30].map((m) => (
                  <Button
                    key={m}
                    disabled={m > restanteExtra}
                    onClick={() => { aumentarTempoReserva(sala, m); setOpcoes(false) }}
                    className="border border-zinc-500 py-2.5 disabled:cursor-not-allowed disabled:bg-zinc-900 disabled:text-zinc-500"
                  >
                    +{m} min
                  </Button>
                ))}
              </div>
              <p className="mt-3.5 text-xs text-zinc-300">
                Máximo de {LIMITE_EXTRA_MIN} minutos adicionais por reserva. Restante: <b>{restanteExtra} min</b>.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
