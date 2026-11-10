import React, { useState } from 'react';
import { 
  X, 
  MapPin, 
  Heart, 
  Share2, 
  ShieldCheck, 
  MessageCircle, 
  DollarSign, 
  Tag, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  Award,
  Trash2,
  Check,
  Building2,
  FileCheck,
  CreditCard
} from 'lucide-react';
import { MarketplaceItem, StudentProfile } from '../types';
import { formatPrice, calculateDiscount, getConditionColor, triggerConfetti } from '../utils/helpers';

interface MarketplaceDetailModalProps {
  item: MarketplaceItem;
  currentUser: StudentProfile;
  onClose: () => void;
  onToggleSave: (itemId: string) => void;
  onStartChat: (item: MarketplaceItem) => void;
  onUpdateStatus: (itemId: string, status: 'available' | 'reserved' | 'sold') => void;
  onDeleteItem: (itemId: string) => void;
  onInitiatePurchase?: (item: MarketplaceItem) => void;
}

export const MarketplaceDetailModal: React.FC<MarketplaceDetailModalProps> = ({
  item,
  currentUser,
  onClose,
  onToggleSave,
  onStartChat,
  onUpdateStatus,
  onDeleteItem,
  onInitiatePurchase,
}) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [copiedLink, setCopiedLink] = useState(false);

  const currencySymbol = currentUser.currencySymbol || item.currencySymbol || '$';
  const discount = calculateDiscount(item.price, item.originalPrice);
  const conditionStyles = getConditionColor(item.condition);
  const isSeller = currentUser.id === item.seller.id;

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex justify-center p-2 sm:p-4 md:p-6 animate-in fade-in duration-150">
      <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-auto flex flex-col max-h-[92vh]">
        {/* Top Header */}
        <div className="px-5 py-3.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-md text-xs font-bold bg-indigo-600 text-white uppercase tracking-wider">
              {item.category.replace('_', ' ')}
            </span>
            {item.courseCode && (
              <span className="px-2.5 py-0.5 rounded-md text-xs font-bold bg-slate-900 text-white">
                {item.courseCode}
              </span>
            )}
            <span className="text-xs text-slate-500 hidden sm:inline">
              • {item.campus}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onToggleSave(item.id)}
              className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                item.isSaved
                  ? 'bg-rose-50 border-rose-200 text-rose-600'
                  : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-100'
              }`}
              title="Save to Wishlist"
            >
              <Heart className={`w-4 h-4 ${item.isSaved ? 'fill-rose-500 text-rose-500' : ''}`} />
            </button>

            <button
              onClick={handleShare}
              className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-500 hover:bg-slate-100 transition-colors cursor-pointer relative"
              title="Share Item"
            >
              <Share2 className="w-4 h-4" />
              {copiedLink && (
                <span className="absolute -bottom-7 right-0 text-[10px] bg-slate-900 text-white px-2 py-0.5 rounded shadow whitespace-nowrap">
                  Link copied!
                </span>
              )}
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition-colors cursor-pointer ml-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
            {/* Left: Images */}
            <div>
              <div className="aspect-4/3 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 relative shadow-inner">
                <img
                  src={item.images[selectedImageIndex] || item.images[0]}
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
                {item.status === 'sold' && (
                  <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center">
                    <span className="px-5 py-2 rounded-full bg-slate-900 text-white font-extrabold text-sm uppercase tracking-wider shadow-lg border border-slate-700">
                      Item Sold
                    </span>
                  </div>
                )}
              </div>

              {/* Thumbnails if multiple images */}
              {item.images.length > 1 && (
                <div className="flex gap-2 mt-3 overflow-x-auto pb-1">
                  {item.images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImageIndex(idx)}
                      className={`w-16 h-16 rounded-xl overflow-hidden border-2 transition-all cursor-pointer shrink-0 ${
                        selectedImageIndex === idx ? 'border-indigo-600 ring-2 ring-indigo-200' : 'border-slate-200 opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}

              {/* Campus Meetup Safety Card */}
              <div className="mt-5 p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Safe Campus Exchange</span>
                </div>
                <div className="flex items-start gap-2 text-xs text-slate-600 mb-2">
                  <MapPin className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-slate-800">Meetup Location:</span>
                    <p className="text-slate-700 font-medium">{item.meetupLocation}</p>
                  </div>
                </div>
                <p className="text-[11px] text-slate-500 leading-normal">
                  Always inspect materials and test electronics in high-traffic campus spots (Library, Student Center, Dining Hall). Venmo or cash upon inspection.
                </p>
              </div>
            </div>

            {/* Right: Pricing, Details, Seller */}
            <div className="flex flex-col justify-between">
              <div>
                {/* Price Box */}
                <div className="p-4 rounded-2xl bg-gradient-to-r from-indigo-50/80 via-white to-amber-50/40 border border-indigo-100 mb-4">
                  <div className="flex items-baseline justify-between">
                    <div>
                      <div className="text-3xl font-black text-slate-900 tracking-tight">
                        {formatPrice(item.price, currencySymbol)}
                      </div>
                      {item.originalPrice && item.originalPrice > item.price && (
                        <div className="text-xs text-slate-500 flex items-center gap-1.5 mt-0.5">
                          <span>Campus Bookstore Price:</span>
                          <span className="line-through">{formatPrice(item.originalPrice, currencySymbol)}</span>
                        </div>
                      )}
                    </div>

                    {discount && (
                      <div className="text-right">
                        <span className="px-3 py-1 rounded-xl bg-emerald-600 text-white font-extrabold text-xs shadow-sm">
                          Save {discount}%
                        </span>
                        <div className="text-[11px] text-emerald-700 font-semibold mt-1">
                          You save {formatPrice(item.originalPrice! - item.price, currencySymbol)}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2 mt-3 pt-3 border-t border-indigo-100/60 text-xs text-slate-600">
                    <span className={`px-2 py-0.5 rounded-md font-bold ${conditionStyles.bg} ${conditionStyles.text}`}>
                      {item.condition}
                    </span>
                    {item.isNegotiable ? (
                      <span className="text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md font-medium border border-amber-200">
                        Price is negotiable
                      </span>
                    ) : (
                      <span className="text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md font-medium">
                        Firm price
                      </span>
                    )}
                    <span className="text-slate-400 ml-auto">Listed {item.createdAt}</span>
                  </div>
                </div>

                {/* Title */}
                <h1 className="text-xl sm:text-2xl font-bold text-slate-900 leading-snug mb-3">
                  {item.title}
                </h1>

                {/* Description */}
                <div className="text-sm text-slate-700 leading-relaxed whitespace-pre-line mb-6">
                  {item.description}
                </div>

                {/* Course Code / Requirement */}
                {item.courseCode && (
                  <div className="mb-6 p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs flex items-center justify-between">
                    <span className="text-slate-500">Course Syllabus Match:</span>
                    <span className="font-bold text-slate-800 bg-white px-2.5 py-1 rounded border border-slate-200">
                      {item.courseCode}
                    </span>
                  </div>
                )}

                {/* Seller Card */}
                <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs mb-6">
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                    Seller Information
                  </div>
                  <div className="flex items-center gap-3">
                    <img
                      src={item.seller.avatar}
                      alt={item.seller.name}
                      className="w-12 h-12 rounded-xl object-cover ring-2 ring-indigo-200"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-slate-900 flex items-center gap-1.5">
                        <span className="truncate">{item.seller.name}</span>
                        {item.seller.verifiedStudent && (
                          <span className="text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-200 px-1.5 py-0.2 rounded font-medium">
                            Verified Student
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-slate-500 truncate">
                        {item.seller.major} • Class of {item.seller.graduationYear}
                      </div>
                      <div className="text-[11px] text-amber-600 font-semibold flex items-center gap-1 mt-0.5">
                        <Award className="w-3.5 h-3.5" />
                        <span>{item.seller.karma} karma</span>
                        <span className="text-slate-400 font-normal ml-1">• Verified Campus Student</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Seller Payout Bank Details (Account Number, Name, Bank) */}
                {item.sellerBankDetails && (
                  <div className="p-3.5 rounded-2xl bg-gradient-to-r from-blue-50/90 to-indigo-50/70 border border-blue-200 mb-4">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-blue-900 mb-1.5">
                      <CreditCard className="w-3.5 h-3.5 text-blue-700" />
                      <span className="uppercase tracking-wider">Seller Payout Bank Account</span>
                    </div>
                    <div className="text-xs text-slate-700 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500">Bank:</span>
                        <span className="font-bold text-slate-900">{item.sellerBankDetails.bankName}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500">Account Name:</span>
                        <span className="font-semibold text-slate-900 truncate max-w-[180px]">{item.sellerBankDetails.accountName}</span>
                      </div>
                      <div className="flex items-center justify-between pt-1 border-t border-blue-200/60">
                        <span className="text-slate-500">Account Number:</span>
                        <span className="font-mono font-black text-blue-900 bg-white px-2 py-0.5 rounded border border-blue-200">
                          {item.sellerBankDetails.accountNumber}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="pt-2">
                {isSeller ? (
                  <div className="space-y-2">
                    <div className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                      Manage Your Listing:
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => {
                          onUpdateStatus(item.id, item.status === 'reserved' ? 'available' : 'reserved');
                        }}
                        className={`py-2 px-3 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${
                          item.status === 'reserved'
                            ? 'bg-amber-100 text-amber-800 border-amber-300'
                            : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-300'
                        }`}
                      >
                        {item.status === 'reserved' ? 'Unreserve Item' : 'Mark as Reserved'}
                      </button>

                      <button
                        onClick={() => {
                          onUpdateStatus(item.id, item.status === 'sold' ? 'available' : 'sold');
                          if (item.status !== 'sold') triggerConfetti();
                        }}
                        className={`py-2 px-3 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${
                          item.status === 'sold'
                            ? 'bg-slate-900 text-white border-slate-900'
                            : 'bg-emerald-600 hover:bg-emerald-700 text-white border-emerald-600'
                        }`}
                      >
                        {item.status === 'sold' ? 'Relist as Available' : 'Mark as Sold'}
                      </button>
                    </div>

                    <button
                      onClick={() => onDeleteItem(item.id)}
                      className="w-full mt-2 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-xl transition-colors flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Delete Listing</span>
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {/* Primary Action: Buy Now & Provide Receipt */}
                    <button
                      onClick={() => {
                        if (onInitiatePurchase) onInitiatePurchase(item);
                      }}
                      disabled={item.status === 'sold'}
                      className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-extrabold text-sm shadow-lg shadow-emerald-600/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      <FileCheck className="w-4 h-4" />
                      <span>{item.status === 'sold' ? 'Item is Sold' : 'Buy Now • Direct Bank Transfer & Receipt'}</span>
                    </button>

                    <button
                      onClick={() => onStartChat(item)}
                      disabled={item.status === 'sold'}
                      className="w-full py-2.5 px-4 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      <MessageCircle className="w-3.5 h-3.5 text-slate-500" />
                      <span>Chat with Seller / Ask Questions</span>
                    </button>
                    <p className="text-[11px] text-center text-slate-400">
                      Transfer money to seller's bank account & upload payment receipt. No platform fees.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
