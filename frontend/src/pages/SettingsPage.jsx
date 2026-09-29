import React, { useState } from 'react';
import { Settings, Shield, User, KeyRound, Globe, Bell, Check, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../services/api';

export const SettingsPage = () => {
  const { user } = useAuth();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [pwStatus, setPwStatus] = useState({ msg: '', isError: false });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Application / API key settings
  const [ipApiKey, setIpApiKey] = useState('demo_ip_intelligence_key_secure');
  const [domainApiKey, setDomainApiKey] = useState('demo_domain_tools_key_secure');
  const [autoEnrich, setAutoEnrich] = useState(true);
  const [savedSettings, setSavedSettings] = useState(false);

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setPwStatus({ msg: 'New passwords do not match.', isError: true });
      return;
    }
    setIsSubmitting(true);
    setPwStatus({ msg: '', isError: false });

    try {
      await authAPI.changePassword(currentPassword, newPassword);
      setPwStatus({ msg: 'Password updated successfully.', isError: false });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setPwStatus({ msg: err.response?.data?.message || 'Failed to update password.', isError: true });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveApiKeys = (e) => {
    e.preventDefault();
    setSavedSettings(true);
    setTimeout(() => setSavedSettings(false), 2500);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="border-b border-slate-800 pb-5">
        <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
          <Settings className="w-5 h-5 text-cyan-400" />
          <span>Platform & Security Settings</span>
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Manage investigator identity, security credentials, and external intelligence API integrations.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Profile Card */}
        <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/60 backdrop-blur-sm space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
            <User className="w-4 h-4 text-cyan-400" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-white">
              Investigator Identity Profile
            </h3>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-lg font-bold font-mono text-cyan-400">
              {user?.name ? user.name.substring(0, 2).toUpperCase() : 'IN'}
            </div>
            <div className="space-y-0.5">
              <h4 className="text-sm font-bold text-white">{user?.name || 'Dr. Alok Verma'}</h4>
              <p className="text-xs text-slate-400 font-mono">{user?.email || 'investigator@maildrishti.ai'}</p>
              <div className="pt-1 flex items-center gap-1.5">
                <span className="px-2 py-0.5 rounded bg-sky-500/20 text-sky-400 font-mono text-[10px] font-bold">
                  {user?.role || 'INVESTIGATOR'}
                </span>
                <span className="text-[11px] text-slate-400">{user?.badge || 'Senior Forensic Investigator'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Change Password Form */}
        <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/60 backdrop-blur-sm space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
            <KeyRound className="w-4 h-4 text-cyan-400" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-white">
              Credential Security
            </h3>
          </div>

          {pwStatus.msg && (
            <div className={`p-2.5 rounded-lg text-xs font-medium ${
              pwStatus.isError ? 'bg-rose-950/30 text-rose-300 border border-rose-500/40' : 'bg-emerald-950/30 text-emerald-300 border border-emerald-500/40'
            }`}>
              {pwStatus.msg}
            </div>
          )}

          <form onSubmit={handlePasswordChange} className="space-y-3 text-xs">
            <div className="space-y-1">
              <label className="text-slate-400 uppercase font-semibold text-[10px]">Current Password</label>
              <input
                type="password"
                placeholder="••••••••••••"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-cyan-500"
              />
            </div>
            <div className="space-y-1">
              <label className="text-slate-400 uppercase font-semibold text-[10px]">New Password</label>
              <input
                type="password"
                placeholder="••••••••••••"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-cyan-500"
              />
            </div>
            <div className="space-y-1">
              <label className="text-slate-400 uppercase font-semibold text-[10px]">Confirm New Password</label>
              <input
                type="password"
                placeholder="••••••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-cyan-500"
              />
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-400 border border-slate-700 font-bold text-xs transition-colors"
            >
              {isSubmitting ? 'Updating...' : 'Update Password'}
            </button>
          </form>
        </div>

        {/* Intelligence API Services (Modular Abstraction) */}
        <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/60 backdrop-blur-sm space-y-4 md:col-span-2">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-cyan-400" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-white">
                Threat Intelligence Service Connectors (Modular Fallback Active)
              </h3>
            </div>
            <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-500/30">
              Demo Mode & Cache Active
            </span>
          </div>

          <form onSubmit={handleSaveApiKeys} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-slate-400 uppercase font-bold text-[10px]">
                  IP Geolocation & ASN Intelligence Key (IPinfo / AbuseIPDB)
                </label>
                <input
                  type="password"
                  value={ipApiKey}
                  onChange={(e) => setIpApiKey(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 font-mono text-slate-300 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-slate-400 uppercase font-bold text-[10px]">
                  Domain & URL Intelligence Key (VirusTotal / WhoisXML)
                </label>
                <input
                  type="password"
                  value={domainApiKey}
                  onChange={(e) => setDomainApiKey(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 font-mono text-slate-300 focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="autoEnrich"
                  checked={autoEnrich}
                  onChange={(e) => setAutoEnrich(e.target.checked)}
                  className="rounded bg-slate-950 border-slate-800 text-cyan-500 focus:ring-0 cursor-pointer"
                />
                <label htmlFor="autoEnrich" className="text-xs text-slate-300 cursor-pointer">
                  Automatically enrich IOCs with approximate geo coordinates & ASN metadata on ingestion
                </label>
              </div>

              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-cyan-500/20"
              >
                {savedSettings ? <Check className="w-4 h-4 text-slate-950" /> : null}
                <span>{savedSettings ? 'Saved!' : 'Save Integration Settings'}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
