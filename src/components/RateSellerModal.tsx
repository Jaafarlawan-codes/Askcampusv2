import React, { useState } from 'react';
import { X, Star, ShieldCheck, Check } from 'lucide-react';
import { SellerReview, StudentProfile } from '../types';
import { SELLER_PRAISE_TAGS } from '../utils/reputation';

interface RateSellerModalProps {
  seller: StudentProfile;
  currentUser: StudentProfile;
  itemId?: string;
  itemTitle?: string;
  orderId?: string;
  verifiedPurchase?: boolean;
  onClose: () => void;
  onSubmitReview: (review: SellerReview) => Promise<void> | void;
}

const RATING_LABELS: Record<number, string> = {
  1: 'Poor experience',
  2: 'Below expectations',
  3: 'Okay transaction',
  4: 'Great seller',
  5: 'Outstanding · Highly Recommended',
};

export const RateSellerModal: React.FC<RateSellerModalProps> = ({
  seller,
  currentUser,
  itemId,
  itemTitle,
  orderId,
  verifiedPurchase = false,
  onClose,
  onSubmitReview,
}) => {
  const [rating, setRating] = useState<number>(5);
  const [hoveredRating, setHoveredRating] = useState<number | null>(null);
  const [selectedTags, setSelectedTags] = useState<string[]>(['Fast Reply', 'As Described']);
  const [comment, setComment] = useState<string>('');
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const activeStarValue = hoveredRating ?? rating;

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) => {
      if (prev.includes(tag)) {
        return prev.filter((t) => t !== tag);
      }
      if (prev.length >= 5) return prev;
      return [...prev, tag];
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser.id) {
      setError('Please sign in with Google to leave a seller rating.');
      return;
    }
    if (currentUser.id === seller.id) {
      setError('You cannot rate your own seller account.');
      return;
    }
    setSubmitting(true);
    setError(null);

    const newReview: SellerReview = {
      id: `rev_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      sellerId: seller.id,
      sellerName: seller.name,
      reviewerId: currentUser.id,
      reviewerName: currentUser.name || 'Campus Student',
      reviewerAvatar: currentUser.avatar || '',
      itemId,
      itemTitle,
      orderId,
      rating,
      comment: comment.trim(),
      tags: selectedTags,
      campus: seller.school || seller.college || currentUser.school || '',
      verifiedPurchase,
      createdAt: new Date().toISOString(),
    };

    try {
      await onSubmitReview(newReview);
      onClose();
    } catch (err: any) {
      setError(err?.message || 'Could not save rating right now. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-150">
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900">Rate Campus Seller</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Help classmates find reliable sellers on {seller.school || seller.college || 'campus'}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
            aria-label="Close rating modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-5">
          {/* Seller Summary */}
          <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200/80">
            <img
              src={seller.avatar}
              alt={seller.name}
              referrerPolicy="no-referrer"
              className="w-11 h-11 rounded-xl object-cover border border-slate-200 shrink-0"
            />
            <div className="min-w-0 flex-1">
              <div className="text-sm font-bold text-slate-900 truncate">{seller.name}</div>
              <div className="text-xs text-slate-500 truncate">
                {seller.school || seller.college}
                {itemTitle ? ` · ${itemTitle}` : ''}
              </div>
            </div>
            {verifiedPurchase && (
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 shrink-0">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Verified Order</span>
              </span>
            )}
          </div>

          {/* Interactive 1-5 Star Selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-2">
              Overall Experience Rating
            </label>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => {
                const filled = star <= activeStarValue;
                return (
                  <button
                    key={star}
                    type="button"
                    onMouseEnter={() => setHoveredRating(star)}
                    onMouseLeave={() => setHoveredRating(null)}
                    onClick={() => setRating(star)}
                    className={`p-2 rounded-xl border transition-all cursor-pointer ${
                      filled
                        ? 'bg-amber-50 border-amber-300 text-amber-500'
                        : 'bg-white border-slate-200 text-slate-300 hover:text-slate-400'
                    }`}
                    aria-label={`Rate ${star} out of 5 stars`}
                  >
                    <Star className={`w-6 h-6 ${filled ? 'fill-amber-400 text-amber-500' : ''}`} />
                  </button>
                );
              })}
              <span className="ml-2 text-sm font-bold text-slate-900 tabular-nums">
                {activeStarValue}.0 / 5
              </span>
            </div>
            <p className="text-xs font-medium text-slate-600 mt-1.5">
              {RATING_LABELS[activeStarValue]}
            </p>
          </div>

          {/* Praise Tags */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-2">
              What stood out?
            </label>
            <div className="flex flex-wrap gap-1.5">
              {SELLER_PRAISE_TAGS.map((tag) => {
                const active = selectedTags.includes(tag);
                return (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => toggleTag(tag)}
                    className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors cursor-pointer whitespace-nowrap ${
                      active
                        ? 'bg-slate-900 text-white border-slate-900'
                        : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    {active && <Check className="w-3 h-3" />}
                    <span>{tag}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Written Review */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Feedback Note (Optional)
            </label>
            <textarea
              rows={3}
              maxLength={600}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Was the textbook condition accurate? How fast did they respond?"
              className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 resize-none"
            />
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 font-medium">
              {error}
            </div>
          )}

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs transition-colors cursor-pointer disabled:opacity-50"
            >
              {submitting ? 'Submitting...' : 'Submit Seller Rating'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
