import type { CashFlowPoint, SalesTrendPoint } from '../types/chart'

export const SALES_TREND_DATA: SalesTrendPoint[] = [
  { month: 'Jan', revenue: 2.4 },
  { month: 'Feb', revenue: 2.8 },
  { month: 'Mar', revenue: 3.2 },
  { month: 'Apr', revenue: 3.6 },
  { month: 'May', revenue: 3.9 },
  { month: 'Jun', revenue: 4.3 },
  { month: 'Jul', revenue: 4.1 },
  { month: 'Aug', revenue: 4.5 },
  { month: 'Sep', revenue: 4.7 },
  { month: 'Oct', revenue: 5.0 },
  { month: 'Nov', revenue: 5.4 },
  { month: 'Dec', revenue: 5.8 },
]

export const CASH_FLOW_DATA: CashFlowPoint[] = [
  { month: 'Jan', inflow: 6.2, outflow: 3.8, netCash: 2.4 },
  { month: 'Feb', inflow: 6.8, outflow: 4.0, netCash: 2.8 },
  { month: 'Mar', inflow: 7.1, outflow: 4.2, netCash: 2.9 },
  { month: 'Apr', inflow: 7.4, outflow: 4.0, netCash: 3.4 },
  { month: 'May', inflow: 7.7, outflow: 4.1, netCash: 3.6 },
  { month: 'Jun', inflow: 8.1, outflow: 4.3, netCash: 3.8 },
  { month: 'Jul', inflow: 7.9, outflow: 4.2, netCash: 3.7 },
  { month: 'Aug', inflow: 8.3, outflow: 4.1, netCash: 4.2 },
  { month: 'Sep', inflow: 8.5, outflow: 4.4, netCash: 4.1 },
  { month: 'Oct', inflow: 8.8, outflow: 4.6, netCash: 4.2 },
  { month: 'Nov', inflow: 9.1, outflow: 4.7, netCash: 4.4 },
  { month: 'Dec', inflow: 9.5, outflow: 4.8, netCash: 4.7 },
]
