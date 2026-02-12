import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Search, Send, Loader2, User as UserIcon, Wifi, WifiOff, MessageCircle, AlertCircle, RefreshCw } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { RealtimeChannel } from '@supabase/supabase-js';

interface MessagesProps {
  onBack: () => void;
  embedded?: boolean;
}

interface ChatUser {
  id: string;
  name: string;
  avatar?: string;
  email: string;
  role: string;
}

interface Message {
  id: number;
  sender_id: string;
  receiver_id: string;
  content: string;
  created_at: string;
}

export const MessagesView: React.FC<MessagesProps> = ({ onBack, embedded = false }) => {
  const [currentUser, setCurrentUser] = useState<string | null>(null);
  const [users, setUsers] = useState<ChatUser[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [debugStatus, setDebugStatus] = useState('Initializing...');
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const searchTimeoutRef = useRef<any>(null);
  const channelRef = useRef<RealtimeChannel | null>(null);

  // 1. Get Current User
  useEffect(() => {
    const fetchCurrentUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      setCurrentUser(user.id);
    };
    fetchCurrentUser();
  }, []);

  // 2. Fetch Users
  useEffect(() => {
    if (!currentUser) return;

    const fetchUsers = async () => {
      setLoadingUsers(true);
      try {
        let query = supabase
            .from('users') // Ensuring we query 'users', not 'profiles'
            .select('id, name, avatar, email, role')
            .neq('id', currentUser);

        if (searchQuery.trim()) {
           query = query.or(`name.ilike.%${searchQuery}%,email.ilike.%${searchQuery}%`);
        } else {
           query = query.limit(50);
        }

        const { data, error } = await query;
        if (error) throw error;
        setUsers(data || []);
      } catch (err: any) {
        console.error('Error fetching users:', err);
      } finally {
        setLoadingUsers(false);
      }
    };

    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    searchTimeoutRef.current = setTimeout(fetchUsers, 500);
    return () => clearTimeout(searchTimeoutRef.current);
  }, [currentUser, searchQuery]);

  // 3. Realtime Subscription
  useEffect(() => {
    if (!selectedUserId || !currentUser) return;

    setLoadingMessages(true);
    setMessages([]);
    setIsConnected(false);
    setDebugStatus('Connecting to Realtime...');

    // Load initial messages
    const fetchMessages = async () => {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .or(`and(sender_id.eq.${currentUser},receiver_id.eq.${selectedUserId}),and(sender_id.eq.${selectedUserId},receiver_id.eq.${currentUser})`)
        .order('created_at', { ascending: true });

      if (error) {
          console.error('Error loading messages:', error);
          setDebugStatus(`Error loading: ${error.message}`);
      } else {
          setMessages(data || []);
      }
      setLoadingMessages(false);
    };

    fetchMessages();

    // Setup Realtime
    const channel = supabase.channel('room1')
        .on(
            'postgres_changes',
            {
                event: 'INSERT',
                schema: 'public',
                table: 'messages',
            },
            (payload) => {
                console.log('Realtime Payload Received:', payload);
                const newMsg = payload.new as Message;
                
                // Only add if it belongs to this chat
                const isForMe = newMsg.receiver_id === currentUser && newMsg.sender_id === selectedUserId;
                const isFromMe = newMsg.sender_id === currentUser && newMsg.receiver_id === selectedUserId;

                if (isForMe || isFromMe) {
                    setMessages((prev) => {
                        if (prev.some(m => m.id === newMsg.id)) return prev;
                        return [...prev, newMsg];
                    });
                }
            }
        )
        .subscribe((status) => {
            console.log("Subscription status:", status);
            if (status === 'SUBSCRIBED') {
                setIsConnected(true);
                setDebugStatus('Connected');
            } else {
                setIsConnected(false);
                setDebugStatus(`Status: ${status}`);
            }
        });

    channelRef.current = channel;

    return () => {
      supabase.removeChannel(channel);
    };
  }, [selectedUserId, currentUser]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputText.trim() || !selectedUserId || !currentUser) return;

    const content = inputText.trim();
    setInputText(''); 

    // Optimistic Update
    const tempId = Date.now();
    const tempMsg: Message = {
        id: tempId,
        sender_id: currentUser,
        receiver_id: selectedUserId,
        content: content,
        created_at: new Date().toISOString()
    };
    
    setMessages(prev => [...prev, tempMsg]);

    try {
        const { error } = await supabase.from('messages').insert({
          sender_id: currentUser,
          receiver_id: selectedUserId,
          content: content,
        });

        if (error) throw error;
    } catch (error: any) {
        console.error('Error sending:', error);
        setMessages(prev => prev.filter(m => m.id !== tempId));
        alert(`Failed to send: ${error.message}`);
        setInputText(content);
    }
  };

  const activeUser = users.find(u => u.id === selectedUserId);

  const renderChatInterface = () => {
    if (!activeUser) return null;
    return (
      <div className="flex flex-col h-full bg-white">
        {/* Header */}
        <div className="px-4 py-3 border-b border-gray-100 flex justify-between items-center bg-white shadow-sm z-10">
          <div className="flex items-center gap-3">
            <button onClick={() => setSelectedUserId(null)} className="text-gray-600 hover:bg-gray-50 p-1 rounded-full">
              <ArrowLeft size={22} />
            </button>
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold overflow-hidden">
                {activeUser.avatar ? (
                  <img src={activeUser.avatar} alt={activeUser.name} className="w-full h-full object-cover" />
                ) : (
                  activeUser.name?.charAt(0) || <UserIcon size={20} />
                )}
            </div>
            <div>
              <h3 className="font-bold text-gray-900 leading-tight">{activeUser.name || activeUser.email}</h3>
              <div className="flex items-center gap-1.5">
                  <span className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></span>
                  <p className="text-xs text-gray-500 font-medium">
                      {isConnected ? 'Online' : debugStatus}
                  </p>
              </div>
            </div>
          </div>
        </div>

        {/* Messages List */}
        <div className="flex-1 overflow-y-auto p-4 bg-gray-50 space-y-4">
          {loadingMessages ? (
             <div className="flex justify-center items-center h-full text-gray-400">
               <Loader2 className="animate-spin mr-2" /> Syncing...
             </div>
          ) : messages.length === 0 ? (
             <div className="flex flex-col items-center justify-center h-full text-gray-400 text-sm">
               <MessageCircle className="text-gray-300 mb-2" size={32} />
               <p>Start chatting with {activeUser.name}</p>
             </div>
          ) : (
             messages.map((msg) => {
               const isMe = msg.sender_id === currentUser;
               return (
                <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'} animate-fade-in`}>
                  <div className={`max-w-[80%] rounded-2xl px-4 py-2.5 shadow-sm text-sm break-words ${
                    isMe ? 'bg-blue-600 text-white rounded-tr-none' : 'bg-white text-gray-800 rounded-tl-none border border-gray-100'
                  }`}>
                    {msg.content}
                    <div className={`text-[10px] mt-1 text-right ${isMe ? 'text-blue-200' : 'text-gray-400'}`}>
                      {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </div>
               );
             })
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className={`p-3 bg-white border-t border-gray-100 flex items-center gap-3 ${embedded ? '' : 'pb-safe-bottom'}`}>
           <input
             type="text"
             value={inputText}
             onChange={(e) => setInputText(e.target.value)}
             onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
             placeholder="Type a message..."
             className="flex-1 bg-gray-100 text-gray-900 rounded-full pl-4 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
           />
           <button 
             onClick={handleSendMessage}
             disabled={!inputText.trim()}
             className={`p-3 rounded-full text-white transition-all shadow-md ${inputText.trim() ? 'bg-blue-600' : 'bg-gray-300'}`}
           >
             <Send size={20} />
           </button>
        </div>
      </div>
    );
  };

  const renderUserList = () => {
    return (
      <div className="flex flex-col h-full bg-white animate-fade-in">
        {!embedded && (
          <div className="px-4 pt-4 pb-2 bg-white">
            <div className="flex items-center justify-between mb-4">
              <button onClick={onBack} className="text-gray-500 p-1 hover:bg-gray-100 rounded-full">
                <ArrowLeft size={24} />
              </button>
              <h1 className="text-xl font-bold text-gray-900">Chats</h1>
              <div className="w-8"></div>
            </div>
          </div>
        )}

        {/* Search */}
        <div className={`px-4 ${embedded ? 'pt-4' : ''} mb-2`}>
           <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Find students..."
                className="w-full pl-10 pr-4 py-2.5 bg-gray-100 border-none rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
           </div>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto no-scrollbar">
           {loadingUsers && users.length === 0 ? (
              <div className="flex justify-center pt-10 text-gray-400">
                 <Loader2 className="animate-spin" />
              </div>
           ) : users.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                 <p>No users found. Try searching.</p>
                 <p className="text-xs text-gray-400 mt-2">Make sure users are registered in the 'users' table.</p>
              </div>
           ) : (
              <div>
                  {users.map((user) => (
                    <div 
                        key={user.id} 
                        onClick={() => setSelectedUserId(user.id)}
                        className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-50 last:border-0"
                    >
                        <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold border border-white shadow-sm overflow-hidden">
                            {user.avatar ? (
                                <img src={user.avatar} alt="" className="w-full h-full object-cover" />
                            ) : (
                                user.name?.charAt(0) || <UserIcon size={24} />
                            )}
                        </div>
                        <div className="flex-1 min-w-0">
                            <h3 className="font-bold text-gray-900 truncate">{user.name || user.email}</h3>
                            <p className="text-xs text-gray-400">{user.role}</p>
                        </div>
                    </div>
                  ))}
              </div>
           )}
        </div>
      </div>
    );
  };

  return (
    <div className={embedded 
       ? "relative flex flex-col h-[calc(100vh-190px)] bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden" 
       : "fixed inset-0 z-50 flex flex-col h-full bg-white"
    }>
       {selectedUserId ? renderChatInterface() : renderUserList()}
    </div>
  );
};
