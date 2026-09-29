import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShieldCheck, Lock, Mail, User, Sparkles, AlertCircle, ArrowRight } from 'lucide-react';

const LoginPage = () => {
  const [isSignup, setIsSignup] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState('officer');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { user, login, signup, quickDemoLogin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (user) {
      navigate(user.role === 'applicant' ? '/applications/new' : '/dashboard', { replace: true });
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isSignup) {
        await signup({ name, email, password, role });
      } else {
        await login(email, password);
      }
      navigate(role === 'applicant' ? '/applications/new' : '/dashboard');
    } catch (err) {
      setError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemo = async (demoRole) => {
    setError('');
    setLoading(true);
    try {
      await quickDemoLogin(demoRole);
      navigate(demoRole === 'applicant' ? '/applications/new' : '/dashboard');
    } catch (err) {
      setError(err.message || 'Demo login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-950 flex flex-col justify-center py-8 sm:py-12 px-3 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="w-12 h-12 rounded-2xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center mx-auto shadow-lg shadow-indigo-600/20">
          <ShieldCheck className="w-7 h-7 text-indigo-400" />
        </div>
        <h2 className="mt-4 text-xl sm:text-2xl font-black tracking-tight text-white">
          {isSignup ? 'Create Verification Account' : 'Sign in to SatyaPatra AI'}
        </h2>
        <p className="mt-1 text-xs text-slate-400">
          Ministry of Tribal Affairs &bull; Automated ST Scholarship Verification Portal
        </p>
      </div>

      <div className="mt-6 sm:mt-8 sm:mx-auto sm:w-full sm:max-w-md w-full">
        <div className="bg-slate-900 border border-slate-800 py-6 sm:py-8 px-4 sm:px-10 shadow-2xl rounded-2xl">
          {/* Quick 1-Click Demo Buttons */}
          <div className="mb-5 sm:mb-6 pb-5 sm:pb-6 border-b border-slate-800">
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2.5 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              1-Click Demo Access
            </p>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleQuickDemo('officer')}
                className="py-2 px-2 rounded-lg bg-indigo-600/20 hover:bg-indigo-600/30 border border-indigo-500/40 text-indigo-300 text-[11px] font-bold transition text-center truncate"
              >
                Officer
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemo('admin')}
                className="py-2 px-2 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/40 text-emerald-300 text-[11px] font-bold transition text-center truncate"
              >
                Admin
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemo('applicant')}
                className="py-2 px-2 rounded-lg bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/40 text-blue-300 text-[11px] font-bold transition text-center truncate"
              >
                Applicant
              </button>
            </div>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/30 flex items-center gap-2 text-xs text-red-300">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form className="space-y-4" onSubmit={handleSubmit}>
            {isSignup && (
              <>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Full Name</label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Dr. Rajesh Munda"
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white placeholder:text-slate-400 focus:outline-none focus:border-indigo-500 transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Account Role</label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500 transition"
                  >
                    <option value="officer">Verification Officer (Review &amp; Decide)</option>
                    <option value="admin">System Admin (Manage Schemes &amp; Audits)</option>
                    <option value="applicant">Applicant / Operator (Submit Documents)</option>
                  </select>
                </div>
              </>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Government / Official Email</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="officer@satyapatra.gov.in"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white placeholder:text-slate-400 focus:outline-none focus:border-indigo-500 transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white placeholder:text-slate-400 focus:outline-none focus:border-indigo-500 transition"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 transition disabled:opacity-50"
            >
              <span>{loading ? 'Authenticating...' : isSignup ? 'Create Account' : 'Sign In'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>

          <div className="mt-5 sm:mt-6 text-center text-xs text-slate-400">
            {isSignup ? (
              <p>
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => setIsSignup(false)}
                  className="font-semibold text-indigo-400 hover:text-indigo-300"
                >
                  Sign in here
                </button>
              </p>
            ) : (
              <p>
                Need to register a new officer?{' '}
                <button
                  type="button"
                  onClick={() => setIsSignup(true)}
                  className="font-semibold text-indigo-400 hover:text-indigo-300"
                >
                  Create account
                </button>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
