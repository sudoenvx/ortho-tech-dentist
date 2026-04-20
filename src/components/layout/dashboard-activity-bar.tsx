import React from 'react'
import { NavLink } from 'react-router-dom'
import { HomeIcon, UserStar, Globe, SettingsIcon } from 'lucide-react'
import { motion } from 'motion/react'
import { cn } from '../../lib/cn'

interface ActivityItem {
  id: string
  label: string
  icon: React.ReactNode
  to: string
  disabled?: boolean
}

const activities: ActivityItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: <HomeIcon className='w-5 h-5' />,
    to: '/',
  },
  {
    id: 'websites',
    label: 'Websites',
    icon: <Globe className='w-5 h-5' />,
    to: '/websites',
  },
  {
    id: 'managers',
    label: 'Managers',
    icon: <UserStar className='w-5 h-5' />,
    to: '/managers',
    disabled: true
  },
]

function ActivityFooter() {
  return (
    <button
      type="button"
      className="group w-full justify-center text-sm rounded-sm flex items-center gap-3 transition-colors duration-150"
    >
      <div className="relative">
        <div className="w-8 h-8 rounded-sm bg-secondary-tint hover:bg-secondary hover:text-secondary-text text-secondary flex items-center justify-center text-xs font-semibold">
          <SettingsIcon className="w-5 h-5" />
        </div>
      </div>
    </button>
  )
}

function ActivityItemComponent({ icon, label, to, disabled }: ActivityItem) {
  return (
    <NavLink
      to={disabled ? '#' : to}
      title={label}
      onClick={(e) => disabled && e.preventDefault()}
      className={({ isActive }) =>
        cn(
          'h-8 w-full text-center rounded-sm flex items-center justify-center gap-3 transition-colors duration-150',
          disabled
            ? 'opacity-50 cursor-not-allowed bg-secondary/20 text-secondary'
            : isActive
            ? 'bg-primary text-primary-text'
            : 'bg-secondary/20 text-secondary hover:text-text hover:bg-secondary/30',
        )
      }
    >
      {icon}
    </NavLink>
  )
}

function DashboardActivityBar() {
  return (
    <motion.div className="h-full w-fit bg-surface p-2 flex flex-col justify-between ">
      <div className="flex flex-col flex-1 gap-2">
        <div className="flex flex-col gap-2">
          {activities.map((activity) => (
            <ActivityItemComponent id={activity.id} key={activity.id} icon={activity.icon} label={activity.label} to={activity.to} disabled={activity.disabled} />
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
