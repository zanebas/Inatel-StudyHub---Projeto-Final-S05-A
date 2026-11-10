import { useState } from 'react'
import { Eye, EyeOff, Lock } from 'lucide-react'
import { useApp } from '../context/AppContext.jsx'

export default function Login() {
  const { login } = useApp()
  const [outroUsuario, setOutroUsuario] = useState(false)
  const [verSenha, setVerSenha] = useState(false)

  return (
    <div className="login-backdrop">
      <main className="flex flex-1 items-center justify-center px-4 pb-20 pt-8 md:py-12">
        <form
          onSubmit={(e) => {
            e.preventDefault()
            login()
          }}
          className="login-card"
        >
          <div className="login-card__header">Inatel Acadêmico</div>

          <div className="login-card__body">
            <img src="logo-inatel.png" alt="Inatel" className="mx-auto h-14 w-auto select-none" />

            {!outroUsuario ? (
              <>
                <h2 className="login-perfis-title">Perfis Salvos</h2>

                <button type="submit" className="login-profile-box">
                  <span className="text-[16px] leading-snug text-white">Samuel Zanebone</span>
                  <span className="mt-0.5 text-[15px] leading-snug text-zinc-400">GES - 851</span>
                </button>

                <button
                  type="button"
                  onClick={() => setOutroUsuario(true)}
                  className="login-submit-btn mt-14"
                >
                  Outro Usuário
                </button>
              </>
            ) : (
              <div className="mt-8 text-left">
                <label htmlFor="matricula" className="login-label">Matrícula</label>
                <div className="login-field mt-1 justify-between py-2.5">
                  <input
                    id="matricula"
                    defaultValue="851"
                    readOnly
                    className="w-full bg-transparent text-sm font-semibold tracking-wider text-white outline-none"
                  />
                  <Lock size={14} className="text-zinc-500" aria-hidden />
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

                <button type="submit" className="login-submit-btn mt-6">
                  Entrar
                </button>

                <button
                  type="button"
                  onClick={() => setOutroUsuario(false)}
                  className="mt-3 w-full py-2 text-center text-sm text-zinc-400 transition hover:text-white"
                >
                  Voltar para Perfis Salvos
                </button>
              </div>
            )}
          </div>
        </form>
      </main>
    </div>
  )
}
