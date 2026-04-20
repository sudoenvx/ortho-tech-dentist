import React from "react";

export function CaseListHeader() {
  return (
    <div
      className="grid gap-2 px-3 py-1.5  text-[11px] font-medium uppercase tracking-wider text-secondary-text bg-secondary/80 rounded"
      style={{ gridTemplateColumns: '2fr 1.2fr 1.5fr 1fr 80px' }}
    >
      <span className="pl-[3px]">Patient</span>
      <span>Stage</span>
      <span>Doctor · Updated</span>
      <span>Website</span>
      <span className="text-right">Actions</span>
    </div>
  )
}