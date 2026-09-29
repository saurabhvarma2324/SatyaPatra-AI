import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, ShieldAlert, CheckCircle, XCircle, FolderPlus, Search, Filter, RefreshCw, Eye } from 'lucide-react';
import { useData } from '../context/DataContext';
import RiskBadge from '../components/common/RiskBadge';
import Toast from '../components/common/Toast';

export const AlertsPage = () => {
  const { alerts, dismissAlert, reviewAlert, createCaseFromAlert } = useData();
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState('');
  const [severityFilter, setSeverityFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [toastMessage, setToastMessage] = useState(null);

  const filteredAlerts = useMemo(() => {
    return alerts.filter(a => {
      const matchesSearch = 
        a.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.account.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (a.accountName && a.accountName.toLowerCase().includes(searchTerm.toLowerCase())) ||
        a.type.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesSeverity = severityFilter === 'ALL' || a.severity === severityFilter;
      const matchesStatus = statusFilter === 'ALL' || a.status === statusFilter;

      return matchesSearch && matchesSeverity && matchesStatus;
    });
  }, [alerts, searchTerm, severityFilter, statusFilter]);

  const handleReview = (id) => {
    reviewAlert(id);
    setToastMessage(`Alert ${id} marked as Under Review`);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const handleDismiss = (id) => {
    dismissAlert(id);
    setToastMessage(`Alert ${id} dismissed`);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const handleCreateCase = (alert) => {
    const created = createCaseFromAlert(alert);
    setToastMessage(`New case ${created.id} created from alert`);
    setTimeout(() => {
      setToastMessage(null);
      navigate(`/cases/${created.id}`);
    }, 1000);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-5">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Real-Time Risk Alerts</h2>
          <p className="text-xs text-slate-500 mt-1">
            Triaged telemetry feeds triggering anomaly thresholds across transaction streams.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-500">
          <span className="font-mono font-bold text-slate-900">{alerts.filter(a => a.status === 'New').length}</span>
          <span>Active Unreviewed Alerts</span>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search by Alert ID, Account, Rule..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <select
            value={severityFilter}
            onChange={(e) => setSeverityFilter(e.target.value)}
            className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
          >
            <option value="ALL">All Severities</option>
            <option value="CRITICAL">Critical</option>
            <option value="HIGH">High</option>
            <option value="MEDIUM">Medium</option>
            <option value="LOW">Low</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
          >
            <option value="ALL">All Statuses</option>
            <option value="New">New</option>
            <option value="Under Review">Under Review</option>
            <option value="Reviewed">Reviewed / Resolved</option>
            <option value="Dismissed">Dismissed</option>
          </select>
        </div>
      </div>

      {/* Alerts Feed */}
      <div className="space-y-3">
        {filteredAlerts.length === 0 ? (
          <div className="p-8 text-center bg-white rounded-xl border border-slate-200 text-slate-400 text-xs">
            No alerts found matching your criteria.
          </div>
        ) : (
          filteredAlerts.map((alert) => (
            <div
              key={alert.id}
              className={`bg-white p-4 rounded-xl border transition-all duration-150 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm ${
                alert.status === 'New' ? 'border-brand-200 ring-1 ring-brand-100' : 'border-slate-200 opacity-90'
              }`}
            >
              <div className="space-y-1.5 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono font-bold text-slate-900 text-xs">{alert.id}</span>
                  <RiskBadge level={alert.severity} size="sm" />
                  <span className="text-[11px] font-mono text-brand-700 font-semibold bg-brand-50 px-2 py-0.5 rounded border border-brand-100">
                    {alert.account}
                  </span>
                  <span className="text-[11px] text-slate-400 font-mono ml-auto md:ml-2">
                    {new Date(alert.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>

                <h4 className="text-xs font-bold text-slate-900">{alert.type}</h4>
                <p className="text-xs text-slate-600 leading-relaxed">{alert.description}</p>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-slate-100">
                {alert.status === 'New' && (
                  <button
                    onClick={() => handleReview(alert.id)}
                    className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition"
                  >
                    Review
                  </button>
                )}

                <button
                  onClick={() => handleDismiss(alert.id)}
                  disabled={alert.status === 'Dismissed'}
                  className="px-3 py-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg text-xs font-medium transition disabled:opacity-40"
                >
                  Dismiss
                </button>

                <button
                  onClick={() => handleCreateCase(alert)}
                  className="px-3 py-1.5 bg-brand-600 hover:bg-brand-700 text-white rounded-lg text-xs font-bold shadow-xs transition flex items-center gap-1"
                >
                  <FolderPlus className="w-3.5 h-3.5" />
                  <span>Create Case</span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <Toast message={toastMessage} onClose={() => setToastMessage(null)} />
    </div>
  );
};

export default AlertsPage;
