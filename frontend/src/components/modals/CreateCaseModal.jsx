import React, { useState } from 'react';
import { X, Plus, ShieldAlert, Check } from 'lucide-react';
import { useData } from '../../context/DataContext';

export const CreateCaseModal = ({ isOpen, onClose, onCaseCreated }) => {
  const { accounts, createCase } = useData();
  const [primaryAccount, setPrimaryAccount] = useState('ACC-10082');
  const [description, setDescription] = useState('');
  const [assignedInvestigator, setAssignedInvestigator] = useState('Demo Investigator');
  const [initialRiskScore, setInitialRiskScore] = useState(85);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const created = createCase({
      primaryAccount,
      description,
      assignedInvestigator,
      riskScore: parseInt(initialRiskScore, 10),
    });
    if (onCaseCreated) onCaseCreated(created);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="p-5 border-b border-slate-100 bg-slate-50/80 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-brand-50 text-brand-700 rounded-lg border border-brand-200">
              <Plus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Initiate Investigation Case</h3>
              <p className="text-xs text-slate-500">Create a new dossier for suspicious activity analysis</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-700 rounded-md transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          <div>
            <label className="font-semibold text-slate-700 block mb-1.5">Target Primary Account</label>
            <select
              value={primaryAccount}
              onChange={(e) => setPrimaryAccount(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500/20 font-mono text-xs"
              required
            >
              {accounts.slice(0, 25).map((acc) => (
                <option key={acc.id} value={acc.id}>
                  {acc.id} - {acc.name} ({acc.bank})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-slate-700 block mb-1.5">Assigned Investigator</label>
              <input
                type="text"
                value={assignedInvestigator}
                onChange={(e) => setAssignedInvestigator(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500/20 text-xs"
                required
              />
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-1.5">Initial Risk Heuristic (0-100)</label>
              <input
                type="number"
                min="10"
                max="100"
                value={initialRiskScore}
                onChange={(e) => setInitialRiskScore(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500/20 font-mono text-xs"
                required
              />
            </div>
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1.5">Investigation Hypothesis / Synopsis</label>
            <textarea
              rows="3"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe trigger reason e.g. sudden spike in rapid layered payments or abnormal structuring..."
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500/20 text-xs resize-none"
              required
            />
          </div>

          <div className="p-3 bg-amber-50 rounded-lg border border-amber-200 text-amber-800 text-[11px] flex items-start gap-2">
            <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <span>
              All case creation activities are recorded in immutable audit logs for regulatory accountability.
            </span>
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-medium transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-lg font-semibold shadow-sm transition flex items-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              <span>Create Dossier</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateCaseModal;
