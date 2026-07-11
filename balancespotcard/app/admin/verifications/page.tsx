'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { createAdminApi } from '@/lib/api';
import { motion } from 'framer-motion';
import { Search, Loader2, CheckCircle2, XCircle, Clock, AlertTriangle } from 'lucide-react';

function getAdminKey(): string {
  if (typeof document === 'undefined') return '';
  return document.cookie.match(/admin_key=([^;]+)/)?.[1] || '';
}

const STATUS_OPTIONS = ['', 'PENDING', 'PROCESSING', 'COMPLETED', 'FAILED'];

export default function AdminVerificationsPage() {
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState('');
  const [search, setSearch] = useState('');

  const adminApi = createAdminApi(getAdminKey());

  const { data, isLoading } = useQuery({
    queryKey: ['admin-verifications', page, status, search],
    queryFn: () => adminApi.getVerifications({ page, limit: 20, status: status || undefined, search: search || undefined }),
  });

  const statusIcon = (s: string) => {
    if (s === 'COMPLETED') return <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />;
    if (s === 'FAILED') return <XCircle className="w-3.5 h-3.5 text-red-400" />;
    if (s === 'PROCESSING') return <Loader2 className="w-3.5 h-3.5 text-violet-400 animate-spin" />;
    return <Clock className="w-3.5 h-3.5 text-yellow-400" />;
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Verifications</h1>
        <p className="text-sm text-muted-foreground mt-1">All verification requests</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by ID..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="w-full bg-background/50 border border-border rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/50"
          />
        </div>
        <select
          value={status}
          onChange={(e) => { setStatus(e.target.value); setPage(1); }}
          className="bg-background/50 border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/50"
        >
          {STATUS_OPTIONS.map((s) => (
            <option key={s} value={s}>{s || 'All Statuses'}</option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="glass rounded-2xl overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-6 h-6 animate-spin text-violet-400" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-border/50">
                <tr className="text-xs text-muted-foreground">
                  <th className="text-left px-4 py-3">ID</th>
                  <th className="text-left px-4 py-3">Card Type</th>
                  <th className="text-left px-4 py-3">Amount</th>
                  <th className="text-left px-4 py-3">Status</th>
                  <th className="text-left px-4 py-3">Valid</th>
                  <th className="text-left px-4 py-3">Created</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/30">
                {(data?.items || []).map((item) => (
                  <tr key={item.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{item.id.slice(0, 14)}...</td>
                    <td className="px-4 py-3">{item.cardType?.name || '—'}</td>
                    <td className="px-4 py-3">{item.currency} {item.amount.toFixed(2)}</td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center gap-1.5">
                        {statusIcon(item.status)}
                        <span className="text-xs">{item.status}</span>
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {item.verificationResult ? (
                        item.verificationResult.valid ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        ) : (
                          <XCircle className="w-4 h-4 text-red-400" />
                        )
                      ) : '—'}
                    </td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">
                      {new Date(item.createdAt).toLocaleString()}
                    </td>
                  </tr>
                ))}
                {data?.items.length === 0 && (
                  <tr>
                    <td colSpan={6} className="text-center py-12 text-muted-foreground">
                      No verifications found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {data && data.totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-4 border-t border-border/50">
            <p className="text-xs text-muted-foreground">
              Page {data.page} of {data.totalPages} ({data.total} total)
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-3 py-1.5 text-xs glass rounded-lg disabled:opacity-50"
              >
                Previous
              </button>
              <button
                onClick={() => setPage(p => Math.min(data.totalPages, p + 1))}
                disabled={page === data.totalPages}
                className="px-3 py-1.5 text-xs glass rounded-lg disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
