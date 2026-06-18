import type { ReactElement, ReactNode } from 'react'
import Sidebar from './Sidebar'
import Header from './Header'
import DashboardPage from '../../pages/DashboardPage'

interface LayoutProps {
  children?: ReactNode
}

export default function Layout({ children }: LayoutProps): ReactElement {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-200">
      <div className="flex min-h-screen">
        <Sidebar />

        <div className="flex flex-1 flex-col">
          <Header title="Dashboard" userName="U" />

          <main className="flex-1 bg-slate-100 p-6 dark:bg-slate-900">
            <div className="min-h-[calc(100vh-72px)] rounded-lg bg-white p-6 shadow-sm dark:bg-slate-800">
              {children ?? <DashboardPage />}
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}