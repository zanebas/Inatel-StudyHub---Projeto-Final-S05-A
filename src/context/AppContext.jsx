import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { FILTRO_INICIAL, RECURSOS, USUARIO, criarSalas, liberarSala, marcarReservado } from '../data/mockData.js'
import { fmtHora, toMin } from '../utils.js'

const DURACAO_PADRAO_MIN = 90
const FECHAMENTO_MIN = 22 * 60 + 30
export const LIMITE_EXTRA_MIN = 30
export const TOLERANCIA_CHECKIN_MIN = 10

const AppContext = createContext(null)
export const useApp = () => useContext(AppContext)

export function AppProvider({ children }) {
  const [autenticado, setAutenticado] = useState(false)
  const [dark, setDark] = useState(false)
  const [pagina, setPagina] = useState('inicio')
  const [usuarioState, setUsuario] = useState(USUARIO)
  const [salas, setSalas] = useState(criarSalas)
  const [filtro, setFiltro] = useState(FILTRO_INICIAL)
  const [filtroAplicado, setFiltroAplicado] = useState(null)
  const [salaSelecionada, setSalaSelecionada] = useState(null)
  const [reserva, setReserva] = useState(null)
  const [filaEspera, setFilaEspera] = useState([])
  const [toast, setToast] = useState(null)
  const [agora, setAgora] = useState(Date.now())

  const notificar = (mensagem, tipo = 'sucesso') => setToast({ mensagem, tipo })

  // Relógio global: atualiza contagens, libera salas cujo término previsto passou e notifica fila de espera
  useEffect(() => {
    const t = setInterval(() => {
      const n = Date.now()
      setAgora(n)
      setSalas((ss) => {
        const liberadas = ss.filter((s) => !s.status && s.liberaEm && s.liberaEm <= n)
        if (liberadas.length === 0) return ss
        const numsLiberados = liberadas.map((s) => s.numero)
        setFilaEspera((fila) => {
          const naFila = fila.filter((num) => numsLiberados.includes(num))
          if (naFila.length > 0) {
            notificar(`A Sala ${naFila.join(', ')} que você aguardava na fila acaba de ficar disponível!`)
          }
          return fila.filter((num) => !numsLiberados.includes(num))
        })
        return ss.map((s) => (s.liberaEm <= n ? s.liberarSala() : s))
      })
    }, 5000)
    return () => clearInterval(t)
  }, [])

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark)
  }, [dark])

  useEffect(() => {
    if (!toast) return
    const t = setTimeout(() => setToast(null), 4000)
    return () => clearTimeout(t)
  }, [toast])

  // SistemaReserva.filtrarDisponiveis(horario, recursos)
  const filtrarDisponiveis = (
    horario = { horarioEntrada: filtro.horarioEntrada, horarioSaida: filtro.horarioSaida },
    recursos = filtro,
  ) => {
    const entrada = horario?.horarioEntrada ?? recursos?.horarioEntrada ?? ''
    const saida = horario?.horarioSaida ?? recursos?.horarioSaida ?? ''
    if (entrada && saida && toMin(saida) <= toMin(entrada)) {
      notificar('O horário de saída deve ser maior que o de entrada.', 'erro')
      return false
    }
    setFiltroAplicado({ ...recursos, horarioEntrada: entrada, horarioSaida: saida })
    return true
  }

  const limparFiltro = () => {
    setFiltro(FILTRO_INICIAL)
    setFiltroAplicado(null)
  }

  const aplicarSugestaoHorario = (entrada = '08:00', saida = '10:00') => {
    const novoFiltro = { ...filtro, horarioEntrada: entrada, horarioSaida: saida }
    setFiltro(novoFiltro)
    setFiltroAplicado(novoFiltro)
    notificar(`Sugestão aplicada: janela livre (${entrada} - ${saida}).`)
  }

  const alternarFilaEspera = (salaAlvo) => {
    const num = typeof salaAlvo === 'number' ? salaAlvo : salaAlvo?.numero
    if (!num) return
    if (filaEspera.includes(num)) {
      setFilaEspera((f) => f.filter((n) => n !== num))
      notificar(`Aviso da Sala ${num} cancelado.`)
    } else {
      setFilaEspera((f) => [...f, num])
      notificar(`Aviso ativado! Você será notificado assim que a Sala ${num} liberar.`)
    }
  }

  const salasFiltradas = useMemo(() => {
    const f = filtroAplicado
    if (!f) return salas
    return salas.filter(
      (s) =>
        (!f.arCondicionado || s.arCondicionado) &&
        (!f.tv || s.tv) &&
        (!f.lousa || s.lousa) &&
        (!f.computador || s.computador) &&
        !RECURSOS.some((r) => f[r.key] && !s[r.key]) &&
        (f.capacidade !== 'exata' || s.capacidade === 2) &&
        (f.capacidade !== 'grupo' || s.capacidade > 2),
    )
  }, [salas, filtroAplicado])

  const totalLivres = salas.filter((s) => s.status === true).length
  const proximaLiberacao = useMemo(() => {
    const tempos = salas.filter((s) => !s.status && s.liberaEm).map((s) => s.liberaEm)
    return tempos.length ? Math.max(1, Math.ceil((Math.min(...tempos) - agora) / 60000)) : null
  }, [salas, agora])

  // Usuario.consultarSala(sala)
  const consultarSala = (sala) => {
    if (usuarioState.pendencia) {
      notificar('Usuário possui pendência ativa.', 'erro')
      return
    }
    if (usuarioState.reserva) {
      notificar('Você já possui uma reserva ativa. Devolva a sala antes de reservar outra.', 'erro')
      return setPagina('reserva')
    }
    setSalaSelecionada(sala)
    setPagina('confirmacao')
  }

  // Usa o horário do filtro quando válido; senão, 90 min a partir de agora
  const calcularPermanencia = () => {
    if (filtro.horarioEntrada && filtro.horarioSaida && toMin(filtro.horarioSaida) > toMin(filtro.horarioEntrada)) {
      return {
        horarioEntrada: filtro.horarioEntrada,
        horarioSaida: filtro.horarioSaida,
        minutos: toMin(filtro.horarioSaida) - toMin(filtro.horarioEntrada),
      }
    }
    const inicio = new Date()
    const fim = new Date(inicio.getTime() + DURACAO_PADRAO_MIN * 60000)
    return { horarioEntrada: fmtHora(inicio), horarioSaida: fmtHora(fim), minutos: DURACAO_PADRAO_MIN }
  }

  // SistemaReserva.reservarSala(usuario, sala)
  const reservarSala = (usuarioAlvo = usuarioState, salaAlvo = salaSelecionada, participantes = []) => {
    if (!salaAlvo || usuarioAlvo?.pendencia) return
    const { horarioEntrada, horarioSaida, minutos } = calcularPermanencia()
    const endsAt = Date.now() + minutos * 60000
    const checkinExpiresAt = Date.now() + TOLERANCIA_CHECKIN_MIN * 60000
    const numero = salaAlvo.numero
    setReserva({
      salaNumero: numero,
      horarioEntrada,
      horarioSaida,
      extraTotal: 0,
      endsAt,
      statusCheckin: 'pendente',
      checkinExpiresAt,
      participantes,
    })
    setUsuario((u) => ({ ...u, reserva: true }))
    setSalas((ss) =>
      ss.map((s) => (s.numero === numero ? s.marcarReservado(horarioEntrada, horarioSaida, endsAt) : s)),
    )
    notificar(`Reserva da Sala ${numero} confirmada! Realize o check-in presencial em até 10 min.`)
    setPagina('reserva')
  }

  const confirmarCheckin = () => {
    if (!reserva) return
    setReserva((r) => (r ? { ...r, statusCheckin: 'confirmado', checkinExpiresAt: null } : r))
    notificar('Check-in presencial confirmado com sucesso!')
  }

  // SistemaReserva.aumentarTempoReserva(sala, minutos)
  const aumentarTempoReserva = (salaAlvo, minutos) => {
    const extra = typeof salaAlvo === 'number' ? salaAlvo : minutos
    if (!reserva) return
    if (reserva.extraTotal + extra > LIMITE_EXTRA_MIN) {
      return notificar(`Você só pode adicionar até ${LIMITE_EXTRA_MIN} minutos por reserva.`, 'erro')
    }
    const endsAt = reserva.endsAt + extra * 60000
    const novoFim = new Date(endsAt)
    if (novoFim.getHours() * 60 + novoFim.getMinutes() > FECHAMENTO_MIN || novoFim.getDate() !== new Date().getDate()) {
      return notificar('Conflito de horário: a biblioteca fecha às 22:30.', 'erro')
    }
    const horarioSaida = fmtHora(novoFim)
    const numero = salaAlvo?.numero ?? reserva.salaNumero
    setReserva({ ...reserva, endsAt, horarioSaida, extraTotal: reserva.extraTotal + extra })
    setSalas((ss) =>
      ss.map((s) => (s.numero === numero ? s.marcarReservado(reserva.horarioEntrada, horarioSaida, endsAt) : s)),
    )
    notificar(`Reserva estendida em +${extra} minutos!`)
  }

  // SistemaReserva.devolverSala(sala)
  const devolverSala = (salaAlvo, automatico = false, motivoCustom = '') => {
    if (!reserva) return
    const numero = salaAlvo?.numero ?? reserva.salaNumero
    const salaAtual = salas.find((s) => s.numero === numero)
    setSalas((ss) => ss.map((s) => (s.numero === numero ? s.liberarSala() : s)))
    setUsuario((u) => ({ ...u, reserva: false }))
    setReserva(null)
    setSalaSelecionada(null)
    notificar(
      motivoCustom ||
        (automatico ? `Tempo esgotado. ${salaAtual?.nome} devolvida.` : `${salaAtual?.nome} devolvida com sucesso!`),
      automatico ? 'erro' : 'sucesso',
    )
    setPagina('studyhub')
  }

  const usuario = useMemo(
    () => ({
      ...usuarioState,
      consultarSala,
      reservarSala: (sala) => reservarSala(usuarioState, sala),
      devolverSala: (sala) => devolverSala(sala, false),
    }),
    [usuarioState, reserva, salaSelecionada, salas, filtro], // eslint-disable-line react-hooks/exhaustive-deps
  )

  const login = () => {
    setAutenticado(true)
    setPagina('inicio')
  }

  const value = {
    autenticado, login, logout: () => setAutenticado(false),
    dark, toggleDark: () => setDark((d) => !d),
    pagina, setPagina,
    usuario, salas, salasFiltradas, totalLivres, proximaLiberacao,
    filtro, setFiltro, filtroAplicado,
    filtrarDisponiveis, limparFiltro, aplicarSugestaoHorario,
    filaEspera, alternarFilaEspera,
    salaSelecionada, consultarSala, calcularPermanencia,
    reservarSala, confirmarCheckin, aumentarTempoReserva, devolverSala,
    liberarSala, marcarReservado,
    reserva,
    toast, notificar, dismissToast: () => setToast(null),
  }
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}
