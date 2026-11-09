import { useApp } from '../context/AppContext.jsx'
import { RECURSOS } from '../data/mockData.js'
import { Button, Card, PageHeader } from '../components/ui.jsx'

/** Tela 2: filtro de recursos, horário e capacidade (wireframe) */
export default function Filtro() {
  const { filtro, setFiltro, filtrarDisponiveis, limparFiltro, setPagina, notificar } = useApp()
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
      className={`filtro-pill ${filtro.capacidade === valor ? 'filtro-pill--active' : 'filtro-pill--inactive'}`}
    >
      {label}
    </button>
  )

  return (
    <div>
      <PageHeader onVoltar={() => setPagina('studyhub')} />

      <h2 className="wf-secao-titulo">Recursos da Sala</h2>
      <Card className="px-4 py-2">
        {RECURSOS.map(({ key, label }) => (
          <label key={key} className="wf-opcao">
            <input type="checkbox" checked={filtro[key]} onChange={(e) => set({ [key]: e.target.checked })} className="h-4 w-4 accent-[#0066cc]" />
            {label}
          </label>
        ))}
      </Card>

      <h2 className="wf-secao-titulo">Horário Desejado</h2>
      <Card className="p-4">
        <div className="wf-par">
          {[['horarioEntrada', 'Início'], ['horarioSaida', 'Fim']].map(([campo, rotulo]) => (
            <label key={campo} className="block text-center text-xs font-semibold text-zinc-500">{rotulo}
              <input type="time" value={filtro[campo]} onChange={(e) => set({ [campo]: e.target.value })} className="filtro-input mt-1" />
            </label>
          ))}
        </div>
      </Card>

      <Card className="mt-6 p-4">
        <h2 className="mb-3 text-center text-[17px] font-bold text-white">Capacidade de Alunos</h2>
        <div className="flex gap-3">
          {pill('exata', '2 Alunos')}
          {pill('grupo', '2 ou mais alunos')}
        </div>
      </Card>

      <div className="wf-acoes-coluna">
        <Button onClick={verificar} className="py-3">Verificar Salas Disponíveis</Button>
        <Button variant="outline" onClick={() => { limparFiltro(); notificar('Filtros limpos.') }} className="py-3">Limpar Filtros</Button>
      </div>
    </div>
  )
}
