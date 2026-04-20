import React, { useEffect, useState } from 'react'
import { Button } from '../../components/button'
import { WebsiteEditModal } from '../../components/website-edit-modal'
import { WebsitesTable } from './components/websites-table'
import { subscribeToWebsites, addWebsite, updateWebsite, deleteWebsite } from '../../services/websites'
import { subscribeToCases } from '../../services/cases'
import type { Website } from '../../types/website'
import type { PatientCase } from '../../types/case'
import { Plus, Trash2 } from 'lucide-react'
import { Modal } from '../../components/modal'

function WebsitesPage() {
  const [websites, setWebsites] = useState<Website[]>([])
  const [cases, setCases] = useState<PatientCase[]>([])
  const [isLoadingWebsites, setIsLoadingWebsites] = useState(true)
  const [isLoadingCases, setIsLoadingCases] = useState(true)
  const [editingWebsite, setEditingWebsite] = useState<Website | null>(null)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [websiteToDelete, setWebsiteToDelete] = useState<Website | null>(null)

  // Subscribe to websites
  useEffect(() => {
    const unsubscribe = subscribeToWebsites({
      onData: (websites) => {
        setWebsites(websites)
        setIsLoadingWebsites(false)
      },
      onError: (error) => {
        console.error('Failed to fetch websites:', error)
        setIsLoadingWebsites(false)
      },
    })

    return () => unsubscribe()
  }, [])

  // Subscribe to cases (needed for patient count)
  useEffect(() => {
    const unsubscribe = subscribeToCases({
      onData: (cases) => {
        setCases(cases)
        setIsLoadingCases(false)
      },
      onError: (error) => {
        console.error('Failed to fetch cases:', error)
        setIsLoadingCases(false)
      },
    })

    return () => unsubscribe()
  }, [])

  const handleAddWebsite = async (input: any) => {
    setIsSubmitting(true)
    try {
      await addWebsite(input)
      setIsCreateModalOpen(false)
    } catch (error) {
      console.error('Failed to add website:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleUpdateWebsite = async (input: any) => {
    if (!editingWebsite) return
    
    setIsSubmitting(true)
    try {
      await updateWebsite(editingWebsite.id, {
        name: input.name,
        link: input.link,
        isActive: input.isActive,
      })
      setEditingWebsite(null)
    } catch (error) {
      console.error('Failed to update website:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteWebsite = async (website: Website) => {
    // Check if website has associated cases
    const hasAssociatedCases = cases.some((c) => c.websiteId === website.id)
    if (hasAssociatedCases) {
      console.error('Cannot delete website with associated cases')
      return
    }

    setIsSubmitting(true)
    try {
      await deleteWebsite(website.id)
      setWebsiteToDelete(null)
    } catch (error) {
      console.error('Failed to delete website:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEditClick = (website: Website) => {
    setEditingWebsite(website)
  }

  const handleDeleteClick = (website: Website) => {
    setWebsiteToDelete(website)
  }

  return (
    <div className="flex flex-col gap-4 p-4 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-md  text-text">Websites Sources</h1>
        </div>
        <Button
          onClick={() => setIsCreateModalOpen(true)}
          className="gap-2"
          leftIcon={<Plus size={16} />}
        >
          
          New Website
        </Button>
      </div>

      {/* Table */}
      <WebsitesTable
        websites={websites}
        cases={cases}
        onEdit={handleEditClick}
        onDelete={handleDeleteClick}
        isLoading={isLoadingWebsites || isLoadingCases}
      />

      {/* Create/Edit Modal */}
      <WebsiteEditModal
        open={isCreateModalOpen || !!editingWebsite}
        onClose={() => {
          setIsCreateModalOpen(false)
          setEditingWebsite(null)
        }}
        website={editingWebsite || undefined}
        onSave={editingWebsite ? handleUpdateWebsite : handleAddWebsite}
        isSubmitting={isSubmitting}
      />

      {/* Delete Confirmation */}
      <Modal
        open={!!websiteToDelete}
        onClose={() => {
          if (!isSubmitting) {
            setWebsiteToDelete(null)
          }
        }}
        // title={(
        //   <>
        //     <span>Delete website</span>
        //   </>
        // )}
        footer={(
          <>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setWebsiteToDelete(null)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              size="sm"
              leftIcon={<Trash2 size={14} />}
              onClick={() => websiteToDelete && handleDeleteWebsite(websiteToDelete)}
              loading={isSubmitting}
              disabled={!websiteToDelete}
            >
              Delete website
            </Button>
          </>
        )}
      >
        <div className="space-y-2 p-4 h-24">
          <p className="text-sm text-text">
            Are you sure you want to delete
            {' '}
            <span className="font-semibold text-primary">"{websiteToDelete?.name}"</span>
            ? This action cannot be undone.
          </p>
        </div>
      </Modal>
    </div>
  )
}

export default WebsitesPage
