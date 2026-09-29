import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, ShieldAlert, Clock, User, FileText, ChevronRight } from 'lucide-react';
import RiskBadge from '../common/RiskBadge';

export const CaseTable = ({ cases = [], onCaseClick }) => {
  const navigate = useNavigate();

  const handleRowClick = (caseItem) => {
    if (onCaseClick) {
      onCaseClick(caseItem);
    } else {
      navigate(`/cases/${caseItem.id}`);
    }
  };

  const getStatusBadge = (status) => {
    const statusMap = {
      'New': 'bg-blue-50 text-blue-700 border-blue-200',
      'Under Investigation': 'bg-purple-50 text-purple-700 border-purple-200',
      'Escalated': 'bg-rose-50 text-rose-700 border-rose-200',
      'Resolved': 'bg-emerald-50 text-emerald-700 border-emerald-200',
      'Closed': 'bg-slate-100 text-slate-700 border-slate-200',
    };
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${statusMap[status] || statusMap.New}`}>
        {status}
      </span>
    );
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200/90 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-slate-50/80 text-slate-500 font-semibold border-b border-slate-200">
              <th className="py-3.5 px-4">Case ID</th>
              <th className="py-3.5 px-4">Primary Account / Entity</th>
              <th className="py-3.5 px-4">Risk Score</th>
              <th className="py-3.5 px-4">Risk Level</th>
              <th className="py-3.5 px-4">Transactions</th>
              <th className="py-3.5 px-4">Investigator</th>
              <th className="py-3.5 px-4">Status</th>
              <th className="py-3.5 px-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-normal text-slate-700">
            {cases.length === 0 ? (
              <tr>
                <td colSpan="8" className="py-8 text-center text-slate-400">
                  No cases found matching your criteria.
                </td>
              </tr>
            ) : (
              cases.map((caseItem) => (
                <tr
                  key={caseItem.id}
                  onClick={() => handleRowClick(caseItem)}
                  className="hover:bg-brand-50/30 transition-colors cursor-pointer group"
                >
                  <td className="py-3.5 px-4 font-mono font-bold text-brand-700 group-hover:underline">
                    {caseItem.id}
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="font-semibold text-slate-900">{caseItem.accountName || caseItem.primaryAccount}</div>
                    <span className="text-[11px] font-mono text-slate-500">{caseItem.primaryAccount}</span>
                  </td>
                  <td className="py-3.5 px-4 font-mono font-extrabold text-slate-900">
                    {caseItem.riskScore}/100
                  </td>
                  <td className="py-3.5 px-4">
                    <RiskBadge level={caseItem.riskLevel} size="sm" />
                  </td>
                  <td className="py-3.5 px-4 font-mono text-slate-700">
                    {caseItem.transactionCount || 12} txs
                  </td>
                  <td className="py-3.5 px-4 text-slate-600 flex items-center gap-1.5 mt-2">
                    <User className="w-3.5 h-3.5 text-slate-400" />
                    <span>{caseItem.assignedInvestigator || 'Unassigned'}</span>
                  </td>
                  <td className="py-3.5 px-4">
                    {getStatusBadge(caseItem.status)}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button 
                      onClick={(e) => { e.stopPropagation(); handleRowClick(caseItem); }}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-brand-700 hover:text-brand-900 group-hover:translate-x-0.5 transition-transform"
                    >
                      Investigate <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CaseTable;
