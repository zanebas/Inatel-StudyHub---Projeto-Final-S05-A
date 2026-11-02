import { useEffect, useRef, useState } from 'react'
import { BookOpen, DoorOpen, Home, LogOut, Megaphone, Menu, Timer } from 'lucide-react'
import { ATALHOS } from '../atalhos.js'
import { useApp } from '../context/AppContext.jsx'
import Toast from './Toast.jsx'

const ABAS = [
  { id: 'inicio', label: 'Início', curto: 'Início', icon: Home, paginas: ['inicio'] },
  { id: 'studyhub', label: 'StudyHub', curto: 'StudyHub', icon: DoorOpen, badge: 'Novo', paginas: ['studyhub', 'filtro', 'confirmacao'] },
  { id: 'reserva', label: 'Minhas Reservas', curto: 'Reservas', icon: Timer, paginas: ['reserva'] },
  { id: 'biblioteca', label: 'Biblioteca', curto: 'Biblioteca', icon: BookOpen, paginas: ['biblioteca', 'regras'] },
]

const MENU = [...ATALHOS, { id: 'avisos', icon: Megaphone, titulo: 'Avisos' }]

export default function Shell({ children }) {
  const { pagina, setPagina, usuario, logout } = useApp()
  const [menuAberto, setMenuAberto] = useState(false)
  const menuRef = useRef(null)

  useEffect(() => {
    if (!menuAberto) return
    const fechar = (e) => (e.type === 'keydown' ? e.key === 'Escape' && setMenuAberto(false) : !menuRef.current?.contains(e.target) && setMenuAberto(false))
    document.addEventListener('mousedown', fechar)
    document.addEventListener('keydown', fechar)
    return () => {
      document.removeEventListener('mousedown', fechar)
      document.removeEventListener('keydown', fechar)
    }
  }, [menuAberto])

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/90 backdrop-blur dark:border-slate-800 dark:bg-slate-900/90">
        <div className="flex w-full max-w-full items-center justify-between gap-4 px-4 py-2 md:px-8 md:py-3">
          <div className="flex shrink-0 items-center gap-3">
            <div ref={menuRef} className="relative shrink-0">
              <button
                onClick={() => setMenuAberto((o) => !o)}
                aria-label="Menu"
                aria-expanded={menuAberto}
                aria-haspopup="menu"
                className={`rounded-xl p-2 transition hover:bg-slate-100 dark:hover:bg-slate-800 ${menuAberto || MENU.some((m) => m.id === pagina) ? 'bg-inatel/10 text-inatel dark:text-sky-300' : 'text-slate-600 dark:text-slate-300'}`}
              >
                <Menu size={22} />
              </button>
              {menuAberto && (
                <div role="menu" className="absolute left-0 top-full z-50 mt-2 w-64 rounded-2xl border border-slate-200 bg-white p-2 shadow-xl dark:border-slate-700 dark:bg-slate-900">
                  {MENU.map(({ id, icon: Icon, titulo }) => (
                    <button
                      key={id}
                      role="menuitem"
                      onClick={() => { setPagina(id); setMenuAberto(false) }}
                      className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-semibold transition ${pagina === id ? 'bg-inatel/10 text-inatel dark:text-sky-300' : 'text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800'}`}
                    >
                      <Icon size={18} /> {titulo}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <button onClick={() => setPagina('inicio')} className="flex shrink-0 items-center gap-3 whitespace-nowrap" aria-label="Ir para o início">
              <img src="logo-inatel.png" alt="Inatel" className="h-7 w-auto dark:brightness-150 sm:h-8" />
              <span aria-hidden className="hidden h-6 w-px bg-slate-300 dark:bg-slate-700 md:block" />
              <span className="hidden text-left leading-tight md:block">
                <span className="block text-sm font-extrabold">Portal da Graduação</span>
              </span>
            </button>
          </div>

          <nav aria-label="Navegação principal" className="hidden items-center gap-[10px] md:flex">
            {ABAS.map(({ id, label, badge, paginas }) => {
              const ativa = paginas.includes(pagina)
              return (
                <button
                  key={id}
                  onClick={() => setPagina(id)}
                  aria-current={ativa ? 'page' : undefined}
                  className={`flex shrink-0 items-center gap-2 whitespace-nowrap rounded-full px-3 py-1.5 text-sm font-semibold transition ${
                    ativa
                      ? 'bg-inatel text-white shadow-md shadow-inatel/25'
                      : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
                  }`}
                >
                  {label}
                  {badge && (
                    <span className={`flex items-center gap-1 rounded-full border px-1.5 py-0.5 text-[10px] font-bold ${ativa ? 'border-white/40 bg-white/20 text-white' : 'border-inatel/30 bg-inatel/10 text-inatel dark:border-sky-400/40 dark:bg-sky-400/10 dark:text-sky-300'}`}>
                      <Megaphone size={10} /> {badge}
                    </span>
                  )}
                  {id === 'reserva' && usuario.reserva && <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />}
                </button>
              )
            })}
          </nav>

          <div className="flex shrink-0 items-center gap-2">
            <button
              onClick={() => setPagina('perfil')}
              title="Ver Perfil"
              className="flex shrink-0 items-center gap-3 whitespace-nowrap rounded-full border border-slate-200 bg-slate-50 py-1 pl-1 pr-1 transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700 md:pr-5"
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-inatel-dark text-xs font-bold text-white">SZ</span>
              <span className="hidden text-sm font-bold md:block">{usuario.nome}</span>
            </button>
            <button onClick={logout} title="Sair" aria-label="Sair" className="shrink-0 rounded-full p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800">
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[1200px] px-4 pb-28 pt-6 sm:px-8 md:py-8">{children}</main>

      <nav
        aria-label="Navegação inferior"
        className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-4 border-t border-slate-200 bg-white pb-[env(safe-area-inset-bottom)] dark:border-slate-800 dark:bg-slate-900 md:hidden"
      >
        {ABAS.map(({ id, curto, icon: Icon, badge, paginas }) => {
          const ativa = paginas.includes(pagina)
          return (
            <button
              key={id}
              onClick={() => setPagina(id)}
              aria-current={ativa ? 'page' : undefined}
              className={`relative flex flex-col items-center gap-1 py-2.5 text-[11px] font-semibold transition ${ativa ? 'text-inatel dark:text-sky-400' : 'text-slate-500 dark:text-slate-400'}`}
            >
              <span className="relative">
                <Icon size={22} />
                {badge && (
                  <span className="absolute -top-1.5 left-full ml-0.5 flex items-center gap-0.5 whitespace-nowrap rounded-full border border-inatel/30 bg-inatel/10 px-1 py-px text-[9px] font-bold text-inatel dark:border-sky-400/40 dark:bg-sky-400/10 dark:text-sky-300">
                    <Megaphone size={8} /> {badge}
                  </span>
                )}
                {id === 'reserva' && usuario.reserva && <span className="absolute -right-1 -top-0.5 h-2 w-2 animate-pulse rounded-full bg-emerald-500 ring-2 ring-white dark:ring-slate-900" />}
              </span>
              {curto}
              {ativa && <span className="absolute inset-x-6 top-0 h-0.5 rounded-full bg-inatel dark:bg-sky-400" />}
            </button>
          )
        })}
      </nav>
      <Toast />
    </div>
  )
}
