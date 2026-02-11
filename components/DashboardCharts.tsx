import React from 'react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface DashboardChartsProps {
  type?: 'line' | 'bar' | 'pie' | 'area';
  data: any[];
  dataKey?: string;
  title?: string;
  subtitle?: string;
  color?: string;
}

const COLORS = {
  primary: '#bf0000',
  secondary: '#667eea',
  success: '#22c55e',
  warning: '#f59e0b',
  info: '#3b82f6',
  purple: '#8b5cf6',
  pink: '#ec4899',
};

const CHART_COLORS = [
  COLORS.primary,
  COLORS.secondary,
  COLORS.success,
  COLORS.warning,
  COLORS.info,
  COLORS.purple,
  COLORS.pink,
];

export const DashboardCharts: React.FC<DashboardChartsProps> = ({
  type = 'line',
  data,
  dataKey = 'value',
  title,
  subtitle,
  color = COLORS.primary,
}) => {
  const renderChart = () => {
    switch (type) {
      case 'line':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f5f5f5" />
              <XAxis dataKey="name" stroke="#737373" style={{ fontSize: '0.875rem' }} />
              <YAxis stroke="#737373" style={{ fontSize: '0.875rem' }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e5e5e5',
                  borderRadius: '0.5rem',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                }}
              />
              <Legend wrapperStyle={{ fontSize: '0.875rem' }} />
              <Line
                type="monotone"
                dataKey={dataKey}
                stroke={color}
                strokeWidth={3}
                dot={{ fill: color, r: 5 }}
                activeDot={{ r: 7 }}
              />
            </LineChart>
          </ResponsiveContainer>
        );

      case 'bar':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f5f5f5" />
              <XAxis dataKey="name" stroke="#737373" style={{ fontSize: '0.875rem' }} />
              <YAxis stroke="#737373" style={{ fontSize: '0.875rem' }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e5e5e5',
                  borderRadius: '0.5rem',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                }}
              />
              <Legend wrapperStyle={{ fontSize: '0.875rem' }} />
              <Bar dataKey={dataKey} fill={color} radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        );

      case 'pie':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey={dataKey}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e5e5e5',
                  borderRadius: '0.5rem',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        );

      case 'area':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={data}>
              <defs>
                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={color} stopOpacity={0.8} />
                  <stop offset="95%" stopColor={color} stopOpacity={0.1} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f5f5f5" />
              <XAxis dataKey="name" stroke="#737373" style={{ fontSize: '0.875rem' }} />
              <YAxis stroke="#737373" style={{ fontSize: '0.875rem' }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e5e5e5',
                  borderRadius: '0.5rem',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                }}
              />
              <Legend wrapperStyle={{ fontSize: '0.875rem' }} />
              <Area
                type="monotone"
                dataKey={dataKey}
                stroke={color}
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorValue)"
              />
            </AreaChart>
          </ResponsiveContainer>
        );

      default:
        return null;
    }
  };

  return (
    <div className="dashboard-chart-card">
      {(title || subtitle) && (
        <div className="chart-header">
          {title && <h3 className="chart-title">{title}</h3>}
          {subtitle && <p className="chart-subtitle">{subtitle}</p>}
        </div>
      )}
      <div className="chart-container">{renderChart()}</div>
    </div>
  );
};

// Quick Stats Card Component
interface QuickStatProps {
  title: string;
  value: string | number;
  change?: number;
  icon?: React.ReactNode;
  color?: string;
  trend?: 'up' | 'down';
}

export const QuickStat: React.FC<QuickStatProps> = ({
  title,
  value,
  change,
  icon,
  color = COLORS.primary,
  trend,
}) => {
  return (
    <div className="quick-stat-card">
      <div className="quick-stat-header">
        <div className="quick-stat-icon" style={{ backgroundColor: `${color}15`, color }}>
          {icon}
        </div>
        {change !== undefined && (
          <div className={`quick-stat-change ${trend === 'up' ? 'positive' : 'negative'}`}>
            <span className="change-arrow">{trend === 'up' ? '↑' : '↓'}</span>
            <span className="change-value">{Math.abs(change)}%</span>
          </div>
        )}
      </div>
      <div className="quick-stat-body">
        <div className="quick-stat-value">{value}</div>
        <div className="quick-stat-title">{title}</div>
      </div>
    </div>
  );
};

// Sample data generators
export const generateLineData = () => [
  { name: 'Jan', value: 400 },
  { name: 'Feb', value: 300 },
  { name: 'Mar', value: 600 },
  { name: 'Apr', value: 800 },
  { name: 'May', value: 500 },
  { name: 'Jun', value: 900 },
];

export const generateBarData = () => [
  { name: 'Mon', value: 120 },
  { name: 'Tue', value: 200 },
  { name: 'Wed', value: 150 },
  { name: 'Thu', value: 300 },
  { name: 'Fri', value: 250 },
  { name: 'Sat', value: 400 },
  { name: 'Sun', value: 350 },
];

export const generatePieData = () => [
  { name: 'Active', value: 400 },
  { name: 'Pending', value: 300 },
  { name: 'Expired', value: 200 },
  { name: 'Redeemed', value: 500 },
];
