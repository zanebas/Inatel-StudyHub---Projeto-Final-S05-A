import { AlertCircle, CheckCircle2, X } from 'lucide-react'
import { useApp } from '../context/AppContext.jsx'

export default function Toast() {
  const { toast, dismissToast } = useApp()
  if (!toast) return null
  const erro = toast.tipo === 'erro'

  return (
    <div
      role="dialog"
      aria-live="polite"
      aria-modal="true"
      onClick={dismissToast}
      className="popup-backdrop"
    >
      <div onClick={(e) => e.stopPropagation()} className="popup-card">
        <div className="popup-card__header">
          <span className="flex items-center gap-2">
            {erro ? (
              <AlertCircle size={16} className="shrink-0 text-white" />
            ) : (
              <CheckCircle2 size={16} className="shrink-0 text-white" />
            )}
            {erro ? 'Atenção' : 'Aviso StudyHub'}
          </span>
          <button onClick={dismissToast} aria-label="Fechar" className="text-white/80 hover:text-white">
            <X size={16} />
          </button>
        </div>

        <div className="popup-card__body">
          <p className="popup-card__msg">{toast.mensagem}</p>
          <button onClick={dismissToast} className="popup-card__btn">
            OK
          </button>
        </div>
      </div>
    </div>
  )
}
