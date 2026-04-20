import { create } from 'zustand'
import type { CaseStepFilter, CaseImportantFilter } from '../types/case'

interface CaseFilterState {
  searchQuery: string
  stepFilter: CaseStepFilter
  importantFilter: CaseImportantFilter
  setSearchQuery: (query: string) => void
  setStepFilter: (step: CaseStepFilter) => void
  setImportantFilter: (filter: CaseImportantFilter) => void
  reset: () => void
}

const initialState = {
  searchQuery: '',
  stepFilter: 'all' as const,
  importantFilter: 'all' as const,
}

export const useCaseFilterStore = create<CaseFilterState>((set) => ({
  ...initialState,
  setSearchQuery: (query: string) => set({ searchQuery: query }),
  setStepFilter: (step: CaseStepFilter) => set({ stepFilter: step }),
  setImportantFilter: (filter: CaseImportantFilter) => set({ importantFilter: filter }),
  reset: () => set(initialState),
}))
