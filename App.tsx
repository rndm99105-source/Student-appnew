import React, { useState, useEffect } from 'react';
import { BottomNav } from './components/BottomNav';
import { HomeView } from './views/Home';
import { EducationView } from './views/Education';
import { JobsView } from './views/Jobs';
import { CommunityView } from './views/Community';
import { ProfileView } from './views/Profile';
import { MessagesView } from './views/Messages';
import { EarningsView } from './views/Earnings';
import { AuthView } from './views/Auth';
import { ViewState, AppNotification } from './types';
import { supabase } from './lib/supabase';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [currentView, setCurrentView] = useState<ViewState>('HOME');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setCurrentUser({
          uid: session.user.id,
          displayName: session.user.user_metadata.full_name || session.user.email,
          email: session.user.email,
          photoURL: session.user.user_metadata.avatar_url || '',
          role: session.user.user_metadata.role || 'Student'
        });
      }
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setCurrentUser({
           uid: session.user.id,
           displayName: session.user.user_metadata.full_name || session.user.email,
           email: session.user.email,
           photoURL: session.user.user_metadata.avatar_url || '',
           role: session.user.user_metadata.role || 'Student'
        });
      } else {
        setCurrentUser(null);
        setCurrentView('AUTH');
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // Centralized Notifications State
  const [notifications, setNotifications] = useState<AppNotification[]>([
    { id: 1, title: "Assignment Due", message: "History Essay is due tomorrow at 11:59 PM", time: "2h ago", unread: true, type: 'alert' },
    { id: 2, title: "New Comment", message: "Sarah replied to your post about Econ 101.", time: "10m ago", unread: true, type: 'info' },
    { id: 3, title: "Class Cancelled", message: "Prof. Smith cancelled Advanced Calculus today", time: "5h ago", unread: true, type: 'alert' },
    { id: 4, title: "Event Starting", message: "Hackathon 2024 starts in 1 hour.", time: "1h ago", unread: false, type: 'success' },
    { id: 5, title: "New Grade Posted", message: "Your Physics Lab grade has been updated: A-", time: "1d ago", unread: false, type: 'success' },
    { id: 6, title: "Club Invite", message: "Tech Club invited you to join 'AI Workshop'.", time: "3h ago", unread: true, type: 'info' },
    { id: 7, title: "Library Overdue", message: "Return 'Introduction to Psychology' by tomorrow", time: "2d ago", unread: false, type: 'alert' },
  ]);

  const markRead = (id: number) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, unread: false } : n));
  };

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
  };

  const renderView = () => {
    // Force Auth view if not logged in
    if (!currentUser && !loading) {
        return <AuthView onLogin={() => setCurrentView('HOME')} />;
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    switch (currentView) {
      case 'HOME':
        return (
          <HomeView 
            userName={currentUser?.displayName || 'Student'} 
            notifications={notifications}
            onMarkRead={markRead}
            onMarkAllRead={markAllRead}
            onNavigate={setCurrentView}
          />
        );
      case 'EDUCATION':
        return <EducationView />;
      case 'JOBS':
        return <JobsView />;
      case 'COMMUNITY':
        return (
          <CommunityView 
            notifications={notifications}
            onMarkRead={markRead}
            onMarkAllRead={markAllRead}
            onNavigate={setCurrentView}
          />
        );
      case 'PROFILE':
        return (
          <ProfileView user={currentUser} />
        );
      case 'MESSAGES':
        return (
          <MessagesView onBack={() => setCurrentView('HOME')} />
        );
      case 'EARNINGS':
        return (
          <EarningsView onBack={() => setCurrentView('HOME')} />
        );
      case 'AUTH':
        return <AuthView onLogin={() => setCurrentView('HOME')} />;
      default:
        return (
          <HomeView 
            userName={currentUser?.displayName || 'Student'} 
            notifications={notifications}
            onMarkRead={markRead}
            onMarkAllRead={markAllRead}
            onNavigate={setCurrentView}
          />
        );
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen font-sans text-gray-900 mx-auto max-w-md shadow-2xl overflow-hidden relative">
      <div className="h-full overflow-y-auto no-scrollbar bg-gray-50/50">
        {renderView()}
      </div>
      
      {currentUser && currentView !== 'MESSAGES' && currentView !== 'EARNINGS' && currentView !== 'AUTH' && (
        <BottomNav currentView={currentView} onNavigate={setCurrentView} />
      )}
    </div>
  );
};

export default App;
