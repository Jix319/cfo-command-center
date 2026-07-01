import type { ReactElement } from 'react'
import { useState } from 'react'
import SectionTitle from '../../components/common/SectionTitle'
import ConstructionProgressCard from '../../components/projectControl/ConstructionProgressCard'
import EscrowStatusCard from '../../components/projectControl/EscrowStatusCard'
import InventoryStatusCard from '../../components/projectControl/InventoryStatusCard'
import LandownerStatusCard from '../../components/projectControl/LandownerStatusCard'
import ProjectCashFlowCard from '../../components/projectControl/ProjectCashFlowCard'
import ProjectHealthCard from '../../components/projectControl/ProjectHealthCard'
import { projectControlEngine } from '../../engines/projectControl/projectControlEngine'
import { PROJECT_CONTROL_SAMPLE_INPUT } from '../../engines/projectControl/sampleData'

export default function ProjectControlTower(): ReactElement {
  const controlTower = projectControlEngine.evaluate(PROJECT_CONTROL_SAMPLE_INPUT)
  const [selectedProjectId, setSelectedProjectId] = useState(
    controlTower.highestRiskProject.projectId,
  )
  const selectedProject =
    controlTower.projects.find((project) => project.projectId === selectedProjectId) ??
    controlTower.highestRiskProject

  return (
    <div className="space-y-6">
      <SectionTitle
        title="Real Estate Control Tower"
        subtitle="Project health, RERA, landowner exposure, construction, inventory, and cash flow"
      />

      <div className="flex flex-wrap gap-2">
        {controlTower.projects.map((project) => (
          <button
            key={project.projectId}
            type="button"
            onClick={() => setSelectedProjectId(project.projectId)}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
              project.projectId === selectedProject.projectId
                ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            {project.projectName}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-12">
        <div className="md:col-span-6">
          <ProjectHealthCard
            project={selectedProject}
            currency={controlTower.currency}
          />
        </div>
        <div className="md:col-span-6">
          <EscrowStatusCard
            project={selectedProject}
            currency={controlTower.currency}
          />
        </div>

        <div className="md:col-span-6">
          <LandownerStatusCard
            project={selectedProject}
            currency={controlTower.currency}
          />
        </div>
        <div className="md:col-span-6">
          <ConstructionProgressCard
            project={selectedProject}
            currency={controlTower.currency}
          />
        </div>

        <div className="md:col-span-6">
          <InventoryStatusCard
            project={selectedProject}
            currency={controlTower.currency}
          />
        </div>
        <div className="md:col-span-6">
          <ProjectCashFlowCard
            project={selectedProject}
            currency={controlTower.currency}
          />
        </div>
      </div>
    </div>
  )
}
