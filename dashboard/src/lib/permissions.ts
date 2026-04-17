import type { Manager, ManagerRole, Permission } from '../types/manager'

const rolePermissions: Record<ManagerRole, Permission[]> = {
  admin: ['viewDashboard', 'manageCases', 'manageManagers'],
  editor: ['viewDashboard', 'manageCases'],
  viewer: ['viewDashboard'],
}

export function getPermissionsForRole(role: ManagerRole): Permission[] {
  return rolePermissions[role] ?? []
}

export function hasPermission(role: ManagerRole, permission: Permission): boolean {
  return getPermissionsForRole(role).includes(permission)
}

export function managerHasPermission(manager: Manager | null | undefined, permission: Permission): boolean {
  if (!manager) return false
  return hasPermission(manager.role, permission)
}

export function canManageCases(manager: Manager | null | undefined): boolean {
  return managerHasPermission(manager, 'manageCases')
}

export function canManageManagers(manager: Manager | null | undefined): boolean {
  return managerHasPermission(manager, 'manageManagers')
}
