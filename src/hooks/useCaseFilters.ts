import type { PatientCase, CaseStepFilter, CaseImportantFilter } from '../types/case'

export function useCaseFilters(
  cases: PatientCase[],
  searchQuery: string,
  stepFilter: CaseStepFilter,
  importantFilter: CaseImportantFilter,
) {
  return cases.filter((caseItem) => {
    // Search filter - checks patient name, doctor name, and website name
    const searchLower = searchQuery.toLowerCase()
    const matchesSearch =
      caseItem.patientName.toLowerCase().includes(searchLower) ||
      caseItem.doctorName.toLowerCase().includes(searchLower)
      // || caseItem.websiteName.toLowerCase().includes(searchLower)

    if (!matchesSearch) return false

    // Important filter
    if (importantFilter === 'important' && !caseItem.isImportant) {
      return false
    }

    if (importantFilter === 'notImportant' && caseItem.isImportant) {
      return false
    }

    // Step filter - check if the last completed step matches the filter
    if (stepFilter !== 'all') {
      const steps = Object.entries(caseItem.steps)
      const lastCompletedStep = steps.reverse().find(([_, step]) => step.completed === true)
      
      if (stepFilter === 'empty') {
      return !lastCompletedStep
      } else {
      return lastCompletedStep?.[0] === stepFilter
      }
    }

    return true
  })
}
