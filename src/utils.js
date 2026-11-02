import { useEffect, useState } from 'react'
import { DISCIPLINAS } from './data/mockData.js'

export const pad = (n) => String(n).padStart(2, '0')
export const fmtHora = (d) => `${pad(d.getHours())}:${pad(d.getMinutes())}`
export const toMin = (hhmm) => {
  const [h, m] = hhmm.split(':').map(Number)
  return h * 60 + m
}

export const fmtTempo = (ms, comHoras = true) => {
  const s = Math.max(0, Math.floor(ms / 1000))
  const min = Math.floor(s / 60)
  const mmss = `${pad(comHoras ? min % 60 : min)}:${pad(s % 60)}`
  return comHoras ? `${pad(Math.floor(min / 60))}:${mmss}` : mmss
}

export const media = (campo) => Math.round(DISCIPLINAS.reduce((a, d) => a + d[campo], 0) / DISCIPLINAS.length)

/** Relógio que atualiza a cada segundo */
export const useAgora = () => {
  const [agora, setAgora] = useState(Date.now())
  useEffect(() => {
    const t = setInterval(() => setAgora(Date.now()), 1000)
    return () => clearInterval(t)
  }, [])
  return agora
}
