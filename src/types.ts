export interface StudentProfile {
  id: string;
  name: string;
  username: string;
  avatar: string;
  college: string;
  school: string;
  country: string;
  state: string;
  currencyCode: string;
  currencySymbol: string;
  major: string;
  graduationYear: string;
  karma: number;
  badges: string[];
  verifiedStudent: boolean;
}

export type UrgencyLevel = 'urgent' | 'exam_prep' | 'regular';

export interface AnswerComment {
  id: string;
  author: StudentProfile;
  text: string;
  createdAt: string;
}

export interface Answer {
  id: string;
  questionId: string;
  body: string;
  author: StudentProfile;
  createdAt: string;
  upvotes: number;
  downvotes: number;
  userVote?: 'up' | 'down';
  isAccepted: boolean;
  isTAOrTutor?: boolean;
  comments?: AnswerComment[];
}

export interface Question {
  id: string;
  title: string;
  body: string;
  courseCode: string;
  category: string;
  tags: string[];
  urgency: UrgencyLevel;
  campus: string;
  author: StudentProfile;
  createdAt: string;
  upvotes: number;
  downvotes: number;
  userVote?: 'up' | 'down';
  views: number;
  answersCount: number;
  acceptedAnswerId?: string;
  answers: Answer[];
  isBookmarked?: boolean;
  aiExplanation?: string;
}

export type ItemCondition = 'Brand New' | 'Like New' | 'Good' | 'Fair';

export type MarketplaceCategory = 
  | 'textbooks'
  | 'electronics'
  | 'lab_supplies'
  | 'notes_guides'
  | 'dorm_living'
  | 'other';

export interface SellerBankDetails {
  bankName: string;
  accountName: string;
  accountNumber: string;
}

export interface MarketplaceItem {
  id: string;
  title: string;
  description: string;
  category: MarketplaceCategory;
  courseCode?: string;
  price: number;
  originalPrice?: number;
  currencySymbol?: string;
  currencyCode?: string;
  condition: ItemCondition;
  images: string[];
  seller: StudentProfile;
  sellerBankDetails: SellerBankDetails;
  campus: string;
  meetupLocation: string;
  isNegotiable: boolean;
  status: 'available' | 'reserved' | 'sold';
  createdAt: string;
  savesCount: number;
  isSaved?: boolean;
}

export interface MarketplaceOrder {
  id: string;
  itemId: string;
  itemTitle: string;
  itemPrice: number;
  currencySymbol?: string;
  currencyCode?: string;
  itemImage: string;
  buyer: StudentProfile;
  seller: StudentProfile;
  sellerBankDetails: SellerBankDetails;
  paymentReceiptUrl: string;
  paymentReceiptName?: string;
  paymentReference: string;
  buyerPhone?: string;
  buyerNote?: string;
  submittedAt: string;
  status: 'receipt_submitted' | 'confirmed' | 'rejected';
  meetupLocation: string;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  text: string;
  timestamp: string;
  isOffer?: boolean;
  offerAmount?: number;
  offerStatus?: 'pending' | 'accepted' | 'declined';
}

export interface Conversation {
  id: string;
  itemId: string;
  itemTitle: string;
  itemPrice: number;
  itemImage: string;
  buyer: StudentProfile;
  seller: StudentProfile;
  lastMessage: string;
  lastMessageTime: string;
  messages: ChatMessage[];
}

export interface StudyGroup {
  id: string;
  courseCode: string;
  title: string;
  description: string;
  campus: string;
  meetingType: 'In-Person' | 'Online Zoom' | 'Library Room';
  location: string;
  schedule: string;
  membersCount: number;
  maxMembers: number;
  joined: boolean;
  tags: string[];
  host: StudentProfile;
}
