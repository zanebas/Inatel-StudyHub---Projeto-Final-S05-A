import { Megaphone } from 'lucide-react'
import { DISCIPLINAS, HORARIO_AULA, media } from '../data/academico.js'

export const AVISOS = [
  { t: 'Parabéns, você foi aprovado na disciplina de Interação Homem Máquina, com a melhor nota da história!', d: 'Nota final 100. Excelente trabalho!', tag: 'Acadêmico', cor: 'blue', data: '31/10' },
  { t: 'Inscrições abertas: Maratona de Programação Inatel', d: 'Monte sua equipe e inscreva-se até 15/11 na Secretaria Acadêmica.', tag: 'Urgente', cor: 'red', data: '30/10' },
  { t: 'Biblioteca: horário estendido', d: 'Funcionamento até 22:30 durante o período de provas.', tag: 'Institucional', cor: 'amber', data: '28/10' },
]
const HORARIOS = DISCIPLINAS.map((d) => [d.cod, d.nome, d.diaLabel])
const NOTAS = DISCIPLINAS.map((d) => [`${d.cod} · ${d.nome}`, String(d.nota)])
const FREQ = DISCIPLINAS.map((d) => [`${d.cod} · ${d.nome}`, `${d.freq}%`])

const Box = ({ titulo, children }) => (
  <section className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
    <h2 className="mb-4 text-2xl font-extrabold">{titulo}</h2>
    <div className="divide-y divide-slate-100 dark:divide-slate-800">{children}</div>
  </section>
)
const Row = ({ a, b, c }) => (
  <div className="flex items-center justify-between gap-4 py-3 text-sm">
    <span className="font-medium">{a}</span>
    <span className="text-slate-500 dark:text-slate-400">{b}{c && ` · ${c}`}</span>
  </div>
)

export function Secundaria({ id }) {
  switch (id) {
    case 'avisos':
      return <Box titulo="Avisos">{AVISOS.map((a) => (
        <div key={a.t} className="flex gap-3 py-3"><Megaphone size={18} className="mt-0.5 text-inatel" /><div><p className="text-sm font-bold">{a.t}</p><p className="text-sm text-slate-500">{a.d}</p></div></div>
      ))}</Box>
    case 'horarios':
      return <Box titulo="Horários">{HORARIOS.map(([cod, m, d]) => <Row key={cod} a={`${cod} · ${m}`} b={`${d} · ${HORARIO_AULA}`} />)}</Box>
    case 'notas':
      return <Box titulo="Notas / Acadêmico">{NOTAS.map(([m, n]) => <Row key={m} a={m} b={`Nota ${n}`} />)}<Row a={<b>Média Semestral</b>} b={<b>{media('nota')}</b>} /></Box>
    case 'frequencias':
      return <Box titulo="Frequências">{FREQ.map(([m, f]) => <Row key={m} a={m} b={f} />)}<Row a={<b>Presença Geral</b>} b={<b>{media('freq')}%</b>} /></Box>
    case 'regras':
      return <Box titulo="Regras da Biblioteca">
        <Row a="Funcionamento" b="07:30 às 22:30" />
        <Row a="Tolerância para ocupar a sala" b="10 minutos" />
        <Row a="Extensão máxima de reserva" b="30 minutos" />
        <Row a="Reservas simultâneas" b="1 por aluno" />
      </Box>
    default:
      return <Box titulo="Perfil">
        <Row a="Nome" b="Samuel Zanebone" />
        <Row a="Matrícula" b="851" />
        <Row a="Curso" b="Engenharia de Software – 4º período" />
      </Box>
  }
}

