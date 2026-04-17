export type ManagerRole = 'admin' | 'editor' | 'viewer'

export type Permission = 'viewDashboard' | 'manageCases' | 'manageManagers'

export interface Manager {
  id: string
  name: string
  email: string
  password: string
  role: ManagerRole
  createdAt: Date
  updatedAt: Date
}

export interface NewManagerInput {
  name: string
  email: string
  password: string
  role: ManagerRole
}
