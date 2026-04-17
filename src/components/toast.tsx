import React from 'react'
import { useToastStore, type ToastVariant } from '../lib/toastStore'
import { AnimatePresence, motion } from 'motion/react'
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react'

const variantConfig: Record<ToastVariant, { bg: string; text: string; icon: React.ReactNode }> = {
  success: {
    bg: 'bg-green-50 border-green-200',
    text: 'text-green-900',
    icon: <CheckCircle size={18} className="text-green-600" />,
  },
  error: {
    bg: 'bg-red-50 border-red-200',
    text: 'text-red-900',
    icon: <AlertCircle size={18} className="text-red-600" />,
  },
  info: {
    bg: 'bg-primary/10',
    text: 'text-text',
    icon: <Info size={18} className="text-text" />,
  },
}

export function ToastContainer() {
  const { toasts, removeToast } = useToastStore()

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-sm space-y-2 pointer-events-none">
      <AnimatePresence mode="popLayout">
        {toasts.map((t) => {
          const config = variantConfig[t.variant]
          return (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 16, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.97 }}
              transition={{ type: 'spring', damping: 20, stiffness: 300 }}
              className={`flex items-center gap-3 px-3 py-2 rounded-md pointer-events-auto ${config.bg}`}
            >
              {config.icon}
              <span className={`text-sm font-medium flex-1 ${config.text}`}>{t.message}</span>
              <button
                onClick={() => removeToast(t.id)}
                className={`shrink-0 rounded-sm transition-colors ${config.text} hover:bg-white p-1 hover:opacity-70`}
              >
                <X size={16} />
              </button>
            </motion.div>
          )
        })}
      </AnimatePresence>
    </div>
  )
}
