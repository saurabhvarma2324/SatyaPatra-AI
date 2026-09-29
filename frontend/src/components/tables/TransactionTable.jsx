import React, { useState, useMemo } from 'react';
import { Search, Filter, ArrowUpDown, ChevronLeft, ChevronRight, Eye, ShieldAlert, ArrowUpRight, ArrowDownLeft } from 'lucide-react';
import RiskBadge from '../common/RiskBadge';
import TransactionDetailModal from './TransactionDetailModal';

export const TransactionTable = ({ transactions = [], title = 'Transactions', highlightAccountId = null }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [riskFilter, setRiskFilter] = useState('ALL');
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedTx, setSelectedTx] = useState(null);
  const [sortField, setSortField] = useState('timestamp');
  const [sortAsc, setSortAsc] = useState(false);

  const pageSize = 10;

  // Filter and sort transactions
  const filteredTransactions = useMemo(() => {
    return transactions.filter(t => {
      const matchesSearch = (
        t.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.senderAccount.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.receiverAccount.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (t.location && t.location.toLowerCase().includes(searchTerm.toLowerCase()))
      );

      const matchesRisk = 
        riskFilter === 'ALL' ? true :
        riskFilter === 'HIGH' ? t.riskScore >= 70 :
        riskFilter === 'MEDIUM' ? (t.riskScore >= 40 && t.riskScore < 70) :
        t.riskScore < 40;

      const matchesType = typeFilter === 'ALL' ? true : t.transactionType === typeFilter;

      return matchesSearch && matchesRisk && matchesType;
    }).sort((a, b) => {
      let valA = a[sortField];
      let valB = b[sortField];
      if (sortField === 'amount' || sortField === 'riskScore') {
        return sortAsc ? valA - valB : valB - valA;
      }
      return sortAsc ? String(valA).localeCompare(String(valB)) : String(valB).localeCompare(String(valA));
    });
  }, [transactions, searchTerm, riskFilter, typeFilter, sortField, sortAsc]);

  const totalPages = Math.ceil(filteredTransactions.length / pageSize) || 1;
  const paginatedTransactions = filteredTransactions.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(false);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200/90 shadow-sm overflow-hidden">
      {/* Table Toolbar */}
      <div className="p-4 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <h3 className="text-base font-bold text-slate-900">{title}</h3>
          <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-mono font-medium">
            {filteredTransactions.length} records
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Search Input */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search Tx ID, Account..."
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
              className="pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 w-48 sm:w-56"
            />
          </div>

          {/* Risk Filter */}
          <select
            value={riskFilter}
            onChange={(e) => { setRiskFilter(e.target.value); setCurrentPage(1); }}
            className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
          >
            <option value="ALL">All Risk Levels</option>
            <option value="HIGH">High / Critical Risk</option>
            <option value="MEDIUM">Medium Risk</option>
            <option value="LOW">Low Risk</option>
          </select>

          {/* Type Filter */}
          <select
            value={typeFilter}
            onChange={(e) => { setTypeFilter(e.target.value); setCurrentPage(1); }}
            className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
          >
            <option value="ALL">All Payment Types</option>
            <option value="NEFT">NEFT</option>
            <option value="RTGS">RTGS</option>
            <option value="IMPS">IMPS</option>
            <option value="UPI">UPI</option>
          </select>
        </div>
      </div>

      {/* Table Element */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-slate-50/80 text-slate-500 font-semibold border-b border-slate-200">
              <th className="py-3 px-4 cursor-pointer" onClick={() => handleSort('id')}>
                <div className="flex items-center gap-1">Tx ID <ArrowUpDown className="w-3 h-3 text-slate-400" /></div>
              </th>
              <th className="py-3 px-4">Sender (Origin)</th>
              <th className="py-3 px-4">Receiver (Beneficiary)</th>
              <th className="py-3 px-4 cursor-pointer" onClick={() => handleSort('amount')}>
                <div className="flex items-center gap-1">Amount (₹) <ArrowUpDown className="w-3 h-3 text-slate-400" /></div>
              </th>
              <th className="py-3 px-4">Type</th>
              <th className="py-3 px-4">Location</th>
              <th className="py-3 px-4 cursor-pointer" onClick={() => handleSort('timestamp')}>
                <div className="flex items-center gap-1">Timestamp <ArrowUpDown className="w-3 h-3 text-slate-400" /></div>
              </th>
              <th className="py-3 px-4 cursor-pointer" onClick={() => handleSort('riskScore')}>
                <div className="flex items-center gap-1">Risk Score <ArrowUpDown className="w-3 h-3 text-slate-400" /></div>
              </th>
              <th className="py-3 px-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-normal text-slate-700">
            {paginatedTransactions.length === 0 ? (
              <tr>
                <td colSpan="9" className="py-8 text-center text-slate-400">
                  No transactions match the specified filter parameters.
                </td>
              </tr>
            ) : (
              paginatedTransactions.map((tx) => {
                const isHighRisk = tx.riskScore >= 70;
                const isSenderMatch = highlightAccountId && tx.senderAccount === highlightAccountId;
                const isReceiverMatch = highlightAccountId && tx.receiverAccount === highlightAccountId;

                return (
                  <tr 
                    key={tx.id} 
                    className="hover:bg-slate-50/80 transition-colors group cursor-pointer"
                    onClick={() => setSelectedTx(tx)}
                  >
                    <td className="py-3 px-4 font-mono font-medium text-brand-700">
                      {tx.id}
                    </td>
                    <td className="py-3 px-4 font-mono">
                      <span className={`px-2 py-0.5 rounded ${isSenderMatch ? 'bg-purple-100 text-purple-900 font-bold border border-purple-300' : 'text-slate-800'}`}>
                        {tx.senderAccount}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono">
                      <span className={`px-2 py-0.5 rounded ${isReceiverMatch ? 'bg-purple-100 text-purple-900 font-bold border border-purple-300' : 'text-slate-800'}`}>
                        {tx.receiverAccount}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-semibold text-slate-900 font-mono">
                      ₹{tx.amount?.toLocaleString('en-IN')}
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 text-[11px] font-mono">
                        {tx.transactionType}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-500">
                      {tx.location || 'Mumbai, MH'}
                    </td>
                    <td className="py-3 px-4 text-slate-500 font-mono text-[11px]">
                      {new Date(tx.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}{' '}
                      <span className="text-slate-400 text-[10px]">({new Date(tx.timestamp).toLocaleDateString()})</span>
                    </td>
                    <td className="py-3 px-4">
                      <RiskBadge 
                        level={tx.riskScore >= 90 ? 'CRITICAL' : tx.riskScore >= 70 ? 'HIGH' : tx.riskScore >= 40 ? 'MEDIUM' : 'LOW'} 
                        score={tx.riskScore}
                        size="sm" 
                      />
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={(e) => { e.stopPropagation(); setSelectedTx(tx); }}
                        className="p-1.5 text-slate-400 hover:text-brand-600 hover:bg-brand-50 rounded transition"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="p-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 bg-slate-50/50">
        <span>
          Showing {Math.min(filteredTransactions.length, (currentPage - 1) * pageSize + 1)} - {Math.min(filteredTransactions.length, currentPage * pageSize)} of {filteredTransactions.length}
        </span>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="p-1.5 rounded border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="font-mono text-slate-700 font-medium">Page {currentPage} of {totalPages}</span>
          <button
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="p-1.5 rounded border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Detail Modal */}
      <TransactionDetailModal
        isOpen={!!selectedTx}
        transaction={selectedTx}
        onClose={() => setSelectedTx(null)}
      />
    </div>
  );
};

export default TransactionTable;
