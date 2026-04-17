import React from "react"
import { useNavigate } from "react-router-dom"
import { signOut } from "firebase/auth"
import { Button } from "../button"
import { useAuth } from "../../lib/authContext"
import { auth } from "../../lib/firebase"
import { toast } from "../../lib/toastStore"
import { LogOut } from "lucide-react"

function DashboardNavbar() {
  const navigate = useNavigate()
  const { currentUser } = useAuth()

  const handleLogout = async () => {
    try {
      if (auth) {
        await signOut(auth)
        toast.success('Logged out successfully')
        navigate('/login')
      }
    } catch (error) {
      console.error('Failed to logout:', error)
      toast.error('Failed to logout')
    }
  }

  return (
    <div className="bg-surface border-l border-border/0 text-text py-2 px-2">
      <div className="flex items-center justify-between h-full gap-4">
        <div className="flex items-center w-full justify-between gap-2">
          <div className="text-sm font-medium">Ortho Tech Dashboard</div>
          <div className="flex items-center gap-3">
            {currentUser && (
              <span className="text-xs text-text-muted">{currentUser.email}</span>
            )}
            <Button 
              variant="danger"
              size="sm"
              rightIcon={<LogOut size={14} />}
              onClick={handleLogout}
            >
              Sign Out
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DashboardNavbar