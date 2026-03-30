import React, { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';

export interface DashboardAction {
  label: string;
  onClick: () => void;
  icon?: React.ReactNode;
}

interface DashboardActionContextType {
  action: DashboardAction | null;
  setAction: (action: DashboardAction | null) => void;
}

const DashboardActionContext = createContext<DashboardActionContextType | undefined>(undefined);

export function DashboardActionProvider({ children }: { children: ReactNode }) {
  const [action, setAction] = useState<DashboardAction | null>(null);

  return (
    <DashboardActionContext.Provider value={{ action, setAction }}>
      {children}
    </DashboardActionContext.Provider>
  );
}

export function useDashboardAction() {
  const context = useContext(DashboardActionContext);
  if (context === undefined) {
    throw new Error('useDashboardAction must be used within a DashboardActionProvider');
  }
  return context;
}
