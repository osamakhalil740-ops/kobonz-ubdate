
import React, { ReactNode, memo } from 'react';

interface StatCardProps {
    title: string;
    value: string | number;
    icon: ReactNode;
    color: string;
}

const StatCard: React.FC<StatCardProps> = memo(({ title, value, icon, color }) => {
    const colorClasses = {
        blue: 'bg-blue-100 text-blue-600',
        green: 'bg-green-100 text-green-600',
        yellow: 'bg-yellow-100 text-yellow-600',
        indigo: 'bg-indigo-100 text-indigo-600',
        purple: 'bg-purple-100 text-purple-600',
        red: 'bg-red-100 text-red-600',
        orange: 'bg-orange-100 text-orange-600',
        teal: 'bg-teal-100 text-teal-600',
    };
    
    return (
        <div className="enhanced-card-subtle card-hover-lift p-4 sm:p-6 flex items-start gap-3 sm:gap-4 slide-up">
            <div className={`p-2 sm:p-3 rounded-lg flex-shrink-0 ${colorClasses[color as keyof typeof colorClasses]}`}>
                <div className="w-5 h-5 sm:w-6 sm:h-6">
                    {icon}
                </div>
            </div>
            <div className="flex flex-col min-w-0 flex-1">
                <p className="caption text-gray-500 text-xs sm:text-sm truncate">{title}</p>
                <p className="heading-sm text-gray-800 text-lg sm:text-2xl font-bold truncate">{value}</p>
            </div>
        </div>
    );
});

StatCard.displayName = 'StatCard';

export default StatCard;