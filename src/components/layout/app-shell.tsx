import React from "react";
import DashboardLayout from "./dashboard-layout";

interface AppShellProps {
  children: React.ReactNode;
}

export default function AppShell({ children }: AppShellProps) {
  return (
    <div className="h-screen bg-background p-4 gap-3">
      <div className="bg-white flex h-full rounded-xl overflow-hidden">
        <div className="flex-1 overflow-hidden">
          <DashboardLayout>
            {children}
          </DashboardLayout>
        </div>
      </div>
    </div>
  );
}
