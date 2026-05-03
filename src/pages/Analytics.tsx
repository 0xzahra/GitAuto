import React, { useMemo } from 'react';
import { useAppContext } from '../contexts/AppContext';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Activity, Clock, CalendarDays, BarChart } from 'lucide-react';
import ActivityLog from './ActivityLog';

export default function Analytics() {
  const { getStats } = useAppContext();
  
  const stats = useMemo(() => {
    const history: { date: string }[] = getStats();
    
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
    const yesterday = today - 86400000;
    const thisWeek = today - 86400000 * 7;
    const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1).getTime();
    const thisYear = new Date(now.getFullYear(), 0, 1).getTime();
    
    let stats = {
      today: 0,
      yesterday: 0,
      thisWeek: 0,
      thisMonth: 0,
      thisYear: 0,
      allTime: history.length
    };
    
    const chartDataMap: Record<string, number> = {};
    
    // Start last 7 days for chart
    for (let i = 6; i >= 0; i--) {
      const d = new Date(today - (i * 86400000));
      chartDataMap[`${d.getMonth()+1}/${d.getDate()}`] = 0;
    }

    history.forEach(item => {
      const t = new Date(item.date).getTime();
      if (t >= today) stats.today++;
      else if (t >= yesterday && t < today) stats.yesterday++;
      
      if (t >= thisWeek) stats.thisWeek++;
      if (t >= thisMonth) stats.thisMonth++;
      if (t >= thisYear) stats.thisYear++;
      
      if (t >= thisWeek) {
        const d = new Date(t);
        const key = `${d.getMonth()+1}/${d.getDate()}`;
        if (chartDataMap[key] !== undefined) chartDataMap[key]++;
      }
    });

    const chartData = Object.keys(chartDataMap).map(date => ({
      date,
      count: chartDataMap[date]
    }));

    return { stats, chartData };
  }, [getStats]);

  return (
    <div className="max-w-6xl mx-auto py-8">
      <div className="mb-8">
        <h2 className="text-3xl font-bold tracking-tight mb-2">Analytics Dashboard</h2>
        <p className="text-[var(--text-secondary)]">Track your documentation generation activity over time.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-8">
        <div className="opus-glass p-6 flex flex-col">
          <div className="flex items-center text-[var(--accent-primary)] mb-2 space-x-2">
            <Activity size={18} />
            <span className="font-bold text-xs tracking-widest uppercase">Today</span>
          </div>
          <span className="text-4xl font-bold text-[var(--text-primary)]">{stats.stats.today}</span>
          <div className="progress-bar mt-4"><div className="progress-fill" style={{ width: `${Math.min(100, (stats.stats.today / (stats.stats.allTime || 1)) * 100)}%` }}></div></div>
        </div>
        
        <div className="opus-glass p-6 flex flex-col">
          <div className="flex items-center text-[var(--text-secondary)] mb-2 space-x-2">
            <Clock size={18} />
            <span className="font-bold text-xs tracking-widest uppercase">Yesterday</span>
          </div>
          <span className="text-4xl font-bold text-[var(--text-primary)]">{stats.stats.yesterday}</span>
          <div className="progress-bar mt-4"><div className="progress-fill opacity-50 bg-[var(--text-secondary)]" style={{ width: `${Math.min(100, (stats.stats.yesterday / (stats.stats.allTime || 1)) * 100)}%` }}></div></div>
        </div>

        <div className="opus-glass p-6 flex flex-col">
          <div className="flex items-center text-[var(--accent-secondary)] mb-2 space-x-2">
            <CalendarDays size={18} />
            <span className="font-bold text-xs tracking-widest uppercase">This Week</span>
          </div>
          <span className="text-4xl font-bold text-[var(--text-primary)]">{stats.stats.thisWeek}</span>
          <div className="progress-bar mt-4"><div className="progress-fill bg-[var(--accent-secondary)]" style={{ width: `${Math.min(100, (stats.stats.thisWeek / (stats.stats.allTime || 1)) * 100)}%` }}></div></div>
        </div>

        <div className="opus-glass p-6 flex flex-col">
          <div className="flex items-center text-[var(--text-secondary)] mb-2 space-x-2">
            <BarChart size={18} />
            <span className="font-bold text-xs tracking-widest uppercase">All Time</span>
          </div>
          <span className="text-4xl font-bold text-[var(--text-primary)]">{stats.stats.allTime}</span>
          <div className="progress-bar mt-4"><div className="progress-fill bg-[var(--text-primary)]" style={{ width: '100%' }}></div></div>
        </div>
      </div>

      <div className="opus-glass p-6 md:p-8 h-[400px]">
        <h3 className="text-lg font-bold mb-6">Generations Last 7 Days</h3>
        <ResponsiveContainer width="100%" height="80%">
          <LineChart data={stats.chartData} margin={{ top: 5, right: 20, bottom: 20, left: 0 }}>
             <XAxis 
               dataKey="date" 
               stroke="var(--text-secondary)" 
               axisLine={false} 
               tickLine={false}
               dy={10}
             />
             <YAxis 
               stroke="var(--text-secondary)" 
               axisLine={false} 
               tickLine={false}
               allowDecimals={false}
             />
             <Tooltip 
               contentStyle={{ 
                 backgroundColor: 'var(--bg-surface)', 
                 borderColor: 'var(--border-color)',
                 borderRadius: '12px',
                 boxShadow: '0 8px 32px rgba(0,0,0,0.2)'
               }} 
             />
             <Line 
               type="monotone" 
               dataKey="count" 
               stroke="var(--accent-primary)" 
               strokeWidth={4} 
               dot={{ r: 6, fill: 'var(--bg-surface)', strokeWidth: 3 }}
               activeDot={{ r: 8, stroke: 'var(--accent-primary)', strokeWidth: 2 }}
             />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-8">
        <ActivityLog />
      </div>
    </div>
  );
}
