/**
 * Responsive Table Component
 * 
 * Provides mobile-friendly table display with automatic card view on small screens
 */

import React, { ReactNode } from 'react';

interface Column {
    key: string;
    label: string;
    render?: (value: any, row: any) => ReactNode;
    mobileLabel?: string; // Optional different label for mobile
}

interface ResponsiveTableProps {
    columns: Column[];
    data: any[];
    keyField?: string;
    emptyMessage?: string;
    className?: string;
    mobileCardView?: boolean; // Enable card view on mobile (default: true)
}

const ResponsiveTable: React.FC<ResponsiveTableProps> = ({
    columns,
    data,
    keyField = 'id',
    emptyMessage = 'No data available',
    className = '',
    mobileCardView = true
}) => {
    if (data.length === 0) {
        return (
            <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg">
                {emptyMessage}
            </div>
        );
    }

    return (
        <>
            {/* Desktop/Tablet Table View */}
            <div className={`table-container mobile-card-table ${className}`}>
                <table className="w-full text-sm text-left">
                    <thead className="text-xs text-gray-700 uppercase bg-slate-100">
                        <tr>
                            {columns.map((column) => (
                                <th key={column.key} className="px-6 py-3">
                                    {column.label}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                        {data.map((row, index) => (
                            <tr key={row[keyField] || index} className="hover:bg-slate-50 transition-colors">
                                {columns.map((column) => (
                                    <td key={column.key} className="px-6 py-4">
                                        {column.render 
                                            ? column.render(row[column.key], row)
                                            : row[column.key]
                                        }
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Mobile Card View */}
            {mobileCardView && (
                <div className="mobile-card-view space-y-4">
                    {data.map((row, index) => (
                        <div 
                            key={row[keyField] || index}
                            className="bg-white rounded-lg shadow-md border border-gray-200 p-4"
                        >
                            {columns.map((column) => (
                                <div key={column.key} className="mb-3 last:mb-0">
                                    <div className="text-xs font-semibold text-gray-500 uppercase mb-1">
                                        {column.mobileLabel || column.label}
                                    </div>
                                    <div className="text-sm text-gray-800">
                                        {column.render 
                                            ? column.render(row[column.key], row)
                                            : row[column.key]
                                        }
                                    </div>
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            )}
        </>
    );
};

export default ResponsiveTable;
