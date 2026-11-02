import { LogOut, Megaphone } from 'lucide-react'
import { useApp } from '../context/AppContext.jsx'
import { AVISOS, DISCIPLINAS, HORARIOS_BIBLIOTECA, HORARIO_AULA, PERFIL, REGRAS } from '../data/mockData.js'
import { media } from '../utils.js'
import { Card } from '../components/ui.jsx'

const Box = ({ titulo, children }) => (
  <Card className="p-5">
    <h2 className="mb-4 text-2xl font-extrabold">{titulo}</h2>
    <div className="divide-y divide-slate-100 dark:divide-slate-800">{children}</div>
  </Card>
)

const Row = ({ a, b }) => (
  <div className="flex items-center justify-between gap-4 py-3 text-sm">
    <span className="font-medium">{a}</span>
    <span className="text-slate-500 dark:text-slate-400">{b}</span>
  </div>
)

const linhas = (pares) => pares.map(([a, b]) => <Row key={a} a={a} b={b} />)
const porDisciplina = (fn) => DISCIPLINAS.map((d) => <Row key={d.cod} {...fn(d)} />)
const titulo = (d) => `${d.cod} · ${d.nome}`

function Perfil() {
  const { logout } = useApp()
  return (
    <Box titulo="Perfil">
      {linhas(PERFIL)}
      <div className="pt-4">
        <button onClick={logout} className="flex items-center gap-2 rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-bold hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800">
          <LogOut size={16} /> Sair da conta
        </button>
      </div>
    </Box>
  )
}

const PAGINAS = {
  avisos: () => (
    <Box titulo="Avisos">
      {AVISOS.map((a) => (
        <div key={a.t} className="flex gap-3 py-3">
          <Megaphone size={18} className="mt-0.5 text-inatel" />
          <div><p className="text-sm font-bold">{a.t}</p><p className="text-sm text-slate-500">{a.d}</p></div>
        </div>
      ))}
    </Box>
  ),
  horarios: () => <Box titulo="Horários">{porDisciplina((d) => ({ a: titulo(d), b: `${d.diaLabel} · ${HORARIO_AULA}` }))}</Box>,
  notas: () => (
    <Box titulo="Notas / Acadêmico">
      {porDisciplina((d) => ({ a: titulo(d), b: `Nota ${d.nota}` }))}
      <Row a={<b>Média Semestral</b>} b={<b>{media('nota')}</b>} />
    </Box>
  ),
  frequencias: () => (
    <Box titulo="Frequências">
      {porDisciplina((d) => ({ a: titulo(d), b: `${d.freq}%` }))}
      <Row a={<b>Presença Geral</b>} b={<b>{media('freq')}%</b>} />
    </Box>
  ),
  regras: () => <Box titulo="Regras da Biblioteca">{linhas(REGRAS)}</Box>,
  biblioteca: () => <Box titulo="Horários da Biblioteca">{linhas(HORARIOS_BIBLIOTECA)}</Box>,
  perfil: () => <Perfil />,
}

export default function Secundaria({ id }) {
  return (PAGINAS[id] ?? PAGINAS.perfil)()
}
