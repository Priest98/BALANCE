'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { createAdminApi } from '@/lib/api';
import { toast } from 'sonner';
import { useState } from 'react';
import { Search, Loader2 } from 'lucide-react';

function getAdminKey(): string {
  if (typeof document === 'undefined') return '';
  return document.cookie.match(/admin_key=([^;]+)/)?.[1] || '';
}

export default function AdminLogsPage() {
  const adminApi = createAdminApi(getAdminKey());
  const [page, setPage] = useState(1);
  const [action, setAction] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['admin-logs', page, action],
    queryFn: () => adminApi.getLogs({ page, limit: 50, action: action || undefined }),
  });

  const actionColors: Record<string, string> = {
    VERIFICATION_REQUESTED: 'text-violet-400 bg-violet-500/10',
    VERIFICATION_COMPLETED: 'text-emerald-400 bg-emerald-500/10',
    VERIFICATION_FAILED: 'text-red-400 bg-red-500/10',
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Audit Logs</h1>
        <p className="text-sm text-muted-foreground mt-1">Complete record of all verification events</p>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Filter by action..."
          value={action}
          onChange={(e) => { setAction(e.target.value); setPage(1); }}
          className="w-full bg-background/50 border border-border rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/50"
        />
      </div>

      <div className="glass rounded-2xl overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center py-20"><Loader2 className="w-6 h-6 animate-spin text-violet-400" /></div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-border/50">
                <tr className="text-xs text-muted-foreground">
                  <th className="text-left px-4 py-3">Action</th>
                  <th className="text-left px-4 py-3">Request ID</th>
                  <th className="text-left px-4 py-3">IP</th>
                  <th className="text-left px-4 py-3">Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/30">
                {(data?.items || []).map((log) => (
                  <tr key={log.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${actionColors[log.action] || 'text-muted-foreground bg-muted/50'}`}>
                        {log.action}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-mono text-xs text-muted-foreground">
                      {log.requestId ? `${log.requestId.slice(0, 12)}...` : '—'}
                    </td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">{log.ip || '—'}</td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">
                      {new Date(log.createdAt).toLocaleString()}
                    </td>
                  </tr>
                ))}
                {data?.items.length === 0 && (
                  <tr><td colSpan={4} className="text-center py-12 text-muted-foreground">No logs found</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {data && data.totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-4 border-t border-border/50">
            <p className="text-xs text-muted-foreground">Page {data.page} of {data.totalPages}</p>
            <div className="flex gap-2">
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                className="px-3 py-1.5 text-xs glass rounded-lg disabled:opacity-50">Previous</button>
              <button onClick={() => setPage(p => Math.min(data.totalPages, p + 1))} disabled={page === data.totalPages}
                className="px-3 py-1.5 text-xs glass rounded-lg disabled:opacity-50">Next</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
