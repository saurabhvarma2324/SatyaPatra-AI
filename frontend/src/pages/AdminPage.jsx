import React, { useState, useEffect } from 'react';
import { Users, Plus, ShieldCheck, UserX, UserCheck, KeyRound, AlertCircle } from 'lucide-react';
import { usersAPI } from '../services/api';
import { Modal } from '../components/common/Modal';

export const AdminPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // New user form state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('INVESTIGATOR');
  const [badge, setBadge] = useState('Forensic Analyst L1');
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await usersAPI.getUsers();
      if (res.data?.data) {
        setUsers(res.data.data);
      }
    } catch (err) {
      console.warn('Error loading users:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleToggleStatus = async (user) => {
    const newStatus = user.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    try {
      await usersAPI.updateStatus(user.id, newStatus);
      fetchUsers();
    } catch (err) {
      alert('Failed to update status: ' + err.message);
    }
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMsg('');

    try {
      await usersAPI.createUser({ name, email, password, role, badge });
      setSubmitting(false);
      setIsModalOpen(false);
      setName('');
      setEmail('');
      setPassword('');
      fetchUsers();
    } catch (err) {
      setSubmitting(false);
      setErrorMsg(err.response?.data?.message || 'Failed to create user account.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
            <Users className="w-5 h-5 text-cyan-400" />
            <span>Administrator User & Access Management</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Provision investigator accounts, grant SOC privileges, and manage authentication statuses.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-cyan-500/20"
        >
          <Plus className="w-4 h-4" />
          <span>Provision New Investigator</span>
        </button>
      </div>

      {/* Users Table */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/60 backdrop-blur-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-950/60 border-b border-slate-800 text-[10px] uppercase font-bold text-slate-400">
                <th className="py-3.5 pl-4">Investigator Name</th>
                <th className="py-3.5">Email Identity</th>
                <th className="py-3.5">Assigned Role</th>
                <th className="py-3.5">Rank & Badge</th>
                <th className="py-3.5">Access Status</th>
                <th className="py-3.5">Created Date</th>
                <th className="py-3.5 pr-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {loading ? (
                <tr>
                  <td colSpan="7" className="py-12 text-center text-slate-500 animate-pulse font-mono">
                    Querying access control registry...
                  </td>
                </tr>
              ) : (
                users.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3.5 pl-4 font-bold text-white">
                      {u.name}
                    </td>
                    <td className="py-3.5 font-mono text-slate-300">
                      {u.email}
                    </td>
                    <td className="py-3.5">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase font-mono ${
                        u.role === 'ADMIN' ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30' : 'bg-sky-500/20 text-sky-300 border border-sky-500/30'
                      }`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="py-3.5 text-slate-400">
                      {u.badge || 'Forensic Analyst'}
                    </td>
                    <td className="py-3.5">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium border ${
                        u.status === 'ACTIVE' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' : 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${u.status === 'ACTIVE' ? 'bg-emerald-400' : 'bg-rose-400'}`} />
                        <span>{u.status}</span>
                      </span>
                    </td>
                    <td className="py-3.5 text-slate-500 font-mono text-[11px]">
                      {new Date(u.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3.5 pr-4 text-right">
                      <button
                        onClick={() => handleToggleStatus(u)}
                        className={`px-2.5 py-1 rounded text-xs font-semibold border transition-colors ${
                          u.status === 'ACTIVE'
                            ? 'bg-rose-950/20 text-rose-400 border-rose-500/30 hover:bg-rose-900/40'
                            : 'bg-emerald-950/20 text-emerald-400 border-emerald-500/30 hover:bg-emerald-900/40'
                        }`}
                      >
                        {u.status === 'ACTIVE' ? 'Deactivate' : 'Activate'}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Provision Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Provision Forensic Investigator Account"
        subtitle="Credentials will be initialized for authorized portal access."
      >
        <form onSubmit={handleCreateUser} className="space-y-4">
          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-950/30 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{errorMsg}</span>
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block">Full Name *</label>
            <input
              type="text"
              placeholder="e.g. Inspector R. K. Nair"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block">Official Email *</label>
            <input
              type="email"
              placeholder="e.g. rnair@maildrishti.ai"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block">Temporary Password *</label>
            <input
              type="password"
              placeholder="••••••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block">Role</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-500"
              >
                <option value="INVESTIGATOR">INVESTIGATOR</option>
                <option value="ADMIN">ADMIN</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block">Rank / Badge</label>
              <input
                type="text"
                placeholder="SOC Specialist"
                value={badge}
                onChange={(e) => setBadge(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold shadow-lg shadow-cyan-500/20"
            >
              {submitting ? 'Creating...' : 'Provision User'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default AdminPage;
