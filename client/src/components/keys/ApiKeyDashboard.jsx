import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert } from '@/components/ui/alert';
import { KeyStatusCard } from './KeyStatusCard';
import { AddKeyDialog } from './AddKeyDialog';
import { fetchApiKeys, deleteApiKey, resetAllCooldowns } from '@/services/keyApi';
import { Key, Plus, RotateCcw, Sparkles, Cpu, ShieldCheck } from 'lucide-react';

export function ApiKeyDashboard() {
  const [data, setData] = useState({ gemini: { keys: [] }, huggingFace: { tokens: [] } });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [actionMessage, setActionMessage] = useState(null);

  const loadKeys = async () => {
    try {
      setIsLoading(true);
      const res = await fetchApiKeys();
      setData(res.data);
      setError(null);
    } catch (err) {
      setError(err.message || 'Failed to fetch API key pool status.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadKeys();
    // Poll key statuses every 10 seconds to update cooldown timers
    const timer = setInterval(loadKeys, 10000);
    return () => clearInterval(timer);
  }, []);

  const handleDelete = async (provider, id) => {
    try {
      await deleteApiKey(provider, id);
      setActionMessage('Key removed successfully.');
      loadKeys();
      setTimeout(() => setActionMessage(null), 3000);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleResetCooldowns = async () => {
    try {
      await resetAllCooldowns();
      setActionMessage('All key cooldowns and quotas have been reset.');
      loadKeys();
      setTimeout(() => setActionMessage(null), 3000);
    } catch (err) {
      setError(err.message);
    }
  };

  const gemini = data.gemini || { total: 0, active: 0, rateLimited: 0, keys: [] };
  const hf = data.huggingFace || { total: 0, active: 0, rateLimited: 0, tokens: [] };

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-white tracking-tight flex items-center gap-2">
            <Key className="w-5 h-5 text-sky-400" />
            API Key Rotation & Quota Management Pool
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Configure multiple free Gemini and Hugging Face keys. The engine balances traffic and automatically rotates keys when 429 rate limits are encountered.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="outline"
            size="sm"
            onClick={handleResetCooldowns}
            className="gap-1.5 text-xs border-slate-700 text-slate-300 hover:text-white"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset Cooldowns
          </Button>

          <Button
            size="sm"
            onClick={() => setShowAddDialog(true)}
            className="gap-1.5 text-xs shadow-sky-600/30"
          >
            <Plus className="w-3.5 h-3.5" />
            Add New Key
          </Button>
        </div>
      </div>

      {actionMessage && <Alert variant="success">{actionMessage}</Alert>}
      {error && <Alert variant="destructive">{error}</Alert>}

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4 bg-slate-900/70 border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Gemini Keys Pool</span>
            <Sparkles className="w-4 h-4 text-sky-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-white">{gemini.total || 0}</span>
            <span className="text-xs text-emerald-400 font-medium">({gemini.active || 0} active)</span>
          </div>
        </Card>

        <Card className="p-4 bg-slate-900/70 border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Gemini Rate-Limited</span>
            <Key className="w-4 h-4 text-amber-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-amber-400">{gemini.rateLimited || 0}</span>
            <span className="text-xs text-slate-400 font-medium">in cooldown</span>
          </div>
        </Card>

        <Card className="p-4 bg-slate-900/70 border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">HuggingFace Tokens</span>
            <Cpu className="w-4 h-4 text-purple-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-white">{hf.total || 0}</span>
            <span className="text-xs text-emerald-400 font-medium">({hf.active || 0} active)</span>
          </div>
        </Card>

        <Card className="p-4 bg-slate-900/70 border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Failover Engine</span>
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-xs font-bold text-emerald-400">Zero-Downtime</span>
            <span className="text-xs text-slate-400">Auto-Recovery</span>
          </div>
        </Card>
      </div>

      {/* Gemini Pool Section */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-sky-400" />
            <CardTitle className="text-sm">Google Gemini Multi-Key Rotation Pool</CardTitle>
          </div>
          <span className="text-xs text-slate-400">
            {gemini.active} / {gemini.total} Ready
          </span>
        </CardHeader>
        <CardContent className="space-y-3">
          {gemini.keys && gemini.keys.length > 0 ? (
            gemini.keys.map((k) => (
              <KeyStatusCard
                key={k.id}
                keyItem={k}
                provider="gemini"
                onDelete={handleDelete}
              />
            ))
          ) : (
            <div className="text-center py-6 text-xs text-slate-400 border border-dashed border-slate-800 rounded-xl">
              No custom Gemini keys added yet. The engine runs on the default environment key or falls back to local and Hugging Face models. Click "Add New Key" to add your Gemini keys.
            </div>
          )}
        </CardContent>
      </Card>

      {/* Hugging Face Pool Section */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="flex items-center gap-2">
            <Cpu className="w-4 h-4 text-purple-400" />
            <CardTitle className="text-sm">Hugging Face API Token Pool</CardTitle>
          </div>
          <span className="text-xs text-slate-400">
            {hf.active} / {hf.total} Ready
          </span>
        </CardHeader>
        <CardContent className="space-y-3">
          {hf.tokens && hf.tokens.length > 0 ? (
            hf.tokens.map((t) => (
              <KeyStatusCard
                key={t.id}
                keyItem={t}
                provider="huggingface"
                onDelete={handleDelete}
              />
            ))
          ) : (
            <div className="text-center py-6 text-xs text-slate-400 border border-dashed border-slate-800 rounded-xl">
              No custom Hugging Face tokens added yet. Standard public free inference models are used. Click "Add New Key" to register your Hugging Face token for higher rate limits.
            </div>
          )}
        </CardContent>
      </Card>

      <AddKeyDialog
        open={showAddDialog}
        onClose={() => setShowAddDialog(false)}
        onKeyAdded={loadKeys}
      />
    </div>
  );
}

