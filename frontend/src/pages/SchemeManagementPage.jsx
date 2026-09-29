import React, { useState, useEffect } from 'react';
import api from '../api/client';
import { Sliders, Plus, Edit2, CheckCircle, AlertCircle, RefreshCw, Layers } from 'lucide-react';

const SchemeManagementPage = () => {
  const [schemes, setSchemes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingScheme, setEditingScheme] = useState(null);

  const [form, setForm] = useState({
    name: '',
    code: '',
    description: '',
    incomeLimit: 250000,
    minPercentage: 50.0,
    category: 'ST',
    approvedCourses: '',
    approvedInstitutions: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const fetchSchemes = async () => {
    setLoading(true);
    try {
      const res = await api.get('/schemes');
      if (res.data?.success) {
        setSchemes(res.data.schemes);
      }
    } catch (err) {
      console.error('Failed to load schemes:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSchemes();
  }, []);

  const handleOpenCreate = () => {
    setEditingScheme(null);
    setForm({
      name: '',
      code: '',
      description: '',
      incomeLimit: 250000,
      minPercentage: 50.0,
      category: 'ST',
      approvedCourses: '',
      approvedInstitutions: ''
    });
    setError('');
    setSuccess('');
    setShowModal(true);
  };

  const handleOpenEdit = (s) => {
    setEditingScheme(s);
    setForm({
      name: s.name,
      code: s.code,
      description: s.description || '',
      incomeLimit: s.incomeLimit,
      minPercentage: s.minPercentage,
      category: s.category || 'ST',
      approvedCourses: (s.approvedCourses || []).join(', '),
      approvedInstitutions: (s.approvedInstitutions || []).join(', ')
    });
    setError('');
    setSuccess('');
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      if (editingScheme) {
        await api.put(`/schemes/${editingScheme._id}`, form);
        setSuccess('Scheme updated successfully');
      } else {
        await api.post('/schemes', form);
        setSuccess('Scheme created successfully');
      }
      setShowModal(false);
      fetchSchemes();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save scheme');
    }
  };

  return (
    <div className="space-y-5 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <Sliders className="w-5 h-5 sm:w-6 sm:h-6 text-indigo-400 shrink-0" />
            <span>ST Scholarship Scheme Rule Engine</span>
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Configure dynamic eligibility thresholds, income ceilings, and academic cutoffs
          </p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="px-3.5 sm:px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-1.5 transition shadow-lg shadow-indigo-600/30 self-start sm:self-auto whitespace-nowrap"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Scheme</span>
        </button>
      </div>

      {success && (
        <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-300 flex items-center gap-2">
          <CheckCircle className="w-4 h-4 shrink-0" />
          <span>{success}</span>
        </div>
      )}

      {/* Schemes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
        {loading ? (
          <div className="col-span-full text-center py-12 text-slate-400">
            <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-indigo-400" />
            Loading scheme rules...
          </div>
        ) : schemes.map((s) => (
          <div
            key={s._id}
            className="p-4 sm:p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl flex flex-col justify-between space-y-4 hover:border-slate-700 transition"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-mono text-[10px] font-bold">
                  {s.code}
                </span>
                <span className="text-[10px] uppercase font-bold text-emerald-400 flex items-center gap-1">
                  <CheckCircle className="w-3 h-3" /> Active
                </span>
              </div>
              <h3 className="text-sm font-bold text-white leading-snug">{s.name}</h3>
              <p className="text-xs text-slate-400 mt-1 line-clamp-2">{s.description || 'Central/State ST welfare scheme.'}</p>
            </div>

            <div className="pt-3 border-t border-slate-800/80 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400">Income Ceiling:</span>
                <span className="font-mono font-bold text-slate-200">₹{s.incomeLimit?.toLocaleString('en-IN')} / yr</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Min. Academic Score:</span>
                <span className="font-mono font-bold text-slate-200">{s.minPercentage}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Category Constraint:</span>
                <span className="font-bold text-emerald-400">{s.category || 'ST'}</span>
              </div>
            </div>

            <button
              onClick={() => handleOpenEdit(s)}
              className="w-full py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center justify-center gap-1.5 transition"
            >
              <Edit2 className="w-3.5 h-3.5" />
              <span>Modify Scheme Rules</span>
            </button>
          </div>
        ))}
      </div>

      {/* Modal for Add / Edit */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-5 sm:p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <h2 className="text-sm sm:text-base font-bold text-white">
              {editingScheme ? 'Edit Scheme Rules' : 'Create New ST Scheme'}
            </h2>

            {error && (
              <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-xs text-red-300">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Scheme Name *</label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g. National Overseas Scholarship for ST"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Scheme Code *</label>
                  <input
                    type="text"
                    required
                    value={form.code}
                    onChange={(e) => setForm({ ...form, code: e.target.value })}
                    placeholder="e.g. NOS-ST-2026"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 uppercase font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Category *</label>
                  <input
                    type="text"
                    required
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Income Ceiling (INR) *</label>
                  <input
                    type="number"
                    required
                    value={form.incomeLimit}
                    onChange={(e) => setForm({ ...form, incomeLimit: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Min Academic Score (%) *</label>
                  <input
                    type="number"
                    step="0.5"
                    required
                    value={form.minPercentage}
                    onChange={(e) => setForm({ ...form, minPercentage: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Description</label>
                <textarea
                  rows={2}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Approved Courses (comma separated)</label>
                <input
                  type="text"
                  value={form.approvedCourses}
                  onChange={(e) => setForm({ ...form, approvedCourses: e.target.value })}
                  placeholder="B.Tech, MBBS, Ph.D, M.Tech"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/30"
                >
                  Save Scheme
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SchemeManagementPage;
