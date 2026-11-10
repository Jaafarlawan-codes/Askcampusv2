import confetti from 'canvas-confetti';

export function formatPrice(amount: number, currencySymbol: string = '$'): string {
  const formatted = new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 0,
  }).format(amount || 0);

  // If the symbol has trailing text like 'KSh' or 'CA$', keep clean spacing if needed
  if (currencySymbol.length > 2) {
    return `${currencySymbol} ${formatted}`;
  }
  return `${currencySymbol}${formatted}`;
}

export function calculateDiscount(askingPrice: number, originalPrice?: number): number | null {
  if (!originalPrice || originalPrice <= askingPrice) return null;
  const pct = Math.round(((originalPrice - askingPrice) / originalPrice) * 100);
  return pct > 0 ? pct : null;
}

export function triggerConfetti() {
  try {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#4f46e5', '#06b6d4', '#10b981', '#f59e0b', '#ec4899']
    });
  } catch (e) {
    // Graceful fallback if canvas is restricted
  }
}

export function getConditionColor(condition: string): { bg: string; text: string; border: string } {
  switch (condition) {
    case 'Brand New':
      return { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' };
    case 'Like New':
      return { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' };
    case 'Good':
      return { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' };
    case 'Fair':
    default:
      return { bg: 'bg-stone-50', text: 'text-stone-700', border: 'border-stone-200' };
  }
}

export function getUrgencyBadge(urgency: string): { label: string; bg: string; text: string } {
  switch (urgency) {
    case 'exam_prep':
      return { label: 'Exam Prep', bg: 'bg-purple-100', text: 'text-purple-800' };
    case 'urgent':
      return { label: 'Urgent Help', bg: 'bg-rose-100', text: 'text-rose-800' };
    case 'regular':
    default:
      return { label: 'General', bg: 'bg-slate-100', text: 'text-slate-700' };
  }
}
