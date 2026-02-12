import React, { useState } from 'react';
import { Search, Bell, MessageSquare, Share2, Heart, Calendar, MapPin, Plus, Users, Clock, X, CheckCircle2 } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { FEED_POSTS, EVENTS } from '../constants';
import { AppNotification, ViewState } from '../types';
import { MessagesView } from './Messages';

interface CommunityProps {
  notifications: AppNotification[];
  onMarkRead: (id: number) => void;
  onMarkAllRead: () => void;
  onNavigate: (view: ViewState) => void;
}

export const CommunityView: React.FC<CommunityProps> = ({ notifications, onMarkRead, onMarkAllRead, onNavigate }) => {
  const [activeTab, setActiveTab] = useState<'Feed' | 'Events' | 'Clubs' | 'Messages'>('Feed');
  const [showSearch, setShowSearch] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const unreadCount = notifications.filter(n => n.unread).length;

  return (
    <div className="pb-24 pt-4 px-4 space-y-6 relative min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center relative z-20">
        {!showSearch ? (
           <h1 className="text-2xl font-bold text-gray-900 animate-fade-in">Community</h1>
        ) : (
           <div className="flex-1 mr-3 animate-fade-in">
             <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input 
                  type="text"
                  placeholder={`Search ${activeTab.toLowerCase()}...`}
                  autoFocus
                  className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
                />
             </div>
          </div>
        )}
        
        <div className="flex gap-2 shrink-0">
          <button 
            onClick={() => {
                setShowSearch(!showSearch);
                setShowNotifications(false);
            }}
            className={`p-2 rounded-full border shadow-sm transition-all duration-200 ${showSearch ? 'bg-gray-900 text-white border-gray-900' : 'bg-white border-gray-100 text-gray-600'}`}
          >
            {showSearch ? <X size={20} /> : <Search size={20} />}
          </button>

          <button 
            onClick={() => {
                setShowNotifications(!showNotifications);
                setShowSearch(false);
            }}
            className={`p-2 rounded-full border shadow-sm transition-all duration-200 relative ${showNotifications ? 'bg-blue-50 border-blue-200 text-blue-600' : 'bg-white border-gray-100 text-gray-600'}`}
          >
            <Bell size={20} />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-2 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
            )}
          </button>
        </div>
      </div>

       {/* Notifications Panel */}
       {showNotifications && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setShowNotifications(false)}></div>
          <div className="absolute top-16 right-4 left-4 z-20 animate-fade-in">
            <Card className="shadow-xl border-gray-100 p-0 overflow-hidden">
               <div className="p-3 bg-gray-50/80 border-b border-gray-100 flex justify-between items-center backdrop-blur-sm">
                 <h3 className="font-bold text-sm text-gray-900">Notifications {unreadCount > 0 && `(${unreadCount})`}</h3>
                 <button 
                   onClick={onMarkAllRead}
                   className="text-xs text-blue-600 font-medium hover:text-blue-700 flex items-center gap-1"
                 >
                   <CheckCircle2 size={12} />
                   Mark all read
                 </button>
               </div>
               <div className="max-h-[320px] overflow-y-auto">
                 {notifications.length === 0 ? (
                    <div className="p-6 text-center text-gray-400 text-sm">No notifications</div>
                 ) : (
                    notifications.map((n) => (
                      <div 
                        key={n.id} 
                        onClick={() => onMarkRead(n.id)}
                        className={`p-3 border-b border-gray-50 last:border-0 transition-colors cursor-pointer group ${n.unread ? 'bg-blue-50/40 hover:bg-blue-50/70' : 'bg-white hover:bg-gray-50'}`}
                      >
                        <div className="flex justify-between items-start mb-1">
                          <h4 className={`text-sm ${n.unread ? 'font-bold text-gray-900' : 'font-medium text-gray-700'}`}>{n.title}</h4>
                          <span className="text-[10px] text-gray-400 whitespace-nowrap ml-2">{n.time}</span>
                        </div>
                        <p className={`text-xs leading-relaxed ${n.unread ? 'text-gray-800' : 'text-gray-500'}`}>{n.message}</p>
                      </div>
                    ))
                 )}
               </div>
               <button className="w-full py-2.5 text-center text-xs font-medium text-gray-500 hover:bg-gray-50 hover:text-gray-900 border-t border-gray-50 transition-colors">
                  View All Notifications
               </button>
            </Card>
          </div>
        </>
      )}

      <div className={`transition-opacity duration-200 space-y-6 ${showNotifications ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}>
      
      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
        {['Feed', 'Events', 'Clubs', 'Messages'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab as any)}
            className={`px-5 py-2 rounded-full text-sm font-medium border transition-colors flex-shrink-0 ${activeTab === tab ? 'bg-gray-900 text-white border-gray-900' : 'bg-white text-gray-600 border-gray-200'}`}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === 'Feed' && (
        <div className="space-y-6 animate-fade-in">
          {/* Announcements */}
          <div>
            <h3 className="font-bold text-gray-900 mb-3">Announcements</h3>
            <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
              <Card className="min-w-[280px] bg-blue-600 text-white border-none p-5">
                <div className="flex justify-between mb-2">
                  <Badge className="bg-white/20 text-white">EVENT</Badge>
                  <span className="text-xs text-blue-100">2 days ago</span>
                </div>
                <h3 className="font-bold text-lg mb-1">Campus Career Fair 2024</h3>
                <p className="text-sm text-blue-100 mb-2">Posted by Career Center</p>
              </Card>
               <Card className="min-w-[280px] bg-indigo-600 text-white border-none p-5">
                <div className="flex justify-between mb-2">
                  <Badge className="bg-white/20 text-white">NEWS</Badge>
                  <span className="text-xs text-indigo-100">5h ago</span>
                </div>
                <h3 className="font-bold text-lg mb-1">Library Maintenance</h3>
                <p className="text-sm text-indigo-100 mb-2">Posted by Admin</p>
              </Card>
            </div>
          </div>

          {/* Discussions */}
          <div className="space-y-4">
             <div className="flex justify-between items-center">
              <h3 className="font-bold text-gray-900">Student Discussions</h3>
              <button className="text-blue-600 text-sm font-medium">Latest</button>
            </div>

            {FEED_POSTS.filter(p => !p.isEvent).map(post => (
              <Card key={post.id} className="p-4">
                <div className="flex gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 font-bold">
                     {post.author.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-gray-900">{post.author}</h4>
                    <span className="text-xs text-gray-400">{post.timeAgo}</span>
                  </div>
                </div>
                
                <p className="text-gray-800 text-sm mb-3 leading-relaxed">{post.content}</p>
                
                <div className="flex gap-2 mb-4">
                  {post.tags.map(tag => (
                    <span key={tag} className="text-blue-600 text-xs font-medium">#{tag}</span>
                  ))}
                </div>

                <div className="flex items-center gap-6 text-gray-400 pt-3 border-t border-gray-50">
                  <button className="flex items-center gap-1.5 text-xs font-medium hover:text-red-500 transition-colors">
                    <Heart size={16} /> {post.likes}
                  </button>
                  <button className="flex items-center gap-1.5 text-xs font-medium hover:text-blue-500 transition-colors">
                    <MessageSquare size={16} /> {post.comments}
                  </button>
                  <button className="flex items-center gap-1.5 text-xs font-medium ml-auto">
                    <Share2 size={16} />
                  </button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'Events' && (
        <div className="space-y-4 animate-fade-in">
          <div className="flex justify-between items-center mb-2">
             <h3 className="font-bold text-gray-900">Upcoming Events</h3>
          </div>
          {EVENTS.map(event => (
            <Card key={event.id} className="p-0 flex flex-col sm:flex-row">
               <div className="bg-indigo-50 p-6 flex flex-col items-center justify-center min-w-[100px] border-b sm:border-b-0 sm:border-r border-indigo-100">
                  <span className="text-indigo-600 text-xs font-bold uppercase tracking-wider">{event.date.split(' ')[0]}</span>
                  <span className="text-gray-900 text-2xl font-bold">{event.date.split(' ')[1]}</span>
               </div>
               <div className="p-4 flex-1">
                 <h3 className="font-bold text-gray-900 mb-1">{event.title}</h3>
                 <div className="space-y-1 mb-3">
                   <div className="flex items-center text-gray-500 text-sm">
                      <Clock size={14} className="mr-2" /> {event.time}
                   </div>
                    <div className="flex items-center text-gray-500 text-sm">
                      <MapPin size={14} className="mr-2" /> {event.location}
                   </div>
                 </div>
                 <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-400 italic">By {event.organizer}</span>
                    <Badge variant="purple" className="flex items-center gap-1">
                      <Users size={12} /> {event.attendees} going
                    </Badge>
                 </div>
               </div>
            </Card>
          ))}
        </div>
      )}

      {/* Embedded Messages Tab */}
      {activeTab === 'Messages' && (
         <div className="animate-fade-in">
            <MessagesView embedded onBack={() => setActiveTab('Feed')} />
         </div>
      )}

      {/* Placeholder for Clubs Tab */}
      {activeTab === 'Clubs' && (
          <div className="flex flex-col items-center justify-center py-12 text-gray-400 animate-fade-in">
             <Users size={48} className="mb-4 text-gray-300" />
             <p className="font-medium">Club features coming soon!</p>
          </div>
      )}

       {/* Floating Action Button */}
       {activeTab === 'Feed' && (
         <div className="fixed bottom-20 right-4">
            <button className="w-14 h-14 bg-blue-600 rounded-full shadow-lg shadow-blue-300 flex items-center justify-center text-white active:scale-95 transition-transform hover:bg-blue-700">
              <Plus size={28} />
            </button>
         </div>
       )}
      </div>
    </div>
  );
};
