import {
  MarketplaceItem,
  MarketplaceOrder,
  SellerReputationStats,
  SellerReview,
  StudentProfile,
} from '../types';

export const SELLER_PRAISE_TAGS = [
  'Fast Reply',
  'As Described',
  'On-Time Meetup',
  'Fair Price',
  'Friendly Classmate',
] as const;

export function computeSellerReputation(
  sellerId: string,
  sellerProfile: StudentProfile,
  reviews: SellerReview[],
  orders: MarketplaceOrder[],
  items: MarketplaceItem[]
): SellerReputationStats {
  const sellerReviews = reviews.filter((r) => r.sellerId === sellerId);
  const reviewsCount = sellerReviews.length;

  const completedSales = orders.filter(
    (o) => o.seller?.id === sellerId && o.status === 'confirmed'
  ).length;

  const activeListings = items.filter(
    (i) => i.seller?.id === sellerId && i.status !== 'sold'
  ).length;

  const sumRatings = sellerReviews.reduce((acc, r) => acc + r.rating, 0);
  const averageRating = reviewsCount > 0 ? Number((sumRatings / reviewsCount).toFixed(1)) : 0;

  // Positive reviews are 4 or 5 stars
  const positiveCount = sellerReviews.filter((r) => r.rating >= 4).length;
  const starRatioPercent = reviewsCount > 0 ? (sumRatings / (reviewsCount * 5)) * 100 : 0;
  const positivePercent = reviewsCount > 0 ? (positiveCount / reviewsCount) * 100 : 0;

  // Blend star score and positive endorsement rate for a trustworthy 0-100% reputation rate
  const rawReputationRate =
    reviewsCount > 0
      ? Math.round(starRatioPercent * 0.65 + positivePercent * 0.35)
      : completedSales > 0
      ? Math.min(92, 75 + completedSales * 5)
      : 0;

  const reputationRate = Math.max(0, Math.min(100, rawReputationRate));

  // Bayesian smoothed score so consistent 4.8+ sellers with volume rank highest
  // Prior: C = 2 reviews at m = 3.6 stars
  const bayesianStars = (2 * 3.6 + sumRatings) / (2 + reviewsCount);
  const karmaBoost = Math.min(Math.round((sellerProfile.karma || 0) / 100), 5);
  const completedSalesBoost = Math.min(completedSales * 4, 20);
  const verifiedBoost = sellerProfile.verifiedStudent ? 4 : 0;

  const recommendationScore =
    reviewsCount > 0 || completedSales > 0
      ? Number((bayesianStars * 18 + completedSalesBoost + karmaBoost + verifiedBoost).toFixed(2))
      : Number(((sellerProfile.verifiedStudent ? 12 : 0) + karmaBoost).toFixed(2));

  // Aggregate top praise tags
  const tagCounts = new Map<string, number>();
  sellerReviews.forEach((rev) => {
    (rev.tags || []).forEach((tag) => {
      tagCounts.set(tag, (tagCounts.get(tag) || 0) + 1);
    });
  });
  const positiveTags = Array.from(tagCounts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([tag]) => tag);

  let tier: SellerReputationStats['tier'] = 'New Seller';
  if ((reviewsCount >= 2 && averageRating >= 4.5 && reputationRate >= 88) || (reviewsCount >= 1 && averageRating >= 4.7 && completedSales >= 1)) {
    tier = 'Top Recommended';
  } else if (reviewsCount >= 1 && reputationRate >= 80) {
    tier = 'Highly Rated';
  } else if (completedSales >= 1 || reviewsCount >= 1) {
    tier = 'Trusted Peer';
  }

  const isRecommended = tier === 'Top Recommended' || tier === 'Highly Rated';

  return {
    sellerId,
    seller: sellerProfile,
    averageRating,
    reviewsCount,
    reputationRate,
    recommendationScore,
    positiveTags,
    completedSales,
    activeListings,
    tier,
    isRecommended,
  };
}

export function buildSellerReputationMap(
  items: MarketplaceItem[],
  reviews: SellerReview[],
  orders: MarketplaceOrder[],
  colleagues: StudentProfile[] = [],
  currentUser?: StudentProfile
): Record<string, SellerReputationStats> {
  const sellerProfiles = new Map<string, StudentProfile>();

  colleagues.forEach((p) => {
    if (p.id) sellerProfiles.set(p.id, p);
  });

  if (currentUser?.id) {
    sellerProfiles.set(currentUser.id, currentUser);
  }

  items.forEach((item) => {
    if (item.seller?.id) {
      sellerProfiles.set(item.seller.id, item.seller);
    }
  });

  orders.forEach((order) => {
    if (order.seller?.id && !sellerProfiles.has(order.seller.id)) {
      sellerProfiles.set(order.seller.id, order.seller);
    }
  });

  reviews.forEach((rev) => {
    if (rev.sellerId && !sellerProfiles.has(rev.sellerId)) {
      sellerProfiles.set(rev.sellerId, {
        id: rev.sellerId,
        name: rev.sellerName || 'Campus Seller',
        username: (rev.sellerName || 'seller').toLowerCase().replace(/\s+/g, ''),
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
        college: rev.campus || 'Campus',
        school: rev.campus || 'Campus',
        country: '',
        state: '',
        currencyCode: 'USD',
        currencySymbol: '$',
        major: 'Student Seller',
        graduationYear: '2026',
        karma: 50,
        badges: ['Verified Student'],
        verifiedStudent: true,
      });
    }
  });

  const statsMap: Record<string, SellerReputationStats> = {};
  sellerProfiles.forEach((profile, sellerId) => {
    statsMap[sellerId] = computeSellerReputation(sellerId, profile, reviews, orders, items);
  });

  return statsMap;
}

export function getRecommendedSellers(
  statsMap: Record<string, SellerReputationStats>,
  schoolFilter?: string
): SellerReputationStats[] {
  return Object.values(statsMap)
    .filter((stat) => {
      const hasMarketPresence = stat.activeListings > 0 || stat.reviewsCount > 0 || stat.completedSales > 0;
      if (!hasMarketPresence) return false;
      if (schoolFilter) {
        const s = (stat.seller.school || stat.seller.college || '').toLowerCase();
        return s === schoolFilter.toLowerCase();
      }
      return true;
    })
    .sort((a, b) => {
      if (b.recommendationScore !== a.recommendationScore) {
        return b.recommendationScore - a.recommendationScore;
      }
      if (b.reputationRate !== a.reputationRate) {
        return b.reputationRate - a.reputationRate;
      }
      return b.reviewsCount - a.reviewsCount;
    });
}
