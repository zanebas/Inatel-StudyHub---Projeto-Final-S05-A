import { useApp } from '../context/AppContext.jsx'
import { RECURSOS } from '../data/mockData.js'
import { recursosDe } from '../components/RecursoBadge.jsx'
import { Button, Card, PageHeader } from '../components/ui.jsx'

const rotuloDe = Object.fromEntries(RECURSOS.map((r) => [r.key, r.label]))

/** Tela 3: confirmação do agendamento (wireframe + identidade visual do app) */
export default function Confirmacao() {
  const { usuario, salaSelecionada: sala, calcularPermanencia, reservarSala, setPagina } = useApp()
  const voltar = () => setPagina('studyhub')
  const header = <PageHeader titulo="Confirmação do Agendamento" onVoltar={voltar} />
  if (!sala) return header

  const { horarioEntrada, horarioSaida } = calcularPermanencia()
  return (
    <div>
      {header}
      <Card className="mx-auto mt-5 max-w-md p-5">
        <div className="wf-par">
          <p className="wf-box"><span className="wf-box__rotulo">Nome:</span> {usuario.nome}</p>
          <p className="wf-box"><span className="wf-box__rotulo">Matrícula:</span> {usuario.matricula}</p>
        </div>

        <p className="wf-box mx-auto mt-6 w-3/4 max-w-[240px] py-3.5">
          <span className="wf-box__rotulo">Sala Selecionada:</span> Sala {sala.numero}
        </p>

        <p className="wf-box mx-auto mt-6 w-11/12 max-w-[280px] py-3.5">
          <span className="wf-box__rotulo">Tempo de Permanência:</span> {horarioEntrada} às {horarioSaida}
        </p>

        <div className="wf-box mx-auto mt-6 w-11/12 max-w-[280px] p-4">
          <p className="mb-3 text-[15px] font-bold text-[#0066cc]">Recursos Incluídos</p>
          <div className="space-y-2.5">
            {recursosDe(sala).map((r) => (
              <p key={r} className="rounded-md border border-zinc-500 bg-black py-2 text-sm font-medium text-white">
                {rotuloDe[r]}
              </p>
            ))}
          </div>
        </div>

        <div className="wf-acoes">
          <Button variant="outline" onClick={voltar} className="px-2 py-2.5">
            Cancelar/Voltar
          </Button>
          <Button onClick={() => reservarSala(usuario, sala)} className="border border-zinc-500 px-2 py-2.5">
            Confirmar Agendamento
          </Button>
        </div>

        <div role="note" className="aviso-tolerancia">
          <p>
            <b className="text-[#0066cc]">Aviso de Regra/Tolerância:</b> O aluno tem até 10 minutos após o início do horário para ocupar a sala presencialmente na biblioteca. Após esse período sem confirmação presencial, a reserva é cancelada automaticamente.
          </p>
        </div>
      </Card>
    </div>
  )
}
