import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Send, 
  DollarSign, 
  MapPin, 
  Check, 
  XCircle, 
  MessageCircle, 
  Sparkles,
  ShieldCheck
} from 'lucide-react';
import { Conversation, StudentProfile, MarketplaceItem, ChatMessage } from '../types';
import { formatPrice, triggerConfetti } from '../utils/helpers';

interface MarketplaceChatDrawerProps {
  conversation: Conversation | null;
  activeItem?: MarketplaceItem | null;
  currentUser: StudentProfile;
  allConversations: Conversation[];
  onSelectConversation: (conv: Conversation) => void;
  onClose: () => void;
  onSendMessage: (conversationId: string, text: string, isOffer?: boolean, offerAmount?: number) => void;
  onAcceptOffer: (conversationId: string, messageId: string) => void;
}

export const MarketplaceChatDrawer: React.FC<MarketplaceChatDrawerProps> = ({
  conversation,
  activeItem,
  currentUser,
  allConversations,
  onSelectConversation,
  onClose,
  onSendMessage,
  onAcceptOffer,
}) => {
  const [inputText, setInputText] = useState('');
  const [offerValue, setOfferValue] = useState<number | ''>('');
  const [showOfferBox, setShowOfferBox] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const currencySymbol = currentUser.currencySymbol || '$';

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [conversation?.messages]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!conversation || !inputText.trim()) return;
    onSendMessage(conversation.id, inputText.trim());
    setInputText('');
  };

  const handleSendOffer = () => {
    if (!conversation || offerValue === '' || Number(offerValue) <= 0) return;
    const amount = Number(offerValue);
    const offerText = `I would like to make an offer of ${formatPrice(amount)} for "${conversation.itemTitle}". Can we meet on campus?`;
    onSendMessage(conversation.id, offerText, true, amount);
    setOfferValue('');
    setShowOfferBox(false);
  };

  const quickReplies = [
    'Is this still available for campus pickup?',
    'Can we meet at the campus library today?',
    'Are there any markings or torn pages?',
    'What payment do you prefer? (Venmo / Cash)'
  ];

  const otherUser = conversation
    ? currentUser.id === conversation.buyer.id
      ? conversation.seller
      : conversation.buyer
    : null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/60 backdrop-blur-xs flex justify-end animate-in fade-in duration-150">
      <div className="w-full max-w-xl bg-white h-full shadow-2xl flex flex-col border-l border-slate-200">
        {/* Top Header */}
        <div className="px-5 py-4 bg-slate-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white">
              <MessageCircle className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white">
                {conversation ? `Chat with ${otherUser?.name}` : 'Campus Marketplace Messages'}
              </h2>
              <p className="text-[11px] text-slate-300">
                {otherUser ? `${otherUser.college} • ${otherUser.major}` : 'Direct student inquiries'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* If no active conversation, show conversation list */}
        {!conversation ? (
          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider px-2 py-1">
              Active Conversations
            </div>
            {allConversations.length === 0 ? (
              <div className="text-center py-16 text-slate-400 text-sm">
                No active conversations yet. Click "Chat" on any marketplace listing to message the seller!
              </div>
            ) : (
              allConversations.map((conv) => {
                const partner = currentUser.id === conv.buyer.id ? conv.seller : conv.buyer;
                return (
                  <div
                    key={conv.id}
                    onClick={() => onSelectConversation(conv)}
                    className="p-3.5 rounded-2xl bg-white border border-slate-200 hover:border-indigo-400 hover:shadow-md transition-all cursor-pointer flex items-center gap-3"
                  >
                    <img
                      src={conv.itemImage}
                      alt={conv.itemTitle}
                      className="w-12 h-12 rounded-xl object-cover ring-1 ring-slate-200 shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-0.5">
                        <span className="font-bold text-slate-900 text-sm truncate">
                          {partner.name}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          {conv.lastMessageTime}
                        </span>
                      </div>
                      <div className="text-xs text-blue-600 font-semibold truncate mb-1">
                        {conv.itemTitle} • {formatPrice(conv.itemPrice, currencySymbol)}
                      </div>
                      <p className="text-xs text-slate-500 truncate">
                        {conv.lastMessage}
                      </p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        ) : (
          /* Active Chat Thread */
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Item Card Banner */}
            <div className="p-3.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between gap-3 shrink-0">
              <div className="flex items-center gap-2.5 min-w-0">
                <img
                  src={conversation.itemImage}
                  alt={conversation.itemTitle}
                  className="w-10 h-10 rounded-lg object-cover ring-1 ring-slate-200 shrink-0"
                />
                <div className="min-w-0">
                  <h4 className="text-xs font-bold text-slate-900 truncate">
                    {conversation.itemTitle}
                  </h4>
                  <div className="text-xs text-slate-500 flex items-center gap-1.5">
                    <span className="font-bold text-blue-600">
                      Listing Price: {formatPrice(conversation.itemPrice, currencySymbol)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Make an Offer Button */}
              <button
                onClick={() => setShowOfferBox(!showOfferBox)}
                className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold shadow-xs transition-colors cursor-pointer shrink-0"
              >
                Make Offer
              </button>
            </div>

            {/* Offer Box Dropdown */}
            {showOfferBox && (
              <div className="p-3 bg-amber-50/80 border-b border-amber-200 shrink-0 animate-in fade-in duration-100">
                <div className="flex items-center justify-between text-xs font-bold text-amber-900 mb-1.5">
                  <span>Send Formal Student Offer:</span>
                  <button onClick={() => setShowOfferBox(false)} className="text-slate-400 hover:text-slate-600">
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-xs font-bold">{currencySymbol}</span>
                    <input
                      type="number"
                      value={offerValue}
                      onChange={(e) => setOfferValue(e.target.value === '' ? '' : Number(e.target.value))}
                      placeholder={`e.g. ${Math.round(conversation.itemPrice * 0.85)}`}
                      className="w-full text-xs pl-8 pr-3 py-2 rounded-xl bg-white border border-amber-300 focus:outline-none focus:ring-1 focus:ring-amber-500 font-bold"
                    />
                  </div>
                  <button
                    onClick={handleSendOffer}
                    disabled={offerValue === '' || Number(offerValue) <= 0}
                    className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer disabled:opacity-40"
                  >
                    Submit Offer
                  </button>
                </div>
              </div>
            )}

            {/* Messages Scroll Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              <div className="text-center my-2">
                <span className="text-[10px] text-slate-400 bg-slate-100 px-3 py-1 rounded-full">
                  Meet in safe campus areas: Library, Student Center, Dining Hall
                </span>
              </div>

              {conversation.messages.map((msg) => {
                const isMe = msg.senderId === currentUser.id;
                return (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                  >
                    <div className="text-[10px] text-slate-400 mb-0.5 px-1">
                      {msg.senderName} • {msg.timestamp}
                    </div>

                    <div
                      className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-xs sm:text-sm leading-relaxed ${
                        isMe
                          ? 'bg-indigo-600 text-white rounded-br-xs'
                          : 'bg-slate-100 text-slate-800 rounded-bl-xs'
                      }`}
                    >
                      {msg.text}

                      {/* If message is a formal offer */}
                      {msg.isOffer && msg.offerAmount && (
                        <div className={`mt-2 p-2.5 rounded-xl border ${
                          isMe ? 'bg-indigo-700/60 border-indigo-400/40' : 'bg-white border-amber-300'
                        }`}>
                          <div className="flex items-center justify-between text-xs font-bold mb-1">
                            <span className={isMe ? 'text-amber-200' : 'text-amber-800'}>
                              Formal Offer: {formatPrice(msg.offerAmount)}
                            </span>
                            {msg.offerStatus === 'accepted' ? (
                              <span className="text-[10px] bg-emerald-500 text-white px-2 py-0.5 rounded-full font-bold">
                                Accepted
                              </span>
                            ) : msg.offerStatus === 'declined' ? (
                              <span className="text-[10px] bg-rose-500 text-white px-2 py-0.5 rounded-full font-bold">
                                Declined
                              </span>
                            ) : (
                              <span className="text-[10px] bg-amber-500/20 text-amber-700 px-2 py-0.5 rounded-full font-bold">
                                Pending
                              </span>
                            )}
                          </div>

                          {/* Accept Offer Action if user is seller and offer is pending */}
                          {!isMe && msg.offerStatus === 'pending' && currentUser.id === conversation.seller.id && (
                            <div className="flex gap-2 mt-2 pt-2 border-t border-slate-200">
                              <button
                                onClick={() => {
                                  onAcceptOffer(conversation.id, msg.id);
                                  triggerConfetti();
                                }}
                                className="flex-1 py-1 px-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-1"
                              >
                                <Check className="w-3.5 h-3.5" />
                                <span>Accept Offer</span>
                              </button>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Reply Chips */}
            <div className="p-2 border-t border-slate-100 bg-slate-50 flex gap-1.5 overflow-x-auto shrink-0">
              {quickReplies.map((qr) => (
                <button
                  key={qr}
                  onClick={() => onSendMessage(conversation.id, qr)}
                  className="text-[11px] whitespace-nowrap px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-600 hover:border-indigo-400 hover:text-indigo-600 transition-colors cursor-pointer shrink-0"
                >
                  {qr}
                </button>
              ))}
            </div>

            {/* Input form */}
            <form onSubmit={handleSend} className="p-3 bg-white border-t border-slate-200 flex items-center gap-2 shrink-0">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder={`Message ${otherUser?.name}...`}
                className="flex-1 text-sm px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <button
                type="submit"
                disabled={!inputText.trim()}
                className="p-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white transition-colors cursor-pointer disabled:opacity-40"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
