export type WebsiteName = 'softSmile' | 'orthero' | 'DSmile'
export type CaseStep = 'stl' | 'printing' | 'stacking' | 'finishing' | 'delivered'
export type CaseStepFilter = 'all' | 'empty' | CaseStep
export type CaseImportantFilter = 'all' | 'important' | 'notImportant'

export interface CaseStepDetail { 
  completed: boolean
  notes?: string
}

export interface CaseSteps {
  stl: CaseStepDetail
  printing: CaseStepDetail
  stacking: CaseStepDetail
  finishing: CaseStepDetail
  delivered: CaseStepDetail
}

export interface JawFile {
  jaw_stl_file: string
  jaw_name: string
}

export interface PatientCase {
  id: string
  patientName: string
  doctorName: string
  websiteName: WebsiteName
  steps: CaseSteps
  jawFiles: JawFile[]
  isImportant: boolean
  createdAt: Date
  updatedAt: Date
}

export interface NewPatientCaseInput {
  patientName: string
  doctorName: string
  websiteName: WebsiteName
}

export const CASE_STEP_OPTIONS: Array<{
  value: CaseStepFilter
  label: string
}> = [
  { value: 'all', label: 'All Steps' },
  { value: 'empty', label: 'No Steps Completed' },
  { value: 'stl', label: 'STL Design' },
  { value: 'printing', label: 'Printing' },
  { value: 'stacking', label: 'Stacking' },
  { value: 'finishing', label: 'Finishing' },
  { value: 'delivered', label: 'Delivered' },
]

export const PRODUCTION_STEP_OPTIONS: Array<{
  value: CaseStep
  label: string
}> = [
  { value: 'stl', label: 'STL Design' },
  { value: 'printing', label: 'Printing' },
  { value: 'stacking', label: 'Stacking' },
  { value: 'finishing', label: 'Finishing' },
  { value: 'delivered', label: 'Delivered' },
]

export const CASE_IMPORTANT_OPTIONS: Array<{
  value: CaseImportantFilter
  label: string
}> = [
  { value: 'all', label: 'All Cases' },
  { value: 'important', label: 'Important Only' },
  { value: 'notImportant', label: 'Not Important' },
]