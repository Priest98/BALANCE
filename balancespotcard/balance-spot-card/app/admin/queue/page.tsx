'use client';

import { useQuery, useMutation } from '@tanstack/react-query';
import { createAdminApi } from '@/lib/api';
import { toast } from 'sonner';
import { Loader2, RefreshCw, Trash2, Activity, CheckCircle2, XCircle, Clock, AlertTriangle } from 'lucide-react';

function getAdminKey(): string {
  if (typeof document === 'undefined') return '';
  return document.cookie.match(/admin_key=([^;]+)/)?.[1] || '';
}

export default function AdminQueuePage() {
  const adminApi = createAdminApi(getAdminKey());

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['admin-queue'],
    queryFn: adminApi.getQueueStats,
    refetchInterval: 10000,
  });

  const retryMutation = useMutation({
    mutationFn: adminApi.retryFailed,
    onSuccess: (d) => { toast.success(`Retried ${d.retried} jobs`); refetch(); },
    onError: (e: Error) => toast.error(e.message),
  });

  const cleanMutation = useMutation({
    mutationFn: adminApi.cleanJobs,
    onSuccess: () => { toast.success('Old jobs cleaned'); refetch(); },
    onError: (e: Error) => toast.error(e.message),
  });

  const stats = data?.stats;
  const queueCards = [
    { label: 'Waiting', value: stats?.waiting ?? 0, icon: Clock, color: 'text-yellow-400', bg: 'bg-yellow-500/10' },
    { label: 'Active', value: stats?.active ?? 0, icon: Activity, color: 'text-blue-400', bg: 'bg-blue-500/10' },
    { label: 'Completed', value: stats?.completed ?? 0, icon: CheckCircle2, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
    { label: 'Failed', value: stats?.failed ?? 0, icon: XCircle, color: 'text-red-400', bg: 'bg-red-500/10' },
    { label: 'Delayed', value: stats?.delayed ?? 0, icon: AlertTriangle, color: 'text-orange-400', bg: 'bg-orange-500/10' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Queue Monitor</h1>
          <p className="text-sm text-muted-foreground mt-1">BullMQ verification queue status</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => refetch()} className="glass px-3 py-2 rounded-xl text-sm flex items-center gap-2 hover:border-violet-500/30 transition-all">
            <RefreshCw className="w-4 h-4" /> Refresh
          </button>
          <button onClick={() => retryMutation.mutate()} disabled={retryMutation.isPending}
            className="glass px-3 py-2 rounded-xl text-sm flex items-center gap-2 text-yellow-400 hover:border-yellow-500/30 transition-all">
            <RefreshCw className={`w-4 h-4 ${retryMutation.isPending ? 'animate-spin' : ''}`} />
            Retry Failed
          </button>
          <button onClick={() => cleanMutation.mutate()} disabled={cleanMutation.isPending}
            className="glass px-3 py-2 rounded-xl text-sm flex items-center gap-2 text-red-400 hover:border-red-500/30 transition-all">
            <Trash2 className="w-4 h-4" /> Clean Old
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20"><Loader2 className="w-6 h-6 animate-spin text-violet-400" /></div>
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {queueCards.map(c => (
              <div key={c.label} className="glass rounded-2xl p-5">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-xs text-muted-foreground">{c.label}</p>
                  <div className={`p-1.5 ${c.bg} rounded-lg`}><c.icon className={`w-3.5 h-3.5 ${c.color}`} /></div>
                </div>
                <p className="text-2xl font-bold">{c.value.toLocaleString()}</p>
              </div>
            ))}
          </div>

          {/* Recent Jobs */}
          <div className="glass rounded-2xl p-6">
            <h2 className="font-semibold mb-4">Recent Active Jobs</h2>
            {(data?.jobs.active?.length ?? 0) === 0 ? (
              <p className="text-sm text-muted-foreground py-4 text-center">No active jobs</p>
            ) : (
              <div className="space-y-2">
                {data?.jobs.active?.slice(0, 5).map((job: any) => (
                  <div key={job.id} className="flex items-center justify-between p-3 bg-white/[0.03] rounded-xl text-sm">
                    <span className="font-mono text-xs text-muted-foreground">#{job.id}</span>
                    <span className="text-xs text-blue-400">Processing</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="glass rounded-2xl p-6">
            <h2 className="font-semibold mb-4">Recent Failed Jobs</h2>
            {(data?.jobs.failed?.length ?? 0) === 0 ? (
              <p className="text-sm text-muted-foreground py-4 text-center">No failed jobs 🎉</p>
            ) : (
              <div className="space-y-2">
                {data?.jobs.failed?.slice(0, 5).map((job: any) => (
                  <div key={job.id} className="flex items-center justify-between p-3 bg-red-500/5 rounded-xl text-sm">
                    <span className="font-mono text-xs text-muted-foreground">#{job.id}</span>
                    <span className="text-xs text-red-400">{job.failedReason || 'Unknown error'}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
