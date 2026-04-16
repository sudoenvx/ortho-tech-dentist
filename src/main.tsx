import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import React from 'react'
import AppShell from './components/layout/app-shell'
import Dashboard from './pages/dashboard/dashboard'

const root = document.getElementById('root')

if (!root) {
	throw new Error('Root element not found')
}

createRoot(root).render(
	<StrictMode>
		<AppShell>
			<Dashboard />
		</AppShell>
	</StrictMode>,
)
