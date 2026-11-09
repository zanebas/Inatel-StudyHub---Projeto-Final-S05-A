import { ChevronRight, User } from 'lucide-react'
import { useApp } from '../../context/AppContext.jsx'
import { ALUNO, MENU_SECOES } from '../../data/mockData.js'

export default function MenuTab() {
  const { setPagina, logout, notificar } = useApp()

  const abrir = (titulo, acao) => {
    if (acao === 'logout') return logout()
    if (acao) return setPagina(acao)
    notificar(`${titulo}: indisponível nesta versão.`, 'erro')
  }

  return (
    <>
      <h2 className="menu-section-title">ALUNO</h2>
      <div className="menu-aluno">
        <div className="flex flex-col items-center">
          <span className="menu-aluno__avatar"><User size={34} fill="currentColor" /></span>
          <button onClick={() => notificar('Edição de perfil indisponível nesta versão.', 'erro')} className="text-[15px] text-[#0a84ff]">
            Editar
          </button>
        </div>
        <div>
          <p className="text-[19px] text-white">{ALUNO.nome}</p>
          <p className="text-sm text-zinc-300">{ALUNO.email}</p>
        </div>
      </div>

      {MENU_SECOES.map(({ titulo, itens }) => (
        <section key={titulo}>
          <h2 className="menu-section-title">{titulo}</h2>
          {itens.map(([nome, descricao, acao]) => (
            <button key={nome} onClick={() => abrir(nome, acao)} className="menu-row">
              <span>
                <span className="menu-row__title block">{nome}</span>
                <span className="menu-row__desc block">{descricao}</span>
              </span>
              <ChevronRight size={20} className="shrink-0 text-zinc-500" />
            </button>
          ))}
        </section>
      ))}
    </>
  )
}
