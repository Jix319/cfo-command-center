import type { ReactElement } from 'react'
import type { ScheduledTreasuryPayment } from '../../engines/treasury/types'
import StatusBadge, { type StatusVariant } from '../common/StatusBadge'
import DashboardCard from '../layout/DashboardCard'

interface PaymentCalendarCardProps {
  payments: ScheduledTreasuryPayment[]
  title?: string
}

const fundingStatusVariant: Record<ScheduledTreasuryPayment['fundingStatus'], StatusVariant> = {
  funded: 'success',
  watch: 'warning',
  gap: 'error',
}

function formatMoney(amountMinor: number, currency: string): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(amountMinor / 100)
}

function formatDate(dateIso: string): string {
  return new Intl.DateTimeFormat('en-IN', {
    day: '2-digit',
    month: 'short',
  }).format(new Date(dateIso))
}

export default function PaymentCalendarCard({
  payments,
  title = 'Payment Calendar',
}: PaymentCalendarCardProps): ReactElement {
  return (
    <DashboardCard title={title}>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200 text-left text-sm dark:divide-slate-700">
          <thead>
            <tr className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">
              <th className="py-2 pr-4 font-semibold">Payment</th>
              <th className="py-2 pr-4 font-semibold">Due</th>
              <th className="py-2 pr-4 text-right font-semibold">Amount</th>
              <th className="py-2 pr-4 font-semibold">Priority</th>
              <th className="py-2 font-semibold">Funding</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
            {payments.map((payment) => (
              <tr key={payment.id}>
                <td className="py-3 pr-4 font-medium text-slate-900 dark:text-slate-100">
                  {payment.category}
                </td>
                <td className="py-3 pr-4 text-slate-500 dark:text-slate-400">
                  {formatDate(payment.dueDate)}
                </td>
                <td className="py-3 pr-4 text-right font-semibold text-slate-900 dark:text-slate-100">
                  {formatMoney(payment.amount.amountMinor, payment.amount.currency)}
                </td>
                <td className="py-3 pr-4 capitalize text-slate-500 dark:text-slate-400">
                  {payment.priority}
                </td>
                <td className="py-3">
                  <StatusBadge
                    variant={fundingStatusVariant[payment.fundingStatus]}
                    label={payment.fundingStatus}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </DashboardCard>
  )
}
