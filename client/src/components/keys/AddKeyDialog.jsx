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
      setTestResult({ success: true, message: res.message });
    } catch (err) {
      setTestResult({ success: false, message: err.message || 'Key validation failed.' });
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
      setError(err.message || 'Failed to register API key into pool.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} className="max-w-md">
      <DialogHeader>
        <div className="flex items-center gap-2 text-sky-400">
          <Key className="w-5 h-5" />
          <DialogTitle>Add API Key to Rotation Pool</DialogTitle>
        </div>
        <DialogDescription>
          DeepShield automatically rotates between multiple API keys. When one key reaches rate limit (429), it switches to the next available key instantly.
        </DialogDescription>
      </DialogHeader>

      <form onSubmit={handleSave} className="space-y-4">
        {/* Provider Toggle */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-300">Target AI Service</label>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => { setProvider('gemini'); setTestResult(null); }}
              className={`flex items-center justify-center gap-2 p-3 rounded-xl border text-xs font-semibold transition-all ${
                provider === 'gemini'
                  ? 'border-sky-500 bg-sky-500/10 text-sky-400'
                  : 'border-slate-800 bg-slate-900 text-slate-400 hover:border-slate-700'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              Google Gemini API
            </button>
            <button
              type="button"
              onClick={() => { setProvider('huggingface'); setTestResult(null); }}
              className={`flex items-center justify-center gap-2 p-3 rounded-xl border text-xs font-semibold transition-all ${
                provider === 'huggingface'
                  ? 'border-purple-500 bg-purple-500/10 text-purple-400'
                  : 'border-slate-800 bg-slate-900 text-slate-400 hover:border-slate-700'
              }`}
            >
              <Key className="w-4 h-4" />
              Hugging Face Token
            </button>
          </div>
        </div>

        {/* Key Input */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-300">
            {provider === 'gemini' ? 'Gemini API Key (AIza...)' : 'Hugging Face User Access Token (hf_...)'}
          </label>
          <input
            type="password"
            value={keyValue}
            onChange={(e) => setKeyValue(e.target.value)}
            placeholder={provider === 'gemini' ? 'AIzaSy...' : 'hf_xxxxxxxxxxxxxxxxx'}
            className="w-full rounded-xl bg-slate-950 border border-slate-800 p-3 text-xs text-slate-100 placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-sky-500"
            required
          />
        </div>

        {testResult && (
          <Alert variant={testResult.success ? 'success' : 'destructive'} className="text-xs py-2.5">
            {testResult.message}
          </Alert>
        )}

        {error && <Alert variant="destructive" className="text-xs py-2.5">{error}</Alert>}

        <div className="flex items-center justify-between pt-3 border-t border-slate-800">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleTest}
            disabled={!keyValue.trim() || isTesting || isSubmitting}
            className="text-xs text-slate-400 hover:text-slate-200"
          >
            {isTesting ? <RefreshCw className="w-3.5 h-3.5 animate-spin mr-1" /> : null}
            Test Key First
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
              Save to Pool
            </Button>
          </div>
        </div>
      </form>
    </Dialog>
  );
}

