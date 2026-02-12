import React, { useState, useEffect } from 'react';
import { Bell, Calendar, ChevronRight, Briefcase, X, CheckCircle2, MessageCircle, AlertCircle, Info, Heart, MessageSquare, Share2, Send } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { UPCOMING_CLASSES, JOBS, ASSIGNMENTS, FEED_POSTS } from '../constants';
import { AppNotification, ViewState, Post } from '../types';

interface HomeProps {
  userName: string;
  notifications: AppNotification[];
  onMarkRead: (id: number) => void;
  onMarkAllRead: () => void;
  onNavigate: (view: ViewState) => void;
}

const NewsModal = ({ post, onClose }: { post: Post; onClose: () => void }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(post.likes);
  const [showComments, setShowComments] = useState(false);
  const [commentCount, setCommentCount] = useState(post.comments);
  const [comments, setComments] = useState<{id: number, text: string, author: string, time: string}[]>([
      { id: 1, text: "This sounds amazing! Can't wait.", author: "Alice", time: "10m ago" },
      { id: 2, text: "Will there be food?", author: "Bob", time: "1h ago" }
  ]); 
  const [newComment, setNewComment] = useState('');

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikeCount(prev => isLiked ? prev - 1 : prev + 1);
  };

  const handleShare = async () => {
     try {
       await navigator.share({
         title: post.eventTitle || 'Campus News',
         text: post.content,
         url: window.location.href
       });
     } catch (err) {
       alert("Link copied to clipboard!");
     }
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if(!newComment.trim()) return;
    
    const comment = {
      id: Date.now(),
      text: newComment,
      author: "You",
      time: "Just now"
    };
    
    setComments([...comments, comment]);
    setCommentCount(prev => prev + 1);
    setNewComment('');
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
       {/* Backdrop */}
       <div className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" onClick={onClose}></div>
       
       <Card className="w-full max-w-sm relative z-10 animate-fade-in p-0 overflow-hidden shadow-2xl flex flex-col max-h-[85vh]">
          {/* Header Image Area */}
          <div className="h-32 bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center text-white p-6 relative flex-shrink-0">
                <button 
                   onClick={onClose}
                   className="absolute top-4 right-4 bg-black/20 hover:bg-black/40 p-1 rounded-full text-white transition-colors"
                >
                  <X size={20} />
                </button>
                <div className="bg-white/20 p-4 rounded-full backdrop-blur-sm">
                   {post.isEvent ? <Calendar size={32} /> : <Briefcase size={32} />}
                </div>
          </div>

          <div className="flex-1 overflow-y-auto p-6 scrollbar-hide">
             {/* Metadata */}
             <div className="flex items-center gap-2 mb-3">
                <Badge variant="blue">{post.isEvent ? 'EVENT' : 'NEWS'}</Badge>
                <span className="text-xs text-gray-500">{post.timeAgo}</span>
             </div>

             {/* Title & Author */}
             <h2 className="text-xl font-bold text-gray-900 mb-2 leading-tight">
                {post.eventTitle || post.author + "'s Announcement"}
             </h2>
             <div className="flex items-center gap-2 mb-5 text-sm text-gray-600 pb-4 border-b border-gray-100">
                 <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-500">
                    {post.author[0]}
                 </div>
                 <div className="flex flex-col">
                    <span className="font-medium text-gray-900 leading-none">{post.author}</span>
                    <span className="text-xs text-gray-400 mt-0.5">Campus Official</span>
                 </div>
             </div>

             {/* Content */}
             <div className="space-y-4 mb-6">
                 <p className="text-gray-800 leading-relaxed text-sm">{post.content}</p>
                 <p className="text-gray-600 leading-relaxed text-sm">
                   Join us for this opportunity to connect with peers and industry leaders. Make sure to bring your student ID and register in advance if required.
                 </p>
             </div>
             
             {/* Tags */}
             {post.tags && (
                <div className="flex gap-2 mb-6 flex-wrap">
                  {post.tags.map(tag => (
                    <span key={tag} className="text-xs font-medium px-2 py-1 bg-gray-100 text-gray-600 rounded-md">#{tag}</span>
                  ))}
                </div>
              )}

             {/* Actions Bar */}
             <div className="flex items-center justify-between border-t border-gray-100 pt-4 mb-2">
                <div className="flex gap-6">
                   <button 
                     onClick={handleLike}
                     className={`flex items-center gap-1.5 text-xs font-medium transition-colors p-1 -ml-1 ${isLiked ? 'text-red-500' : 'text-gray-500 hover:text-red-500'}`}
                   >
                     <Heart size={20} className={isLiked ? "fill-current" : ""} /> 
                     <span className="text-sm">{likeCount}</span>
                   </button>
                   
                   <button 
                     onClick={() => setShowComments(!showComments)}
                     className={`flex items-center gap-1.5 text-xs font-medium transition-colors p-1 ${showComments ? 'text-blue-600' : 'text-gray-500 hover:text-blue-600'}`}
                   >
                     <MessageSquare size={20} className={showComments ? "fill-current" : ""} /> 
                     <span className="text-sm">{commentCount}</span>
                   </button>
                </div>
                <button 
                  onClick={handleShare} 
                  className="text-gray-400 hover:text-gray-900 transition-colors p-1 -mr-1"
                >
                   <Share2 size={20} />
                </button>
             </div>

             {/* Comments Section */}
             {showComments && (
               <div className="animate-fade-in bg-gray-50 -mx-6 -mb-6 p-4 border-t border-gray-100 mt-4">
                  <div className="space-y-3 mb-4 max-h-40 overflow-y-auto pr-1">
                    {comments.map(c => (
                      <div key={c.id} className="flex gap-2 animate-fade-in">
                        <div className="w-7 h-7 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-[10px] font-bold flex-shrink-0">
                          {c.author[0]}
                        </div>
                        <div className="bg-white p-2.5 rounded-2xl rounded-tl-none shadow-sm flex-1 border border-gray-100">
                           <div className="flex justify-between items-baseline mb-0.5">
                             <span className="text-xs font-bold text-gray-900">{c.author}</span>
                             <span className="text-[9px] text-gray-400">{c.time}</span>
                           </div>
                           <p className="text-xs text-gray-700">{c.text}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <form onSubmit={handleAddComment} className="relative">
                    <input 
                      type="text" 
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="Add a comment..."
                      autoFocus
                      className="w-full pl-3 pr-10 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                    />
                    <button 
                      type="submit"
                      disabled={!newComment.trim()}
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg disabled:text-gray-300 disabled:hover:bg-transparent transition-colors"
                    >
                      <Send size={16} />
                    </button>
                  </form>
               </div>
             )}
          </div>

          {!showComments && (
            <div className="p-4 bg-gray-50 border-t border-gray-100 flex-shrink-0">
                <button 
                  onClick={onClose}
                  className="w-full py-3 bg-gray-900 text-white font-bold rounded-xl hover:bg-black transition-colors"
                >
                  Close
                </button>
            </div>
          )}
       </Card>
    </div>
  );
};

export const HomeView: React.FC<HomeProps> = ({ userName, notifications, onMarkRead, onMarkAllRead, onNavigate }) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState<AppNotification | null>(null);
  const [selectedNews, setSelectedNews] = useState<Post | null>(null);
  const [greeting, setGreeting] = useState('Good Morning,');
  const [nextClass, setNextClass] = useState(UPCOMING_CLASSES[0]);
  const [isClassToday, setIsClassToday] = useState(true);

  const unreadCount = notifications.filter(n => n.unread).length;
  const pendingAssignmentsCount = ASSIGNMENTS.filter(a => !a.completed).length;
  
  // Get the latest event or important post for the news section
  const featuredNews = FEED_POSTS.find(p => p.isEvent) || FEED_POSTS[0];

  useEffect(() => {
    // Set greeting based on time
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good Morning,');
    else if (hour < 18) setGreeting('Good Afternoon,');
    else setGreeting('Good Evening,');

    // Find next class
    const findNextClass = () => {
      const now = new Date();
      const currentMinutes = now.getHours() * 60 + now.getMinutes();
      const dayName = now.toLocaleDateString('en-US', { weekday: 'short' });

      const todaysClasses = UPCOMING_CLASSES.filter(c => c.dayOfWeek === dayName);
      
      const parseTime = (timeStr: string) => {
        const [time, modifier] = timeStr.split(' ');
        let [hours, minutes] = time.split(':').map(Number);
        if (modifier === 'PM' && hours < 12) hours += 12;
        if (modifier === 'AM' && hours === 12) hours = 0;
        return hours * 60 + minutes;
      };

      // Find first class that ends after now
      const upcoming = todaysClasses.find(c => parseTime(c.endTime) > currentMinutes);
      
      if (upcoming) {
        setNextClass(upcoming);
        setIsClassToday(true);
      } else {
        // If no class left today, show the next available class in the list (assuming list is sorted/static)
        // For static demo, we just show the first one but indicate it's not "Today" if day doesn't match
        const first = UPCOMING_CLASSES[0];
        setNextClass(first);
        setIsClassToday(first.dayOfWeek === dayName);
      }
    };

    findNextClass();
    const interval = setInterval(findNextClass, 60000);
    return () => clearInterval(interval);
  }, []);

  const handleNotificationClick = (n: AppNotification) => {
    setSelectedNotification(n);
    if (n.unread) {
      onMarkRead(n.id);
    }
  };

  return (
    <div className="pb-24 pt-4 px-4 space-y-6 relative min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-start relative z-20">
        <div className="animate-fade-in">
          <h2 className="text-gray-500 text-sm mb-1">{greeting}</h2>
          <h1 className="text-2xl font-bold text-gray-900">{userName}</h1>
        </div>
        
        <div className="flex gap-2 shrink-0">
          <button 
            onClick={() => onNavigate('MESSAGES')}
            className="p-2 rounded-full border border-gray-100 shadow-sm bg-white text-gray-600 relative hover:bg-gray-50 transition-colors"
          >
            <MessageCircle size={20} />
            <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
          </button>

          <button 
            onClick={() => {
              setShowNotifications(!showNotifications);
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
                        onClick={() => handleNotificationClick(n)}
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

      {/* Notification Detail Modal */}
      {selectedNotification && (
          <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
             <div 
               className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
               onClick={() => setSelectedNotification(null)}
             ></div>
             <Card className="w-full max-w-sm relative z-10 animate-fade-in p-6 shadow-2xl">
                <button 
                  onClick={() => setSelectedNotification(null)}
                  className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition-colors"
                >
                  <X size={20} />
                </button>
                
                <div className="flex flex-col items-center text-center mb-6">
                  <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ${
                    selectedNotification.type === 'alert' ? 'bg-red-100 text-red-600' :
                    selectedNotification.type === 'success' ? 'bg-green-100 text-green-600' :
                    'bg-blue-100 text-blue-600'
                  }`}>
                    {selectedNotification.type === 'alert' ? <AlertCircle size={32} /> :
                     selectedNotification.type === 'success' ? <CheckCircle2 size={32} /> :
                     <Info size={32} />}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-1">{selectedNotification.title}</h3>
                  <span className="text-sm text-gray-400">{selectedNotification.time}</span>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-xl mb-6">
                   <p className="text-gray-700 leading-relaxed text-sm">
                     {selectedNotification.message}
                   </p>
                </div>
                
                <button 
                  onClick={() => setSelectedNotification(null)}
                  className="w-full py-3 bg-gray-900 text-white font-bold rounded-xl hover:bg-black transition-colors"
                >
                  Close
                </button>
             </Card>
          </div>
      )}

      {/* News Detail Modal */}
      {selectedNews && (
        <NewsModal post={selectedNews} onClose={() => setSelectedNews(null)} />
      )}

      {/* Rest of the content */}
      <div className={`transition-opacity duration-200 ${showNotifications ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-4">
        <Card 
          onClick={() => onNavigate('EARNINGS')}
          className="bg-gradient-to-br from-violet-600 to-indigo-600 border-none text-white p-5 shadow-lg shadow-indigo-200 cursor-pointer hover:shadow-xl transition-shadow"
        >
          <h3 className="text-3xl font-bold mb-1">$150</h3>
          <p className="text-indigo-100 text-sm">Earned this week</p>
        </Card>
        <Card 
          onClick={() => onNavigate('EDUCATION')}
          className="bg-gradient-to-br from-amber-500 to-orange-500 border-none text-white p-5 shadow-lg shadow-orange-200 cursor-pointer hover:shadow-xl transition-shadow"
        >
          <h3 className="text-3xl font-bold mb-1">{pendingAssignmentsCount}</h3>
          <p className="text-orange-100 text-sm">Assignments due</p>
        </Card>
      </div>

      {/* Up Next */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-gray-900">Up Next</h3>
          <button 
            onClick={() => onNavigate('EDUCATION')}
            className="text-blue-600 text-sm font-medium hover:text-blue-700 transition-colors"
          >
            See Calendar
          </button>
        </div>
        
        <Card className="flex items-center gap-4 p-4">
          <div className="w-1 h-12 bg-indigo-600 rounded-full"></div>
          <div className="flex-1">
            <h4 className="font-bold text-gray-900">{nextClass.title}</h4>
            <div className="flex items-center text-gray-500 text-sm mt-1 space-x-2">
              <span className="flex items-center"><Calendar size={14} className="mr-1"/> {nextClass.startTime}</span>
              <span>•</span>
              <span>{nextClass.location}</span>
            </div>
          </div>
          <Badge variant={isClassToday ? 'blue' : 'gray'}>
             {isClassToday ? 'Now' : nextClass.dayOfWeek}
          </Badge>
        </Card>
      </div>

      {/* For You (Jobs) */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-gray-900">For You</h3>
          <button onClick={() => onNavigate('JOBS')} className="text-blue-600 text-sm font-medium hover:text-blue-700 transition-colors">See All Jobs</button>
        </div>
        
        <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
          {JOBS.slice(0, 2).map(job => (
            <Card 
              key={job.id} 
              className="min-w-[240px] p-4 flex-shrink-0"
              onClick={() => onNavigate('JOBS')}
            >
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${job.color || 'bg-blue-100 text-blue-600'}`}>
                <Briefcase size={20} />
              </div>
              <h4 className="font-bold text-gray-900 mb-1">{job.title}</h4>
              <p className="text-sm text-gray-500 mb-3">{job.company}</p>
              <div className="flex items-center justify-between">
                <Badge variant="gray">{job.type}</Badge>
                <span className="text-sm font-semibold text-green-600">{job.rate}</span>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Campus News */}
      <div>
         <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-gray-900">Campus News</h3>
        </div>
        
        <Card 
          className="p-4 border-l-4 border-l-blue-600 cursor-pointer active:scale-[0.99] transition-transform hover:shadow-md"
          onClick={() => setSelectedNews(featuredNews)}
        >
          <div className="flex justify-between items-start mb-2">
             <Badge variant="blue">{featuredNews.isEvent ? 'EVENT' : 'NEWS'}</Badge>
             <span className="text-xs text-gray-400">{featuredNews.timeAgo}</span>
          </div>
          <h4 className="font-bold text-gray-900 text-lg mb-1">{featuredNews.eventTitle || featuredNews.content.substring(0, 30)}</h4>
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">{featuredNews.content}</p>
          <button className="text-blue-600 text-sm font-medium flex items-center">
            Read More <ChevronRight size={16} />
          </button>
        </Card>
      </div>
      </div>
    </div>
  );
};
