import React, { useState } from 'react'
import { PatientCase } from '../../../types/case'
import { Modal } from '../../../components/modal'
import { StlViewer } from '../../../components/stl-viewer'
import { Edit2, Trash2, Plus, X, Check, DownloadIcon } from 'lucide-react'
import { Button } from '../../../components/button'
import { Input } from '../../../components/input'
import { cn } from '../../../lib/cn'

interface StlFilesProps {
    caseItem: PatientCase
    onUpdate?: (updatedCase: PatientCase) => void
}

export default function StlFiles({ caseItem, onUpdate }: StlFilesProps) {
    const [editingIndex, setEditingIndex] = useState<number | null>(null)
    const [isAddingNew, setIsAddingNew] = useState(false)
    const [viewFile, setViewFile] = useState<string | null>(null)
    const [tempName, setTempName] = useState('')
    const [tempFile, setTempFile] = useState('')

    const startEdit = (index: number) => {
        setEditingIndex(index)
        setTempName(caseItem.jawFiles[index]?.jaw_name ?? '')
        setTempFile(caseItem.jawFiles[index]?.jaw_stl_file ?? '')
    }

    const startAdd = () => {
        setIsAddingNew(true)
        setTempName('')
        setTempFile('')
    }

    const save = () => {
        const newJawFiles = [...caseItem.jawFiles]
        if (isAddingNew) {
            newJawFiles.push({ jaw_name: tempName, jaw_stl_file: tempFile })
        } else if (editingIndex !== null) {
            newJawFiles[editingIndex] = { jaw_name: tempName, jaw_stl_file: tempFile }
        }
        onUpdate?.({ ...caseItem, jawFiles: newJawFiles })
        cancelEdit()
    }

    const cancelEdit = () => {
        setEditingIndex(null)
        setIsAddingNew(false)
        setTempName('')
        setTempFile('')
    }

    const deleteJawFile = (index: number) => {
        const newJawFiles = caseItem.jawFiles.filter((_, i) => i !== index)
        onUpdate?.({ ...caseItem, jawFiles: newJawFiles })
    }

    const viewInViewer = (stlFile: string) => {
        setViewFile(stlFile)
    }

    const downloadFile = (stlFile: string) => {
        if (!stlFile) return
        if (!stlFile.startsWith('http://') && !stlFile.startsWith('https://')) {
            console.error('Invalid download URL:', stlFile)
            return
        }

        try {
            const url = new URL(stlFile)
            console.log(url);
            console.log(url.protocol);
            
            if (url.protocol !== 'http:' && url.protocol !== 'https:') {
                console.error('Invalid download protocol:', stlFile)
                return
            }

            const link = document.createElement('a')
            link.href = stlFile
            link.setAttribute('target', '_blank')
            link.download = 'jaw.stl'
            link.click()
        } catch (error) {
            console.error('Error downloading file:', error)
        }
    }

    return (
        <>
            <div className="space-y-2">
                <div className="flex items-center justify-between">
                    <h4 className="text-sm font-medium"></h4>
                    <Button
                        onClick={startAdd}
                        size="sm"
                        className="flex items-center gap-1"
                        disabled={editingIndex !== null || isAddingNew}
                        leftIcon={<Plus size={14} />}
                    >
                        Add Jaw File
                    </Button>
                </div>

                {isAddingNew && (
                    <div className=" rounded p-1.5 space-y-2 bg-white">
                        <div className="flex items-center gap-1">
                            <Input
                                placeholder="Jaw Name (e.g., Upper Jaw)"
                                value={tempName}
                                wrapperClassName='flex-1'
                                onChange={(e) => setTempName(e.target.value)}
                            />
                            <Input
                                placeholder="STL File URL/Path"
                                value={tempFile}
                                wrapperClassName='flex-1'
                                onChange={(e) => setTempFile(e.target.value)}
                            />
                            <ActionBtn title="Save" onClick={save} className='bg-primary/30 hover:bg-primary/40 text-text'>
                                <Check size={14} />
                            </ActionBtn>
                            <ActionBtn title="Cancel" onClick={cancelEdit} className='bg-secondary/30 hover:bg-secondary/40 text-text'>
                                <X size={14} />
                            </ActionBtn>
                        </div>
                    </div>
                )}

                <div className="gap-2 grid max-sm:grid-cols-1 grid-cols-2">
                    {caseItem.jawFiles.map((jaw, index) => (
                        <div key={index} className="flex items-center gap-2 p-1.5 bg-white rounded">
                            {editingIndex === index ? (
                                <div className="flex-1 flex items-center gap-1">
                                    <Input
                                        placeholder="Jaw Name"
                                        className='bg-white'
                                        wrapperClassName='flex-1!'
                                        value={tempName}
                                        onChange={(e) => setTempName(e.target.value)}
                                    />
                                    <Input
                                        placeholder="STL File URL/Path"
                                        value={tempFile}
                                        className='bg-white'
                                        wrapperClassName='flex-1!'
                                        onChange={(e) => setTempFile(e.target.value)}
                                    />
                                    <ActionBtn
                                        title="Save"
                                        onClick={save}
                                        className='bg-primary/30 hover:bg-primary/40 text-text'
                                    >
                                        <Check size={14} />
                                    </ActionBtn>
                                    <ActionBtn
                                        title="Cancel"
                                        onClick={cancelEdit}
                                        className='bg-secondary/30 hover:bg-secondary/40 text-text'

                                    >
                                        <X size={14} />
                                    </ActionBtn>
                                </div>
                            ) : (
                                <>
                                    <span
                                        className="text-sm text-primary hover:underline cursor-pointer hover:text-primary/80 transition-colors duration-200"
                                        onClick={() => viewInViewer(jaw.jaw_stl_file)}
                                    >{jaw.jaw_name}</span>
                                    <div className="flex-1 flex justify-end items-center gap-1">
                                        <ActionBtn
                                            title="Edit"
                                            onClick={() => startEdit(index)}
                                            disabled={editingIndex !== null || isAddingNew}
                                            className='bg-secondary/30 hover:bg-secondary/40 text-text'
                                        >
                                            <Edit2 size={14} />
                                        </ActionBtn>
                                        <ActionBtn
                                            title="Download"
                                            onClick={() => downloadFile(jaw.jaw_stl_file)}
                                            disabled={editingIndex !== null || isAddingNew}
                                            className='bg-yellow-500/30 hover:bg-yellow-500/40 text-text'
                                        >
                                            <DownloadIcon size={14} />
                                        </ActionBtn>
                                        <ActionBtn
                                            title="Delete"
                                            onClick={() => deleteJawFile(index)}
                                            disabled={editingIndex !== null || isAddingNew}
                                            className='bg-danger/30 hover:bg-danger/40 text-text'
                                        >
                                            <Trash2 size={14} />
                                        </ActionBtn>
                                    </div>
                                </>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {viewFile && (
                <Modal
                    open={!!viewFile}
                    onClose={() => setViewFile(null)}
                    title="STL Viewer"
                >
                    <div className="h-96">
                        <StlViewer filePath={viewFile} />
                    </div>
                </Modal>
            )}
        </>
    )
}

function ActionBtn({ children, title, onClick, className = '', disabled }: {
    children: React.ReactNode
    title: string
    onClick: (e: React.MouseEvent) => void
    className?: string
    disabled?: boolean
}) {
    return (
        <button
            title={title}
            onClick={onClick}
            disabled={disabled}
            className={cn(
                'w-7 h-7 flex items-center justify-center rounded transition-colors duration-200',
                className,
            )}
        >
            {children}
        </button>
    )
}