import { useState } from 'react'
import { ArrowRight, DoorOpen, Eye, EyeOff, Lock, Moon, ShieldCheck, Sun } from 'lucide-react'
import { useApp } from '../context/AppContext.jsx'

export default function Login() {
  const { login, dark, toggleDark, totalLivres } = useApp()
  const [verSenha, setVerSenha] = useState(false)

  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-gradient-to-br from-[#003B73] via-[#005CA9] to-[#002850] text-white">
      {/* Decoração: grade técnica + círculos translúcidos */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.12]"
        style={{
          backgroundImage:
            'linear-gradient(to right, #fff 1px, transparent 1px), linear-gradient(to bottom, #fff 1px, transparent 1px)',
          backgroundSize: '48px 48px',
          maskImage: 'radial-gradient(ellipse at center, black 30%, transparent 75%)',
          WebkitMaskImage: 'radial-gradient(ellipse at center, black 30%, transparent 75%)',
        }}
      />
      <div aria-hidden className="pointer-events-none absolute -left-32 -top-32 h-96 w-96 rounded-full border border-white/20 bg-white/5" />
      <div aria-hidden className="pointer-events-none absolute -bottom-40 -right-24 h-[30rem] w-[30rem] rounded-full border border-white/15 bg-white/5" />
      <div aria-hidden className="pointer-events-none absolute bottom-24 left-[12%] hidden h-24 w-24 rounded-full border border-white/20 md:block" />

      {/* Seletor de tema */}
      <button
        onClick={toggleDark}
        aria-label="Alternar tema claro/escuro"
        className="absolute right-4 top-4 z-10 flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-3 py-2 text-xs font-semibold backdrop-blur transition hover:bg-white/20 sm:right-6 sm:top-6"
      >
        {dark ? <Sun size={14} /> : <Moon size={14} />}
        <span className="hidden sm:inline">{dark ? 'Claro' : 'Escuro'}</span>
      </button>

      {/* Card central */}
      <main className="relative z-[1] flex flex-1 items-center justify-center px-4 py-16">
        <form
          onSubmit={(e) => {
            e.preventDefault()
            login()
          }}
          className="w-full max-w-md rounded-3xl bg-white/95 p-7 text-slate-900 shadow-2xl backdrop-blur-xl dark:bg-slate-900/90 dark:text-slate-100 sm:p-9"
        >
          <div className="flex flex-col items-center text-center">
            <h1 className="text-4xl font-extrabold italic tracking-tight text-inatel dark:text-sky-400">Inatel</h1>
            <span className="mt-3 inline-flex items-center gap-2 rounded-full bg-inatel/10 px-3 py-1 text-[11px] font-bold text-inatel dark:bg-sky-400/15 dark:text-sky-300">
              Portal do Aluno <span aria-hidden>•</span> Inatel StudyHub
            </span>
            <h2 className="mt-5 text-2xl font-extrabold">Bem-vindo de volta</h2>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Acesse para gerenciar suas aulas e salas de estudo</p>
          </div>

          {/* Identificação do aluno */}
          <div className="mt-7 rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800/60">
            <div className="flex items-center gap-3">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-inatel-light to-[#003B73] text-sm font-bold text-white ring-4 ring-white dark:ring-slate-800">
                SZ
              </span>
              <div className="min-w-0 leading-tight">
                <p className="truncate text-sm font-bold">Samuel Zanebone</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">Engenharia de Software</p>
              </div>
            </div>
            <label htmlFor="matricula" className="mt-4 block text-[11px] font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">
              Matrícula
            </label>
            <div className="mt-1.5 flex items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-2.5 dark:border-slate-700 dark:bg-slate-900">
              <input id="matricula" defaultValue="851" readOnly className="w-full bg-transparent text-sm font-semibold tracking-wider outline-none" />
              <Lock size={14} className="text-slate-400" aria-hidden />
            </div>
          </div>

          {/* Senha */}
          <label htmlFor="senha" className="mt-5 block text-[11px] font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">
            Senha
          </label>
          <div className="mt-1.5 flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 focus-within:border-inatel focus-within:ring-2 focus-within:ring-inatel/30 dark:border-slate-700 dark:bg-slate-800">
            <Lock size={16} className="text-slate-400" />
            <input
              id="senha"
              type={verSenha ? 'text' : 'password'}
              defaultValue="inatel"
              readOnly
              className="w-full bg-transparent text-sm tracking-[0.3em] outline-none"
            />
            <button
              type="button"
              aria-label={verSenha ? 'Ocultar senha' : 'Mostrar senha'}
              onClick={() => setVerSenha(!verSenha)}
              className="text-slate-400 transition hover:text-inatel"
            >
              {verSenha ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>

          <button
            type="submit"
            className="mt-7 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#005CA9] to-[#0077E6] px-5 py-3.5 text-sm font-bold text-white shadow-lg shadow-inatel/30 transition duration-200 hover:-translate-y-0.5 hover:shadow-xl hover:brightness-110 focus:outline-none focus:ring-4 focus:ring-inatel/30 active:translate-y-0 active:scale-[0.98]"
          >
            Entrar no Portal <ArrowRight size={18} />
          </button>

          <p className="mt-5 flex items-center justify-center gap-1.5 text-center text-xs text-slate-500 dark:text-slate-400">
            <ShieldCheck size={13} className="shrink-0" /> Ambiente acadêmico seguro • Credenciais pré-validadas
          </p>
        </form>
      </main>

      {/* Rodapé */}
      <footer className="relative z-[1] flex flex-col items-center gap-2 px-4 pb-6 text-center text-xs text-white/70">
        <p className="max-w-md text-[11px] italic text-white/60">
          Talento gera Tecnologia. Tecnologia gera Transformação. E assim construímos o futuro.
        </p>
        <p className="flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 backdrop-blur">
          <DoorOpen size={13} /> Biblioteca Inatel: {totalLivres} salas de estudo livres agora
        </p>
        <p>© 2026 Instituto Nacional de Telecomunicações</p>
      </footer>
    </div>
  )
}
