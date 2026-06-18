import type { ReactElement, ReactNode } from 'react'

interface ChartContainerProps {
  title: string
  subtitle: string
  children: ReactNode
}

export default function ChartContainer({ title, subtitle, children }: ChartContainerProps): ReactElement {
  return (
    <section className="rounded-[1.25rem] border border-slate-200/80 bg-white/95 shadow-sm dark:border-slate-700/80 dark:bg-slate-900/95 p-5">
      <div className="mb-4 flex flex-col gap-1">
        <div className="text-sm uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">{subtitle}</div>
        <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100">{title}</h3>
      </div>
      <div className="h-[320px] w-full">{children}</div>
    </section>
  )
}
