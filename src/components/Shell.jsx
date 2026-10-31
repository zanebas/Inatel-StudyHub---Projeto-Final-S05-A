import { Bell, BookOpen, CalendarDays, ClipboardList, Home, LogOut, Megaphone, Menu, Moon, Sun, Timer, User, Users, X, ChevronDown } from 'lucide-react'
import { useState } from 'react'
import { useApp } from '../context/AppContext.jsx'
import Toast from './Toast.jsx'

const STUDY_PAGES = ['studyhub', 'filtro', 'confirmacao']

export default function Shell({ children }) {
  const { dark, toggleDark, pagina, setPagina, usuario, logout } = useApp()
  const [aberto, setAberto] = useState(false)

  const itens = [
    { id: 'inicio', label: 'Início', icon: Home },
    { id: 'studyhub', label: 'Inatel StudyHub', icon: Users, destaque: 'StudyHub' },
    ...(usuario.reserva ? [{ id: 'reserva', label: 'Minha Reserva', icon: Timer, ativo: true }] : []),
    { id: 'avisos', label: 'Avisos', icon: Megaphone, badge: 3 },
    { id: 'horarios', label: 'Horários', icon: CalendarDays },
    { id: 'notas', label: 'Notas / Acadêmico', icon: BookOpen },
    { id: 'frequencias', label: 'Frequências', icon: ClipboardList },
    { id: 'perfil', label: 'Perfil', icon: User },
  ]
  const ativa = (id) => pagina === id || (id === 'studyhub' && STUDY_PAGES.includes(pagina))
  const ir = (id) => {
    setPagina(id)
    setAberto(false)
  }

  const nav = (
    <nav className="flex flex-col gap-1 p-4">
      {itens.map(({ id, label, icon: Icon, destaque, badge, ativo }) => (
        <button
          key={id}
          onClick={() => ir(id)}
          aria-current={ativa(id) ? 'page' : undefined}
          className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-semibold transition ${
            ativa(id)
              ? 'bg-inatel/10 text-inatel dark:bg-sky-400/10 dark:text-sky-300'
              : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
          }`}
        >
          <Icon size={18} />
          <span className="flex-1">{label}</span>
          {destaque && <span className="rounded-full bg-inatel px-2 py-0.5 text-[10px] font-bold uppercase text-white">Novo</span>}
          {badge && <span className="rounded-full bg-red-100 px-2 py-0.5 text-[10px] font-bold text-red-600 dark:bg-red-500/20 dark:text-red-300">{badge}</span>}
          {ativo && <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />}
        </button>
      ))}
    </nav>
  )

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-slate-200 bg-white/90 px-4 py-3 backdrop-blur dark:border-slate-800 dark:bg-slate-900/90 ">
        <button className="rounded-lg p-2 hover:bg-slate-100 dark:hover:bg-slate-800 lg:hidden" aria-label="Abrir menu" onClick={() => setAberto(true)}>
          <Menu size={22} />
        </button>
        <img src="logo-inatel.png" alt="Inatel" className="mr-1 h-7 w-auto shrink-0 sm:h-8 lg:mr-6 dark:brightness-150" />
        <div className="mr-auto leading-tight">
          <p className="hidden text-[11px] text-slate-500 dark:text-slate-400 sm:block">Portal do Aluno</p>
          <p className="text-sm font-bold">
Portal da Graduação
          </p>
        </div>
        <button
          onClick={toggleDark}
          className="flex items-center gap-2 rounded-full border border-slate-200 px-3 py-1.5 text-xs font-semibold hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800"
          aria-label="Alternar tema"
        >
          {dark ? <Sun size={14} /> : <Moon size={14} />}
          <span className="hidden sm:inline">{dark ? 'Claro' : 'Escuro'}</span>
        </button>
        <button className="relative rounded-full p-2 hover:bg-slate-100 dark:hover:bg-slate-800" aria-label="Notificações" onClick={() => ir('avisos')}>
          <Bell size={18} />
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-red-500" />
        </button>
        <button onClick={logout} title="Sair" className="flex items-center gap-3 rounded-xl p-1 pr-2 hover:bg-slate-100 dark:hover:bg-slate-800">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-inatel text-xs font-bold text-white">SZ</span>
          <span className="hidden text-left leading-tight md:block">
            <span className="block text-sm font-bold">{usuario.nome}</span>
            <span className="block text-[11px] text-slate-500 dark:text-slate-400">Engenharia de Software - 4º período</span>
          </span>
          <ChevronDown size={14} className="hidden text-slate-400 md:block" />
        </button>
      </header>

      {/* Sidebar desktop */}
      <aside className="fixed bottom-0 left-0 top-16 z-20 hidden w-64 flex-col border-r border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 lg:flex">
        {nav}
        <button onClick={logout} className="mx-4 mt-auto mb-4 flex items-center gap-2 rounded-xl px-3 py-2 text-sm text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800">
          <LogOut size={16} /> Sair
        </button>
      </aside>

      {/* Sidebar mobile (drawer) */}
      {aberto && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setAberto(false)} />
          <aside className="absolute inset-y-0 left-0 w-72 overflow-y-auto bg-white dark:bg-slate-900">
            <div className="flex items-center justify-between px-6 pt-5">
              <img src="logo-inatel.png" alt="Inatel" className="h-8 w-auto" />
              <button onClick={() => setAberto(false)} aria-label="Fechar menu"><X size={20} /></button>
            </div>
            {nav}
          </aside>
        </div>
      )}

      <main className="px-4 py-6 sm:px-8 lg:pl-[17rem]">
        <div className="mx-auto max-w-5xl lg:px-8">{children}</div>
      </main>
      <Toast />
    </div>
  )
}

