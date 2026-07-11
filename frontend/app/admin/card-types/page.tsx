'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { createAdminApi, type CardType } from '@/lib/api';
import { toast } from 'sonner';
import { Plus, Edit2, Trash2, Loader2, ToggleLeft, ToggleRight, X } from 'lucide-react';

function getAdminKey(): string {
  if (typeof document === 'undefined') return '';
  return document.cookie.match(/admin_key=([^;]+)/)?.[1] || '';
}

export default function AdminCardTypesPage() {
  const adminApi = createAdminApi(getAdminKey());
  const qc = useQueryClient();
  const [editing, setEditing] = useState<Partial<CardType> | null>(null);

  const { data: cardTypes = [], isLoading } = useQuery({
    queryKey: ['admin-card-types'],
    queryFn: adminApi.getCardTypes,
  });

  const createMutation = useMutation({
    mutationFn: (data: Partial<CardType>) => adminApi.createCardType(data),
    onSuccess: () => { toast.success('Card type created'); qc.invalidateQueries({ queryKey: ['admin-card-types'] }); setEditing(null); },
    onError: (e: Error) => toast.error(e.message),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CardType> }) => adminApi.updateCardType(id, data),
    onSuccess: () => { toast.success('Card type updated'); qc.invalidateQueries({ queryKey: ['admin-card-types'] }); setEditing(null); },
    onError: (e: Error) => toast.error(e.message),
  });

  const deleteMutation = useMutation({
    mutationFn: adminApi.deleteCardType,
    onSuccess: () => { toast.success('Card type deleted'); qc.invalidateQueries({ queryKey: ['admin-card-types'] }); },
    onError: (e: Error) => toast.error(e.message),
  });

  const handleSave = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = {
      name: (form.elements.namedItem('name') as HTMLInputElement).value,
      brand: (form.elements.namedItem('brand') as HTMLInputElement).value,
      logo: (form.elements.namedItem('logo') as HTMLInputElement).value || undefined,
      active: (form.elements.namedItem('active') as HTMLInputElement).checked,
    };
    if (editing?.id) {
      updateMutation.mutate({ id: editing.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Card Types</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage supported gift card brands</p>
        </div>
        <button onClick={() => setEditing({})} className="btn-primary flex items-center gap-2 py-2 px-4 text-sm">
          <Plus className="w-4 h-4" /> Add Card Type
        </button>
      </div>

      {/* Modal */}
      {editing !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60" onClick={() => setEditing(null)} />
          <div className="relative glass rounded-2xl p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-semibold">{editing.id ? 'Edit Card Type' : 'New Card Type'}</h2>
              <button onClick={() => setEditing(null)}><X className="w-4 h-4" /></button>
            </div>
            <form onSubmit={handleSave} className="space-y-4">
              {[
                { name: 'name', label: 'Name', placeholder: 'Amazon Gift Card', defaultValue: editing.name },
                { name: 'brand', label: 'Brand (unique)', placeholder: 'amazon', defaultValue: editing.brand },
                { name: 'logo', label: 'Logo URL', placeholder: '/logos/amazon.svg', defaultValue: editing.logo || '' },
              ].map(f => (
                <div key={f.name}>
                  <label className="block text-sm text-muted-foreground mb-1.5">{f.label}</label>
                  <input name={f.name} defaultValue={f.defaultValue} placeholder={f.placeholder}
                    className="w-full bg-background/50 border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/50" />
                </div>
              ))}
              <div className="flex items-center gap-2">
                <input type="checkbox" name="active" id="active" defaultChecked={editing.active ?? true}
                  className="w-4 h-4 accent-violet-500" />
                <label htmlFor="active" className="text-sm">Active</label>
              </div>
              <button type="submit" disabled={createMutation.isPending || updateMutation.isPending}
                className="btn-primary w-full py-2.5 text-sm">
                {createMutation.isPending || updateMutation.isPending ? 'Saving...' : 'Save Card Type'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="glass rounded-2xl overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center py-20"><Loader2 className="w-6 h-6 animate-spin text-violet-400" /></div>
        ) : (
          <table className="w-full text-sm">
            <thead className="border-b border-border/50">
              <tr className="text-xs text-muted-foreground">
                <th className="text-left px-4 py-3">Name</th>
                <th className="text-left px-4 py-3">Brand</th>
                <th className="text-left px-4 py-3">Status</th>
                <th className="text-left px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/30">
              {cardTypes.map((ct) => (
                <tr key={ct.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="px-4 py-3 font-medium">{ct.name}</td>
                  <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{ct.brand}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-1 rounded-full ${ct.active ? 'bg-emerald-500/15 text-emerald-400' : 'bg-muted text-muted-foreground'}`}>
                      {ct.active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button onClick={() => setEditing(ct)}
                        className="p-1.5 hover:bg-white/5 rounded-lg transition-colors text-muted-foreground hover:text-foreground">
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button onClick={() => { if (confirm(`Delete "${ct.name}"?`)) deleteMutation.mutate(ct.id); }}
                        className="p-1.5 hover:bg-red-500/10 rounded-lg transition-colors text-muted-foreground hover:text-red-400">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
