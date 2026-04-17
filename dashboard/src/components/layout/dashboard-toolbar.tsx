import {
  CheckIcon,
  ChevronDownIcon,
  PlusIcon,
  SearchIcon,
  XIcon,
} from "lucide-react"
import { AnimatePresence, motion } from "motion/react"
import React, { useEffect, useMemo, useRef, useState } from "react"
import { Button } from "../button"
import {
  CASE_STEP_OPTIONS,
  CASE_IMPORTANT_OPTIONS,
  type CaseStepFilter,
  type CaseImportantFilter,
} from "../../types/case"

interface DashboardToolbarProps {
  searchValue: string
  stepFilter: CaseStepFilter
  importantFilter: CaseImportantFilter
  onSearchValueChange: (value: string) => void
  onStepFilterChange: (value: CaseStepFilter) => void
  onImportantFilterChange: (value: CaseImportantFilter) => void
  onCreateCase?: () => void
}

function ImportantFilterGroup({
  value,
  onChange,
}: {
  value: CaseImportantFilter
  onChange: (value: CaseImportantFilter) => void
}) {
  return (
    <div className="flex items-center gap-1 rounded-2xl border border-border bg-card/70 p-1">
      {CASE_IMPORTANT_OPTIONS.map((option) => {
        const isActive = option.value === value

        return (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            className={[
              "relative min-w-[72px] rounded-xl px-3 py-2 text-xs font-medium transition-colors duration-200",
              isActive ? "text-text" : "text-text-muted hover:text-text",
            ].join(" ")}
          >
            {isActive ? (
              <motion.span
                layoutId="important-filter-highlight"
                className="absolute inset-0 rounded-xl bg-surface shadow-[0_10px_24px_rgba(14,14,14,0.08)]"
                transition={{ type: "spring", stiffness: 320, damping: 26 }}
              />
            ) : null}
            <span className="relative z-10">{option.label}</span>
          </button>
        )
      })}
    </div>
  )
}

function StepFilterDropdown({
  value,
  onChange,
}: {
  value: CaseStepFilter
  onChange: (value: CaseStepFilter) => void
}) {
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const selectedOption = useMemo(
    () => CASE_STEP_OPTIONS.find((option) => option.value === value) ?? CASE_STEP_OPTIONS[0],
    [value],
  )

  useEffect(() => {
    if (!open) {
      return
    }

    const handlePointerDown = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setOpen(false)
      }
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false)
      }
    }

    document.addEventListener("mousedown", handlePointerDown)
    document.addEventListener("keydown", handleEscape)

    return () => {
      document.removeEventListener("mousedown", handlePointerDown)
      document.removeEventListener("keydown", handleEscape)
    }
  }, [open])

  return (
    <div ref={containerRef} className="relative min-w-[220px]">
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        className={[
          "group flex h-full w-full items-center justify-between gap-3 rounded-2xl border border-border bg-card/80 px-4 py-3 text-right transition-all duration-200",
          open ? "border-primary/35 bg-surface shadow-[0_14px_40px_rgba(14,14,14,0.08)]" : "hover:border-border-strong hover:bg-card",
        ].join(" ")}
        aria-expanded={open}
        aria-haspopup="listbox"
      >
        <div className="flex min-w-0 flex-col items-end">
          <span className="text-[11px] font-medium text-text-muted">المرحلة</span>
          <span className="truncate text-sm font-medium text-text">{selectedOption?.label}</span>
        </div>
        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.22, ease: "easeOut" }}
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-surface text-text-muted shadow-[inset_0_0_0_1px_rgba(213,211,206,0.65)]"
        >
          <ChevronDownIcon className="h-4 w-4" />
        </motion.span>
      </button>

      <AnimatePresence>
        {open ? (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
            className="absolute right-0 z-30 mt-2 w-full origin-top rounded-3xl border border-border bg-surface p-2 shadow-[0_20px_50px_rgba(14,14,14,0.14)]"
          >
            <div className="mb-1 px-2 pt-1 text-[11px] font-medium text-text-muted">
              اختر مرحلة التصفية
            </div>
            <div className="space-y-1">
              {CASE_STEP_OPTIONS.map((option) => {
                const isActive = option.value === value

                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => {
                      onChange(option.value)
                      setOpen(false)
                    }}
                    className={[
                      "flex w-full items-center justify-between rounded-2xl px-3 py-2.5 text-right text-sm transition-colors duration-150",
                      isActive
                        ? "bg-primary-tint text-primary-tint-text"
                        : "text-text-muted hover:bg-card hover:text-text",
                    ].join(" ")}
                  >
                    <span>{option.label}</span>
                    <span
                      className={[
                        "flex h-5 w-5 items-center justify-center rounded-full border transition-all duration-150",
                        isActive
                          ? "border-primary bg-primary text-primary-text"
                          : "border-border bg-surface text-transparent",
                      ].join(" ")}
                    >
                      <CheckIcon className="h-3 w-3" />
                    </span>
                  </button>
                )
              })}
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  )
}

function SearchField({
  value,
  onChange,
}: {
  value: string
  onChange: (value: string) => void
}) {
  return (
    <label className="group flex min-h-[56px] flex-1 items-center gap-3 rounded-2xl border border-border bg-card/80 px-4 py-3 transition-colors duration-200 focus-within:border-primary/35 focus-within:bg-surface">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-surface text-text-muted shadow-[inset_0_0_0_1px_rgba(213,211,206,0.65)] transition-colors duration-200 group-focus-within:text-primary">
        <SearchIcon className="h-4 w-4" />
      </span>
      <div className="flex min-w-0 flex-1 flex-col">
        <span className="text-[11px] font-medium text-text-muted">بحث سريع</span>
        <input
          type="search"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder="ابحث باسم المريض أو الطبيب أو الموقع"
          className="w-full border-none bg-transparent p-0 text-sm text-text outline-none placeholder:text-text-faint"
        />
      </div>
      {value ? (
        <button
          type="button"
          onClick={() => onChange("")}
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl text-text-muted transition-colors duration-150 hover:bg-surface hover:text-text"
          aria-label="مسح البحث"
        >
          <XIcon className="h-4 w-4" />
        </button>
      ) : null}
    </label>
  )
}

export default function DashboardToolbar({
  searchValue,
  importantFilter,
  stepFilter,
  onSearchValueChange,
  onImportantFilterChange,
  onStepFilterChange,
  onCreateCase,
}: DashboardToolbarProps) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex flex-col gap-1">
          <div className="text-base font-semibold text-text">Ortho Tech Dashboard</div>
          <p className="text-xs text-text-muted">لوحة متابعة حالات ومواعيد المرضى</p>
        </div>

        <Button
          size="md"
          className="justify-center rounded-2xl px-4 shadow-[0_14px_26px_rgba(13,125,211,0.18)]"
          leftIcon={<PlusIcon />}
          onClick={onCreateCase}
        >
          إضافة حالة جديدة
        </Button>
      </div>

      <div className="flex flex-col gap-2 xl:flex-row xl:items-center">
        <SearchField value={searchValue} onChange={onSearchValueChange} />
        <ImportantFilterGroup value={importantFilter} onChange={onImportantFilterChange} />
        <StepFilterDropdown value={stepFilter} onChange={onStepFilterChange} />
      </div>
    </div>
  )
}
