import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  FilePlus2,
  Sliders,
  History,
  FlaskConical,
  ShieldCheck,
  X
} from 'lucide-react';

const Sidebar = ({ mobileMenuOpen, setMobileMenuOpen }) => {
  const { user } = useAuth();

  const navItems = [
    {
      label: 'Officer Dashboard',
      to: '/dashboard',
      icon: LayoutDashboard,
      roles: ['officer', 'admin']
    },
    {
      label: 'Submit Application',
      to: '/applications/new',
      icon: FilePlus2,
      roles: ['applicant', 'officer', 'admin']
    },
    {
      label: 'AI Verification Sandbox',
      to: '/demo-tester',
      icon: FlaskConical,
      roles: ['officer', 'admin', 'applicant'],
      highlight: true
    },
    {
      label: 'Scheme Rule Engine',
      to: '/schemes',
      icon: Sliders,
      roles: ['admin', 'officer']
    },
    {
      label: 'Compliance Audit Trail',
      to: '/audit-logs',
      icon: History,
      roles: ['admin', 'officer']
    }
  ];

  const handleNavClick = () => {
    if (setMobileMenuOpen) {
      setMobileMenuOpen(false);
    }
  };

  const sidebarContent = (
    <div className="flex flex-col justify-between h-full p-4">
      <div className="space-y-6">
        {/* Mobile Header with Close Button */}
        <div className="flex items-center justify-between lg:hidden pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-indigo-400" />
            <span className="text-sm font-bold text-white">Navigation Menu</span>
          </div>
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Section */}
        <div>
          <p className="px-3 text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
            Verification Platform
          </p>
          <nav className="space-y-1">
            {navItems
              .filter(item => !user || item.roles.includes(user.role))
              .map(item => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    onClick={handleNavClick}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                        isActive
                          ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                          : item.highlight
                          ? 'bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/20 border border-emerald-500/30'
                          : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                      }`
                    }
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    <span className="truncate">{item.label}</span>
                    {item.highlight && (
                      <span className="ml-auto text-[9px] px-1.5 py-0.5 rounded bg-emerald-500/30 text-emerald-300 font-bold uppercase shrink-0">
                        TEST
                      </span>
                    )}
                  </NavLink>
                );
              })}
          </nav>
        </div>

        {/* AI Engine Status Card */}
        <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800/80">
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0"></span>
            <span className="text-xs font-bold text-slate-200">AI Intelligence Core</span>
          </div>
          <div className="space-y-1.5 text-[11px] text-slate-400">
            <div className="flex justify-between">
              <span>OCR Provider:</span>
              <span className="text-slate-200 font-mono">Tesseract / Vision</span>
            </div>
            <div className="flex justify-between">
              <span>Perceptual Hash:</span>
              <span className="text-slate-200 font-mono">dHash / pHash</span>
            </div>
            <div className="flex justify-between">
              <span>Cross-Check:</span>
              <span className="text-slate-200 font-mono">Levenshtein v2</span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Info */}
      <div className="p-3 rounded-xl bg-slate-950/40 border border-slate-800/60 text-[11px] text-slate-400 space-y-0.5">
        <p className="font-semibold text-slate-300">Ministry of Tribal Affairs</p>
        <p className="text-[10px]">Govt. of India &bull; ST Higher Education</p>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside className="hidden lg:flex w-64 bg-slate-900 border-r border-slate-800 flex-col shrink-0 min-h-[calc(100vh-4rem)]">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Drawer Panel */}
          <aside className="relative w-72 max-w-[85vw] bg-slate-900 border-r border-slate-800 h-full z-10 flex flex-col shadow-2xl">
            {sidebarContent}
          </aside>
        </div>
      )}
    </>
  );
};

export default Sidebar;
