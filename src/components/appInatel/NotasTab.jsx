import { BarChart3 } from 'lucide-react'
import { DISCIPLINAS, NOTAS_AVALIACOES } from '../../data/mockData.js'

export default function NotasTab() {
  return (
    <>
      {DISCIPLINAS.map(({ cod, nome }) => (
        <section key={cod}>
          <h2 className="notas-titulo">
            <span>{cod} - {nome}</span>
            <BarChart3 size={24} className="mt-1 shrink-0" aria-hidden />
          </h2>
          <div className="notas-table">
            <div className="notas-table__head">Avaliação</div>
            <div className="notas-table__head">Nota</div>
            {(NOTAS_AVALIACOES[cod] ?? []).map(([avaliacao, nota]) => (
              <div key={avaliacao} className="contents">
                <div className="notas-table__cell">{avaliacao}</div>
                <div className="notas-table__cell">{nota}</div>
              </div>
            ))}
          </div>
        </section>
      ))}
    </>
  )
}
