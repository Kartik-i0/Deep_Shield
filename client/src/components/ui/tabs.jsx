import React, { createContext, useContext } from 'react';
import { cn } from '@/lib/utils';

const TabsContext = createContext({
  activeTab: '',
  setActiveTab: () => {},
});

export function Tabs({ defaultValue, value, onValueChange, className, children }) {
  const [currentTab, setCurrentTab] = React.useState(defaultValue || '');
  const activeTab = value !== undefined ? value : currentTab;
  const setActiveTab = onValueChange || setCurrentTab;

  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab }}>
      <div className={cn("w-full", className)}>{children}</div>
    </TabsContext.Provider>
  );
}

export function TabsList({ className, children }) {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-1 p-1 bg-slate-900/90 border border-slate-800 rounded-xl",
        className
      )}
    >
      {children}
    </div>
  );
}

export function TabsTrigger({ value, className, children, icon: Icon }) {
  const { activeTab, setActiveTab } = useContext(TabsContext);
  const isActive = activeTab === value;

  return (
    <button
      type="button"
      onClick={() => setActiveTab(value)}
      className={cn(
        "inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all",
        isActive
          ? "bg-sky-600 text-white shadow-md shadow-sky-600/30"
          : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50",
        className
      )}
    >
      {Icon && <Icon className="w-4 h-4" />}
      {children}
    </button>
  );
}

export function TabsContent({ value, className, children }) {
  const { activeTab } = useContext(TabsContext);
  if (activeTab !== value) return null;

  return <div className={cn("mt-4 focus:outline-none animate-fadeIn", className)}>{children}</div>;
}

