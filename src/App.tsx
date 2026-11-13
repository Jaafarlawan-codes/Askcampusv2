import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  ShoppingBag, 
  MessageSquare, 
  BookOpen, 
  Laptop, 
  FlaskConical, 
  FileText, 
  Home, 
  Package, 
  Sparkles, 
  TrendingUp, 
  Zap, 
  CheckCircle2, 
  Award,
  ArrowUpDown,
  Tag,
  Clock,
  Layers,
  Heart,
  Bookmark,
  Building2,
  CreditCard,
  FileCheck,
  Receipt,
  ShieldCheck,
  Eye,
  ArrowRight,
  Globe2,
  GraduationCap,
  X
} from 'lucide-react';
import { 
  Question, 
  MarketplaceItem, 
  StudentProfile, 
  Conversation, 
  StudyGroup, 
  MarketplaceCategory,
  MarketplaceOrder 
} from './types';
import { 
  INITIAL_QUESTIONS, 
  INITIAL_MARKETPLACE_ITEMS, 
  INITIAL_CONVERSATIONS, 
  INITIAL_STUDY_GROUPS,
  INITIAL_MARKETPLACE_ORDERS,
  CATEGORIES,
  MARKETPLACE_CATEGORIES 
} from './data/mockData';
import { QuestionCard } from './components/QuestionCard';
import { QuestionDetailModal } from './components/QuestionDetailModal';
import { PostQuestionModal } from './components/PostQuestionModal';
import { MarketplaceCard } from './components/MarketplaceCard';
import { MarketplaceDetailModal } from './components/MarketplaceDetailModal';
import { CreateListingModal } from './components/CreateListingModal';
import { MarketplaceChatDrawer } from './components/MarketplaceChatDrawer';
import { PaymentReceiptModal } from './components/PaymentReceiptModal';
import { OrderReceiptDetailModal } from './components/OrderReceiptDetailModal';
import { AICopilotView } from './components/AICopilotView';
import { StudyGroupsView } from './components/StudyGroupsView';
import { WelcomeLandingPage } from './components/WelcomeLandingPage';
import { AndroidTopBar } from './components/AndroidTopBar';
import { AndroidBottomNav } from './components/AndroidBottomNav';
import { PostBottomSheet } from './components/PostBottomSheet';
import { GoogleAuthModal } from './components/GoogleAuthModal';
import { UserProfileView } from './components/UserProfileView';
import { OnboardingModal } from './components/OnboardingModal';
import { SUPPORTED_COUNTRIES } from './data/campusLocations';
import { triggerConfetti, formatPrice } from './utils/helpers';
import { auth, syncUserProfile, getRegisteredUsers, updateUserFirestoreProfile, logOut } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';

export default function App() {
  // Navigation & Campus filter
  const [currentTab, setCurrentTab] = useState<'questions' | 'marketplace' | 'studygroups' | 'copilot' | 'saved' | 'profile'>('questions');
  const [currentUser, setCurrentUser] = useState<StudentProfile>(() => {
    const saved = localStorage.getItem('askcampus_user_v2');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Ensure no legacy demo mock account is restored
        const demoPrefixes = ['user_alex', 'user_tunde', 'user_chidinma', 'user_elena', 'user_marcus', 'user_priya'];
        if (parsed && parsed.id && !demoPrefixes.includes(parsed.id) && parsed.name !== 'Alex Rivera') {
          return parsed;
        }
      } catch (e) {}
    }
    return {
      id: '',
      name: '',
      username: '',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      college: '',
      school: '',
      country: '',
      state: '',
      currencyCode: 'USD',
      currencySymbol: '$',
      major: '',
      graduationYear: '2026',
      karma: 0,
      badges: [],
      verifiedStudent: false,
    };
  });
  const [registeredColleagues, setRegisteredColleagues] = useState<StudentProfile[]>([]);
  const [selectedCampus, setSelectedCampus] = useState<string>(() => {
    return currentUser?.school || 'All Campuses';
  });
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showActionSheet, setShowActionSheet] = useState<boolean>(false);
  const [showGoogleAuthModal, setShowGoogleAuthModal] = useState<boolean>(false);
  const [showOnboardingModal, setShowOnboardingModal] = useState<boolean>(() => {
    const saved = localStorage.getItem('askcampus_user_v2');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed?.id && (!parsed?.school || !parsed?.country)) {
          return true;
        }
      } catch (e) {}
    }
    return false;
  });
  const [filterMySchoolOnly, setFilterMySchoolOnly] = useState<boolean>(true);
  const [showHowItWorksModal, setShowHowItWorksModal] = useState<boolean>(false);
  const [showWelcomeLanding, setShowWelcomeLanding] = useState<boolean>(() => {
    const saved = localStorage.getItem('askcampus_user_v2');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed?.id && parsed?.school && parsed?.country) {
          return false;
        }
      } catch (e) {}
    }
    return true;
  });

  // Data states with localStorage fallback (cleared of any demo accounts)
  const [questions, setQuestions] = useState<Question[]>(() => {
    const saved = localStorage.getItem('askcampus_questions');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.every(q => !q.author?.id?.startsWith('user_'))) {
          return parsed;
        }
      } catch (e) {}
    }
    return INITIAL_QUESTIONS;
  });

  const [marketplaceItems, setMarketplaceItems] = useState<MarketplaceItem[]>(() => {
    const saved = localStorage.getItem('askcampus_items');
    return saved ? JSON.parse(saved) : [];
  });

  const [orders, setOrders] = useState<MarketplaceOrder[]>(() => {
    const saved = localStorage.getItem('askcampus_orders');
    return saved ? JSON.parse(saved) : INITIAL_MARKETPLACE_ORDERS;
  });

  const [conversations, setConversations] = useState<Conversation[]>(() => {
    const saved = localStorage.getItem('askcampus_convs');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.every(c => !c.buyer?.id?.startsWith('user_') && !c.seller?.id?.startsWith('user_'))) {
          return parsed;
        }
      } catch (e) {}
    }
    return INITIAL_CONVERSATIONS;
  });

  const [studyGroups, setStudyGroups] = useState<StudyGroup[]>(() => {
    const saved = localStorage.getItem('askcampus_groups');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.every(g => !g.host?.id?.startsWith('user_'))) {
          return parsed;
        }
      } catch (e) {}
    }
    return INITIAL_STUDY_GROUPS;
  });

  // Modals & Drawers
  const [activeQuestion, setActiveQuestion] = useState<Question | null>(null);
  const [activeItem, setActiveItem] = useState<MarketplaceItem | null>(null);
  const [activePurchaseItem, setActivePurchaseItem] = useState<MarketplaceItem | null>(null);
  const [activeOrder, setActiveOrder] = useState<MarketplaceOrder | null>(null);
  const [activeConversation, setActiveConversation] = useState<Conversation | null>(null);
  const [showAskModal, setShowAskModal] = useState<boolean>(false);
  const [showSellModal, setShowSellModal] = useState<boolean>(false);
  const [showMessagesDrawer, setShowMessagesDrawer] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Filters for Q&A
  const [questionCategory, setQuestionCategory] = useState<string>('All Subjects');
  const [questionSort, setQuestionSort] = useState<'trending' | 'latest' | 'unanswered' | 'urgent'>('trending');

  // Filters & Tabs for Marketplace
  const [marketView, setMarketView] = useState<'browse' | 'my_receipts' | 'seller_receipts'>('browse');
  const [marketCategory, setMarketCategory] = useState<string>('all');
  const [marketCondition, setMarketCondition] = useState<string>('all');
  const [marketSort, setMarketSort] = useState<'newest' | 'price_asc' | 'price_desc' | 'savings'>('newest');
  const [onlyNegotiable, setOnlyNegotiable] = useState<boolean>(false);

  // Sync to LocalStorage
  useEffect(() => {
    localStorage.setItem('askcampus_questions', JSON.stringify(questions));
  }, [questions]);

  useEffect(() => {
    localStorage.setItem('askcampus_items', JSON.stringify(marketplaceItems));
  }, [marketplaceItems]);

  useEffect(() => {
    localStorage.setItem('askcampus_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('askcampus_convs', JSON.stringify(conversations));
  }, [conversations]);

  useEffect(() => {
    localStorage.setItem('askcampus_groups', JSON.stringify(studyGroups));
  }, [studyGroups]);

  useEffect(() => {
    if (currentUser.id && currentUser.name) {
      localStorage.setItem('askcampus_user_v2', JSON.stringify(currentUser));
    }
  }, [currentUser]);

  // Load real registered user accounts from Firestore
  useEffect(() => {
    getRegisteredUsers().then((users) => {
      setRegisteredColleagues(users);
    });
  }, [currentUser.school]);

  // Listen to Firebase Auth state for Google account sign-in
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      if (fbUser) {
        const synced = await syncUserProfile(fbUser, {
          college: currentUser.college,
          school: currentUser.school,
          country: currentUser.country,
          state: currentUser.state,
          currencyCode: currentUser.currencyCode,
          currencySymbol: currentUser.currencySymbol,
          major: currentUser.major,
          graduationYear: currentUser.graduationYear,
        });
        if (synced) {
          const profile: StudentProfile = {
            id: fbUser.uid,
            name: synced.displayName || fbUser.displayName || 'Campus Student',
            username: (fbUser.email || 'student').split('@')[0],
            avatar: synced.avatar || fbUser.photoURL || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
            college: synced.school || synced.college || '',
            school: synced.school || synced.college || '',
            country: synced.country || '',
            state: synced.state || '',
            currencyCode: synced.currencyCode || 'USD',
            currencySymbol: synced.currencySymbol || '$',
            major: synced.major || '',
            graduationYear: synced.graduationYear || '2026',
            karma: synced.karma || 50,
            badges: synced.badges || ['Verified Student', 'Google Authenticated'],
            verifiedStudent: true,
          };
          setCurrentUser(profile);
          localStorage.setItem('askcampus_user_v2', JSON.stringify(profile));

          // If the authenticated Google user hasn't set their country and school, prompt them immediately
          if (!profile.country || !profile.school) {
            setShowWelcomeLanding(false);
            setShowGoogleAuthModal(false);
            setShowOnboardingModal(true);
          } else {
            setSelectedCampus(profile.school);
            setShowWelcomeLanding(false);
            setShowGoogleAuthModal(false);
          }
        }
      }
    });
    return () => unsubscribe();
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleOpenAskModal = () => {
    if (!currentUser.id || !currentUser.name) {
      showToast('Please sign in or create an account to post a question.');
      setShowGoogleAuthModal(true);
      return;
    }
    setShowAskModal(true);
  };

  const handleOpenSellModal = () => {
    if (!currentUser.id || !currentUser.name) {
      showToast('Please sign in or create an account to list materials.');
      setShowGoogleAuthModal(true);
      return;
    }
    setShowSellModal(true);
  };

  // -------------------------
  // Q&A Handlers
  // -------------------------
  const handleVoteQuestion = (questionId: string, direction: 'up' | 'down', e?: React.MouseEvent) => {
    e?.stopPropagation();
    setQuestions((prev) =>
      prev.map((q) => {
        if (q.id !== questionId) return q;
        const currentVote = q.userVote;
        let newVote: 'up' | 'down' | undefined = direction;
        let upDiff = 0;
        let downDiff = 0;

        if (currentVote === direction) {
          // undo vote
          newVote = undefined;
          if (direction === 'up') upDiff = -1;
          if (direction === 'down') downDiff = -1;
        } else {
          if (direction === 'up') {
            upDiff = currentVote === 'down' ? 1 : 1;
            if (currentVote === 'down') downDiff = -1;
          } else {
            downDiff = currentVote === 'up' ? 1 : 1;
            if (currentVote === 'up') upDiff = -1;
          }
        }

        const updated = {
          ...q,
          upvotes: Math.max(0, q.upvotes + upDiff),
          downvotes: Math.max(0, q.downvotes + downDiff),
          userVote: newVote,
        };

        if (activeQuestion?.id === questionId) {
          setActiveQuestion(updated);
        }
        return updated;
      })
    );
  };

  const handleVoteAnswer = (questionId: string, answerId: string, direction: 'up' | 'down') => {
    setQuestions((prev) =>
      prev.map((q) => {
        if (q.id !== questionId) return q;
        const updatedAnswers = q.answers.map((ans) => {
          if (ans.id !== answerId) return ans;
          const currentVote = ans.userVote;
          let newVote: 'up' | 'down' | undefined = direction;
          let upDiff = 0;
          let downDiff = 0;

          if (currentVote === direction) {
            newVote = undefined;
            if (direction === 'up') upDiff = -1;
            if (direction === 'down') downDiff = -1;
          } else {
            if (direction === 'up') {
              upDiff = 1;
              if (currentVote === 'down') downDiff = -1;
            } else {
              downDiff = 1;
              if (currentVote === 'up') upDiff = -1;
            }
          }

          return {
            ...ans,
            upvotes: Math.max(0, ans.upvotes + upDiff),
            downvotes: Math.max(0, ans.downvotes + downDiff),
            userVote: newVote,
          };
        });

        const updatedQ = { ...q, answers: updatedAnswers };
        if (activeQuestion?.id === questionId) {
          setActiveQuestion(updatedQ);
        }
        return updatedQ;
      })
    );
  };

  const handleAcceptAnswer = (questionId: string, answerId: string) => {
    setQuestions((prev) =>
      prev.map((q) => {
        if (q.id !== questionId) return q;
        const updatedAnswers = q.answers.map((ans) => ({
          ...ans,
          isAccepted: ans.id === answerId,
        }));
        const updatedQ = {
          ...q,
          acceptedAnswerId: answerId,
          answers: updatedAnswers,
        };
        if (activeQuestion?.id === questionId) {
          setActiveQuestion(updatedQ);
        }
        return updatedQ;
      })
    );
    showToast('Accepted solution selected! +15 Karma rewarded to author.');
  };

  const handleSubmitAnswer = (questionId: string, body: string) => {
    const newAnswer = {
      id: `ans_${Date.now()}`,
      questionId,
      body,
      author: currentUser,
      createdAt: 'Just now',
      upvotes: 1,
      downvotes: 0,
      userVote: 'up' as const,
      isAccepted: false,
      isTAOrTutor: false,
    };

    setQuestions((prev) =>
      prev.map((q) => {
        if (q.id !== questionId) return q;
        const updated = {
          ...q,
          answersCount: q.answersCount + 1,
          answers: [...q.answers, newAnswer],
        };
        if (activeQuestion?.id === questionId) {
          setActiveQuestion(updated);
        }
        return updated;
      })
    );

    // Give user karma
    setCurrentUser((prev) => ({ ...prev, karma: prev.karma + 25 }));
    showToast('Answer submitted! You earned +25 Campus Karma ⚡');
  };

  const handleToggleBookmarkQuestion = (questionId: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setQuestions((prev) =>
      prev.map((q) => {
        if (q.id !== questionId) return q;
        const updated = { ...q, isBookmarked: !q.isBookmarked };
        if (activeQuestion?.id === questionId) {
          setActiveQuestion(updated);
        }
        return updated;
      })
    );
  };

  const handleCreateQuestion = (newQuestion: Question) => {
    setQuestions([newQuestion, ...questions]);
    setCurrentUser((prev) => ({ ...prev, karma: prev.karma + 10 }));
    showToast('Question posted to campus community! +10 Karma');
  };

  // -------------------------
  // Marketplace Handlers
  // -------------------------
  const handleToggleSaveItem = (itemId: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setMarketplaceItems((prev) =>
      prev.map((item) => {
        if (item.id !== itemId) return item;
        const updated = {
          ...item,
          isSaved: !item.isSaved,
          savesCount: item.isSaved ? item.savesCount - 1 : item.savesCount + 1,
        };
        if (activeItem?.id === itemId) {
          setActiveItem(updated);
        }
        return updated;
      })
    );
  };

  const handleCreateListing = (newItem: MarketplaceItem) => {
    setMarketplaceItems([newItem, ...marketplaceItems]);
    setCurrentUser((prev) => ({ ...prev, karma: prev.karma + 15 }));
    showToast(`"${newItem.title}" listed on the campus marketplace!`);
  };

  const handleUpdateItemStatus = (itemId: string, status: 'available' | 'reserved' | 'sold') => {
    setMarketplaceItems((prev) =>
      prev.map((item) => {
        if (item.id !== itemId) return item;
        const updated = { ...item, status };
        if (activeItem?.id === itemId) {
          setActiveItem(updated);
        }
        return updated;
      })
    );
    showToast(`Item status changed to ${status.toUpperCase()}`);
  };

  const handleDeleteItem = (itemId: string) => {
    setMarketplaceItems((prev) => prev.filter((i) => i.id !== itemId));
    setActiveItem(null);
    showToast('Marketplace listing removed.');
  };

  // -------------------------
  // Direct Bank Transfer & Receipt Handlers
  // -------------------------
  const handleInitiatePurchase = (item: MarketplaceItem, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setActivePurchaseItem(item);
  };

  const handleCreateOrder = (newOrder: MarketplaceOrder) => {
    setOrders((prev) => [newOrder, ...prev]);
    // Set item status to reserved while verification is pending
    setMarketplaceItems((prev) =>
      prev.map((i) => (i.id === newOrder.itemId ? { ...i, status: 'reserved' } : i))
    );
    if (activeItem?.id === newOrder.itemId) {
      setActiveItem((prev) => (prev ? { ...prev, status: 'reserved' } : null));
    }
    showToast('Payment receipt submitted! Seller will verify transfer & confirm.');
    triggerConfetti();
  };

  const handleConfirmOrder = (orderId: string) => {
    setOrders((prev) =>
      prev.map((ord) => (ord.id === orderId ? { ...ord, status: 'confirmed' } : ord))
    );
    const targetOrder = orders.find((o) => o.id === orderId);
    if (targetOrder) {
      setMarketplaceItems((prev) =>
        prev.map((i) => (i.id === targetOrder.itemId ? { ...i, status: 'sold' } : i))
      );
      if (activeItem?.id === targetOrder.itemId) {
        setActiveItem((prev) => (prev ? { ...prev, status: 'sold' } : null));
      }
    }
    showToast('Payment confirmed! Item marked as SOLD.');
    triggerConfetti();
  };

  const handleRejectOrder = (orderId: string, _reason?: string) => {
    setOrders((prev) =>
      prev.map((ord) => (ord.id === orderId ? { ...ord, status: 'rejected' } : ord))
    );
    const targetOrder = orders.find((o) => o.id === orderId);
    if (targetOrder) {
      setMarketplaceItems((prev) =>
        prev.map((i) => (i.id === targetOrder.itemId ? { ...i, status: 'available' } : i))
      );
      if (activeItem?.id === targetOrder.itemId) {
        setActiveItem((prev) => (prev ? { ...prev, status: 'available' } : null));
      }
    }
    showToast('Receipt unverified. Item returned to available.');
  };

  // -------------------------
  // Messaging & Offer Handlers
  // -------------------------
  const handleStartChat = (item: MarketplaceItem, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setActiveItem(null);

    // Look for existing conversation
    let conv = conversations.find(
      (c) =>
        c.itemId === item.id &&
        ((c.buyer.id === currentUser.id && c.seller.id === item.seller.id) ||
         (c.seller.id === currentUser.id && c.buyer.id === item.seller.id))
    );

    if (!conv) {
      conv = {
        id: `conv_${Date.now()}`,
        itemId: item.id,
        itemTitle: item.title,
        itemPrice: item.price,
        itemImage: item.images[0],
        buyer: currentUser,
        seller: item.seller,
        lastMessage: `Hi ${item.seller.name}! Is "${item.title}" still available?`,
        lastMessageTime: 'Just now',
        messages: [
          {
            id: `m_${Date.now()}`,
            senderId: currentUser.id,
            senderName: currentUser.name,
            text: `Hi ${item.seller.name}! I saw your listing for "${item.title}" (${item.condition}) for ${item.campus}. Is it still available for campus pickup?`,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          },
        ],
      };
      setConversations([conv, ...conversations]);
    }

    setActiveConversation(conv);
    setShowMessagesDrawer(true);
  };

  const handleSendMessage = (conversationId: string, text: string, isOffer?: boolean, offerAmount?: number) => {
    const newMessage = {
      id: `msg_${Date.now()}`,
      senderId: currentUser.id,
      senderName: currentUser.name,
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isOffer: Boolean(isOffer),
      offerAmount,
      offerStatus: isOffer ? ('pending' as const) : undefined,
    };

    setConversations((prev) =>
      prev.map((c) => {
        if (c.id !== conversationId) return c;
        const updated = {
          ...c,
          lastMessage: text,
          lastMessageTime: 'Just now',
          messages: [...c.messages, newMessage],
        };
        if (activeConversation?.id === conversationId) {
          setActiveConversation(updated);
        }
        return updated;
      })
    );

    // If messaging a demo user, simulate an authentic, helpful student reply
    const currentConv = conversations.find((c) => c.id === conversationId);
    const recipient = currentConv?.buyer.id === currentUser.id ? currentConv?.seller : currentConv?.buyer;

    if (recipient && recipient.id !== currentUser.id) {
      setTimeout(() => {
        let replyText = `Hey ${currentUser.name}! Yes, it is still available. I can meet you at ${currentConv?.seller.college} Library or Student Union today!`;
        if (isOffer && offerAmount) {
          replyText = `Hey! Your offer of $${offerAmount} works for me. Are you free to meet around 3:30pm today to swap?`;
        }

        const autoReply = {
          id: `reply_${Date.now()}`,
          senderId: recipient.id,
          senderName: recipient.name,
          text: replyText,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };

        setConversations((prev) =>
          prev.map((c) => {
            if (c.id !== conversationId) return c;
            const updated = {
              ...c,
              lastMessage: replyText,
              lastMessageTime: 'Just now',
              messages: [...c.messages, autoReply],
            };
            if (activeConversation?.id === conversationId) {
              setActiveConversation(updated);
            }
            return updated;
          })
        );
      }, 1200);
    }
  };

  const handleAcceptOffer = (conversationId: string, messageId: string) => {
    setConversations((prev) =>
      prev.map((c) => {
        if (c.id !== conversationId) return c;
        const updatedMessages = c.messages.map((m) => {
          if (m.id === messageId) {
            return { ...m, offerStatus: 'accepted' as const };
          }
          return m;
        });
        const updated = {
          ...c,
          messages: updatedMessages,
          lastMessage: 'Offer accepted! Arrange campus meetup time.',
        };
        if (activeConversation?.id === conversationId) {
          setActiveConversation(updated);
        }
        return updated;
      })
    );
    showToast('Offer accepted! You can now arrange campus meetup details.');
  };

  // -------------------------
  // Study Group Handlers
  // -------------------------
  const handleToggleJoinGroup = (groupId: string) => {
    setStudyGroups((prev) =>
      prev.map((g) => {
        if (g.id !== groupId) return g;
        const joined = !g.joined;
        return {
          ...g,
          joined,
          membersCount: joined ? g.membersCount + 1 : Math.max(1, g.membersCount - 1),
        };
      })
    );
  };

  const handleCreateStudyGroup = (newGroup: StudyGroup) => {
    if (!currentUser.id || !currentUser.name) {
      showToast('Please sign in or create an account to host a study group.');
      setShowGoogleAuthModal(true);
      return;
    }
    setStudyGroups([newGroup, ...studyGroups]);
    showToast(`Study group "${newGroup.title}" created!`);
  };

  // -------------------------
  // Filtered & Sorted Lists
  // -------------------------
  const filteredQuestions = questions.filter((q) => {
    // School Colleague Filter
    if (filterMySchoolOnly && currentUser.school) {
      const matchSchool = 
        q.campus.toLowerCase() === currentUser.school.toLowerCase() ||
        (q.author.school && q.author.school.toLowerCase() === currentUser.school.toLowerCase()) ||
        (q.author.college && q.author.college.toLowerCase() === currentUser.school.toLowerCase());
      // If filtering by school colleague, check match
      if (!matchSchool && selectedCampus !== 'All Campuses') return false;
    } else if (selectedCampus !== 'All Campuses' && q.campus !== selectedCampus) {
      return false;
    }
    // Category filter
    if (questionCategory !== 'All Subjects' && q.category !== questionCategory) {
      return false;
    }
    // Search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      const matchTitle = q.title.toLowerCase().includes(query);
      const matchCourse = q.courseCode.toLowerCase().includes(query);
      const matchBody = q.body.toLowerCase().includes(query);
      const matchTags = q.tags.some((t) => t.toLowerCase().includes(query));
      if (!matchTitle && !matchCourse && !matchBody && !matchTags) return false;
    }
    // Tab filter
    if (currentTab === 'saved' && !q.isBookmarked) {
      return false;
    }
    return true;
  }).sort((a, b) => {
    if (questionSort === 'trending') return (b.upvotes + b.answersCount * 2) - (a.upvotes + a.answersCount * 2);
    if (questionSort === 'latest') return b.id.localeCompare(a.id);
    if (questionSort === 'unanswered') return a.answersCount - b.answersCount;
    if (questionSort === 'urgent') {
      const order = { urgent: 3, exam_prep: 2, regular: 1 };
      return order[b.urgency] - order[a.urgency];
    }
    return 0;
  });

  const filteredMarketplaceItems = marketplaceItems.filter((item) => {
    // School Colleague filter
    if (filterMySchoolOnly && currentUser.school) {
      const isFromUserSchool = 
        item.campus.toLowerCase() === currentUser.school.toLowerCase() ||
        (item.seller.school && item.seller.school.toLowerCase() === currentUser.school.toLowerCase()) ||
        (item.seller.college && item.seller.college.toLowerCase() === currentUser.school.toLowerCase());
      if (!isFromUserSchool) {
        return false;
      }
    } else if (selectedCampus !== 'All Campuses' && item.campus !== selectedCampus) {
      return false;
    }
    // Category filter
    if (marketCategory !== 'all' && item.category !== marketCategory) {
      return false;
    }
    // Condition filter
    if (marketCondition !== 'all' && item.condition !== marketCondition) {
      return false;
    }
    // Negotiable toggle
    if (onlyNegotiable && !item.isNegotiable) {
      return false;
    }
    // Search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      const matchTitle = item.title.toLowerCase().includes(query);
      const matchDesc = item.description.toLowerCase().includes(query);
      const matchCourse = item.courseCode?.toLowerCase().includes(query);
      if (!matchTitle && !matchDesc && !matchCourse) return false;
    }
    // Tab filter
    if (currentTab === 'saved' && !item.isSaved) {
      return false;
    }
    return true;
  }).sort((a, b) => {
    if (marketSort === 'newest') return b.id.localeCompare(a.id);
    if (marketSort === 'price_asc') return a.price - b.price;
    if (marketSort === 'price_desc') return b.price - a.price;
    if (marketSort === 'savings') {
      const savingsA = a.originalPrice ? a.originalPrice - a.price : 0;
      const savingsB = b.originalPrice ? b.originalPrice - b.price : 0;
      return savingsB - savingsA;
    }
    return 0;
  });

  const handleResetData = () => {
    localStorage.removeItem('askcampus_questions');
    localStorage.removeItem('askcampus_items');
    localStorage.removeItem('askcampus_convs');
    localStorage.removeItem('askcampus_groups');
    setQuestions(INITIAL_QUESTIONS);
    setMarketplaceItems(INITIAL_MARKETPLACE_ITEMS);
    setConversations(INITIAL_CONVERSATIONS);
    setStudyGroups(INITIAL_STUDY_GROUPS);
    showToast('Campus data reset to default demo values.');
  };

  // Dedicated page before signing up or logging in (contains the circled welcome hero & 4-step flow)
  if (showWelcomeLanding) {
    return (
      <div className="min-h-screen bg-slate-50">
        <WelcomeLandingPage
          selectedCampus={selectedCampus}
          setSelectedCampus={setSelectedCampus}
          onGetStarted={() => {
            setShowGoogleAuthModal(true);
          }}
          onSignInGoogle={() => {
            setShowGoogleAuthModal(true);
          }}
          onContinueGuest={() => {
            setShowGoogleAuthModal(true);
          }}
          onExploreMarketplace={() => {
            setShowGoogleAuthModal(true);
          }}
        />

        {/* Google Authentication Modal on Welcome Page */}
        {showGoogleAuthModal && (
          <GoogleAuthModal
            currentUser={currentUser}
            setCurrentUser={(user) => {
              setCurrentUser(user);
              setShowGoogleAuthModal(false);
              if (!user.country || !user.school) {
                setShowWelcomeLanding(false);
                setShowOnboardingModal(true);
              } else {
                setSelectedCampus(user.school);
                setShowWelcomeLanding(false);
              }
              showToast(`Welcome to AskCampus, ${user.name}!`);
            }}
            onRequireOnboarding={() => {
              setShowWelcomeLanding(false);
              setShowGoogleAuthModal(false);
              setShowOnboardingModal(true);
            }}
            onClose={() => setShowGoogleAuthModal(false)}
            onOpenDataManagement={() => {
              setShowWelcomeLanding(false);
              setShowGoogleAuthModal(false);
              setCurrentTab('profile');
            }}
          />
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-900 font-sans flex flex-col selection:bg-blue-500 selection:text-white">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-16 left-4 right-4 sm:left-auto sm:right-6 sm:w-auto z-50 bg-slate-900/95 text-white text-xs sm:text-sm font-semibold px-4 py-2.5 rounded-2xl shadow-2xl border border-slate-700 flex items-center gap-2 animate-in slide-in-from-top-4">
          <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
          <span className="truncate">{toastMessage}</span>
        </div>
      )}

      {/* Top App Bar */}
      <AndroidTopBar
        selectedCampus={selectedCampus}
        setSelectedCampus={setSelectedCampus}
        currentUser={currentUser}
        onOpenGoogleAuth={() => setShowGoogleAuthModal(true)}
        onOpenMessages={() => {
          setActiveConversation(conversations[0] || null);
          setShowMessagesDrawer(true);
        }}
        onOpenSaved={() => setCurrentTab('saved')}
        unreadCount={conversations.length > 0 ? 1 : 0}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onSelectTab={setCurrentTab}
        onOpenWelcome={() => setShowWelcomeLanding(true)}
        onOpenCampusSetup={() => setShowOnboardingModal(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 pb-24">
        {/* ============================================================
            TAB 1: CAMPUS Q&A
        ============================================================ */}
        {currentTab === 'questions' && (
          <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
            {/* Clean Modern Campus Q&A Feed Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5 bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs">
              <div>
                <p className="text-xs font-semibold text-blue-600 mb-1">
                  {currentUser.school || selectedCampus} · Academic Community
                </p>
                <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                  Student Questions & Discussions
                </h1>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">
                  Ask course questions, get peer insights, and collaborate with classmates
                </p>
              </div>

              <button
                onClick={handleOpenAskModal}
                className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm rounded-xl shadow-xs transition-all flex items-center gap-2 cursor-pointer shrink-0 self-start sm:self-auto whitespace-nowrap"
              >
                <Plus className="w-4 h-4 stroke-[2.5]" />
                <span>Ask Question</span>
              </button>
            </div>

            {/* Unified Segmented Controls & Subject Filter */}
            <div className="space-y-3 mb-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                {/* School Colleague vs All Campuses Segmented Switch */}
                <div className="inline-flex items-center p-1 bg-slate-200/75 rounded-xl">
                  <button
                    onClick={() => setFilterMySchoolOnly(true)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                      filterMySchoolOnly
                        ? 'bg-white text-slate-900 shadow-2xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    🎓 {currentUser.school || 'My School'}
                  </button>
                  <button
                    onClick={() => setFilterMySchoolOnly(false)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                      !filterMySchoolOnly
                        ? 'bg-white text-slate-900 shadow-2xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    🌐 All Campuses
                  </button>
                </div>

                {/* Sorting Controls */}
                <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0">
                  <button
                    onClick={() => setQuestionSort('trending')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer flex items-center gap-1 whitespace-nowrap ${
                      questionSort === 'trending' ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-200/60'
                    }`}
                  >
                    <TrendingUp className="w-3.5 h-3.5" />
                    <span>Trending</span>
                  </button>
                  <button
                    onClick={() => setQuestionSort('latest')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer flex items-center gap-1 whitespace-nowrap ${
                      questionSort === 'latest' ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-200/60'
                    }`}
                  >
                    <Clock className="w-3.5 h-3.5" />
                    <span>Latest</span>
                  </button>
                  <button
                    onClick={() => setQuestionSort('unanswered')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer flex items-center gap-1 whitespace-nowrap ${
                      questionSort === 'unanswered' ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-200/60'
                    }`}
                  >
                    <Award className="w-3.5 h-3.5 text-amber-500" />
                    <span>Needs Answer</span>
                  </button>
                  <button
                    onClick={() => setQuestionSort('urgent')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer flex items-center gap-1 whitespace-nowrap ${
                      questionSort === 'urgent' ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-200/60'
                    }`}
                  >
                    <Zap className="w-3.5 h-3.5 text-rose-500" />
                    <span>Urgent</span>
                  </button>
                </div>
              </div>

              {/* Clean Subject Filter Strip */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setQuestionCategory(cat)}
                    className={`text-xs font-semibold whitespace-nowrap px-3.5 py-1.5 rounded-xl transition-all cursor-pointer shrink-0 ${
                      questionCategory === cat
                        ? 'bg-slate-900 text-white shadow-2xs'
                        : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/80'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Questions List */}
            {filteredQuestions.length === 0 ? (
              <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-10 text-center">
                <MessageSquare className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                <h3 className="text-base font-bold text-slate-900">No questions yet</h3>
                <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto leading-relaxed">
                  Be the first student at {currentUser.school || 'your campus'} to ask a course question or switch to All Campuses.
                </p>
                <button
                  onClick={handleOpenAskModal}
                  className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-xs cursor-pointer transition-colors"
                >
                  Ask a Question
                </button>
              </div>
            ) : (
              <div className="space-y-3.5">
                {filteredQuestions.map((question) => (
                  <QuestionCard
                    key={question.id}
                    question={question}
                    onSelect={(q) => setActiveQuestion(q)}
                    onVote={handleVoteQuestion}
                    onToggleBookmark={handleToggleBookmarkQuestion}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* ============================================================
            TAB 2: CAMPUS MARKETPLACE (THRIFT & MATERIALS)
        ============================================================ */}
        {currentTab === 'marketplace' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
            {/* Clean Modern Marketplace Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5 bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs">
              <div>
                <p className="text-xs font-semibold text-blue-600 mb-1">
                  {currentUser.school || selectedCampus} · Currency: {currentUser.currencySymbol} ({currentUser.currencyCode || 'USD'})
                </p>
                <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                  Campus Materials & Thrift
                </h1>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">
                  Buy and sell textbooks, lab kits & tech directly in {currentUser.currencyCode || 'local currency'}
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0 self-start sm:self-auto">
                <button
                  onClick={() => setShowHowItWorksModal(true)}
                  className="px-3.5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors cursor-pointer flex items-center gap-1.5 whitespace-nowrap"
                  title="How P2P Bank Transfer Works"
                >
                  <ShieldCheck className="w-4 h-4 text-blue-600" />
                  <span>How It Works</span>
                </button>
                <button
                  onClick={handleOpenSellModal}
                  className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
                >
                  <Plus className="w-4 h-4 stroke-[2.5]" />
                  <span>Sell Material</span>
                </button>
              </div>
            </div>

            {/* Unified Segmented Views & Campus Filter */}
            <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
              {/* Sub-View Navigation Tabs */}
              <div className="inline-flex flex-wrap items-center gap-1 p-1 bg-slate-200/75 rounded-xl">
                <button
                  onClick={() => setMarketView('browse')}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg font-bold text-xs transition-all cursor-pointer whitespace-nowrap ${
                    marketView === 'browse'
                      ? 'bg-white text-slate-900 shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <ShoppingBag className="w-3.5 h-3.5 text-blue-600" />
                  <span>Browse</span>
                  <span className="text-[11px] text-slate-400 tabular-nums">
                    ({filteredMarketplaceItems.length})
                  </span>
                </button>

                <button
                  onClick={() => setMarketView('my_receipts')}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg font-bold text-xs transition-all cursor-pointer whitespace-nowrap ${
                    marketView === 'my_receipts'
                      ? 'bg-white text-slate-900 shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Receipt className="w-3.5 h-3.5 text-emerald-600" />
                  <span>My Purchases</span>
                  <span className="text-[11px] text-slate-400 tabular-nums">
                    ({orders.filter((o) => o.buyer.id === currentUser.id).length})
                  </span>
                </button>

                <button
                  onClick={() => setMarketView('seller_receipts')}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg font-bold text-xs transition-all cursor-pointer whitespace-nowrap ${
                    marketView === 'seller_receipts'
                      ? 'bg-white text-slate-900 shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <FileCheck className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Verify Receipts</span>
                  {orders.filter((o) => o.seller.id === currentUser.id && o.status === 'receipt_submitted').length > 0 && (
                    <span className="px-1.5 py-0.5 rounded-md text-[10px] bg-amber-500 text-white font-bold tabular-nums">
                      {orders.filter((o) => o.seller.id === currentUser.id && o.status === 'receipt_submitted').length}
                    </span>
                  )}
                </button>
              </div>

              {/* School Colleague vs All Campuses Segmented Switch */}
              <div className="inline-flex items-center p-1 bg-slate-200/75 rounded-xl">
                <button
                  onClick={() => setFilterMySchoolOnly(true)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                    filterMySchoolOnly
                      ? 'bg-white text-slate-900 shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  🎓 {currentUser.school || 'My School'}
                </button>
                <button
                  onClick={() => setFilterMySchoolOnly(false)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                    !filterMySchoolOnly
                      ? 'bg-white text-slate-900 shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  🌐 All Campuses
                </button>
              </div>
            </div>

            {/* =======================
                VIEW 1: BROWSE MATERIALS
            ======================= */}
            {marketView === 'browse' && (
              <>
                {/* Sleek Single-Line Category Strip & Compact Filters */}
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 mb-6">
                  <div className="flex items-center gap-1.5 overflow-x-auto pb-1 lg:pb-0 scrollbar-none">
                    {MARKETPLACE_CATEGORIES.map((cat) => {
                      const isSelected = marketCategory === cat.id;
                      return (
                        <button
                          key={cat.id}
                          onClick={() => setMarketCategory(cat.id)}
                          className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer shrink-0 ${
                            isSelected
                              ? 'bg-slate-900 text-white shadow-2xs'
                              : 'bg-white text-slate-600 border border-slate-200/80 hover:bg-slate-100'
                          }`}
                        >
                          {cat.label}
                        </button>
                      );
                    })}
                  </div>

                  {/* Compact Sort & Condition Controls */}
                  <div className="flex flex-wrap items-center gap-2 text-xs shrink-0">
                    <select
                      value={marketCondition}
                      onChange={(e) => setMarketCondition(e.target.value)}
                      className="bg-white border border-slate-200 rounded-xl px-3 py-1.5 font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    >
                      <option value="all">All Conditions</option>
                      <option value="Brand New">Brand New</option>
                      <option value="Like New">Like New</option>
                      <option value="Good">Good</option>
                      <option value="Fair">Fair</option>
                    </select>

                    <select
                      value={marketSort}
                      onChange={(e) => setMarketSort(e.target.value as any)}
                      className="bg-white border border-slate-200 rounded-xl px-3 py-1.5 font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    >
                      <option value="newest">Newest First</option>
                      <option value="price_asc">Price: Low to High</option>
                      <option value="price_desc">Price: High to Low</option>
                      <option value="savings">Biggest Savings %</option>
                    </select>

                    <label className="flex items-center gap-1.5 font-semibold text-slate-600 cursor-pointer bg-white border border-slate-200 rounded-xl px-3 py-1.5">
                      <input
                        type="checkbox"
                        checked={onlyNegotiable}
                        onChange={(e) => setOnlyNegotiable(e.target.checked)}
                        className="rounded text-blue-600 focus:ring-blue-500"
                      />
                      <span>Negotiable</span>
                    </label>
                  </div>
                </div>

                {/* Marketplace Grid or Clean Empty State */}
                {filteredMarketplaceItems.length === 0 ? (
                  <div className="bg-white rounded-2xl border border-slate-200 p-8 sm:p-10 text-center max-w-xl mx-auto shadow-xs">
                    <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-3 border border-blue-100">
                      <ShoppingBag className="w-7 h-7" />
                    </div>
                    <h3 className="text-lg font-black text-slate-900 mb-1">
                      {filterMySchoolOnly 
                        ? `No materials listed at ${currentUser.school || 'your school'} yet` 
                        : 'No materials found matching your filters'}
                    </h3>
                    <p className="text-xs text-slate-500 leading-relaxed mb-5 max-w-md mx-auto">
                      {filterMySchoolOnly 
                        ? `Be the first classmate from ${currentUser.school || 'your campus'} to list a textbook or exam notes in ${currentUser.currencyCode || 'local currency'}! Or explore materials across all campuses.`
                        : 'Try adjusting your category or condition filters, or be the first to upload a textbook or supply!'}
                    </p>
                    <div className="flex flex-wrap items-center justify-center gap-2.5">
                      <button
                        onClick={handleOpenSellModal}
                        className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all cursor-pointer"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Upload Material</span>
                      </button>
                      {filterMySchoolOnly && (
                        <button
                          onClick={() => setFilterMySchoolOnly(false)}
                          className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-all cursor-pointer"
                        >
                          <Globe2 className="w-3.5 h-3.5" />
                          <span>View All Campuses</span>
                        </button>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                    {filteredMarketplaceItems.map((item) => (
                      <MarketplaceCard
                        key={item.id}
                        item={item}
                        userCurrencySymbol={currentUser.currencySymbol || '$'}
                        currentUserSchool={currentUser.school || currentUser.college}
                        onSelect={(it) => setActiveItem(it)}
                        onToggleSave={handleToggleSaveItem}
                        onQuickChat={handleStartChat}
                      />
                    ))}
                  </div>
                )}
              </>
            )}

            {/* =======================
                VIEW 2: MY PURCHASES & RECEIPTS (BUYER VIEW)
            ======================= */}
            {marketView === 'my_receipts' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-black text-slate-900">
                    My Payment Receipts & Order History
                  </h3>
                  <span className="text-xs text-slate-500 font-medium">
                    Showing orders you initiated with bank receipts
                  </span>
                </div>

                {orders.filter((o) => o.buyer.id === currentUser.id).length === 0 ? (
                  <div className="bg-white rounded-3xl border border-dashed border-slate-300 p-10 text-center">
                    <Receipt className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                    <h4 className="text-base font-bold text-slate-800">No payment receipts yet</h4>
                    <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                      When you purchase school materials and submit transfer proof, your payment receipts and status will be tracked here.
                    </p>
                    <button
                      onClick={() => setMarketView('browse')}
                      className="mt-4 px-4 py-2 bg-blue-600 text-white text-xs font-bold rounded-xl shadow-xs cursor-pointer"
                    >
                      Browse Available Materials
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {orders
                      .filter((o) => o.buyer.id === currentUser.id)
                      .map((order) => (
                        <div
                          key={order.id}
                          className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between"
                        >
                          <div>
                            <div className="flex items-start justify-between gap-3 mb-3">
                              <div className="flex items-center gap-3">
                                <img
                                  src={order.itemImage}
                                  alt={order.itemTitle}
                                  className="w-14 h-14 rounded-2xl object-cover border border-slate-100"
                                />
                                <div>
                                  <h4 className="text-sm font-black text-slate-900 line-clamp-1">
                                    {order.itemTitle}
                                  </h4>
                                  <p className="text-xs font-bold text-blue-600 tabular-nums">
                                    {formatPrice(order.itemPrice, order.currencySymbol || currentUser.currencySymbol || '$')}
                                  </p>
                                  <p className="text-[11px] text-slate-500">
                                    Seller: {order.seller.name} ({order.seller.college})
                                  </p>
                                </div>
                              </div>

                              <span
                                className={`px-2.5 py-1 rounded-full text-[11px] font-black uppercase tracking-wider shrink-0 ${
                                  order.status === 'confirmed'
                                    ? 'bg-emerald-100 text-emerald-800'
                                    : order.status === 'rejected'
                                    ? 'bg-rose-100 text-rose-800'
                                    : 'bg-amber-100 text-amber-800'
                                }`}
                              >
                                {order.status === 'confirmed'
                                  ? 'Verified & Paid'
                                  : order.status === 'rejected'
                                  ? 'Unverified'
                                  : 'Pending Seller'}
                              </span>
                            </div>

                            <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 text-xs space-y-1 mb-4">
                              <div className="flex justify-between text-slate-600">
                                <span>Transferred To:</span>
                                <span className="font-bold text-slate-900">
                                  {order.sellerBankDetails?.bankName} ({order.sellerBankDetails?.accountNumber})
                                </span>
                              </div>
                              <div className="flex justify-between text-slate-600">
                                <span>Ref Code:</span>
                                <span className="font-mono text-slate-900 font-bold">{order.paymentReference || 'N/A'}</span>
                              </div>
                              <div className="flex justify-between text-slate-600">
                                <span>Date:</span>
                                <span>{order.submittedAt}</span>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                            <button
                              onClick={() => setActiveOrder(order)}
                              className="flex-1 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                            >
                              <Eye className="w-3.5 h-3.5" />
                              <span>View Receipt Proof</span>
                            </button>
                            <button
                              onClick={() => {
                                const item = marketplaceItems.find((i) => i.id === order.itemId);
                                if (item) handleStartChat(item);
                              }}
                              className="px-3 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-xs rounded-xl transition-colors cursor-pointer flex items-center gap-1"
                            >
                              <MessageSquare className="w-3.5 h-3.5" />
                              <span>Chat</span>
                            </button>
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </div>
            )}

            {/* =======================
                VIEW 3: VERIFY BUYER RECEIPTS (SELLER VIEW)
            ======================= */}
            {marketView === 'seller_receipts' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-black text-slate-900">
                    Incoming Buyer Transfer Receipts
                  </h3>
                  <span className="text-xs text-slate-500 font-medium">
                    Verify deposits in your bank app before confirming
                  </span>
                </div>

                {orders.filter((o) => o.seller.id === currentUser.id).length === 0 ? (
                  <div className="bg-white rounded-3xl border border-dashed border-slate-300 p-10 text-center">
                    <FileCheck className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                    <h4 className="text-base font-bold text-slate-800">No buyer receipts to verify</h4>
                    <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                      When students purchase your listings and transfer money to your bank account, their receipt screenshots will appear here for verification.
                    </p>
                    <button
                      onClick={() => setShowSellModal(true)}
                      className="mt-4 px-4 py-2 bg-amber-500 text-slate-950 text-xs font-bold rounded-xl shadow-xs cursor-pointer"
                    >
                      Sell School Material
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {orders
                      .filter((o) => o.seller.id === currentUser.id)
                      .map((order) => (
                        <div
                          key={order.id}
                          className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-2xs hover:shadow-md transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                        >
                          <div className="flex items-center gap-4">
                            {/* Receipt thumbnail */}
                            <div
                              onClick={() => setActiveOrder(order)}
                              className="relative w-16 h-20 rounded-2xl overflow-hidden border border-slate-200 cursor-pointer group shrink-0 bg-slate-100"
                            >
                              <img
                                src={order.paymentReceiptUrl}
                                alt="Receipt"
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                              />
                              <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <Eye className="w-4 h-4 text-white" />
                              </div>
                            </div>

                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-xs font-bold text-slate-400">ORDER #{order.id.slice(-6)}</span>
                                <span
                                  className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                                    order.status === 'confirmed'
                                      ? 'bg-emerald-100 text-emerald-800'
                                      : order.status === 'rejected'
                                      ? 'bg-rose-100 text-rose-800'
                                      : 'bg-amber-100 text-amber-800 animate-pulse'
                                  }`}
                                >
                                  {order.status === 'confirmed'
                                    ? 'Payment Verified'
                                    : order.status === 'rejected'
                                    ? 'Rejected'
                                    : 'Pending Verification'}
                                </span>
                              </div>

                              <h4 className="text-base font-black text-slate-900">
                                {order.itemTitle}
                              </h4>

                              <p className="text-xs text-slate-600 mt-0.5">
                                Buyer: <strong className="text-slate-800">{order.buyer.name}</strong> • Phone: {order.buyerPhone || 'Not provided'}
                              </p>

                              <p className="text-xs font-mono text-slate-500 mt-1">
                                Ref: <strong>{order.paymentReference || 'Direct Transfer'}</strong> • Date: {order.submittedAt}
                              </p>
                            </div>
                          </div>

                          {/* Action Buttons */}
                          <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
                            <button
                              onClick={() => setActiveOrder(order)}
                              className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1.5 cursor-pointer"
                            >
                              <Eye className="w-3.5 h-3.5" />
                              <span>Inspect Receipt</span>
                            </button>

                            {order.status === 'receipt_submitted' && (
                              <>
                                <button
                                  onClick={() => handleRejectOrder(order.id)}
                                  className="px-3.5 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs cursor-pointer"
                                >
                                  Reject
                                </button>
                                <button
                                  onClick={() => handleConfirmOrder(order.id)}
                                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs shadow-xs cursor-pointer flex items-center gap-1.5"
                                >
                                  <CheckCircle2 className="w-4 h-4" />
                                  <span>Confirm Payment</span>
                                </button>
                              </>
                            )}
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* ============================================================
            TAB 3: STUDY GROUPS
        ============================================================ */}
        {currentTab === 'studygroups' && (
          <StudyGroupsView
            groups={studyGroups}
            currentUser={currentUser}
            selectedCampus={selectedCampus}
            onToggleJoin={handleToggleJoinGroup}
            onCreateGroup={handleCreateStudyGroup}
          />
        )}

        {/* ============================================================
            TAB 4: AI COPILOT
        ============================================================ */}
        {currentTab === 'copilot' && (
          <AICopilotView
            currentUser={currentUser}
            selectedCampus={selectedCampus}
          />
        )}

        {/* ============================================================
            TAB 5: SAVED / WISHLIST
        ============================================================ */}
        {currentTab === 'saved' && (
          <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight mb-1">
              Saved Items & Bookmarked Questions
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mb-6">
              Quick access to materials you're eyeing to buy and questions you're following for exams.
            </p>

            <div className="space-y-8">
              {/* Saved Marketplace Items */}
              <div>
                <h2 className="text-sm font-bold text-slate-800 mb-3 flex items-center gap-2">
                  <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
                  <span>Wishlist School Materials ({marketplaceItems.filter((i) => i.isSaved).length})</span>
                </h2>
                {marketplaceItems.filter((i) => i.isSaved).length === 0 ? (
                  <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center text-xs text-slate-500">
                    No marketplace items saved to wishlist yet. Click the heart icon on any item to save it here.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {marketplaceItems.filter((i) => i.isSaved).map((item) => (
                      <MarketplaceCard
                        key={item.id}
                        item={item}
                        userCurrencySymbol={currentUser.currencySymbol || '$'}
                        currentUserSchool={currentUser.school || currentUser.college}
                        onSelect={(it) => setActiveItem(it)}
                        onToggleSave={handleToggleSaveItem}
                        onQuickChat={handleStartChat}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Bookmarked Questions */}
              <div>
                <h2 className="text-base font-bold text-slate-800 mb-3 flex items-center gap-2">
                  <Bookmark className="w-4 h-4 text-amber-500 fill-amber-500" />
                  <span>Bookmarked Questions ({questions.filter((q) => q.isBookmarked).length})</span>
                </h2>
                {questions.filter((q) => q.isBookmarked).length === 0 ? (
                  <div className="bg-white rounded-2xl border border-slate-200 p-6 text-center text-xs text-slate-400">
                    No questions bookmarked yet. Click the bookmark icon on any question to study later!
                  </div>
                ) : (
                  <div className="space-y-3">
                    {questions.filter((q) => q.isBookmarked).map((question) => (
                      <QuestionCard
                        key={question.id}
                        question={question}
                        onSelect={(q) => setActiveQuestion(q)}
                        onVote={handleVoteQuestion}
                        onToggleBookmark={handleToggleBookmarkQuestion}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ============================================================
            TAB 6: USER PROFILE & DATA MANAGEMENT
        ============================================================ */}
        {currentTab === 'profile' && (
          <UserProfileView
            currentUser={currentUser}
            setCurrentUser={setCurrentUser}
            questions={questions}
            marketplaceItems={marketplaceItems}
            conversations={conversations}
            registeredColleagues={registeredColleagues}
            onOpenGoogleAuth={() => setShowGoogleAuthModal(true)}
            onSelectQuestion={(q) => setActiveQuestion(q)}
            onSelectItem={(i) => setActiveItem(i)}
            onResetData={handleResetData}
            onOpenCampusSetup={() => setShowOnboardingModal(true)}
            onSignOut={async () => {
              await logOut();
              localStorage.removeItem('askcampus_user_v2');
              localStorage.removeItem('askcampus_entered');
              setCurrentUser({
                id: '',
                name: '',
                username: '',
                avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
                college: '',
                school: '',
                country: '',
                state: '',
                currencyCode: 'USD',
                currencySymbol: '$',
                major: '',
                graduationYear: '2026',
                karma: 0,
                badges: [],
                verifiedStudent: false,
              });
              setShowWelcomeLanding(true);
              showToast('Signed out of AskCampus.');
            }}
          />
        )}
      </main>

      {/* Android Material 3 Bottom Navigation Bar */}
      <AndroidBottomNav
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        onOpenActionSheet={() => setShowActionSheet(true)}
        currentUser={currentUser}
        unreadCount={conversations.length > 0 ? 1 : 0}
      />

    {/* Center FAB Post Action Bottom Sheet */}
    {showActionSheet && (
      <PostBottomSheet
        onClose={() => setShowActionSheet(false)}
        onSelectAsk={() => {
          setShowActionSheet(false);
          handleOpenAskModal();
        }}
        onSelectSell={() => {
          setShowActionSheet(false);
          handleOpenSellModal();
        }}
        onSelectStudyGroup={() => {
          setShowActionSheet(false);
          if (!currentUser.id || !currentUser.name) {
            showToast('Please sign in or create an account to host a study group.');
            setShowGoogleAuthModal(true);
            return;
          }
          setCurrentTab('studygroups');
          showToast('Find or host a midterm study cram session!');
        }}
      />
    )}

    {/* Google Authentication & Account Switcher Modal */}
    {showGoogleAuthModal && (
      <GoogleAuthModal
        currentUser={currentUser}
        setCurrentUser={(u) => {
          setCurrentUser(u);
          setShowGoogleAuthModal(false);
          setShowOnboardingModal(true);
        }}
        onRequireOnboarding={() => setShowOnboardingModal(true)}
        onClose={() => setShowGoogleAuthModal(false)}
        onOpenDataManagement={() => setCurrentTab('profile')}
      />
    )}

      {/* MODALS */}
      {/* 1. Question Detail Modal */}
      {activeQuestion && (
        <QuestionDetailModal
          question={activeQuestion}
          currentUser={currentUser}
          onClose={() => setActiveQuestion(null)}
          onVoteQuestion={handleVoteQuestion}
          onVoteAnswer={handleVoteAnswer}
          onAcceptAnswer={handleAcceptAnswer}
          onSubmitAnswer={handleSubmitAnswer}
          onToggleBookmark={handleToggleBookmarkQuestion}
        />
      )}

      {/* 2. Ask Question Modal */}
      {showAskModal && (
        <PostQuestionModal
          currentUser={currentUser}
          selectedCampus={selectedCampus}
          onClose={() => setShowAskModal(false)}
          onSubmit={handleCreateQuestion}
        />
      )}

      {/* 3. Marketplace Detail Modal */}
      {activeItem && (
        <MarketplaceDetailModal
          item={activeItem}
          currentUser={currentUser}
          onClose={() => setActiveItem(null)}
          onToggleSave={handleToggleSaveItem}
          onStartChat={handleStartChat}
          onUpdateStatus={handleUpdateItemStatus}
          onDeleteItem={handleDeleteItem}
          onInitiatePurchase={handleInitiatePurchase}
        />
      )}

      {/* 4. Sell Item Modal */}
      {showSellModal && (
        <CreateListingModal
          currentUser={currentUser}
          selectedCampus={selectedCampus}
          onClose={() => setShowSellModal(false)}
          onSubmit={handleCreateListing}
        />
      )}

      {/* 5. In-App Chat Drawer */}
      {showMessagesDrawer && (
        <MarketplaceChatDrawer
          conversation={activeConversation}
          activeItem={activeItem}
          currentUser={currentUser}
          allConversations={conversations}
          onSelectConversation={(c) => setActiveConversation(c)}
          onClose={() => setShowMessagesDrawer(false)}
          onSendMessage={handleSendMessage}
          onAcceptOffer={handleAcceptOffer}
        />
      )}

      {/* 6. Direct Bank Transfer & Buyer Payment Receipt Modal */}
      {activePurchaseItem && (
        <PaymentReceiptModal
          item={activePurchaseItem}
          currentUser={currentUser}
          onClose={() => setActivePurchaseItem(null)}
          onSubmitOrder={handleCreateOrder}
        />
      )}

      {/* 7. Order & Payment Receipt Inspection Modal (Buyer & Seller) */}
      {activeOrder && (
        <OrderReceiptDetailModal
          order={activeOrder}
          currentUser={currentUser}
          onClose={() => setActiveOrder(null)}
          onConfirmOrder={handleConfirmOrder}
          onRejectOrder={handleRejectOrder}
        />
      )}

      {/* 8. Campus & Country Onboarding / Setup Modal */}
      {showOnboardingModal && (
        <OnboardingModal
          currentUser={currentUser}
          onSave={async (updatedUser) => {
            setCurrentUser(updatedUser);
            setSelectedCampus(updatedUser.school);
            setFilterMySchoolOnly(true);
            setShowOnboardingModal(false);
            setShowWelcomeLanding(false);
            localStorage.setItem('askcampus_user_v2', JSON.stringify(updatedUser));
            localStorage.setItem('askcampus_entered', 'true');
            if (updatedUser.id) {
              await updateUserFirestoreProfile(updatedUser.id, updatedUser);
              getRegisteredUsers().then((users) => setRegisteredColleagues(users));
            }
            showToast(`Welcome to ${updatedUser.school}! Currency set to ${updatedUser.currencySymbol} (${updatedUser.currencyCode}).`);
          }}
          onClose={() => {
            if (currentUser.country && currentUser.school) {
              setShowOnboardingModal(false);
            }
          }}
          isInitialSetup={!currentUser.country || !currentUser.school}
        />
      )}

      {/* 9. Clean "How P2P Direct Bank Transfer Works" Info Modal */}
      {showHowItWorksModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-150">
          <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-auto p-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900 leading-tight">
                    Direct P2P Bank Transfer & Receipts
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    0% Commission • Local Currency ({currentUser.currencySymbol})
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowHowItWorksModal(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* 4 Steps */}
            <div className="space-y-3 text-xs">
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                <div className="flex items-center gap-2 font-bold text-slate-900 mb-1">
                  <span className="w-5 h-5 rounded-full bg-blue-600 text-white text-[10px] flex items-center justify-center font-black">1</span>
                  <span>Seller Enters Bank Account</span>
                </div>
                <p className="text-slate-600 pl-7 leading-relaxed">
                  When listing a school material, the seller enters their official Bank Name, Account Name, and Account Number.
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                <div className="flex items-center gap-2 font-bold text-slate-900 mb-1">
                  <span className="w-5 h-5 rounded-full bg-blue-600 text-white text-[10px] flex items-center justify-center font-black">2</span>
                  <span>Buyer Transfers in Local Currency ({currentUser.currencySymbol})</span>
                </div>
                <p className="text-slate-600 pl-7 leading-relaxed">
                  Buyer copies the verified account number with 1-click and sends funds directly using their mobile banking app.
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                <div className="flex items-center gap-2 font-bold text-slate-900 mb-1">
                  <span className="w-5 h-5 rounded-full bg-blue-600 text-white text-[10px] flex items-center justify-center font-black">3</span>
                  <span>Buyer Submits Transfer Receipt</span>
                </div>
                <p className="text-slate-600 pl-7 leading-relaxed">
                  Buyer uploads the transaction confirmation screenshot and reference number for proof of payment.
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                <div className="flex items-center gap-2 font-bold text-slate-900 mb-1">
                  <span className="w-5 h-5 rounded-full bg-emerald-600 text-white text-[10px] flex items-center justify-center font-black">4</span>
                  <span>Seller Verifies & Exchanges on Campus</span>
                </div>
                <p className="text-slate-600 pl-7 leading-relaxed">
                  Seller checks their bank balance, verifies the receipt, clicks <strong>Confirm Payment</strong>, and meets up safely on campus!
                </p>
              </div>
            </div>

            <button
              onClick={() => setShowHowItWorksModal(false)}
              className="mt-5 w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              Understood
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
