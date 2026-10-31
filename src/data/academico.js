// Dados acadêmicos do semestre (fonte única para Início, Horários, Notas e Frequências)
export const DISCIPLINAS = [
  { cod: 'G04 A', nome: 'Fundamentos de Gestão de Projetos', sigla: 'FGP', dia: 1, diaLabel: 'Seg', nota: 100, freq: 100 },
  { cod: 'S01 A', nome: 'Paradigmas da Programação', sigla: 'PP', dia: 2, diaLabel: 'Ter', nota: 100, freq: 100 },
  { cod: 'S05 A', nome: 'Interação Homem Máquina', sigla: 'IHM', dia: 3, diaLabel: 'Qua', nota: 100, freq: 100 },
  { cod: 'M03 A', nome: 'Cálculo Aplicado à Engenharia I', sigla: 'CAE I', dia: 4, diaLabel: 'Qui', nota: 100, freq: 100 },
  { cod: 'E08 A', nome: 'Eletrônica Digital Aplicada a Contadores e Sequenciadores', sigla: 'EDACS', dia: 5, diaLabel: 'Sex', nota: 100, freq: 100 },
  { cod: 'F01 A', nome: 'Física Newtoniana Clássica', sigla: 'FNC', dia: 5, diaLabel: 'Sex', nota: 100, freq: 100 },
]
export const HORARIO_AULA = '19:00 – 22:30'

export const media = (campo) => Math.round(DISCIPLINAS.reduce((a, d) => a + d[campo], 0) / DISCIPLINAS.length)

/** Texto de prévia para "Horários": aulas de hoje ou próxima aula. */
export function previaHorarios(hoje = new Date()) {
  const dia = hoje.getDay()
  const aulas = DISCIPLINAS.filter((d) => d.dia === dia)
  if (aulas.length) return `Hoje: ${aulas.map((d) => d.sigla).join(' e ')} às 19:00`
  for (let i = 1; i <= 7; i++) {
    const prox = DISCIPLINAS.filter((d) => d.dia === (dia + i) % 7)
    if (prox.length) return `Próxima: ${prox[0].diaLabel} · ${prox.map((d) => d.sigla).join(' e ')}`
  }
  return 'Sem aulas'
}
