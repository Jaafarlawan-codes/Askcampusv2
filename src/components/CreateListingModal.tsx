import React, { useState } from 'react';
import { 
  X, 
  Sparkles, 
  Upload, 
  DollarSign, 
  MapPin, 
  Tag, 
  Package, 
  Loader2, 
  ShieldCheck,
  Check,
  CreditCard,
  Building2
} from 'lucide-react';
import { MarketplaceItem, MarketplaceCategory, ItemCondition, StudentProfile } from '../types';
import { triggerConfetti } from '../utils/helpers';

interface CreateListingModalProps {
  currentUser: StudentProfile;
  selectedCampus: string;
  onClose: () => void;
  onSubmit: (newItem: MarketplaceItem) => void;
}

const PRESET_IMAGES = [
  { label: 'Textbook Hardcover', url: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop&q=80' },
  { label: 'CS / Algorithms Book', url: 'https://images.unsplash.com/photo-1532012164546-f432f2e3777a?w=600&auto=format&fit=crop&q=80' },
  { label: 'Calculator / Electronics', url: 'https://images.unsplash.com/photo-1594980596870-8aa52a78d8cd?w=600&auto=format&fit=crop&q=80' },
  { label: 'iPad / Digital Stylus', url: 'https://images.unsplash.com/photo-1588702547923-7093a6c3ba33?w=600&auto=format&fit=crop&q=80' },
  { label: 'Chemistry / Lab Kit', url: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=600&auto=format&fit=crop&q=80' },
  { label: 'Lab Coat & Goggles', url: 'https://images.unsplash.com/photo-1576086213369-97a306d36557?w=600&auto=format&fit=crop&q=80' },
  { label: 'Study Guides / Notes', url: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=600&auto=format&fit=crop&q=80' },
  { label: 'Dorm Fridge / Supplies', url: 'https://images.unsplash.com/photo-1584992236310-6edddc08acff?w=600&auto=format&fit=crop&q=80' },
];

const SAFE_MEETUP_PRESETS = [
  'Main Campus Library Ground Floor',
  'Student Union / Dining Hall Lounge',
  'Engineering Building Atrium',
  'Science Quad Cafe'
];

export const CreateListingModal: React.FC<CreateListingModalProps> = ({
  currentUser,
  selectedCampus,
  onClose,
  onSubmit,
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<MarketplaceCategory>('textbooks');
  const [courseCode, setCourseCode] = useState('');
  const [price, setPrice] = useState<number | ''>('');
  const [originalPrice, setOriginalPrice] = useState<number | ''>('');
  const [condition, setCondition] = useState<ItemCondition>('Like New');
  const [selectedImage, setSelectedImage] = useState(PRESET_IMAGES[0].url);
  const [customImageUrl, setCustomImageUrl] = useState('');
  const [meetupLocation, setMeetupLocation] = useState(SAFE_MEETUP_PRESETS[0]);
  const [isNegotiable, setIsNegotiable] = useState(true);
  const [isAiEstimating, setIsAiEstimating] = useState(false);
  const [aiTip, setAiTip] = useState<string | null>(null);

  // Seller Banking Information (Required for payouts & buyer transfer receipts)
  const [bankName, setBankName] = useState('');
  const [accountName, setAccountName] = useState(currentUser.name || '');
  const [accountNumber, setAccountNumber] = useState('');

  const handleAiPriceEstimate = async () => {
    if (!title.trim()) return;
    setIsAiEstimating(true);
    setAiTip(null);

    try {
      const res = await fetch('/api/ai/marketplace-estimate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          category,
          condition,
          courseCode,
          originalPrice: originalPrice || undefined,
        }),
      });

      const data = await res.json();
      if (data.suggestedPrice) {
        setPrice(data.suggestedPrice);
      }
      if (data.quickPitch && !description.trim()) {
        setDescription(data.quickPitch);
      }
      if (data.minPrice && data.maxPrice) {
        setAiTip(`AI Price Appraisal: Fellow students typically pay $${data.minPrice} - $${data.maxPrice} for this condition.`);
      }
    } catch (e) {
      setAiTip('Tip: Books and electronics in Like New condition typically resell at 50-65% of bookstore price.');
    } finally {
      setIsAiEstimating(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !title.trim() || 
      price === '' || 
      price < 0 || 
      !bankName.trim() || 
      !accountName.trim() || 
      !accountNumber.trim()
    ) {
      return;
    }

    const finalImage = customImageUrl.trim() ? customImageUrl.trim() : selectedImage;
    const currencySymbol = currentUser.currencySymbol || '$';
    const currencyCode = currentUser.currencyCode || 'USD';

    const newItem: MarketplaceItem = {
      id: `item_${Date.now()}`,
      title: title.trim(),
      description: description.trim() || `Selling ${title}. In ${condition.toLowerCase()} condition. Available for campus pickup.`,
      category,
      courseCode: courseCode.trim() ? courseCode.trim().toUpperCase() : undefined,
      price: Number(price),
      originalPrice: originalPrice !== '' ? Number(originalPrice) : undefined,
      currencySymbol,
      currencyCode,
      condition,
      images: [finalImage],
      seller: currentUser,
      sellerBankDetails: {
        bankName: bankName.trim(),
        accountName: accountName.trim(),
        accountNumber: accountNumber.trim(),
      },
      campus: currentUser.school || currentUser.college || (selectedCampus === 'All Campuses' ? 'Campus' : selectedCampus),
      meetupLocation: meetupLocation.trim() || 'Campus Library Ground Floor',
      isNegotiable,
      status: 'available',
      createdAt: 'Just now',
      savesCount: 0,
    };

    onSubmit(newItem);
    triggerConfetti();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex justify-center p-2 sm:p-4 md:p-6 animate-in fade-in duration-150">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-auto flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-700 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <img
              src="/assets/aistudio/file_000000006df08210b3718ff8855bd0e3_7e7e3969.png"
              alt="AskCampus"
              className="w-10 h-10 rounded-xl shadow-md object-cover ring-2 ring-white/20 shrink-0"
            />
            <div>
              <h2 className="text-base font-black">
                Ask<span className="text-amber-300">Campus</span> Marketplace
              </h2>
              <p className="text-xs text-sky-100">
                List used textbooks, calculators, and materials for campus pickup
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-blue-200 hover:text-white hover:bg-blue-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4">
          {/* Title with AI Helper */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Item Title *
              </label>
              <button
                type="button"
                onClick={handleAiPriceEstimate}
                disabled={!title.trim() || isAiEstimating}
                className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold flex items-center gap-1 transition-colors cursor-pointer disabled:opacity-40"
              >
                {isAiEstimating ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                )}
                <span>AI Price Appraisal & Pitch</span>
              </button>
            </div>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Calculus Stewart 9th Edition or TI-84 Plus CE Calculator"
              required
              className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
            />
          </div>

          {/* AI Tip Banner */}
          {aiTip && (
            <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
              <span>{aiTip}</span>
            </div>
          )}

          {/* Category & Course Code */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Category *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as MarketplaceCategory)}
                className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
              >
                <option value="textbooks">Textbooks</option>
                <option value="electronics">Calculators & Electronics</option>
                <option value="lab_supplies">Lab Kits & Supplies</option>
                <option value="notes_guides">Past Exams & Study Notes</option>
                <option value="dorm_living">Dorm Living & Furniture</option>
                <option value="other">Other School Supplies</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Course Code (Optional)
              </label>
              <input
                type="text"
                value={courseCode}
                onChange={(e) => setCourseCode(e.target.value)}
                placeholder="e.g. MATH 51, CS 161, CHEM 33"
                className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 uppercase placeholder:normal-case font-semibold"
              />
            </div>
          </div>

          {/* Condition Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Condition *
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {(['Brand New', 'Like New', 'Good', 'Fair'] as ItemCondition[]).map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setCondition(c)}
                  className={`py-2 px-2 text-xs font-bold rounded-xl border transition-all cursor-pointer ${
                    condition === c
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          {/* Price & Original Price */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Asking Price ({currentUser.currencySymbol || '$'}) *
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 font-bold">
                  {currentUser.currencySymbol || '$'}
                </span>
                <input
                  type="number"
                  min="0"
                  step="1"
                  value={price}
                  onChange={(e) => setPrice(e.target.value === '' ? '' : Number(e.target.value))}
                  placeholder="e.g. 40 (or 0 for free)"
                  required
                  className="w-full text-sm pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 font-bold text-slate-900"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Original Retail / Bookstore ({currentUser.currencySymbol || '$'})
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 font-bold">
                  {currentUser.currencySymbol || '$'}
                </span>
                <input
                  type="number"
                  min="0"
                  step="1"
                  value={originalPrice}
                  onChange={(e) => setOriginalPrice(e.target.value === '' ? '' : Number(e.target.value))}
                  placeholder="e.g. 150 (helps show student savings)"
                  className="w-full text-sm pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                />
              </div>
            </div>
          </div>

          {/* Negotiable Checkbox */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="negotiable"
              checked={isNegotiable}
              onChange={(e) => setIsNegotiable(e.target.checked)}
              className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 border-slate-300 cursor-pointer"
            />
            <label htmlFor="negotiable" className="text-xs text-slate-700 font-medium cursor-pointer">
              Open to reasonable student offers and negotiations
            </label>
          </div>

          {/* Photo Selection */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Choose Item Photo
            </label>
            <div className="grid grid-cols-4 sm:grid-cols-8 gap-2 mb-2">
              {PRESET_IMAGES.map((preset, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setSelectedImage(preset.url);
                    setCustomImageUrl('');
                  }}
                  className={`aspect-square rounded-xl overflow-hidden border-2 transition-all cursor-pointer relative ${
                    selectedImage === preset.url && !customImageUrl
                      ? 'border-indigo-600 ring-2 ring-indigo-200'
                      : 'border-slate-200 opacity-70 hover:opacity-100'
                  }`}
                  title={preset.label}
                >
                  <img src={preset.url} alt={preset.label} className="w-full h-full object-cover" />
                  {selectedImage === preset.url && !customImageUrl && (
                    <div className="absolute inset-0 bg-indigo-600/30 flex items-center justify-center">
                      <Check className="w-4 h-4 text-white drop-shadow" />
                    </div>
                  )}
                </button>
              ))}
            </div>

            <div className="relative">
              <input
                type="url"
                value={customImageUrl}
                onChange={(e) => setCustomImageUrl(e.target.value)}
                placeholder="Or paste your own photo image URL (optional)"
                className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* Seller Banking Details Section (Mandatory for Payments & Receipts) */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-50/90 via-indigo-50/60 to-slate-50 border border-blue-200 shadow-2xs">
            <div className="flex items-center gap-2 mb-1">
              <CreditCard className="w-4 h-4 text-blue-700" />
              <span className="text-xs font-black text-blue-900 uppercase tracking-wider">
                Seller Payment & Bank Account Details *
              </span>
            </div>
            <p className="text-[11px] text-slate-600 mb-3 leading-relaxed">
              When a buyer purchases this item, they will transfer funds directly to this bank account and upload their payment receipt for your verification.
            </p>

            <div className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Bank Name */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Bank Name *
                  </label>
                  <input
                    type="text"
                    value={bankName}
                    onChange={(e) => setBankName(e.target.value)}
                    placeholder="e.g. Chase, Bank of America, Zenith, GTB"
                    required
                    className="w-full text-xs sm:text-sm px-3.5 py-2 rounded-xl border border-slate-300 bg-white font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                  {/* Quick Bank suggestions */}
                  <div className="flex flex-wrap gap-1 mt-1.5">
                    {['Chase', 'Bank of America', 'Wells Fargo', 'Capital One', 'Zenith Bank', 'Kuda', 'GTBank'].map((b) => (
                      <button
                        type="button"
                        key={b}
                        onClick={() => setBankName(b)}
                        className={`text-[10px] px-2 py-0.5 rounded-md border cursor-pointer ${
                          bankName === b ? 'bg-blue-600 text-white border-blue-600 font-bold' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {b}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Account Name */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Account Name (Account Holder) *
                  </label>
                  <input
                    type="text"
                    value={accountName}
                    onChange={(e) => setAccountName(e.target.value)}
                    placeholder="e.g. Full Name as registered with bank"
                    required
                    className="w-full text-xs sm:text-sm px-3.5 py-2 rounded-xl border border-slate-300 bg-white font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                  <span className="text-[10px] text-slate-400 block mt-1">
                    Must match your official bank account name.
                  </span>
                </div>
              </div>

              {/* Account Number */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Account Number *
                </label>
                <div className="relative">
                  <Building2 className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={accountNumber}
                    onChange={(e) => setAccountNumber(e.target.value.replace(/[^0-9]/g, ''))}
                    placeholder="e.g. 10-digit or standard Account Number"
                    required
                    maxLength={18}
                    className="w-full text-xs sm:text-sm pl-9 pr-3.5 py-2 rounded-xl border border-slate-300 bg-white font-mono font-bold tracking-wider focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
                <span className="text-[10px] text-slate-500 block mt-1">
                  Digits only. Displayed securely to the verified student buyer during checkout.
                </span>
              </div>
            </div>
          </div>

          {/* Campus Meetup Location */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Safe Campus Meetup Spot *
            </label>
            <div className="flex flex-wrap gap-1.5 mb-2">
              {SAFE_MEETUP_PRESETS.map((spot) => (
                <button
                  key={spot}
                  type="button"
                  onClick={() => setMeetupLocation(spot)}
                  className={`text-[11px] px-2.5 py-1 rounded-lg border font-medium transition-colors cursor-pointer ${
                    meetupLocation === spot
                      ? 'bg-indigo-50 border-indigo-300 text-indigo-700 font-semibold'
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {spot}
                </button>
              ))}
            </div>
            <input
              type="text"
              value={meetupLocation}
              onChange={(e) => setMeetupLocation(e.target.value)}
              placeholder="e.g. Green Library ground floor or Student Union"
              required
              className="w-full text-sm px-3.5 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Description & Notes
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Mention edition number, highlight marks, included accessories, or reasons for selling..."
              rows={3}
              className="w-full text-sm p-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-y"
            />
          </div>

          {/* Footer Submit */}
          <div className="pt-3 border-t border-slate-200 flex items-center justify-between">
            <div className="text-xs text-slate-500">
              Selling at <strong>{selectedCampus === 'All Campuses' ? currentUser.college : selectedCampus}</strong>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 text-sm font-semibold transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!title.trim() || price === '' || !bankName.trim() || !accountName.trim() || !accountNumber.trim()}
                className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white text-sm font-semibold shadow-md shadow-amber-500/20 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Package className="w-4 h-4" />
                <span>Publish Listing</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
