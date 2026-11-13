import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert } from '@/components/ui/alert';
import { KeyStatusCard } from './KeyStatusCard';
import { AddKeyDialog } from './AddKeyDialog';
import { fetchApiKeys, deleteApiKey, resetAllCooldowns } from '@/services/keyApi';
import { Key, Plus, RotateCcw } from 'lucide-react';

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
    const timer = setInterval(loadKeys, 15000);
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
      setActionMessage('All key cooldowns have been reset.');
      loadKeys();
      setTimeout(() => setActionMessage(null), 3000);
    } catch (err) {
      setError(err.message);
    }
  };

  const gemini = data.gemini || { total: 0, active: 0, keys: [] };
  const hf = data.huggingFace || { total: 0, active: 0, tokens: [] };

  return (
    <div className="space-y-5 fade-in">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
            <Key className="w-4 h-4 text-zinc-400" />
            API Keys & Quota Management
          </h2>
          <p className="text-xs text-zinc-400 mt-0.5">
            Manage your Google Gemini API keys and Hugging Face tokens. The engine balances usage and handles rate-limits automatically.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleResetCooldowns}
            className="gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset
          </Button>

          <Button
            size="sm"
            onClick={() => setShowAddDialog(true)}
            className="gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Key
          </Button>
        </div>
      </div>

      {actionMessage && <Alert variant="success">{actionMessage}</Alert>}
      {error && <Alert variant="destructive">{error}</Alert>}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Card className="p-4">
          <div className="text-xs font-medium text-zinc-400">Gemini Keys Configured</div>
          <div className="text-2xl font-bold text-white mt-1">
            {gemini.total} <span className="text-xs font-normal text-emerald-400">({gemini.active} active)</span>
          </div>
        </Card>

        <Card className="p-4">
          <div className="text-xs font-medium text-zinc-400">Hugging Face Tokens</div>
          <div className="text-2xl font-bold text-white mt-1">
            {hf.total} <span className="text-xs font-normal text-emerald-400">({hf.active} active)</span>
          </div>
        </Card>
      </div>

      {/* Gemini Pool */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-xs">Google Gemini Keys</CardTitle>
          <span className="text-xs text-zinc-500">{gemini.active} ready</span>
        </CardHeader>
        <CardContent className="space-y-2.5">
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
            <div className="text-center py-6 text-xs text-zinc-500 border border-dashed border-zinc-800 rounded-lg">
              No Gemini keys found. Click "Add Key" above to register your API key.
            </div>
          )}
        </CardContent>
      </Card>

      {/* Hugging Face Pool */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-xs">Hugging Face Tokens</CardTitle>
          <span className="text-xs text-zinc-500">{hf.active} ready</span>
        </CardHeader>
        <CardContent className="space-y-2.5">
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
            <div className="text-center py-6 text-xs text-zinc-500 border border-dashed border-zinc-800 rounded-lg">
              No Hugging Face token added.
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
