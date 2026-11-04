import { CheckCircle2, TriangleAlert } from 'lucide-react'
import { useApp } from '../context/AppContext.jsx'
import { ListaRecursos } from '../components/RecursoBadge.jsx'
import { Button, Card, PageHeader } from '../components/ui.jsx'

const Linha = ({ rotulo, children }) => (
  <div className="flex flex-col gap-1 border-b border-slate-100 py-3 last:border-0 dark:border-slate-800 sm:flex-row sm:items-center sm:justify-between">
    <dt className="text-sm text-slate-500 dark:text-slate-400">{rotulo}</dt>
    <dd className="text-sm font-bold">{children}</dd>
  </div>
)

/** Tela 3: confirmação do agendamento */
export default function Confirmacao() {
  const { usuario, salaSelecionada: sala, calcularPermanencia, reservarSala, setPagina } = useApp()
  const voltar = () => setPagina('studyhub')
  const header = <PageHeader titulo="Confirmação do Agendamento" onVoltar={voltar} voltarLabel="Voltar às salas" />
  if (!sala) return header

  const { horarioEntrada, horarioSaida } = calcularPermanencia()
  const tituloSala = sala.descricao ? `Sala ${sala.numero} - ${sala.descricao}` : `Sala ${sala.numero}`
  return (
    <div className="mx-auto max-w-xl">
      {header}
      <Card className="p-5 shadow-sm sm:p-6">
        <dl>
          <Linha rotulo="Aluno">{usuario.nome} (Matrícula: {usuario.matricula})</Linha>
          <Linha rotulo="Sala Selecionada">{tituloSala}</Linha>
          <Linha rotulo="Tempo de Permanência">{horarioEntrada} às {horarioSaida}</Linha>
          <Linha rotulo="Capacidade">{sala.capacidade} alunos</Linha>
        </dl>
        <div className="mt-4 rounded-xl bg-slate-50 p-4 dark:bg-slate-800/60">
          <p className="mb-2 text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">Recursos Incluídos</p>
          <div className="flex flex-wrap gap-2">
            <ListaRecursos sala={sala} grande />
          </div>
        </div>

        <div className="mt-5 flex flex-col-reverse gap-3 sm:flex-row">
          <Button variant="outline" onClick={voltar} className="flex-1 py-3">Cancelar / Voltar</Button>
          <Button onClick={() => reservarSala(usuario, sala)} className="flex flex-1 items-center justify-center gap-2 py-3 shadow-lg shadow-inatel/30">
            <CheckCircle2 size={16} /> Confirmar Agendamento
          </Button>
        </div>

        <div role="note" className="aviso-tolerancia">
          <TriangleAlert size={20} className="mt-0.5 shrink-0" />
          <p>
            <b>Aviso de Regra/Tolerância:</b> O aluno tem até 10 minutos após o início do horário para ocupar a sala presencialmente na biblioteca. Após esse período sem confirmação presencial, a reserva é cancelada automaticamente.
          </p>
        </div>
      </Card>
    </div>
  )
}
