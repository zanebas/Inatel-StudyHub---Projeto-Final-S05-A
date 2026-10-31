import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'

/**
 * Estado global do Inatel StudyHub.
 * Reflete o modelo de domínio (UML): Usuario, SalaEstudo e Reserva.
 */

export const RECURSOS = [
  { key: 'arCondicionado', label: 'Ar-Condicionado' },
  { key: 'lousa', label: 'Lousa' },
  { key: 'tv', label: 'TV' },
  { key: 'computador', label: 'Computador' },
]

const emMin = (min) => Date.now() + min * 60000
const hhmm = (ms) => {
  const d = new Date(ms)
  return `${pad(d.getHours())}:${pad(d.getMinutes())}`
}

const criarSalasIniciais = () => [
  { id: 1, nome: 'Sala 1', status: 'Livre', arCondicionado: false, tv: true, lousa: false, computador: false, capacidade: 2 },
  { id: 2, nome: 'Sala 2', status: 'Ocupada', arCondicionado: false, tv: true, lousa: false, computador: false, capacidade: 2, horarioLiberacao: hhmm(emMin(8)), liberaEm: emMin(8) },
  { id: 3, nome: 'Sala 3', status: 'Ocupada', arCondicionado: false, tv: false, lousa: false, computador: true, capacidade: 2, horarioLiberacao: hhmm(emMin(15)), liberaEm: emMin(15) },
  { id: 4, nome: 'Sala 4', descricao: 'Estudo em Grupo', status: 'Livre', arCondicionado: true, tv: true, lousa: true, computador: false, capacidade: 6 },
  { id: 5, nome: 'Sala 5', descricao: 'Estudo em Grupo', status: 'Livre', arCondicionado: true, tv: true, lousa: false, computador: true, capacidade: 6 },
  { id: 6, nome: 'Sala 6', status: 'Ocupada', arCondicionado: false, tv: true, lousa: true, computador: false, capacidade: 6, horarioLiberacao: hhmm(emMin(25)), liberaEm: emMin(25) },
]

const USUARIO_INICIAL = { nome: 'Samuel Zanebone', matricula: 851, pendencia: false, reserva: null }

export const FILTRO_INICIAL = {
  arCondicionado: false,
  lousa: false,
  tv: false,
  computador: false,
  inicio: '',
  fim: '',
  capacidade: null, // null | 'exata' (2 alunos) | 'grupo' (2 ou mais alunos / salas de grupo)
}

const DURACAO_PADRAO_MIN = 90
const FECHAMENTO_MIN = 22 * 60 + 30 // biblioteca fecha 22:30
export const LIMITE_EXTRA_MIN = 30 // máximo acumulado que pode ser adicionado por reserva

export const pad = (n) => String(n).padStart(2, '0')
export const fmtHora = (d) => `${pad(d.getHours())}:${pad(d.getMinutes())}`
const toMin = (hhmm) => {
  const [h, m] = hhmm.split(':').map(Number)
  return h * 60 + m
}

const AppContext = createContext(null)
export const useApp = () => useContext(AppContext)

export function AppProvider({ children }) {
  const [autenticado, setAutenticado] = useState(false)
  const [dark, setDark] = useState(false) // sempre inicia no tema claro
  const [pagina, setPagina] = useState('inicio') // inicio | studyhub | filtro | confirmacao | reserva | avisos | ...
  const [usuario, setUsuario] = useState(USUARIO_INICIAL)
  const [salas, setSalas] = useState(criarSalasIniciais)
  const [filtro, setFiltro] = useState(FILTRO_INICIAL)
  const [filtroAplicado, setFiltroAplicado] = useState(null) // null = sem filtro ativo
  const [salaSelecionada, setSalaSelecionada] = useState(null)
  const [reserva, setReserva] = useState(null) // { salaId, inicio, fim, endsAt, minutosTotais }
  const [toast, setToast] = useState(null)
  const [agora, setAgora] = useState(Date.now())

  // Relógio global: atualiza contagens e libera salas cujo término previsto já passou.
  useEffect(() => {
    const t = setInterval(() => {
      const n = Date.now()
      setAgora(n)
      setSalas((ss) =>
        ss.some((s) => s.liberaEm && s.liberaEm <= n)
          ? ss.map((s) => (s.liberaEm && s.liberaEm <= n ? { ...s, status: 'Livre', horarioLiberacao: undefined, liberaEm: undefined } : s))
          : ss,
      )
    }, 5000)
    return () => clearInterval(t)
  }, [])

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark)
  }, [dark])

  const notificar = useCallback((mensagem, tipo = 'sucesso') => {
    setToast({ mensagem, tipo, id: Date.now() })
  }, [])

  useEffect(() => {
    if (!toast) return
    const t = setTimeout(() => setToast(null), 4000)
    return () => clearTimeout(t)
  }, [toast])

  const login = () => {
    setAutenticado(true)
    setPagina('inicio')
  }
  const logout = () => {
    setAutenticado(false)
  }

  const salasFiltradas = useMemo(() => {
    if (!filtroAplicado) return salas
    const f = filtroAplicado
    return salas.filter((s) => {
      if (RECURSOS.some((r) => f[r.key] && !s[r.key])) return false
      if (f.capacidade === 'exata' && s.capacidade !== 2) return false
      if (f.capacidade === 'grupo' && s.capacidade <= 2) return false
      return true
    })
  }, [salas, filtroAplicado])

  const totalLivres = salas.filter((s) => s.status === 'Livre').length
  const proximaLiberacao = useMemo(() => {
    const tempos = salas.filter((s) => s.status === 'Ocupada' && s.liberaEm).map((s) => s.liberaEm)
    if (!tempos.length) return null
    return Math.max(1, Math.ceil((Math.min(...tempos) - agora) / 60000)) // minutos
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
      setPagina('reserva')
      return
    }
    setSalaSelecionada(sala)
    setPagina('confirmacao')
  }

  /** Calcula o intervalo da permanência (usa o horário do filtro quando válido). */
  const calcularPermanencia = () => {
    const agora = new Date()
    const f = filtro
    if (f.inicio && f.fim && toMin(f.fim) > toMin(f.inicio)) {
      return { inicio: f.inicio, fim: f.fim, minutos: toMin(f.fim) - toMin(f.inicio) }
    }
    const fim = new Date(agora.getTime() + DURACAO_PADRAO_MIN * 60000)
    return { inicio: fmtHora(agora), fim: fmtHora(fim), minutos: DURACAO_PADRAO_MIN }
  }

  const confirmarAgendamento = () => {
    if (!salaSelecionada) return
    const { inicio, fim, minutos } = calcularPermanencia()
    const r = { salaId: salaSelecionada.id, inicio, fim, minutosTotais: minutos, extraTotal: 0, endsAt: Date.now() + minutos * 60000 }
    setReserva(r)
    setUsuario((u) => ({ ...u, reserva: r.salaId }))
    setSalas((ss) => ss.map((s) => (s.id === r.salaId ? { ...s, status: 'Ocupada', horarioLiberacao: fim } : s)))
    notificar(`Reserva da ${salaSelecionada.nome} confirmada!`)
    setPagina('reserva')
  }

  const aumentarTempo = (extra = 30) => {
    if (!reserva) return
    const novoFim = new Date(reserva.endsAt + extra * 60000)
    const minutosFim = novoFim.getHours() * 60 + novoFim.getMinutes()
    if ((reserva.extraTotal || 0) + extra > LIMITE_EXTRA_MIN) {
      notificar(`Você só pode adicionar até ${LIMITE_EXTRA_MIN} minutos por reserva.`, 'erro')
      return
    }
    if (minutosFim > FECHAMENTO_MIN || novoFim.getDate() !== new Date().getDate()) {
      notificar('Conflito de horário: a biblioteca fecha às 22:30.', 'erro')
      return
    }
    const nova = { ...reserva, endsAt: reserva.endsAt + extra * 60000, minutosTotais: reserva.minutosTotais + extra, extraTotal: (reserva.extraTotal || 0) + extra, fim: fmtHora(novoFim) }
    setReserva(nova)
    setSalas((ss) => ss.map((s) => (s.id === nova.salaId ? { ...s, horarioLiberacao: nova.fim } : s)))
    notificar(`Reserva estendida em +${extra} minutos!`)
  }

  const finalizarReserva = (automatico = false) => {
    if (!reserva) return
    const id = reserva.salaId
    const nome = salas.find((s) => s.id === id)?.nome
    setSalas((ss) => ss.map((s) => (s.id === id ? { ...s, status: 'Livre', horarioLiberacao: undefined } : s)))
    setUsuario((u) => ({ ...u, reserva: null }))
    setReserva(null)
    setSalaSelecionada(null)
    notificar(automatico ? `Tempo esgotado. ${nome} devolvida.` : `${nome} devolvida com sucesso!`)
    setPagina('studyhub')
  }

  const value = {
    autenticado, login, logout,
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

