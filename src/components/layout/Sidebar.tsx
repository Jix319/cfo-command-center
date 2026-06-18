import type { ReactElement } from 'react'
import { NavLink } from 'react-router-dom'
import { NAV_ITEMS } from '../../config/routes'

export default function Sidebar(): ReactElement {
  return (
    <aside className="hidden md:flex flex-col w-[280px] bg-[#020817] text-slate-200">
      <div className="px-6 py-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-md bg-gradient-to-br from-slate-700 to-slate-900 flex items-center justify-center font-bold">CC</div>
          <div>
            <div className="text-lg font-semibold">CFO Command Center</div>
            <div className="text-xs text-slate-400">The House of Shubhashish</div>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-3 py-6" aria-label="Primary navigation">
        <ul className="space-y-1">
          {NAV_ITEMS.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                end={item.path === '/'}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                    isActive ? 'bg-slate-800' : 'hover:bg-slate-800'
                  }`
                }>
                <item.icon className="w-5 h-5" />
                <span className="text-sm">{item.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <div className="px-4 py-6 border-t border-slate-800">
        <div className="text-xs text-slate-400">Financial Controller</div>
        <div className="mt-2 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 block" />
          <span className="text-sm">Online</span>
        </div>
      </div>
    </aside>
  )
}
