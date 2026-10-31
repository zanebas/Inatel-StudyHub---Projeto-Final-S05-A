import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { FILTRO_INICIAL, RECURSOS, USUARIO, criarSalas } from '../data/mockData.js'
import { fmtHora, toMin } from '../utils.js'

const DURACAO_PADRAO_MIN = 90
const FECHAMENTO_MIN = 22 * 60 + 30
export const LIMITE_EXTRA_MIN = 30

const AppContext = createContext(null)
export const useApp = () => useContext(AppContext)

export function AppProvider({ children }) {
  const [autenticado, setAutenticado] = useState(false)
  const [dark, setDark] = useState(false)
  const [pagina, setPagina] = useState('inicio')
  const [usuario, setUsuario] = useState(USUARIO)
  const [salas, setSalas] = useState(criarSalas)
  const [filtro, setFiltro] = useState(FILTRO_INICIAL)
  const [filtroAplicado, setFiltroAplicado] = useState(null)
  const [salaSelecionada, setSalaSelecionada] = useState(null)
  const [reserva, setReserva] = useState(null)
  const [toast, setToast] = useState(null)
  const [agora, setAgora] = useState(Date.now())

  const notificar = (mensagem, tipo = 'sucesso') => setToast({ mensagem, tipo })
  const atualizarSala = (id, patch) => setSalas((ss) => ss.map((s) => (s.id === id ? { ...s, ...patch } : s)))

  // Relógio global: atualiza contagens e libera salas cujo término previsto já passou
  useEffect(() => {
    const t = setInterval(() => {
      const n = Date.now()
      setAgora(n)
      setSalas((ss) =>
        ss.some((s) => s.liberaEm <= n)
          ? ss.map((s) => (s.liberaEm <= n ? { ...s, status: 'Livre', horarioLiberacao: undefined, liberaEm: undefined } : s))
          : ss,
      )
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

  const salasFiltradas = useMemo(() => {
    const f = filtroAplicado
    if (!f) return salas
    return salas.filter(
      (s) =>
        !RECURSOS.some((r) => f[r.key] && !s[r.key]) &&
        (f.capacidade !== 'exata' || s.capacidade === 2) &&
        (f.capacidade !== 'grupo' || s.capacidade > 2),
    )
  }, [salas, filtroAplicado])

  const totalLivres = salas.filter((s) => s.status === 'Livre').length
  const proximaLiberacao = useMemo(() => {
    const tempos = salas.filter((s) => s.liberaEm).map((s) => s.liberaEm)
    return tempos.length ? Math.max(1, Math.ceil((Math.min(...tempos) - agora) / 60000)) : null
  }, [salas, agora])

  const aplicarFiltro = () => {
    if (filtro.inicio && filtro.fim && toMin(filtro.fim) <= toMin(filtro.inicio)) {
      notificar('O horário final deve ser maior que o inicial.', 'erro')
      return false
    }
    setFiltroAplicado({ ...filtro })
    return true
  }
  const limparFiltro = () => {
    setFiltro(FILTRO_INICIAL)
    setFiltroAplicado(null)
  }

  const iniciarReserva = (sala) => {
    if (usuario.reserva) {
      notificar('Você já possui uma reserva ativa. Devolva a sala antes de reservar outra.', 'erro')
      return setPagina('reserva')
    }
    setSalaSelecionada(sala)
    setPagina('confirmacao')
  }

  // Usa o horário do filtro quando válido; senão, 90 min a partir de agora
  const calcularPermanencia = () => {
    if (filtro.inicio && filtro.fim && toMin(filtro.fim) > toMin(filtro.inicio)) {
      return { inicio: filtro.inicio, fim: filtro.fim, minutos: toMin(filtro.fim) - toMin(filtro.inicio) }
    }
    const inicio = new Date()
    const fim = new Date(inicio.getTime() + DURACAO_PADRAO_MIN * 60000)
    return { inicio: fmtHora(inicio), fim: fmtHora(fim), minutos: DURACAO_PADRAO_MIN }
  }

  const confirmarAgendamento = () => {
    if (!salaSelecionada) return
    const { inicio, fim, minutos } = calcularPermanencia()
    const salaId = salaSelecionada.id
    setReserva({ salaId, inicio, fim, extraTotal: 0, endsAt: Date.now() + minutos * 60000 })
    setUsuario((u) => ({ ...u, reserva: salaId }))
    atualizarSala(salaId, { status: 'Ocupada', horarioLiberacao: fim })
    notificar(`Reserva da ${salaSelecionada.nome} confirmada!`)
    setPagina('reserva')
  }

  const aumentarTempo = (extra) => {
    if (!reserva) return
    if (reserva.extraTotal + extra > LIMITE_EXTRA_MIN) {
      return notificar(`Você só pode adicionar até ${LIMITE_EXTRA_MIN} minutos por reserva.`, 'erro')
    }
    const endsAt = reserva.endsAt + extra * 60000
    const novoFim = new Date(endsAt)
    if (novoFim.getHours() * 60 + novoFim.getMinutes() > FECHAMENTO_MIN || novoFim.getDate() !== new Date().getDate()) {
      return notificar('Conflito de horário: a biblioteca fecha às 22:30.', 'erro')
    }
    const fim = fmtHora(novoFim)
    setReserva({ ...reserva, endsAt, fim, extraTotal: reserva.extraTotal + extra })
    atualizarSala(reserva.salaId, { horarioLiberacao: fim })
    notificar(`Reserva estendida em +${extra} minutos!`)
  }

  const finalizarReserva = (automatico = false) => {
    if (!reserva) return
    const { nome } = salas.find((s) => s.id === reserva.salaId)
    atualizarSala(reserva.salaId, { status: 'Livre', horarioLiberacao: undefined })
    setUsuario((u) => ({ ...u, reserva: null }))
    setReserva(null)
    setSalaSelecionada(null)
    notificar(automatico ? `Tempo esgotado. ${nome} devolvida.` : `${nome} devolvida com sucesso!`)
    setPagina('studyhub')
  }

  const login = () => {
    setAutenticado(true)
    setPagina('inicio')
  }

  const value = {
    autenticado, login, logout: () => setAutenticado(false),
    dark, toggleDark: () => setDark((d) => !d),
    pagina, setPagina,
    usuario, salas, salasFiltradas, totalLivres, proximaLiberacao,
    filtro, setFiltro, filtroAplicado, aplicarFiltro, limparFiltro,
    salaSelecionada, iniciarReserva, calcularPermanencia, confirmarAgendamento,
    reserva, aumentarTempo, finalizarReserva,
    toast, notificar, dismissToast: () => setToast(null),
  }
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}
