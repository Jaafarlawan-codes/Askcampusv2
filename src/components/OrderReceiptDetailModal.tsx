import React, { useState } from 'react';
import { 
  X, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  MapPin, 
  Phone, 
  Building2, 
  Copy, 
  Check, 
  ShieldCheck, 
  MessageSquare,
  ExternalLink,
  DollarSign
} from 'lucide-react';
import { MarketplaceOrder, StudentProfile } from '../types';
import { formatPrice, triggerConfetti } from '../utils/helpers';

interface OrderReceiptDetailModalProps {
  order: MarketplaceOrder;
  currentUser: StudentProfile;
  onClose: () => void;
  onConfirmOrder?: (orderId: string) => void;
  onRejectOrder?: (orderId: string) => void;
  onContactUser?: (targetUser: StudentProfile) => void;
}

export const OrderReceiptDetailModal: React.FC<OrderReceiptDetailModalProps> = ({
  order,
  currentUser,
  onClose,
  onConfirmOrder,
  onRejectOrder,
  onContactUser,
}) => {
  const [copiedRef, setCopiedRef] = useState(false);
  const isSeller = currentUser.id === order.seller.id;
  const isBuyer = currentUser.id === order.buyer.id;
  const currencySymbol = order.currencySymbol || currentUser.currencySymbol || '$';

  const handleCopyRef = () => {
    navigator.clipboard?.writeText(order.paymentReference);
    setCopiedRef(true);
    setTimeout(() => setCopiedRef(false), 2000);
  };

  const getStatusBadge = () => {
    switch (order.status) {
      case 'confirmed':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-black bg-emerald-100 text-emerald-800 border border-emerald-300">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Payment Verified & Confirmed</span>
          </span>
        );
      case 'rejected':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-black bg-rose-100 text-rose-800 border border-rose-300">
            <XCircle className="w-3.5 h-3.5 text-rose-600" />
            <span>Receipt Rejected</span>
          </span>
        );
      case 'receipt_submitted':
      default:
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-black bg-amber-100 text-amber-800 border border-amber-300">
            <Clock className="w-3.5 h-3.5 text-amber-600 animate-pulse" />
            <span>Pending Seller Bank Verification</span>
          </span>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex justify-center p-2 sm:p-4 md:p-6 animate-in fade-in duration-150">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-auto flex flex-col max-h-[94vh]">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between shrink-0">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Order #{order.id.slice(-6).toUpperCase()}
              </span>
              {getStatusBadge()}
            </div>
            <h2 className="text-base font-black truncate max-w-md">
              {order.itemTitle}
            </h2>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5">
          {/* Item & Price Header */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <img
                src={order.itemImage}
                alt={order.itemTitle}
                className="w-14 h-14 rounded-xl object-cover border border-slate-200"
              />
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  {order.itemTitle}
                </h3>
                <div className="text-xs text-slate-500 mt-0.5">
                  Meetup: <span className="font-semibold text-slate-700">{order.meetupLocation}</span>
                </div>
                <div className="text-[11px] text-slate-400">
                  Submitted: {order.submittedAt}
                </div>
              </div>
            </div>

            <div className="text-right">
              <span className="text-xl font-black text-slate-900 block">
                {formatPrice(order.itemPrice, currencySymbol)}
              </span>
              <span className="text-[10px] text-slate-500 font-medium">
                Direct Bank Transfer
              </span>
            </div>
          </div>

          {/* Payment Proof Receipt Image */}
          <div className="rounded-2xl border border-slate-200 overflow-hidden bg-slate-950 p-3 flex flex-col items-center">
            <div className="w-full flex items-center justify-between text-xs text-slate-300 font-bold pb-2 px-1">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Buyer Payment Transfer Receipt</span>
              </span>
              <span className="text-[11px] text-slate-400 font-mono">
                Ref: {order.paymentReference}
              </span>
            </div>

            <div className="w-full max-h-72 overflow-y-auto rounded-xl bg-slate-900 flex items-center justify-center p-2">
              <img
                src={order.paymentReceiptUrl}
                alt="Payment Receipt"
                className="max-h-68 max-w-full object-contain rounded-lg shadow-md"
              />
            </div>
          </div>

          {/* Transaction Reference & Bank Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                Transaction Reference ID
              </span>
              <div className="flex items-center justify-between">
                <span className="font-mono font-black text-slate-900 text-sm">
                  {order.paymentReference}
                </span>
                <button
                  onClick={handleCopyRef}
                  className="p-1 text-slate-500 hover:text-slate-800 cursor-pointer"
                  title="Copy Reference"
                >
                  {copiedRef ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                Seller Receiving Bank
              </span>
              <span className="font-bold text-slate-900 block text-sm">
                {order.sellerBankDetails.bankName}
              </span>
              <span className="text-[11px] text-slate-500 font-mono">
                Acc: {order.sellerBankDetails.accountNumber} ({order.sellerBankDetails.accountName})
              </span>
            </div>
          </div>

          {/* Buyer / Seller details */}
          <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <img
                  src={isSeller ? order.buyer.avatar : order.seller.avatar}
                  alt=""
                  className="w-10 h-10 rounded-full object-cover ring-2 ring-blue-200"
                />
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                    {isSeller ? 'Purchased by (Buyer):' : 'Sold by (Seller):'}
                  </span>
                  <span className="text-sm font-bold text-slate-900">
                    {isSeller ? order.buyer.name : order.seller.name}
                  </span>
                  <span className="text-xs text-slate-500 block">
                    {isSeller ? order.buyer.college : order.seller.college}
                  </span>
                </div>
              </div>

              {order.buyerPhone && (
                <div className="text-xs bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200">
                  <span className="text-[10px] text-slate-400 block">Buyer Phone:</span>
                  <span className="font-semibold text-slate-800">{order.buyerPhone}</span>
                </div>
              )}
            </div>

            {order.buyerNote && (
              <div className="mt-3 pt-3 border-t border-slate-100 text-xs text-slate-600 bg-slate-50/70 p-2.5 rounded-xl">
                <span className="font-bold text-slate-700">Buyer Note: </span>
                {order.buyerNote}
              </div>
            )}
          </div>

          {/* Seller Action Buttons */}
          {isSeller && order.status === 'receipt_submitted' && (
            <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200 space-y-3">
              <div className="text-xs font-bold text-amber-900 flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-600" />
                <span>Verify funds received in your {order.sellerBankDetails.bankName} mobile app:</span>
              </div>
              <p className="text-[11px] text-amber-800">
                Check that <strong>{formatPrice(order.itemPrice)}</strong> with reference <strong>{order.paymentReference}</strong> has credited your account before clicking Confirm.
              </p>

              <div className="grid grid-cols-2 gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => onRejectOrder && onRejectOrder(order.id)}
                  className="py-2.5 px-4 rounded-xl bg-white hover:bg-rose-50 text-rose-700 font-bold text-xs border border-rose-300 transition-colors cursor-pointer"
                >
                  Decline / Reject Receipt
                </button>

                <button
                  type="button"
                  onClick={() => {
                    if (onConfirmOrder) {
                      onConfirmOrder(order.id);
                      triggerConfetti();
                    }
                  }}
                  className="py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/20 transition-all cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Confirm Payment & Complete Sale</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-200 text-xs font-bold transition-colors cursor-pointer"
          >
            Close
          </button>

          <span className="text-[11px] text-slate-500 font-medium">
            Campus Receipt ID: {order.id}
          </span>
        </div>
      </div>
    </div>
  );
};
