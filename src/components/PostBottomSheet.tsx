import React from 'react';
import { 
  X, 
  HelpCircle, 
  ShoppingBag, 
  Users, 
  Sparkles, 
  ChevronRight 
} from 'lucide-react';

interface PostBottomSheetProps {
  onClose: () => void;
  onSelectAsk: () => void;
  onSelectSell: () => void;
  onSelectStudyGroup: () => void;
}

export const PostBottomSheet: React.FC<PostBottomSheetProps> = ({
  onClose,
  onSelectAsk,
  onSelectSell,
  onSelectStudyGroup,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div 
        className="fixed inset-0" 
        onClick={onClose} 
      />
      
      {/* Bottom Sheet Container */}
      <div className="relative w-full max-w-md bg-white rounded-t-3xl shadow-2xl p-5 pb-8 z-50 animate-in slide-in-from-bottom-6 duration-200 border-t border-slate-200">
        {/* Drag handle */}
        <div className="w-12 h-1.5 bg-slate-300 rounded-full mx-auto mb-4" />

        <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100">
          <div>
            <h3 className="text-base font-black text-slate-900">What would you like to post?</h3>
            <p className="text-xs text-slate-500">Contribute to your campus student community</p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Options */}
        <div className="space-y-2.5">
          {/* 1. Ask Academic Question */}
          <button
            onClick={() => {
              onClose();
              onSelectAsk();
            }}
            className="w-full p-3.5 rounded-2xl bg-blue-50/70 hover:bg-blue-100/70 border border-blue-200 text-left flex items-center justify-between transition-all cursor-pointer group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-500/25 group-hover:scale-105 transition-transform">
                <HelpCircle className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900 group-hover:text-blue-700 transition-colors">
                  Ask a Question
                </h4>
                <p className="text-[11px] text-slate-500">
                  Coursework, homework help, exam proofs & concepts
                </p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
          </button>

          {/* 2. Sell Material */}
          <button
            onClick={() => {
              onClose();
              onSelectSell();
            }}
            className="w-full p-3.5 rounded-2xl bg-amber-50/70 hover:bg-amber-100/70 border border-amber-200 text-left flex items-center justify-between transition-all cursor-pointer group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center shadow-md shadow-amber-500/25 group-hover:scale-105 transition-transform">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900 group-hover:text-amber-700 transition-colors">
                  Sell School Material
                </h4>
                <p className="text-[11px] text-slate-500">
                  Textbooks, graphing calculators, lab gear, notes
                </p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-amber-600 group-hover:translate-x-1 transition-all" />
          </button>

          {/* 3. Form Study Group */}
          <button
            onClick={() => {
              onClose();
              onSelectStudyGroup();
            }}
            className="w-full p-3.5 rounded-2xl bg-emerald-50/70 hover:bg-emerald-100/70 border border-emerald-200 text-left flex items-center justify-between transition-all cursor-pointer group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-md shadow-emerald-500/25 group-hover:scale-105 transition-transform">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                  Host a Study Group
                </h4>
                <p className="text-[11px] text-slate-500">
                  Midterm cram sessions, library study rooms
                </p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-600 group-hover:translate-x-1 transition-all" />
          </button>
        </div>
      </div>
    </div>
  );
};
