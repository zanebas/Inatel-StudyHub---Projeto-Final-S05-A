import { useState } from 'react'
import { Search } from 'lucide-react'
import { AVISOS } from '../../data/mockData.js'

export default function AvisosTab() {
  const [busca, setBusca] = useState('')
  const lista = AVISOS.filter((a) => `${a.titulo} ${a.texto}`.toLowerCase().includes(busca.toLowerCase()))

  return (
    <>
      <div className="inatel-search">
        <label className="inatel-search__box">
          <Search size={20} />
          <input
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            placeholder="Buscar"
            className="inatel-search__input"
          />
        </label>
      </div>
      {lista.length === 0 ? (
        <p className="inatel-empty">Não há Informações.</p>
      ) : (
        lista.map((a) => (
          <article key={a.titulo} className="aviso-item">
            <div className="aviso-item__topo">
              <span className="aviso-item__tag">{a.tag}</span>
              <span className="aviso-item__data">{a.data}</span>
            </div>
            <h2 className="aviso-item__titulo">{a.titulo}</h2>
            <p className="aviso-item__texto">{a.texto}</p>
          </article>
        ))
      )}
    </>
  )
}
