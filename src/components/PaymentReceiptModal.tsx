import React, { useState } from 'react';
import { 
  X, 
  Building2, 
  CreditCard, 
  Upload, 
  CheckCircle2, 
  Copy, 
  Check, 
  ShieldCheck, 
  Image as ImageIcon,
  DollarSign,
  AlertCircle,
  FileCheck,
  Phone,
  MessageSquare
} from 'lucide-react';
import { MarketplaceItem, MarketplaceOrder, StudentProfile } from '../types';
import { formatPrice, triggerConfetti } from '../utils/helpers';

interface PaymentReceiptModalProps {
  item: MarketplaceItem;
  currentUser: StudentProfile;
  onClose: () => void;
  onSubmitOrder: (order: MarketplaceOrder) => void;
}

// Sample clean mock receipt images for quick test/demo selection
const SAMPLE_RECEIPTS = [
  {
    label: 'Mobile Banking Transfer Receipt',
    url: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600&auto=format&fit=crop&q=80',
  },
  {
    label: 'Online Bank Confirmation Slip',
    url: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=600&auto=format&fit=crop&q=80',
  }
];

export const PaymentReceiptModal: React.FC<PaymentReceiptModalProps> = ({
  item,
  currentUser,
  onClose,
  onSubmitOrder,
}) => {
  const [copiedAccount, setCopiedAccount] = useState(false);
  const [receiptImage, setReceiptImage] = useState<string>('');
  const [receiptFileName, setReceiptFileName] = useState<string>('');
  const [paymentReference, setPaymentReference] = useState<string>('');
  const [buyerPhone, setBuyerPhone] = useState<string>('');
  const [buyerNote, setBuyerNote] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const currencySymbol = currentUser.currencySymbol || item.currencySymbol || '$';

  const bankDetails = item.sellerBankDetails || {
    bankName: 'Campus Student Bank',
    accountName: item.seller.name,
    accountNumber: '1029384756',
  };

  const handleCopyAccountNumber = () => {
    if (bankDetails.accountNumber) {
      navigator.clipboard?.writeText(bankDetails.accountNumber);
      setCopiedAccount(true);
      setTimeout(() => setCopiedAccount(false), 2000);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setReceiptFileName(file.name);
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setReceiptImage(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!receiptImage || !paymentReference.trim()) return;

    setIsSubmitting(true);

    const newOrder: MarketplaceOrder = {
      id: `ord_${Date.now()}`,
      itemId: item.id,
      itemTitle: item.title,
      itemPrice: item.price,
      currencySymbol,
      currencyCode: currentUser.currencyCode || item.currencyCode || 'USD',
      itemImage: item.images[0] || '',
      buyer: currentUser,
      seller: item.seller,
      sellerBankDetails: bankDetails,
      paymentReceiptUrl: receiptImage,
      paymentReceiptName: receiptFileName || 'Transfer_Receipt.png',
      paymentReference: paymentReference.trim().toUpperCase(),
      buyerPhone: buyerPhone.trim(),
      buyerNote: buyerNote.trim(),
      submittedAt: 'Just now',
      status: 'receipt_submitted',
      meetupLocation: item.meetupLocation,
    };

    setTimeout(() => {
      onSubmitOrder(newOrder);
      triggerConfetti();
      setIsSubmitting(false);
      onClose();
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex justify-center p-2 sm:p-4 md:p-6 animate-in fade-in duration-150">
      <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-auto flex flex-col max-h-[94vh]">
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-700 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-white/20 backdrop-blur-xs">
              <FileCheck className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <h2 className="text-base font-black leading-tight">
                Direct Bank Transfer & Receipt Verification
              </h2>
              <p className="text-[11px] text-sky-100 font-medium">
                Pay seller directly & provide your transaction receipt
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5">
          {/* Item Order Summary Card */}
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <img
                src={item.images[0]}
                alt={item.title}
                className="w-13 h-13 rounded-xl object-cover border border-slate-200 shrink-0"
              />
              <div className="min-w-0">
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 bg-blue-100/70 px-2 py-0.5 rounded-md inline-block mb-0.5">
                  {item.condition}
                </span>
                <h3 className="text-xs sm:text-sm font-bold text-slate-900 truncate">
                  {item.title}
                </h3>
                <p className="text-[11px] text-slate-500 truncate">
                  Seller: <span className="font-semibold text-slate-700">{item.seller.name}</span> • Meetup: {item.meetupLocation}
                </p>
              </div>
            </div>

            <div className="text-right shrink-0">
              <div className="text-lg sm:text-xl font-black text-slate-900">
                {formatPrice(item.price, currencySymbol)}
              </div>
              <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                Total Payable
              </span>
            </div>
          </div>

          {/* STEP 1: Seller's Bank Account Details */}
          <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-blue-50 via-indigo-50/50 to-amber-50/30 border border-blue-200/90 shadow-2xs">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-blue-600 text-white text-[11px] font-black flex items-center justify-center">
                  1
                </span>
                <span className="text-xs font-black text-slate-800 uppercase tracking-wider">
                  Transfer to Seller's Account
                </span>
              </div>
              <span className="text-[10px] font-bold text-blue-700 bg-blue-100 px-2 py-0.5 rounded-md">
                Verified Seller Bank
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-2xs">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5">
                  Bank Name
                </span>
                <span className="text-sm font-black text-slate-900">
                  {bankDetails.bankName}
                </span>
              </div>

              <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-2xs">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5">
                  Account Name
                </span>
                <span className="text-sm font-black text-slate-900 truncate block">
                  {bankDetails.accountName}
                </span>
              </div>

              <div className="sm:col-span-2 p-3 bg-white rounded-xl border border-blue-300 shadow-2xs flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 block mb-0.5">
                    Account Number
                  </span>
                  <span className="text-base sm:text-lg font-mono font-black text-slate-900 tracking-wider">
                    {bankDetails.accountNumber}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={handleCopyAccountNumber}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs transition-all cursor-pointer"
                >
                  {copiedAccount ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Number</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            <p className="text-[11px] text-slate-600 mt-2.5 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>Please transfer <strong>{formatPrice(item.price)}</strong>. Do not send partial payments.</span>
            </p>
          </div>

          {/* STEP 2: Provide Payment Receipt */}
          <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-4">
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-blue-600 text-white text-[11px] font-black flex items-center justify-center">
                2
              </span>
              <span className="text-xs font-black text-slate-800 uppercase tracking-wider">
                Upload Proof of Payment (Receipt) *
              </span>
            </div>

            {/* Receipt Preview or Upload Box */}
            {receiptImage ? (
              <div className="relative rounded-2xl border-2 border-emerald-400 bg-emerald-50/30 p-3 flex flex-col items-center">
                <div className="w-full max-h-56 overflow-hidden rounded-xl border border-emerald-200 bg-slate-900/5 flex items-center justify-center">
                  <img
                    src={receiptImage}
                    alt="Payment Transfer Receipt Preview"
                    className="max-h-56 object-contain rounded-lg"
                  />
                </div>
                <div className="flex items-center justify-between w-full mt-2.5 px-1">
                  <span className="text-xs font-bold text-emerald-800 flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Receipt Attached: {receiptFileName || 'Proof of Payment'}</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setReceiptImage('');
                      setReceiptFileName('');
                    }}
                    className="text-xs font-bold text-rose-600 hover:text-rose-700 cursor-pointer"
                  >
                    Change Receipt
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <label className="border-2 border-dashed border-slate-300 hover:border-blue-500 rounded-2xl p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-colors bg-slate-50/50 hover:bg-blue-50/30">
                  <Upload className="w-8 h-8 text-blue-600 mb-2" />
                  <span className="text-xs sm:text-sm font-bold text-slate-800">
                    Click to select payment receipt screenshot
                  </span>
                  <span className="text-[11px] text-slate-500 mt-0.5">
                    JPG, PNG, or mobile banking confirmation capture
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>

                {/* Or Quick Test / Demo Receipt Presets */}
                <div className="flex flex-wrap items-center gap-2 pt-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Or select demo receipt:
                  </span>
                  {SAMPLE_RECEIPTS.map((sample, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        setReceiptImage(sample.url);
                        setReceiptFileName(sample.label);
                        if (!paymentReference) {
                          setPaymentReference(`TXN-${Math.floor(100000 + Math.random() * 900000)}`);
                        }
                      }}
                      className="text-[11px] font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
                    >
                      {sample.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Transaction Reference & Phone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Transaction Reference / Session ID *
                </label>
                <input
                  type="text"
                  value={paymentReference}
                  onChange={(e) => setPaymentReference(e.target.value)}
                  placeholder="e.g. 09028374921 / TXN-94819"
                  required
                  className="w-full text-xs sm:text-sm px-3.5 py-2 rounded-xl border border-slate-300 font-mono font-bold uppercase tracking-wider focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
                <span className="text-[10px] text-slate-400 block mt-1">
                  Found on your bank transfer confirmation screen.
                </span>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Your Phone / WhatsApp (For Meetup)
                </label>
                <div className="relative">
                  <Phone className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="tel"
                    value={buyerPhone}
                    onChange={(e) => setBuyerPhone(e.target.value)}
                    placeholder="e.g. (555) 234-5678"
                    className="w-full text-xs sm:text-sm pl-8 pr-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
                <span className="text-[10px] text-slate-400 block mt-1">
                  The seller will use this to coordinate handover.
                </span>
              </div>
            </div>

            {/* Note to Seller */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Note for Seller (Optional)
              </label>
              <textarea
                value={buyerNote}
                onChange={(e) => setBuyerNote(e.target.value)}
                placeholder="e.g. Transferred from Chase app, I can meet at 4pm at the library!"
                rows={2}
                className="w-full text-xs sm:text-sm p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none"
              />
            </div>
          </div>

          {/* Action buttons */}
          <div className="pt-3 border-t border-slate-200 flex items-center justify-between">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 text-xs sm:text-sm font-semibold transition-colors cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={!receiptImage || !paymentReference.trim() || isSubmitting}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white text-xs sm:text-sm font-bold shadow-md shadow-emerald-600/20 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{isSubmitting ? 'Verifying Receipt...' : 'Submit Payment Receipt'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
