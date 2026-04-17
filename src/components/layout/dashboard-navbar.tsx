import React from "react"
import { Button } from "../button"


function DashboardNavbar() {

  return (
    <div className="bg-surface border-b border-border text-text py-2 px-2">
      <div className="flex items-center justify-between h-full gap-4">
        <div className="flex items-center w-full justify-between gap-2">
          <div className="text-sm font-medium">Ortho Tech Dashboard</div>
          <Button variant="danger">
            Signout
          </Button>
        </div>
      </div>
    </div>
  )
}

export default DashboardNavbar