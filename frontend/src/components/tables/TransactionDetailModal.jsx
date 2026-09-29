import React from 'react';
import { X, ArrowRight, ShieldAlert, Laptop, MapPin, Calendar, Clock, DollarSign, ArrowUpRight, ArrowDownLeft } from 'lucide-react';
import RiskBadge from '../common/RiskBadge';

export const TransactionDetailModal = ({ transaction, isOpen, onClose }) => {
  if (!isOpen || !transaction) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/50 backdrop-blur-sm flex justify-end animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between overflow-y-auto animate-in slide-in-from-right duration-300">
        
        {/* Header */}
        <div className="p-5 border-b border-slate-200 bg-slate-50/80 flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-brand-700 bg-brand-50 px-2 py-0.5 rounded border border-brand-200">
                {transaction.id}
              </span>
              <RiskBadge 
                level={transaction.riskScore >= 90 ? 'CRITICAL' : transaction.riskScore >= 70 ? 'HIGH' : transaction.riskScore >= 40 ? 'MEDIUM' : 'LOW'} 
                score={transaction.riskScore}
                size="sm" 
              />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mt-2">Transaction Examination</h3>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-md transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-5 flex-1">
          {/* Amount Card */}
          <div className="bg-slate-900 text-white rounded-xl p-4 shadow-sm text-center">
            <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Transaction Volume</span>
            <div className="text-2xl font-black text-white font-mono mt-1">
              ₹{transaction.amount?.toLocaleString('en-IN')}
            </div>
            <span className="inline-block mt-2 text-[11px] bg-slate-800 text-slate-300 px-2.5 py-0.5 rounded-full border border-slate-700">
              Payment Rails: {transaction.transactionType}
            </span>
          </div>

          {/* Account Transfer Routing */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Counterparty Routing</span>
            
            <div className="flex items-center justify-between text-xs font-mono">
              <div className="space-y-0.5">
                <span className="text-slate-500 text-[10px] block uppercase font-sans">Sender / Originator</span>
                <span className="font-bold text-slate-900 bg-white px-2.5 py-1 rounded border border-slate-300 block">
                  {transaction.senderAccount}
                </span>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400 shrink-0 mx-2" />
              <div className="space-y-0.5 text-right">
                <span className="text-slate-500 text-[10px] block uppercase font-sans">Receiver / Beneficiary</span>
                <span className="font-bold text-slate-900 bg-white px-2.5 py-1 rounded border border-slate-300 block">
                  {transaction.receiverAccount}
                </span>
              </div>
            </div>
          </div>

          {/* Metadata Grid */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 bg-white rounded-lg border border-slate-200">
              <span className="text-slate-500 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" /> Timestamp
              </span>
              <span className="font-semibold text-slate-800 block mt-1 font-mono">
                {new Date(transaction.timestamp).toLocaleString()}
              </span>
            </div>

            <div className="p-3 bg-white rounded-lg border border-slate-200">
              <span className="text-slate-500 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5" /> Geolocation
              </span>
              <span className="font-semibold text-slate-800 block mt-1">
                {transaction.location || 'Mumbai, MH'}
              </span>
            </div>

            <div className="p-3 bg-white rounded-lg border border-slate-200">
              <span className="text-slate-500 flex items-center gap-1">
                <Laptop className="w-3.5 h-3.5" /> Terminal Device
              </span>
              <span className="font-semibold text-slate-800 block mt-1 font-mono">
                {transaction.deviceId || 'DEV-8821A'}
              </span>
            </div>

            <div className="p-3 bg-white rounded-lg border border-slate-200">
              <span className="text-slate-500 flex items-center gap-1">
                <ShieldAlert className="w-3.5 h-3.5 text-red-500" /> Risk Contribution
              </span>
              <span className="font-bold text-red-600 block mt-1 font-mono">
                +{transaction.riskContribution || 18}% to Case
              </span>
            </div>
          </div>

          {/* Anomaly / Heuristic Flag */}
          {transaction.riskScore >= 70 && (
            <div className="p-3.5 bg-red-50 border border-red-200 rounded-xl text-red-900 text-xs space-y-1">
              <span className="font-bold flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4 text-red-600" /> Suspicious Pattern Triggered
              </span>
              <p className="text-red-700 leading-relaxed">
                {transaction.description || 'Transaction amount and velocity significantly exceed historical baseline models.'}
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold transition"
          >
            Close Examination
          </button>
        </div>
      </div>
    </div>
  );
};

export default TransactionDetailModal;
