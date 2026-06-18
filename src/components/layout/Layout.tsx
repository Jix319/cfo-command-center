import type { ReactElement } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Sidebar from './Sidebar'
import Header from './Header'
import { ROUTE_DEFINITIONS } from '../../config/routes'

function findRouteTitle(pathname: string) {
  return ROUTE_DEFINITIONS.find((route) => route.path === pathname) ?? ROUTE_DEFINITIONS[0]
}

export default function Layout(): ReactElement {
  const location = useLocation()
  const activeRoute = findRouteTitle(location.pathname)

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-200">
      <div className="flex min-h-screen">
        <Sidebar />

        <div className="flex flex-1 flex-col">
          <Header title={activeRoute.label} breadcrumb={activeRoute.breadcrumb} userName="U" />

          <main className="flex-1 bg-slate-100 p-6 dark:bg-slate-900">
            <div className="min-h-[calc(100vh-72px)] rounded-lg bg-white p-6 shadow-sm dark:bg-slate-800">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}