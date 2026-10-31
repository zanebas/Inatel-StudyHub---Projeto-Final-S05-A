import { AlertCircle, CheckCircle2, X } from 'lucide-react'
import { useApp } from '../context/AppContext.jsx'

export default function Toast() {
  const { toast, dismissToast } = useApp()
  if (!toast) return null
  const erro = toast.tipo === 'erro'
  return (
    <div role="status" aria-live="polite" className="fixed inset-x-4 bottom-4 z-50 mx-auto flex max-w-md items-center gap-3 rounded-xl border bg-white p-4 text-sm font-medium shadow-xl dark:bg-slate-800 sm:left-auto sm:right-6 sm:mx-0 border-slate-200 dark:border-slate-700">
      {erro ? <AlertCircle className="shrink-0 text-red-500" size={20} /> : <CheckCircle2 className="shrink-0 text-emerald-500" size={20} />}
      <span className="flex-1">{toast.mensagem}</span>
      <button onClick={dismissToast} aria-label="Fechar"><X size={16} /></button>
    </div>
  )
}

