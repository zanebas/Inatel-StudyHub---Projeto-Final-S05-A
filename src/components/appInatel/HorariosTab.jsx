import { DIAS_SIGLAS, GRADE_HORARIOS } from '../../data/mockData.js'

const Aula = ({ texto }) => {
  const [codigo, ...turma] = texto.split(' ')
  return (
    <>
      {codigo}
      <br />
      {turma.join(' ')}
    </>
  )
}

export default function HorariosTab() {
  return (
    <div className="horarios-grid">
      <div className="horarios-grid__dia">HORA</div>
      {DIAS_SIGLAS.map((d, i) => (
        <div key={i} className="horarios-grid__dia">{d}</div>
      ))}
      {GRADE_HORARIOS.map(([hora, aulas]) => (
        <div key={hora} className="contents">
          <div className="horarios-grid__hora">{hora}</div>
          {aulas.map((aula, i) => (
            <div key={i} className="horarios-grid__cell">{aula && <span><Aula texto={aula} /></span>}</div>
          ))}
        </div>
      ))}
    </div>
  )
}
