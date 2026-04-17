import React, { useEffect, useMemo, useState } from 'react'
import { Button } from '../../components/button'
import { Input } from '../../components/input'
import { Modal } from '../../components/modal'
import { DataTable } from '../../components/data-table'
import { DropdownMenu, DropdownMenuItem, DropdownMenuLabel } from '../../components/dropdown-menu'
import { subscribeToManagers, addManager, updateManager, deleteManager } from '../../services/managers'
import type { Manager, NewManagerInput } from '../../types/manager'
import { Pencil, Trash2, Plus, ChevronDown } from 'lucide-react'

const roles = [
  { value: 'admin', label: 'Admin' },
  { value: 'editor', label: 'Editor' },
  { value: 'viewer', label: 'Viewer' },
] as const

function ManagersPage() {
  const [managers, setManagers] = useState<Manager[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [selectedManager, setSelectedManager] = useState<Manager | null>(null)
  const [managerToDelete, setManagerToDelete] = useState<Manager | null>(null)
  const [formState, setFormState] = useState<NewManagerInput>({
    name: '',
    email: '',
    role: 'viewer',
  })

  useEffect(() => {
    const unsubscribe = subscribeToManagers({
      onData: (values) => {
        setManagers(values)
        setIsLoading(false)
      },
      onError: (error) => {
        console.error('Failed to load managers:', error)
        setIsLoading(false)
      },
    })

    return () => unsubscribe()
  }, [])

  const openNewManagerModal = () => {
    setSelectedManager(null)
    setFormState({ name: '', email: '', role: 'viewer' })
    setIsModalOpen(true)
  }

  const openEditManagerModal = (manager: Manager) => {
    setSelectedManager(manager)
    setFormState({ name: manager.name, email: manager.email, role: manager.role })
    setIsModalOpen(true)
  }

  const openDeleteConfirm = (manager: Manager) => {
    setManagerToDelete(manager)
    setIsDeleteOpen(true)
  }

  const saveManager = async () => {
    const trimmedName = formState.name.trim()
    const trimmedEmail = formState.email.trim()
    if (!trimmedName || !trimmedEmail) {
      return
    }

    try {
      if (selectedManager) {
        await updateManager(selectedManager.id, {
          name: trimmedName,
          email: trimmedEmail,
          role: formState.role,
        })
        setManagers((prev) =>
          prev.map((manager) =>
            manager.id === selectedManager.id
              ? { ...manager, name: trimmedName, email: trimmedEmail, role: formState.role, updatedAt: new Date() }
              : manager,
          ),
        )
      } else {
        const createdManager = await addManager({
          name: trimmedName,
          email: trimmedEmail,
          role: formState.role,
        })
        setManagers((prev) => [createdManager, ...prev])
      }
    } catch (error) {
      console.error('Failed to save manager:', error)
    } finally {
      setIsModalOpen(false)
      setSelectedManager(null)
    }
  }

  const confirmDelete = async () => {
    if (!managerToDelete) return
    try {
      await deleteManager(managerToDelete.id)
      setManagers((prev) => prev.filter((item) => item.id !== managerToDelete.id))
    } catch (error) {
      console.error('Failed to delete manager:', error)
    } finally {
      setIsDeleteOpen(false)
      setManagerToDelete(null)
    }
  }

  const columns = useMemo(
    () => [
      {
        header: 'Name',
        render: (item: Manager) => <span className="text-[12px] font-medium text-text">{item.name}</span>,
      },
      {
        header: 'Email',
        render: (item: Manager) => <span className="text-[12px] text-text-muted truncate block max-w-55">{item.email}</span>,
      },
      
      {
        header: 'Email',
        render: (item: Manager) => <span className="text-[12px] text-text-muted truncate block max-w-55">{item.email}</span>,
      },

      {
        header: 'Role',
        render: (item: Manager) => <span className="text-[11px] uppercase rounded px-2 py-0.5 bg-secondary-tint text-secondary">{item.role}</span>,
      },
      {
        header: 'Updated At',
        render: (item: Manager) => (
          <span className="text-[12px] text-text-muted">
            {new Intl.DateTimeFormat(undefined, { year: 'numeric', month: 'short', day: 'numeric' }).format(new Date(item.updatedAt))}
          </span>
        ),
      },
    ],
    [],
  )

  return (
    <div className="p-3 max-w-7xl pt-4 mx-auto">
      <div className="flex flex-col gap-4">
        <div className="bg-white  p-2 rounded shadow-xs flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="text-md text-text">Ortho Managers</div>
            {/* <p className="text-sm text-text-muted">Define dashboard managers and grant permissions for editing content.</p> */}
          </div>
          <Button size="sm" leftIcon={<Plus />} onClick={openNewManagerModal}>
            Add New Manager
          </Button>
        </div>

        <DataTable
          columns={columns}
          data={managers}
          loading={isLoading}
          rowKey={(item) => item.id}
          actions={(item) => (
            <>
              <button
                type="button"
                title="Edit manager"
                onClick={() => openEditManagerModal(item)}
                className="flex justify-center items-center w-6.5 h-6.5 rounded bg-secondary/30 hover:bg-secondary/40 text-text transition-colors"
              >
                <Pencil size={14} />
              </button>
              <button
                type="button"
                title="Delete manager"
                onClick={() => openDeleteConfirm(item)}
                className="flex justify-center items-center w-6.5 h-6.5 rounded bg-danger/30 hover:bg-danger/40 text-text transition-colors"
              >
                <Trash2 size={14} />
              </button>
            </>
          )}
          emptyMessage="No managers found. Add one to grant dashboard access."
        />
      </div>

      <Modal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedManager ? 'Edit Manager' : 'Create Manager'}
      >
        <div className="space-y-4 p-2">
          <div className="space-y-3">
            <Input
              label="Name"
              value={formState.name}
              onChange={(event) => setFormState((prev) => ({ ...prev, name: event.target.value }))}
              placeholder="Manager name"
            />
            <Input
              label="Email"
              value={formState.email}
              onChange={(event) => setFormState((prev) => ({ ...prev, email: event.target.value }))}
              placeholder="manager@example.com"
              type="email"
            />
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-medium text-text-muted tracking-wider">Role</label>
              <DropdownMenu
                trigger={
                  <div className="flex items-center justify-between w-full bg-input rounded px-2 py-1 border border-border text-[12px] text-text">
                    <span>{roles.find((r) => r.value === formState.role)?.label}</span>
                    <ChevronDown size={16} className="text-text-muted" />
                  </div>
                }
              >
                <DropdownMenuLabel>Select Role</DropdownMenuLabel>
                {roles.map((role) => (
                  <DropdownMenuItem
                    key={role.value}
                    selected={formState.role === role.value}
                    onSelect={() => setFormState((prev) => ({ ...prev, role: role.value }))}
                  >
                    {role.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenu>
            </div>
          </div>
          <div className="flex items-center justify-end gap-2">
            <Button variant="ghost" size="sm" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button size="sm" onClick={saveManager}>
              {selectedManager ? 'Save Changes' : 'Create Manager'}
            </Button>
          </div>
        </div>
      </Modal>

      <Modal
        open={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        title="Delete Manager"
      >
        <div className="space-y-4 p-2">
          <p className="text-sm text-text">Are you sure you want to remove this manager? This action cannot be undone.</p>
          <div className="flex items-center justify-end gap-2">
            <Button variant="ghost" size="sm" onClick={() => setIsDeleteOpen(false)}>
              Cancel
            </Button>
            <Button variant="danger" size="sm" onClick={confirmDelete}>
              Delete manager
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default ManagersPage
