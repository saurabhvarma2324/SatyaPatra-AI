import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShieldCheck, User, LogOut, FileText, CheckCircle, Sparkles, Building, Menu, X } from 'lucide-react';

const Navbar = ({ mobileMenuOpen, setMobileMenuOpen }) => {
  const { user, logout, quickDemoLogin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="bg-slate-900 border-b border-slate-800 text-white sticky top-0 z-40 shadow-md">
      {/* Top Ministry Banner */}
      <div className="bg-slate-950 px-3 sm:px-4 py-1 text-[11px] sm:text-xs text-slate-400 flex items-center justify-between border-b border-slate-800/80">
        <div className="flex items-center gap-1.5 sm:gap-2 truncate">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0"></span>
          <span className="font-medium tracking-wide truncate">GOVERNMENT OF INDIA &bull; MINISTRY OF TRIBAL AFFAIRS</span>
        </div>
        <div className="hidden sm:flex items-center gap-3 text-xs">
          <span className="text-slate-400">National Verification Directorate</span>
          <span className="text-slate-600">|</span>
          <span className="text-emerald-400 font-medium">SatyaPatra AI v2.0</span>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-2">
        {/* Left: Mobile Menu Toggle & Brand */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Mobile Menu Hamburger Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg bg-slate-800/80 hover:bg-slate-800 text-slate-300 lg:hidden border border-slate-700/60 transition"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          {/* Brand */}
          <Link to="/" className="flex items-center gap-2.5 sm:gap-3 group">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-emerald-500 flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform shrink-0">
              <ShieldCheck className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-1.5 sm:gap-2">
                <span className="text-base sm:text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-100 to-slate-300">
                  SatyaPatra <span className="text-indigo-400 font-extrabold">AI</span>
                </span>
                <span className="text-[9px] sm:text-[10px] uppercase font-bold tracking-wider px-1.5 sm:px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  ST Verification
                </span>
              </div>
              <p className="hidden xs:block text-[10px] sm:text-[11px] text-slate-400 leading-none">
                Automated ST Scholarship Cross-Examination Portal
              </p>
            </div>
          </Link>
        </div>

        {/* Right side Profile & Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {user ? (
            <div className="flex items-center gap-2 sm:gap-4">
              {/* Role badge */}
              <div className="hidden md:flex flex-col items-end text-right">
                <span className="text-xs sm:text-sm font-semibold text-slate-200">{user.name}</span>
                <span className="text-[10px] sm:text-[11px] uppercase tracking-wider text-emerald-400 font-medium flex items-center gap-1">
                  <CheckCircle className="w-3 h-3" />
                  {user.role === 'admin' ? 'Scheme Administrator' : user.role === 'officer' ? 'Verification Officer' : 'Applicant'}
                </span>
              </div>

              {/* User Avatar */}
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 font-bold text-xs sm:text-sm">
                {user.name?.charAt(0) || 'U'}
              </div>

              {/* Logout */}
              <button
                onClick={handleLogout}
                title="Logout"
                className="p-1.5 sm:p-2 rounded-lg bg-slate-800/80 hover:bg-red-500/20 text-slate-400 hover:text-red-400 border border-slate-700/60 transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 sm:gap-2">
              <button
                onClick={() => quickDemoLogin('officer')}
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/40 text-xs font-semibold transition"
              >
                <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                Demo Officer
              </button>
              <Link
                to="/login"
                className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/30 transition"
              >
                Sign In
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
