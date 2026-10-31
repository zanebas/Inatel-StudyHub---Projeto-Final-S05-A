import { CheckCircle2, TriangleAlert } from 'lucide-react'
import { useApp } from '../context/AppContext.jsx'
import { RecursoBadge, recursosDe } from '../components/RecursoBadge.jsx'
import { PageHeader } from './StudyHub.jsx'

/** TELA 3: Confirmação do agendamento */
export default function Confirmacao() {
  const { usuario, salaSelecionada: sala, calcularPermanencia, confirmarAgendamento, setPagina } = useApp()
  if (!sala) {
    return <PageHeader titulo="Confirmação do Agendamento" onVoltar={() => setPagina('studyhub')} voltarLabel="Voltar às salas" />
  }
  const { inicio, fim } = calcularPermanencia()
  const nomeSala = sala.descricao ? `${sala.nome} - ${sala.descricao}` : sala.nome

  const Linha = ({ rotulo, children }) => (
    <div className="flex flex-col gap-1 border-b border-slate-100 py-3 last:border-0 dark:border-slate-800 sm:flex-row sm:items-center sm:justify-between">
      <dt className="text-sm text-slate-500 dark:text-slate-400">{rotulo}</dt>
      <dd className="text-sm font-bold">{children}</dd>
    </div>
  )

  return (
    <div className="mx-auto max-w-xl">
      <PageHeader titulo="Confirmação do Agendamento" onVoltar={() => setPagina('studyhub')} voltarLabel="Voltar às salas" />
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-6">
        <dl>
          <Linha rotulo="Aluno">{usuario.nome} (Matrícula: {usuario.matricula})</Linha>
          <Linha rotulo="Sala Selecionada">{nomeSala}</Linha>
          <Linha rotulo="Tempo de Permanência">{inicio} às {fim}</Linha>
          <Linha rotulo="Capacidade">{sala.capacidade} alunos</Linha>
        </dl>
        <div className="mt-4 rounded-xl bg-slate-50 p-4 dark:bg-slate-800/60">
          <p className="mb-2 text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">Recursos Incluídos</p>
          <div className="flex flex-wrap gap-2">
            {recursosDe(sala).map((r) => <RecursoBadge key={r} tipo={r} grande />)}
            {recursosDe(sala).length === 0 && <span className="text-sm text-slate-500">Sem recursos adicionais</span>}
          </div>
        </div>

        <div role="note" className="mt-5 flex gap-3 rounded-xl border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900 dark:border-amber-500/40 dark:bg-amber-500/10 dark:text-amber-200">
          <TriangleAlert size={20} className="mt-0.5 shrink-0" />
          <p>
            <b>Aviso de Regra/Tolerância:</b> O aluno tem até 10 minutos após o início do horário para ocupar a sala presencialmente na biblioteca. Após esse período sem confirmação presencial, a reserva é cancelada automaticamente.
          </p>
        </div>

        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row">
          <button onClick={() => setPagina('studyhub')} className="flex-1 rounded-xl border border-slate-300 py-3 text-sm font-bold hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800">
            Cancelar / Voltar
          </button>
          <button onClick={confirmarAgendamento} className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-inatel py-3 text-sm font-bold text-white shadow-lg shadow-inatel/30 hover:bg-inatel-dark">
            <CheckCircle2 size={16} /> Confirmar Agendamento
          </button>
        </div>
      </section>
    </div>
  )
}

