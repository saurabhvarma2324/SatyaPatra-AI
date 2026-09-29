import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Filter, Download, ArrowLeftRight, RefreshCw } from 'lucide-react';
import { useData } from '../context/DataContext';
import TransactionTable from '../components/tables/TransactionTable';

export const TransactionExplorerPage = () => {
  const { transactions } = useData();
  const [searchParams] = useSearchParams();
  const initialSearch = searchParams.get('search') || '';
  const initialRisk = searchParams.get('risk') || 'ALL';

  const [filterQuery, setFilterQuery] = useState(initialSearch);

  const handleExport = () => {
    const csvContent = "data:text/csv;charset=utf-8," + 
      "Transaction ID,Sender,Receiver,Amount,Type,Location,Device,Risk Score,Status,Timestamp\n" +
      transactions.map(t => `${t.id},${t.senderAccount},${t.receiverAccount},${t.amount},${t.transactionType},"${t.location}",${t.deviceId},${t.riskScore},${t.status},${t.timestamp}`).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `ArthaDrishti_Transactions_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-5">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Transaction Explorer</h2>
          <p className="text-xs text-slate-500 mt-1">
            Search, filter, and inspect {transactions.length.toLocaleString()} synthetic financial transactions across banking channels.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleExport}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-xl text-xs font-semibold shadow-xs transition"
          >
            <Download className="w-4 h-4" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Main Table */}
      <TransactionTable transactions={transactions} title="All Recorded Transactions" />
    </div>
  );
};

export default TransactionExplorerPage;
