import { BarChart2, BookOpen, Clock, Mail, Menu } from 'lucide-react'

const ABAS = [
  { id: 'avisos', label: 'Avisos', icon: Mail },
  { id: 'horarios', label: 'Horários', icon: Clock },
  { id: 'notas', label: 'Notas', icon: BarChart2 },
  { id: 'studyhub', label: 'StudyHub', icon: BookOpen, novo: true },
  { id: 'menu', label: 'Menu', icon: Menu },
]

export default function InatelBottomNav({ ativa, onSelect }) {
  return (
    <nav aria-label="Navegação inferior" className="inatel-bottom-nav">
      <div className="inatel-bottom-nav__inner">
        {ABAS.map(({ id, label, icon: Icon, novo }) => (
          <button
            key={id}
            onClick={() => onSelect(id)}
            aria-current={ativa === id ? 'page' : undefined}
            className={`inatel-nav-item ${ativa === id ? 'inatel-nav-item--active' : ''}`}
          >
            <span className="relative">
              <Icon size={24} />
              {novo && <span className="inatel-nav-novo">Novo</span>}
            </span>
            {label}
          </button>
        ))}
      </div>
    </nav>
  )
}
