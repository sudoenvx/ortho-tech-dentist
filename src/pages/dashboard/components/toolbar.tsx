import React, { useMemo } from 'react'
import { Input } from '../../../components/input'
import { Button } from '../../../components/button'
import { DropdownMenu, DropdownMenuCheckItem, DropdownMenuLabel, DropdownMenuSeparator } from '../../../components/dropdown-menu'
import { PlusIcon, Filter } from 'lucide-react'
import { useCaseFilterStore } from '../../../stores/caseFilterStore'
import { CASE_STEP_OPTIONS, CASE_IMPORTANT_OPTIONS } from '../../../types/case'
import { cn } from '../../../lib/cn'

interface ToolbarProps {
  onAddNewPatient: () => void
}

function Toolbar({ onAddNewPatient }: ToolbarProps) {
  const searchQuery = useCaseFilterStore((state) => state.searchQuery)
  const stepFilter = useCaseFilterStore((state) => state.stepFilter)
  const importantFilter = useCaseFilterStore((state) => state.importantFilter)
  const setSearchQuery = useCaseFilterStore((state) => state.setSearchQuery)
  const setStepFilter = useCaseFilterStore((state) => state.setStepFilter)
  const setImportantFilter = useCaseFilterStore((state) => state.setImportantFilter)

  // Get display labels for selected filters
  const importantLabel = useMemo(
    () => CASE_IMPORTANT_OPTIONS.find((opt) => opt.value === importantFilter)?.label || 'All Cases',
    [importantFilter]
  )

  const stepLabel = useMemo(
    () =>
      stepFilter === 'all'
        ? 'All'
        : stepFilter === 'empty'
          ? 'No Steps'
          : CASE_STEP_OPTIONS.find((opt) => opt.value === stepFilter)?.label || 'All',
    [stepFilter]
  )

  return (
    <div className="flex items-center gap-2 w-full">
      <Input
        wrapperClassName='flex-1'
        className="bg-white "
        placeholder="search patient name, doctor"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />

      {/* Important Filter Dropdown */}
      <DropdownMenu
        trigger={
          <div className={cn(
            "px-3 h-7 rounded text-sm font-medium cursor-pointer",
            "hover:bg-secondary-tint transition-colors",
            "bg-secondary-tint hover:bg-secondary-tint/80 text-secondary"
          )}>
            <div className="flex items-center gap-2 h-full">
              <Filter className='w-4 h-4' />
              <span className='text-xs'>important - {importantLabel}</span>
            </div>
          </div>
        }
      >
        <DropdownMenuLabel>Filter by Importance</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {CASE_IMPORTANT_OPTIONS.map((option) => (
          <DropdownMenuCheckItem
            key={option.value}
            checked={importantFilter === option.value}
            onCheckedChange={() => setImportantFilter(option.value)}
            group="important"
          >
            {option.label}
          </DropdownMenuCheckItem>
        ))}
      </DropdownMenu>

      {/* Step Filter Dropdown */}
      <DropdownMenu
        trigger={
          <div className={cn(
            "px-3 h-7 rounded text-sm font-medium cursor-pointer",
            "hover:bg-secondary-tint transition-colors",
            "bg-secondary-tint hover:bg-secondary-tint/80 text-secondary"
          )}>
            <div className="flex items-center gap-2 h-full">
              <Filter className='w-4 h-4' />
              <span className='text-xs'>step - {stepLabel}</span>
            </div>
          </div>
        }
      >
        <DropdownMenuLabel>Filter by Step</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {CASE_STEP_OPTIONS.map((option) => (
          <DropdownMenuCheckItem
            key={option.value}
            checked={stepFilter === option.value}
            onCheckedChange={() => setStepFilter(option.value)}
            group="step"
          >
            {option.label}
          </DropdownMenuCheckItem>
        ))}
      </DropdownMenu>

      <Button size="sm" leftIcon={<PlusIcon />} onClick={onAddNewPatient}>
        Add New Patient
      </Button>
    </div>
  )
}

export default Toolbar