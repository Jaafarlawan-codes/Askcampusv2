import React from 'react';
import { 
  Heart, 
  MapPin, 
  MessageCircle, 
  Tag, 
  CheckCircle,
  Clock,
  ArrowRight
} from 'lucide-react';
import { MarketplaceItem } from '../types';
import { formatPrice, calculateDiscount, getConditionColor } from '../utils/helpers';

interface MarketplaceCardProps {
  item: MarketplaceItem;
  userCurrencySymbol?: string;
  currentUserSchool?: string;
  onSelect: (item: MarketplaceItem) => void;
  onToggleSave: (itemId: string, e: React.MouseEvent) => void;
  onQuickChat: (item: MarketplaceItem, e: React.MouseEvent) => void;
}

export const MarketplaceCard: React.FC<MarketplaceCardProps> = ({
  item,
  userCurrencySymbol = '$',
  currentUserSchool,
  onSelect,
  onToggleSave,
  onQuickChat,
}) => {
  const discount = calculateDiscount(item.price, item.originalPrice);
  const conditionStyles = getConditionColor(item.condition);
  const isSold = item.status === 'sold';
  const isReserved = item.status === 'reserved';
  const isColleague = currentUserSchool && (
    item.campus.toLowerCase() === currentUserSchool.toLowerCase() ||
    (item.seller.school && item.seller.school.toLowerCase() === currentUserSchool.toLowerCase()) ||
    (item.seller.college && item.seller.college.toLowerCase() === currentUserSchool.toLowerCase())
  );
  const currencySymbol = userCurrencySymbol || item.currencySymbol || '$';

  return (
    <div
      onClick={() => onSelect(item)}
      className="bg-white rounded-2xl border border-slate-200/90 hover:border-blue-400 shadow-2xs hover:shadow-lg transition-all duration-200 overflow-hidden cursor-pointer group flex flex-col justify-between"
    >
      <div>
        {/* Image Container with Badges */}
        <div className="relative aspect-4/3 overflow-hidden bg-slate-100">
          <img
            src={item.images[0]}
            alt={item.title}
            className={`w-full h-full object-cover group-hover:scale-104 transition-transform duration-300 ${
              isSold ? 'grayscale contrast-75' : ''
            }`}
            loading="lazy"
          />

          {/* Sold / Reserved Overlay */}
          {isSold && (
            <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-2xs flex items-center justify-center">
              <span className="px-3.5 py-1 rounded-full bg-slate-900 text-white font-extrabold text-xs uppercase tracking-wider shadow-md border border-slate-700">
                Sold Out
              </span>
            </div>
          )}

          {isReserved && !isSold && (
            <div className="absolute top-2.5 left-2.5 z-10">
              <span className="px-2.5 py-0.5 rounded-lg bg-amber-500 text-white font-bold text-[10px] shadow-sm uppercase tracking-wider">
                Pending Meetup
              </span>
            </div>
          )}

          {/* Savings Badge */}
          {discount && !isSold && (
            <div className="absolute top-2.5 left-2.5 z-10">
              <span className="inline-flex items-center px-2 py-0.5 rounded-lg bg-emerald-600 text-white font-bold text-[10px] shadow-xs">
                Save {discount}%
              </span>
            </div>
          )}

          {/* Condition Tag */}
          <div className="absolute bottom-2.5 left-2.5 z-10">
            <span className={`inline-flex items-center px-2 py-0.5 rounded-lg text-[10px] font-bold border backdrop-blur-md bg-white/95 ${conditionStyles.text} ${conditionStyles.border} shadow-2xs`}>
              {item.condition}
            </span>
          </div>

          {/* Wishlist Heart Button */}
          <button
            onClick={(e) => onToggleSave(item.id, e)}
            className={`absolute top-2.5 right-2.5 z-10 p-2 rounded-xl backdrop-blur-md transition-all cursor-pointer min-h-[36px] min-w-[36px] flex items-center justify-center ${
              item.isSaved
                ? 'bg-rose-500 text-white shadow-xs'
                : 'bg-white/90 text-slate-600 hover:text-rose-500 hover:bg-white shadow-2xs'
            }`}
            title={item.isSaved ? 'Remove from saved' : 'Save to wishlist'}
          >
            <Heart className={`w-4 h-4 ${item.isSaved ? 'fill-white' : ''}`} />
          </button>
        </div>

        {/* Info Block */}
        <div className="p-4">
          {/* Price & Course Tag */}
          <div className="flex items-baseline justify-between gap-2 mb-1.5">
            <div className="flex items-baseline gap-1.5">
              <span className="text-xl font-extrabold text-slate-900 tracking-tight tabular-nums">
                {formatPrice(item.price, currencySymbol)}
              </span>
              {item.originalPrice && item.originalPrice > item.price && (
                <span className="text-xs text-slate-400 line-through tabular-nums">
                  {formatPrice(item.originalPrice, currencySymbol)}
                </span>
              )}
            </div>

            {isColleague ? (
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-600">
                <span>🎓 Classmate</span>
              </span>
            ) : item.courseCode ? (
              <span className="text-[11px] font-bold text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded">
                {item.courseCode}
              </span>
            ) : null}
          </div>

          {/* Title */}
          <h3 className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-2 leading-snug">
            {item.title}
          </h3>

          {/* Meetup Location */}
          <div className="mt-2.5 flex items-center gap-1 text-xs text-slate-500">
            <MapPin className="w-3.5 h-3.5 text-blue-500 shrink-0" />
            <span className="truncate">{item.meetupLocation}</span>
          </div>
        </div>
      </div>

      {/* Footer / Seller & Chat Button */}
      <div className="px-4 pb-3.5 pt-0">
        <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <img
              src={item.seller.avatar}
              alt={item.seller.name}
              className="w-5 h-5 rounded-full object-cover ring-1 ring-slate-200 shrink-0"
            />
            <div className="truncate text-xs">
              <span className="font-semibold text-slate-800 block truncate leading-tight">{item.seller.name.split(' ')[0]}</span>
              <span className="text-slate-400 block text-[10px] truncate leading-tight">{item.campus}</span>
            </div>
          </div>

          <button
            onClick={(e) => onQuickChat(item, e)}
            disabled={isSold}
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-600 text-blue-700 hover:text-white text-xs font-bold transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
          >
            <MessageCircle className="w-3.5 h-3.5" />
            <span>Chat</span>
          </button>
        </div>
      </div>
    </div>
  );
};
