import { ArrowLeft } from 'lucide-react'

const cx = (...c) => c.filter(Boolean).join(' ')

export const Card = ({ as: Tag = 'section', className, ...p }) => (
  <Tag className={cx('rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900', className)} {...p} />
)

const BOTOES = {
  primary: 'bg-inatel text-white hover:bg-inatel-dark',
  danger: 'border border-red-300 text-red-600 hover:bg-red-50 dark:border-red-500/40 dark:text-red-300 dark:hover:bg-red-500/10',
  outline: 'border border-slate-300 hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800',
}
export const Button = ({ variant = 'primary', className, ...p }) => (
  <button className={cx('rounded-xl text-sm font-bold', BOTOES[variant], className)} {...p} />
)

const TONS = {
  green: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300',
  red: 'bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-300',
  blue: 'bg-blue-100 text-blue-700 dark:bg-sky-400/15 dark:text-sky-300',
  amber: 'bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300',
}
export const Badge = ({ tom = 'blue', className, ...p }) => (
  <span className={cx('rounded-full font-bold', TONS[tom], className)} {...p} />
)

export const PageHeader = ({ titulo, subtitulo, onVoltar, voltarLabel = 'Home' }) => (
  <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
    <div>
      <h2 className="text-2xl font-extrabold sm:text-3xl">{titulo}</h2>
      {subtitulo && <p className="text-sm text-slate-500 dark:text-slate-400">{subtitulo}</p>}
    </div>
    <button
      onClick={onVoltar}
      className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:hover:bg-slate-800"
    >
      <ArrowLeft size={16} /> {voltarLabel}
    </button>
  </div>
)

export const Vazio = ({ children }) => (
  <p className="rounded-2xl border border-dashed border-slate-300 p-10 text-center text-slate-500 dark:border-slate-700">{children}</p>
)
