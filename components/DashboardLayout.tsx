/**
 * Reusable Dashboard Layout Component
 * 
 * Provides consistent layout structure for all dashboards
 */

import React, { ReactNode } from 'react';
import { useTranslation } from '../hooks/useTranslation';

export interface DashboardLayoutProps {
  title: string;
  subtitle?: string;
  headerGradient?: string;
  actions?: ReactNode;
  children: ReactNode;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  title,
  subtitle,
  headerGradient = 'from-indigo-600 to-purple-600',
  actions,
  children
}) => {
  const { dir } = useTranslation();

  return (
    <div className="space-y-6 sm:space-y-8 animate-fadeIn" dir={dir}>
      {/* Header */}
      <div className={`bg-gradient-to-r ${headerGradient} p-4 sm:p-6 md:p-8 rounded-xl shadow-lg`}>
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2 break-words">
              {title}
            </h1>
            {subtitle && (
              <p className="text-white/90 text-sm sm:text-base">
                {subtitle}
              </p>
            )}
          </div>
          {actions && (
            <div className="flex flex-wrap gap-2 sm:gap-3">
              {actions}
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      {children}
    </div>
  );
};

/**
 * Stats Grid Component
 */
export interface StatGridProps {
  children: ReactNode;
  columns?: number;
}

export const StatGrid: React.FC<StatGridProps> = ({ 
  children, 
  columns = 4 
}) => {
  const gridCols = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'
  };

  return (
    <div className={`grid ${gridCols[columns as keyof typeof gridCols]} gap-4 sm:gap-6`}>
      {children}
    </div>
  );
};

/**
 * Content Grid Component
 */
export interface ContentGridProps {
  main: ReactNode;
  sidebar?: ReactNode;
}

export const ContentGrid: React.FC<ContentGridProps> = ({ 
  main, 
  sidebar 
}) => {
  if (!sidebar) {
    return <div>{main}</div>;
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-6">
        {main}
      </div>
      <div className="space-y-6">
        {sidebar}
      </div>
    </div>
  );
};

/**
 * Tab Component
 */
export interface Tab {
  id: string;
  label: string;
  icon?: ReactNode;
  count?: number;
}

export interface TabsProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

export const Tabs: React.FC<TabsProps> = ({ tabs, activeTab, onTabChange }) => {
  return (
    <div className="border-b border-gray-200">
      <nav className="flex gap-8" aria-label="Tabs">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`
                py-4 px-1 border-b-2 font-medium text-sm transition-colors
                flex items-center gap-2
                ${
                  isActive
                    ? 'border-primary text-primary'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }
              `}
              aria-current={isActive ? 'page' : undefined}
            >
              {tab.icon && <span className="w-5 h-5">{tab.icon}</span>}
              {tab.label}
              {tab.count !== undefined && (
                <span
                  className={`
                    ml-2 py-0.5 px-2 rounded-full text-xs font-medium
                    ${
                      isActive
                        ? 'bg-primary/10 text-primary'
                        : 'bg-gray-100 text-gray-600'
                    }
                  `}
                >
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </nav>
    </div>
  );
};

/**
 * Section Component
 */
export interface SectionProps {
  title: string;
  description?: string;
  action?: ReactNode;
  children: ReactNode;
}

export const Section: React.FC<SectionProps> = ({
  title,
  description,
  action,
  children
}) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-lg border">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-1">
            {title}
          </h2>
          {description && (
            <p className="text-sm text-gray-600">
              {description}
            </p>
          )}
        </div>
        {action}
      </div>
      {children}
    </div>
  );
};
