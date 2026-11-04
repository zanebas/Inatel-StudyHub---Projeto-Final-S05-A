import { AlertCircle, CheckCircle2, X } from 'lucide-react'
import { useApp } from '../context/AppContext.jsx'

export default function Toast() {
  const { toast, dismissToast } = useApp()
  if (!toast) return null
  const erro = toast.tipo === 'erro'
  return (
    <div role="status" aria-live="polite" className="toast-container">
      {erro ? <AlertCircle className="shrink-0 text-red-500" size={20} /> : <CheckCircle2 className="shrink-0 text-emerald-500" size={20} />}
      <span className="flex-1">{toast.mensagem}</span>
      <button onClick={dismissToast} aria-label="Fechar"><X size={16} /></button>
    </div>
  )
}
