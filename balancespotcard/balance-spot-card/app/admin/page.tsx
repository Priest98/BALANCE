'use client';

import { useQuery } from '@tanstack/react-query';
import { createAdminApi, type DashboardStats } from '@/lib/api';
import { motion } from 'framer-motion';
import {
  Activity,
  CheckCircle2,
  XCircle,
  Clock,
  TrendingUp,
  CreditCard,
  Loader2,
} from 'lucide-react';

function getAdminKey(): string {
  if (typeof document === 'undefined') return '';
  return document.cookie.match(/admin_key=([^;]+)/)?.[1] || '';
}

export default function AdminDashboardPage() {
  const adminKey = typeof window !== 'undefined' ? getAdminKey() : '';
  const adminApi = createAdminApi(adminKey);

  const { data, isLoading } = useQuery({
    queryKey: ['admin-dashboard'],
    queryFn: adminApi.getDashboard,
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-violet-400" />
      </div>
    );
  }

  const stats = data?.totals;
  const recent = data?.recentRequests || [];
  const chartData = data?.requestsByDay || [];

  const statCards = [
    { label: 'Total Requests', value: stats?.total ?? 0, icon: Activity, color: 'text-violet-400', bg: 'bg-violet-500/10' },
    { label: 'Completed', value: stats?.completed ?? 0, icon: CheckCircle2, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
    { label: 'Failed', value: stats?.failed ?? 0, icon: XCircle, color: 'text-red-400', bg: 'bg-red-500/10' },
    { label: 'Valid Rate', value: `${stats?.validRate ?? 0}%`, icon: TrendingUp, color: 'text-blue-400', bg: 'bg-blue-500/10' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-1">Real-time verification system overview</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass rounded-2xl p-5"
          >
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-muted-foreground">{s.label}</p>
              <div className={`p-2 ${s.bg} rounded-xl`}>
                <s.icon className={`w-4 h-4 ${s.color}`} />
              </div>
            </div>
            <p className="text-3xl font-bold">{s.value.toLocaleString()}</p>
          </motion.div>
        ))}
      </div>

      {/* Chart (Simple bar chart using divs) */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="glass rounded-2xl p-6"
      >
        <h2 className="font-semibold mb-6">Requests (Last 7 Days)</h2>
        <div className="flex items-end gap-2 h-40">
          {chartData.map((d, i) => {
            const max = Math.max(...chartData.map((x) => x.total), 1);
            const height = (d.total / max) * 100;
            return (
              <div key={d.date} className="flex-1 flex flex-col items-center gap-2">
                <div className="w-full flex flex-col items-center gap-0.5" style={{ height: `${Math.max(height, 4)}%` }}>
                  <div
                    className="w-full bg-gradient-to-t from-violet-600 to-violet-400 rounded-t-lg min-h-[4px]"
                    style={{ flex: 1 }}
                    title={`${d.total} requests`}
                  />
                </div>
                <span className="text-xs text-muted-foreground">
                  {new Date(d.date).toLocaleDateString('en', { weekday: 'short' })}
                </span>
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* Recent Requests */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="glass rounded-2xl p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-semibold">Recent Verifications</h2>
          <a href="/admin/verifications" className="text-sm text-violet-400 hover:underline">
            View all →
          </a>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-muted-foreground border-b border-border/50">
                <th className="pb-3 pr-4">ID</th>
                <th className="pb-3 pr-4">Card Type</th>
                <th className="pb-3 pr-4">Amount</th>
                <th className="pb-3 pr-4">Status</th>
                <th className="pb-3">Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/30">
              {recent.map((r) => (
                <tr key={r.id}>
                  <td className="py-3 pr-4 font-mono text-xs text-muted-foreground">{r.id.slice(0, 12)}...</td>
                  <td className="py-3 pr-4">{r.cardType?.name || '—'}</td>
                  <td className="py-3 pr-4">{r.currency} {r.amount.toFixed(2)}</td>
                  <td className="py-3 pr-4">
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      r.status === 'COMPLETED' ? 'bg-emerald-500/15 text-emerald-400' :
                      r.status === 'FAILED' ? 'bg-red-500/15 text-red-400' :
                      'bg-violet-500/15 text-violet-400'
                    }`}>
                      {r.status}
                    </span>
                  </td>
                  <td className="py-3 text-muted-foreground text-xs">
                    {new Date(r.createdAt).toLocaleString()}
                  </td>
                </tr>
              ))}
              {recent.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-muted-foreground">
                    No verifications yet
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}
