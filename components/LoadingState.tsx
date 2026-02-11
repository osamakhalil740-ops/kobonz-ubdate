/**
 * Loading State Components
 * 
 * Provides consistent loading skeletons throughout the application
 */

import React from 'react';

/**
 * Base Skeleton component for shimmer effect
 */
export const Skeleton: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`animate-pulse bg-gray-200 rounded ${className}`} />
  );
};

/**
 * Loading skeleton for cards
 */
export const CardSkeleton: React.FC = () => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-lg border animate-pulse">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <Skeleton className="h-6 w-3/4 mb-2" />
          <Skeleton className="h-4 w-1/2" />
        </div>
        <Skeleton className="h-6 w-16 rounded-full" />
      </div>
      
      <Skeleton className="h-20 w-full mb-4" />
      
      <div className="space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <Skeleton className="h-4 w-4/6" />
      </div>
      
      <div className="mt-4 pt-4 border-t">
        <Skeleton className="h-10 w-full rounded-lg" />
      </div>
    </div>
  );
};

/**
 * Loading skeleton for table rows
 */
export const TableRowSkeleton: React.FC<{ columns?: number }> = ({ columns = 4 }) => {
  return (
    <tr className="animate-pulse">
      {Array.from({ length: columns }).map((_, index) => (
        <td key={index} className="px-6 py-4">
          <Skeleton className="h-4 w-full" />
        </td>
      ))}
    </tr>
  );
};

/**
 * Loading skeleton for entire table
 */
export const TableSkeleton: React.FC<{ rows?: number; columns?: number }> = ({ 
  rows = 5, 
  columns = 4 
}) => {
  return (
    <div className="bg-white rounded-xl shadow-lg border overflow-hidden">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {Array.from({ length: columns }).map((_, index) => (
              <th key={index} className="px-6 py-3">
                <Skeleton className="h-4 w-20" />
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {Array.from({ length: rows }).map((_, index) => (
            <TableRowSkeleton key={index} columns={columns} />
          ))}
        </tbody>
      </table>
    </div>
  );
};

/**
 * Loading skeleton for stat cards
 */
export const StatCardSkeleton: React.FC = () => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-lg border animate-pulse">
      <div className="flex items-center justify-between mb-2">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-8 w-8 rounded-full" />
      </div>
      <Skeleton className="h-8 w-32" />
    </div>
  );
};

/**
 * Loading skeleton for dashboard grid
 */
export const DashboardSkeleton: React.FC = () => {
  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header skeleton */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-8 rounded-xl">
        <Skeleton className="h-8 w-64 mb-2 bg-white/20" />
        <Skeleton className="h-4 w-96 bg-white/20" />
      </div>

      {/* Stats grid skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: 4 }).map((_, index) => (
          <StatCardSkeleton key={index} />
        ))}
      </div>

      {/* Content skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {Array.from({ length: 3 }).map((_, index) => (
            <CardSkeleton key={index} />
          ))}
        </div>
        <div className="space-y-6">
          <CardSkeleton />
          <TableSkeleton rows={3} columns={2} />
        </div>
      </div>
    </div>
  );
};

/**
 * Spinner component for inline loading
 */
export const Spinner: React.FC<{ size?: 'sm' | 'md' | 'lg'; className?: string }> = ({ 
  size = 'md',
  className = '' 
}) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12'
  };

  return (
    <div className={`inline-block ${sizeClasses[size]} ${className}`}>
      <div className="animate-spin rounded-full border-2 border-gray-300 border-t-primary h-full w-full"></div>
    </div>
  );
};

/**
 * Full page loading screen
 */
export const LoadingScreen: React.FC<{ message?: string }> = ({ 
  message = 'Loading...' 
}) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-gray-100">
      <div className="text-center">
        <Spinner size="lg" className="mx-auto mb-4" />
        <p className="text-gray-600 font-medium">{message}</p>
      </div>
    </div>
  );
};

/**
 * Inline loading state with message
 */
export const LoadingState: React.FC<{ 
  message?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}> = ({ 
  message = 'Loading...', 
  size = 'md',
  className = '' 
}) => {
  return (
    <div className={`flex items-center justify-center gap-3 p-8 ${className}`}>
      <Spinner size={size} />
      <p className="text-gray-600">{message}</p>
    </div>
  );
};

/**
 * Empty state component (for when no data is available)
 */
export const EmptyState: React.FC<{
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}> = ({ icon, title, description, action }) => {
  return (
    <div className="text-center py-12 px-4">
      {icon && (
        <div className="flex justify-center mb-4 text-gray-400">
          {icon}
        </div>
      )}
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      {description && (
        <p className="text-gray-600 mb-6 max-w-md mx-auto">{description}</p>
      )}
      {action && (
        <button
          onClick={action.onClick}
          className="bg-primary text-white px-6 py-2 rounded-lg hover:opacity-90 transition-all font-medium"
        >
          {action.label}
        </button>
      )}
    </div>
  );
};

/**
 * Error state component
 */
export const ErrorState: React.FC<{
  title?: string;
  message: string;
  onRetry?: () => void;
}> = ({ 
  title = 'Something went wrong',
  message,
  onRetry 
}) => {
  return (
    <div className="text-center py-12 px-4">
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 mb-4">
        <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 mb-6 max-w-md mx-auto">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="bg-primary text-white px-6 py-2 rounded-lg hover:opacity-90 transition-all font-medium"
        >
          Try Again
        </button>
      )}
    </div>
  );
};
