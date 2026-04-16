import {
    HomeIcon,
    SettingsIcon,
    UserStar,
} from "lucide-react"
import { motion } from "motion/react"
import React from "react"

export interface ActivityItem {
    id: string
    icon: React.ReactNode
    label: string

    onClick: () => void
}


const activities: ActivityItem[] = [
    {
        id: 'managers',
        label: 'Managers',
        icon: <UserStar />,
        onClick() {
            
        },
    }
]

function ActivityFooter() {
    
    return (
        <button
            type="button"
            className="group w-full justify-center text-sm rounded-sm flex items-center gap-3 transition-colors duration-150 "
        >
            <div className="relative">
                <div className="w-8 h-8 rounded-sm bg-secondary-tint hover:bg-secondary hover:text-secondary-text text-secondary flex items-center justify-center text-xs font-semibold">
                    <SettingsIcon className="w-5 h-5" />
                </div>
            </div>
        </button>
    )
}

function ActivityItemComponent({ icon, label }: { icon: React.ReactNode, label: string }) {

    return (
        <button
            type="button"
            title={label}
            className={
                `h-8 w-full text-secondary justify-center [&>svg]:w-5 [&>svg]:h-5 text-center bg-secondary-tint hover:text-text! rounded-sm flex items-center gap-3 transition-colors duration-150`
            }
        >
            {icon}
        </button>
    )
}

function Logo() {

    return (
        <div className="w-full flex items-center justify-center gap-2 rounded-sm hover:bg-card transition-all duration-200">
            <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-primary rounded-sm flex justify-center items-center gap-2 transition-colors duration-150">
                    <HomeIcon className="w-5 h-5 text-primary-text" />
                </div>

            </div>
        </div>
    )
}

function DashboardActivityBar() {
  return (
    <motion.div className={
        `h-full w-fit bg-surface p-2 flex flex-col justify-between border-r border-border`
    }>
        <div className="flex flex-col flex-1 gap-2">
            <Logo />
            <div className="flex flex-col gap-2">
                {activities.map((activity) => (
                    <ActivityItemComponent key={activity.id} icon={activity.icon} label={activity.label} />
                ))}
            </div>
        </div>
        <div className="flex flex-col gap-2">
            <ActivityFooter />
        </div>
    </motion.div>
  )
}

export default DashboardActivityBar
