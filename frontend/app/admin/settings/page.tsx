'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { createAdminApi } from '@/lib/api';
import { toast } from 'sonner';
import { useState } from 'react';
import { Loader2, Save } from 'lucide-react';

function getAdminKey(): string {
  if (typeof document === 'undefined') return '';
  return document.cookie.match(/admin_key=([^;]+)/)?.[1] || '';
}

export default function AdminSettingsPage() {
  const adminApi = createAdminApi(getAdminKey());
  const qc = useQueryClient();
  const [edited, setEdited] = useState<Record<string, string>>({});

  const { data: settings = [], isLoading } = useQuery({
    queryKey: ['admin-settings'],
    queryFn: adminApi.getSettings,
  });

  const updateMutation = useMutation({
    mutationFn: () =>
      adminApi.updateSettings(Object.entries(edited).map(([key, value]) => ({ key, value }))),
    onSuccess: () => { toast.success('Settings saved'); qc.invalidateQueries({ queryKey: ['admin-settings'] }); setEdited({}); },
    onError: (e: Error) => toast.error(e.message),
  });

  const getValue = (key: string) => edited[key] ?? settings.find(s => s.key === key)?.value ?? '';

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Settings</h1>
          <p className="text-sm text-muted-foreground mt-1">System configuration</p>
        </div>
        {Object.keys(edited).length > 0 && (
          <button
            onClick={() => updateMutation.mutate()}
            disabled={updateMutation.isPending}
            className="btn-primary flex items-center gap-2 py-2 px-4 text-sm"
          >
            {updateMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Save Changes
          </button>
        )}
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20"><Loader2 className="w-6 h-6 animate-spin text-violet-400" /></div>
      ) : (
        <div className="glass rounded-2xl divide-y divide-border/50">
          {settings.map((s) => (
            <div key={s.id} className="flex items-center gap-4 px-6 py-4">
              <div className="flex-1">
                <p className="text-sm font-medium font-mono">{s.key}</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Last updated: {new Date(s.updatedAt).toLocaleString()}
                </p>
              </div>
              <input
                type="text"
                value={getValue(s.key)}
                onChange={(e) => setEdited(prev => ({ ...prev, [s.key]: e.target.value }))}
                className={`w-64 bg-background/50 border rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/50 transition-all ${
                  edited[s.key] !== undefined ? 'border-violet-500/50' : 'border-border'
                }`}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
