import React from 'react';
import { TrendingUp, Users, FileText, DollarSign, Clock, CheckCircle } from 'lucide-react';
import { DashboardStats as Stats } from '../../types';

interface DashboardStatsProps {
  stats: Stats;
}

const DashboardStats: React.FC<DashboardStatsProps> = ({ stats }) => {
  const statCards = [
    {
      title: 'Total Quotes',
      value: stats.totalQuotes.toString(),
      icon: FileText,
      color: 'blue',
      trend: '+12%',
      subtitle: 'This month'
    },
    {
      title: 'Pending Approvals',
      value: stats.pendingApprovals.toString(),
      icon: Clock,
      color: 'amber',
      trend: '-5%',
      subtitle: 'Needs attention'
    },
    {
      title: 'Monthly Revenue',
      value: `$${(stats.monthlyRevenue / 1000).toFixed(0)}K`,
      icon: DollarSign,
      color: 'green',
      trend: '+18%',
      subtitle: 'Target: $250K'
    },
    {
      title: 'Active Clients',
      value: stats.activeClients.toString(),
      icon: Users,
      color: 'teal',
      trend: '+3%',
      subtitle: 'Growing steadily'
    },
    {
      title: 'Completion Rate',
      value: `${stats.completionRate}%`,
      icon: CheckCircle,
      color: 'green',
      trend: '+2.1%',
      subtitle: 'Above target'
    },
    {
      title: 'Avg Quote Value',
      value: `$${stats.averageQuoteValue}`,
      icon: TrendingUp,
      color: 'purple',
      trend: '+8%',
      subtitle: 'Per quote'
    }
  ];

  const getColorClasses = (color: string) => {
    const colors = {
      blue: 'bg-blue-50 text-blue-700 border-blue-200',
      amber: 'bg-amber-50 text-amber-700 border-amber-200',
      green: 'bg-green-50 text-green-700 border-green-200',
      teal: 'bg-teal-50 text-teal-700 border-teal-200',
      purple: 'bg-purple-50 text-purple-700 border-purple-200'
    };
    return colors[color] || colors.blue;
  };

  const getIconColorClasses = (color: string) => {
    const colors = {
      blue: 'text-blue-600',
      amber: 'text-amber-600',
      green: 'text-green-600',
      teal: 'text-teal-600',
      purple: 'text-purple-600'
    };
    return colors[color] || colors.blue;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
      {statCards.map((card, index) => {
        const Icon = card.icon;
        
        return (
          <div
            key={card.title}
            className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-lg ${getColorClasses(card.color)}`}>
                <Icon className={`h-6 w-6 ${getIconColorClasses(card.color)}`} />
              </div>
              <span className={`text-sm font-medium px-2 py-1 rounded-full ${
                card.trend.startsWith('+') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                {card.trend}
              </span>
            </div>
            
            <div className="space-y-1">
              <h3 className="text-2xl font-bold text-gray-900">{card.value}</h3>
              <p className="text-sm font-medium text-gray-900">{card.title}</p>
              <p className="text-xs text-gray-500">{card.subtitle}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default DashboardStats;