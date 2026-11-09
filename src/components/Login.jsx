import { useState } from 'react'
import { ArrowRight, Eye, EyeOff, Lock } from 'lucide-react'
import { useApp } from '../context/AppContext.jsx'

export default function Login() {
  const { login } = useApp()
  const [verSenha, setVerSenha] = useState(false)

  return (
    <div className="login-backdrop">
      <main className="flex flex-1 items-center justify-center px-4 pb-24 pt-8 md:py-12">
        <form
          onSubmit={(e) => {
            e.preventDefault()
            login()
          }}
          className="login-card"
        >
          <div className="flex flex-col items-center text-center">
            <img src="logo-inatel.png" alt="Inatel" className="h-9 w-auto brightness-150" />
            <span className="login-pill mt-2">
              Portal do Aluno
            </span>
            <h2 className="mt-3 text-lg font-bold text-white">Bem-vindo de volta</h2>
            <p className="mt-1 text-sm text-zinc-400">Acesse para gerenciar sua vida acadêmica e ao novo Inatel StudyHub</p>
          </div>

          <div className="login-user-box mt-5">
            <div className="flex items-center gap-3">
              <span className="login-avatar">
                SZ
              </span>
              <div className="min-w-0 leading-tight">
                <p className="truncate text-sm font-bold text-white">Samuel Zanebone</p>
                <p className="text-xs text-zinc-400">Engenharia de Software</p>
              </div>
            </div>
            <label htmlFor="matricula" className="login-label mt-3">Matrícula</label>
            <div className="login-field mt-1 justify-between py-2">
              <input id="matricula" defaultValue="851" readOnly className="w-full bg-transparent text-sm font-semibold tracking-wider text-white outline-none" />
              <Lock size={14} className="text-zinc-500" aria-hidden />
            </div>
          </div>

          <label htmlFor="senha" className="login-label mt-4">Senha</label>
          <div className="login-field login-field--focusable mt-1">
            <Lock size={16} className="text-zinc-500" />
            <input
              id="senha"
              type={verSenha ? 'text' : 'password'}
              defaultValue="inatel"
              readOnly
              className="w-full bg-transparent text-sm tracking-[0.3em] text-white outline-none"
            />
            <button
              type="button"
              aria-label={verSenha ? 'Ocultar senha' : 'Mostrar senha'}
              onClick={() => setVerSenha(!verSenha)}
              className="text-zinc-500 transition hover:text-white"
            >
              {verSenha ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>

          <button type="submit" className="login-submit-btn mt-5">
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
