import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/layout/Layout'
import DashboardPage from './pages/DashboardPage'
import ProjectsPage from './pages/Projects/ProjectsPage'
import SalesPage from './pages/Sales/SalesPage'
import CollectionsPage from './pages/Collections/CollectionsPage'
import TreasuryPage from './pages/Treasury/TreasuryPage'
import CompliancePage from './pages/Compliance/CompliancePage'
import ReportsPage from './pages/Reports/ReportsPage'
import UploadPage from './pages/Upload/UploadPage'
import SettingsPage from './pages/Settings/SettingsPage'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<DashboardPage />} />
          <Route path="projects" element={<ProjectsPage />} />
          <Route path="sales" element={<SalesPage />} />
          <Route path="collections" element={<CollectionsPage />} />
          <Route path="treasury" element={<TreasuryPage />} />
          <Route path="compliance" element={<CompliancePage />} />
          <Route path="reports" element={<ReportsPage />} />
          <Route path="upload" element={<UploadPage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
