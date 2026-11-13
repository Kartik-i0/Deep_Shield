import React, { useState } from 'react';
import { Dialog, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Alert } from '@/components/ui/alert';
import { addApiKey, testApiKey } from '@/services/keyApi';
import { Key, Sparkles, Check, RefreshCw } from 'lucide-react';

export function AddKeyDialog({ open, onClose, onKeyAdded }) {
  const [provider, setProvider] = useState('gemini'); // 'gemini' | 'huggingface'
  const [keyValue, setKeyValue] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState(null);
  const [error, setError] = useState(null);

  const handleTest = async () => {
    if (!keyValue.trim()) return;
    setIsTesting(true);
    setTestResult(null);
    setError(null);

    try {
      const res = await testApiKey({ provider, key: keyValue.trim() });
      setTestResult({ success: true, message: res.message || 'Key verified successfully.' });
    } catch (err) {
      setTestResult({ success: false, message: err.message || 'Key verification failed.' });
    } finally {
      setIsTesting(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!keyValue.trim()) return;

    setIsSubmitting(true);
    setError(null);

    try {
      await addApiKey({ provider, key: keyValue.trim() });
      setKeyValue('');
      setTestResult(null);
      onKeyAdded();
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to save API key.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} className="max-w-md">
      <DialogHeader>
        <div className="flex items-center gap-2 text-zinc-100">
          <Key className="w-4 h-4 text-zinc-400" />
          <DialogTitle>Add API Key</DialogTitle>
        </div>
        <DialogDescription>
          Enter your Gemini or Hugging Face key to run scans smoothly.
        </DialogDescription>
      </DialogHeader>

      <form onSubmit={handleSave} className="space-y-4">
        {/* Provider Toggle */}
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-zinc-300">Provider</label>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => { setProvider('gemini'); setTestResult(null); }}
              className={`flex items-center justify-center gap-2 p-2.5 rounded-lg border text-xs font-medium transition-all ${
                provider === 'gemini'
                  ? 'border-zinc-200 bg-zinc-800 text-white'
                  : 'border-zinc-800 bg-zinc-900/50 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              Google Gemini
            </button>
            <button
              type="button"
              onClick={() => { setProvider('huggingface'); setTestResult(null); }}
              className={`flex items-center justify-center gap-2 p-2.5 rounded-lg border text-xs font-medium transition-all ${
                provider === 'huggingface'
                  ? 'border-zinc-200 bg-zinc-800 text-white'
                  : 'border-zinc-800 bg-zinc-900/50 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200'
              }`}
            >
              <Key className="w-3.5 h-3.5" />
              Hugging Face
            </button>
          </div>
        </div>

        {/* Key Input */}
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-zinc-300">
            {provider === 'gemini' ? 'Gemini API Key' : 'Hugging Face Token'}
          </label>
          <input
            type="password"
            value={keyValue}
            onChange={(e) => setKeyValue(e.target.value)}
            placeholder={provider === 'gemini' ? 'AIzaSy...' : 'hf_...'}
            className="w-full rounded-lg bg-zinc-950 border border-zinc-800 p-2.5 text-xs text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-zinc-500"
            required
          />
        </div>

        {testResult && (
          <Alert variant={testResult.success ? 'success' : 'destructive'} className="text-xs py-2">
            {testResult.message}
          </Alert>
        )}

        {error && <Alert variant="destructive" className="text-xs py-2">{error}</Alert>}

        <div className="flex items-center justify-between pt-3 border-t border-zinc-800">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleTest}
            disabled={!keyValue.trim() || isTesting || isSubmitting}
            className="text-xs text-zinc-400 hover:text-zinc-200"
          >
            {isTesting ? <RefreshCw className="w-3.5 h-3.5 animate-spin mr-1" /> : null}
            Test Key
          </Button>

          <div className="flex items-center gap-2">
            <Button type="button" variant="outline" size="sm" onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              size="sm"
              disabled={!keyValue.trim() || isSubmitting}
              className="gap-1.5"
            >
              {isSubmitting ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
              Save Key
            </Button>
          </div>
        </div>
      </form>
    </Dialog>
  );
}

