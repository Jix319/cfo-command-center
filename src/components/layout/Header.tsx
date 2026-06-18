import type { ReactElement } from 'react'
import { Search, Bell } from 'lucide-react'

export interface HeaderProps {
  title: string
  userName?: string
}

export default function Header({ title, userName = 'U' }: HeaderProps): ReactElement {
  const today = new Date().toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })

  return (
    <header className="h-[72px] bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-6">
      <div className="flex items-center gap-6">
        <div>
          <h1 className="text-lg font-semibold">{title}</h1>
          <div className="text-xs text-slate-400">Dashboard / Home</div>
        </div>

        <div className="hidden sm:flex items-center bg-slate-100 dark:bg-slate-900 rounded-md px-3 py-1 border border-transparent dark:border-slate-700">
          <Search className="w-4 h-4 text-slate-500" />
          <input id="search" placeholder="Search" className="ml-2 w-64 bg-transparent outline-none text-sm" />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="text-sm text-slate-500 hidden sm:block">{today}</div>
        <button aria-label="Notifications" className="p-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-700">
          <Bell className="w-5 h-5" />
        </button>

        <div className="w-10 h-10 rounded-full bg-slate-300 dark:bg-slate-700 flex items-center justify-center text-sm font-medium">{userName}</div>
      </div>
    </header>
  )
}
