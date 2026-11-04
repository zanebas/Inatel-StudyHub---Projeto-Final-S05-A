import { Search } from 'lucide-react'
import { useApp } from '../context/AppContext.jsx'
import { RECURSOS } from '../data/mockData.js'
import { ICONES } from '../components/RecursoBadge.jsx'
import { Card, PageHeader } from '../components/ui.jsx'

const Grupo = ({ titulo, children }) => (
  <Card className="p-5">
    <h3 className="mb-4 text-sm font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">{titulo}</h3>
    {children}
  </Card>
)

const inputCls = 'mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-inatel focus:ring-2 focus:ring-inatel/30 dark:border-slate-700 dark:bg-slate-800'

/** Tela 2: filtro de recursos, horário e capacidade */
export default function Filtro() {
  const { filtro, setFiltro, filtrarDisponiveis, limparFiltro, setPagina, salas, notificar } = useApp()
  const set = (patch) => setFiltro((f) => ({ ...f, ...patch }))

  const verificar = () => {
    const horario = { horarioEntrada: filtro.horarioEntrada, horarioSaida: filtro.horarioSaida }
    if (!filtrarDisponiveis(horario, filtro)) return
    setPagina('studyhub')
    notificar('Filtro aplicado! Lista de salas atualizada.')
  }

  const pill = (valor, label) => (
    <button
      type="button"
      onClick={() => set({ capacidade: filtro.capacidade === valor ? null : valor })}
      aria-pressed={filtro.capacidade === valor}
      className={`flex-1 rounded-full border px-4 py-2.5 text-sm font-semibold transition ${
        filtro.capacidade === valor
          ? 'border-inatel bg-inatel text-white'
          : 'border-slate-200 text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800'
      }`}
    >
      {label}
    </button>
  )

  return (
    <div className="mx-auto max-w-xl">
      <PageHeader titulo="Filtrar Salas" subtitulo="Refine sua busca por recursos e horário" voltarLabel="Voltar às salas" onVoltar={() => setPagina('studyhub')} />
      <div className="space-y-4">
        <Grupo titulo="Recursos da Sala">
          <div className="grid gap-2 sm:grid-cols-2">
            {RECURSOS.map(({ key, label }) => {
              const Icon = ICONES[key]
              return (
                <label key={key} className={`flex cursor-pointer items-center gap-3 rounded-xl border p-3 text-sm font-medium transition ${filtro[key] ? 'border-inatel bg-inatel/5 dark:bg-sky-400/10' : 'border-slate-200 dark:border-slate-700'}`}>
                  <input type="checkbox" checked={filtro[key]} onChange={(e) => set({ [key]: e.target.checked })} className="h-4 w-4 accent-[#005CA9]" />
                  <Icon size={16} className="text-slate-500" /> {label}
                </label>
              )
            })}
          </div>
        </Grupo>

        <Grupo titulo="Horário Desejado">
          <div className="grid grid-cols-2 gap-3">
            {[['horarioEntrada', 'Início'], ['horarioSaida', 'Fim']].map(([campo, rotulo]) => (
              <label key={campo} className="text-xs font-semibold text-slate-500">{rotulo}
                <input type="time" value={filtro[campo]} onChange={(e) => set({ [campo]: e.target.value })} className={inputCls} />
              </label>
            ))}
          </div>
          <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">Se informado, será usado como tempo de permanência na reserva.</p>
        </Grupo>

        <Grupo titulo="Capacidade de Alunos">
          <div className="flex gap-3">
            {pill('exata', '2 Alunos')}
            {pill('grupo', '2 ou mais alunos')}
          </div>
          <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">“2 ou mais alunos” exibe as salas de estudo em grupo (6 lugares).</p>
        </Grupo>

        <button onClick={verificar} className="flex w-full items-center justify-center gap-2 rounded-xl bg-inatel py-3.5 text-sm font-bold text-white shadow-lg shadow-inatel/30 transition hover:bg-inatel-dark">
          <Search size={16} /> Verificar Salas Disponíveis
        </button>
        <button onClick={() => { limparFiltro(); notificar(`Filtros limpos. ${salas.length} salas listadas.`) }} className="w-full text-sm font-semibold text-slate-500 hover:underline">
          Limpar filtros
        </button>
      </div>
    </div>
  )
}
