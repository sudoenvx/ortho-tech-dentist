import React from "react"
import DashboardActivityBar from "./dashboard-activity-bar"
import DashboardNavbar from "./dashboard-navbar"

interface DashboardLayoutProps {
    children?: React.ReactNode
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  return (
    <div className="flex h-full">
        <DashboardActivityBar />
        <div className="flex flex-col flex-1">
            <DashboardNavbar />
            <div className="flex-1 overflow-auto bg-[#edecea]">
                {children}
            </div>
        </div>
    </div>
  )
}

export default DashboardLayout