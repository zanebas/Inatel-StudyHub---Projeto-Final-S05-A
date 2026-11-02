import { useState } from 'react'
import { ArrowRight, Eye, EyeOff, Lock } from 'lucide-react'
import { useApp } from '../context/AppContext.jsx'

const rotulo = 'block text-[11px] font-bold uppercase tracking-wide text-slate-500'
const campo = 'flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3'

export default function Login() {
  const { login } = useApp()
  const [verSenha, setVerSenha] = useState(false)

  return (
    <div
      className="flex min-h-screen flex-col overflow-x-hidden bg-[#020A28] bg-no-repeat text-slate-900 [background-position:center_bottom_28px] [background-size:100%_auto] md:bg-cover md:bg-center"
      style={{
        backgroundImage:
          "linear-gradient(to bottom, rgba(2, 10, 40, 0.35), rgba(2, 10, 40, 0.50)), url('campus-inatel.jpg')",
      }}
    >
      <main className="flex flex-1 items-center justify-center px-4 pb-24 pt-8 md:py-12">
        <form
          onSubmit={(e) => {
            e.preventDefault()
            login()
          }}
          className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-7 shadow-2xl shadow-slate-900/20 sm:p-9"
        >
          <div className="flex flex-col items-center text-center">
            <img src="logo-inatel.png" alt="Inatel" className="h-9 w-auto" />
            <span className="mt-3 inline-flex items-center gap-2 rounded-full bg-inatel/10 px-3 py-1 text-[11px] font-bold text-inatel">
              Portal do Aluno
            </span>
            <h2 className="mt-5 text-2xl font-extrabold text-slate-900">Bem-vindo de volta</h2>
            <p className="mt-1 text-sm text-slate-500">Acesse para gerenciar sua vida acadêmica e ao novo Inatel StudyHub</p>
          </div>

          <div className="mt-7 rounded-xl border border-slate-200 bg-slate-50 p-4">
            <div className="flex items-center gap-3">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-inatel-dark text-sm font-bold text-white">
                SZ
              </span>
              <div className="min-w-0 leading-tight">
                <p className="truncate text-sm font-bold text-slate-900">Samuel Zanebone</p>
                <p className="text-xs text-slate-500">Engenharia de Software</p>
              </div>
            </div>
            <label htmlFor="matricula" className={`${rotulo} mt-4`}>Matrícula</label>
            <div className={`${campo} mt-1.5 justify-between py-2.5`}>
              <input id="matricula" defaultValue="851" readOnly className="w-full bg-transparent text-sm font-semibold tracking-wider outline-none" />
              <Lock size={14} className="text-slate-400" aria-hidden />
            </div>
          </div>

          <label htmlFor="senha" className={`${rotulo} mt-5`}>Senha</label>
          <div className={`${campo} mt-1.5 focus-within:border-inatel-light focus-within:ring-2 focus-within:ring-inatel-light/40`}>
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
            className="mt-7 flex w-full items-center justify-center gap-2 rounded-xl bg-inatel px-5 py-3.5 text-sm font-bold text-white shadow-lg shadow-inatel/30 transition duration-200 hover:-translate-y-0.5 hover:bg-inatel-light focus:outline-none focus:ring-4 focus:ring-inatel-light/40 active:translate-y-0 active:scale-[0.98]"
          >
            Entrar no Portal <ArrowRight size={18} />
          </button>
        </form>
      </main>

      <footer className="px-4 pb-6 text-center text-xs font-medium text-white/80">
        © 2026 Instituto Nacional de Telecomunicações - Inatel
      </footer>
    </div>
  )
}
