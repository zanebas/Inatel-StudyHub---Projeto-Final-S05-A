import { ArrowLeft } from 'lucide-react'

const cx = (...c) => c.filter(Boolean).join(' ')

export const Card = ({ as: Tag = 'section', className, ...p }) => (
  <Tag className={cx('ui-card', className)} {...p} />
)

const BOTOES = {
  primary: 'ui-btn ui-btn--primary',
  danger: 'ui-btn ui-btn--danger',
  outline: 'ui-btn ui-btn--outline',
}
export const Button = ({ variant = 'primary', className, ...p }) => (
  <button className={cx(BOTOES[variant], className)} {...p} />
)

const TONS = {
  green: 'ui-badge ui-badge--green',
  red: 'ui-badge ui-badge--red',
  blue: 'ui-badge ui-badge--blue',
  amber: 'ui-badge ui-badge--amber',
}
export const Badge = ({ tom = 'blue', className, ...p }) => (
  <span className={cx(TONS[tom], className)} {...p} />
)

export const PageHeader = ({ titulo, subtitulo, onVoltar, voltarLabel = 'Home' }) => (
  <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
    <div>
      <h2 className="text-2xl font-extrabold sm:text-3xl">{titulo}</h2>
      {subtitulo && <p className="text-sm text-slate-500 dark:text-slate-400">{subtitulo}</p>}
    </div>
    <button onClick={onVoltar} className="ui-back-btn">
      <ArrowLeft size={16} /> {voltarLabel}
    </button>
  </div>
)

export const Vazio = ({ children }) => (
  <p className="ui-empty-state">{children}</p>
)
