import React, { useEffect, useState } from 'react'
import Toolbar from './components/toolbar'
import { CaseTable } from './components/case-table'
import { CreateCaseModal } from './components/create-case-modal'
import { subscribeToCases, updateCase, deleteCase } from '../../services/cases'
import { useCaseFilters } from '../../hooks/useCaseFilters'
import { useCaseFilterStore } from '../../stores/caseFilterStore'
import type { PatientCase } from '../../types/case'


function Dashboard() {
  const [allCases, setAllCases] = useState<PatientCase[]>([])
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const searchQuery = useCaseFilterStore((state) => state.searchQuery)
  const stepFilter = useCaseFilterStore((state) => state.stepFilter)
  const importantFilter = useCaseFilterStore((state) => state.importantFilter)

  const PER_PAGE = 10
  const [page, setPage] = useState(1)
  
  // Reset page when filters change
  useEffect(() => setPage(1), [searchQuery, stepFilter, importantFilter])

  // Subscribe to cases from Firebase/preview
  useEffect(() => {
    const unsubscribe = subscribeToCases({
      onData: (cases) => setAllCases(cases),
      onError: (error) => console.error('Failed to fetch cases:', error),
    })

    return () => unsubscribe()
  }, [])
  
  // Apply filters
  const filteredCases = useCaseFilters(allCases, searchQuery, stepFilter, importantFilter)
  const paginated = filteredCases.slice((page - 1) * PER_PAGE, page * PER_PAGE)

  const handleDeleteCase = async (id: string) => {
    try {
      await deleteCase(id)
      setAllCases((prev) => prev.filter((c) => c.id !== id))
    } catch (error) {
      console.error('Failed to delete case:', error)
    }
  }

  const handleUpdateCase = async (updatedCase: PatientCase) => {
    try {
      await updateCase(updatedCase.id, {
        ...updatedCase,
        updatedAt: new Date(),
      })
      setAllCases((prev) =>
        prev.map((c) => (c.id === updatedCase.id ? updatedCase : c))
      )
    } catch (error) {
      console.error('Failed to update case:', error)
    }
  }

  return (
    <div className="p-3 max-w-7xl pt-4 mx-auto">
        <Toolbar onAddNewPatient={() => setIsCreateModalOpen(true)} />
      {/* Cases section */}
      
      <div className="mt-4">
        {paginated.length === 0 ? (
          <div className="bg-white rounded-md p-6 text-center">
            <div className="flex flex-col items-center justify-center">
              
              <p className="text-2xl font-medium text-text mb-1">No cases found</p>
              <p className="text-sm text-text-muted">Try adjusting your filters or create a new case</p>
            </div>
          </div>
        ) : (
          <CaseTable
            cases={paginated}
            onDelete={handleDeleteCase}
            onUpdate={handleUpdateCase}
            currentPage={page}
            totalPages={Math.ceil(filteredCases.length / PER_PAGE)}
            totalItems={filteredCases.length}
            perPage={PER_PAGE}
            onPageChange={setPage}
          />
        )}
      </div>

      <CreateCaseModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
    </div>
  )
}

export default Dashboard