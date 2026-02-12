import React, { useState } from 'react';
import { User, Briefcase, GraduationCap, Building2, UserCircle, AlertCircle, Loader2 } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { supabase } from '../lib/supabase';

interface AuthProps {
  onLogin: () => void;
}

export const AuthView: React.FC<AuthProps> = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(false);
  const [role, setRole] = useState<string>('Student');
  
  // Form State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        // Handle Login
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (signInError) throw signInError;
      } else {
        // Handle Signup
        if (!fullName) {
          throw new Error("Full Name is required");
        }
        
        const { data: authData, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName,
              role: role,
            },
          },
        });

        if (signUpError) throw signUpError;

        if (authData.user) {
          // Changed from insert to upsert to prevent errors if row exists
          const { error: profileError } = await supabase
            .from('users')
            .upsert([
              { 
                id: authData.user.id, 
                name: fullName, 
                email: email, 
                role: role,
                created_at: new Date().toISOString()
              }
            ]);
            
          if (profileError) {
             console.error("Error creating user profile:", profileError);
             // If this is the specific trigger error (42703), warn the user clearly
             if (profileError.code === '42703') {
                alert("Database Error: A misconfigured Trigger is preventing profile creation. Please run the SQL cleanup script provided in the chat.");
             }
          }
        }
      }

      onLogin(); // Optional callback
    } catch (err: any) {
      console.error(err);
      setError(err.message || "An error occurred during authentication");
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setError('');
  };

  return (
    <div className="min-h-screen bg-white p-6 flex flex-col">
      <div className="flex-1 flex flex-col justify-center max-w-md mx-auto w-full">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {isLogin ? 'Welcome Back' : 'Create Account'}
        </h1>
        <p className="text-gray-500 mb-8">
          {isLogin ? 'Sign in to continue' : 'Join the community today'}
        </p>

        {!isLogin && (
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">I am a:</label>
            <div className="grid grid-cols-2 gap-3">
               <RoleButton 
                  icon={GraduationCap} 
                  label="Student" 
                  selected={role === 'Student'} 
                  onClick={() => setRole('Student')} 
               />
               <RoleButton 
                  icon={User} 
                  label="Pupil" 
                  selected={role === 'Pupil'} 
                  onClick={() => setRole('Pupil')} 
               />
               <RoleButton 
                  icon={Building2} 
                  label="University" 
                  selected={role === 'University'} 
                  onClick={() => setRole('University')} 
               />
               <RoleButton 
                  icon={Briefcase} 
                  label="Company" 
                  selected={role === 'Company'} 
                  onClick={() => setRole('Company')} 
               />
            </div>
          </div>
        )}

        <form className="space-y-4" onSubmit={handleSubmit}>
          {error && (
            <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg flex items-center gap-2">
              <AlertCircle size={16} />
              {error}
            </div>
          )}

          <div className="space-y-4">
             {!isLogin && (
               <div className="relative">
                  <UserCircle className="absolute left-3 top-3.5 text-gray-400" size={20} />
                  <input 
                    type="text" 
                    placeholder="Full Name" 
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-transparent rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  />
               </div>
             )}
             <div className="relative">
                 <svg className="absolute left-3 top-3.5 text-gray-400 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                <input 
                  type="email" 
                  placeholder="Email" 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-transparent rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                />
             </div>
             <div className="relative">
                <svg className="absolute left-3 top-3.5 text-gray-400 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
                <input 
                  type="password" 
                  placeholder="Password" 
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-transparent rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                />
             </div>
          </div>

          <Button 
            type="submit" 
            fullWidth 
            size="lg" 
            className="mt-6 flex items-center justify-center gap-2"
            disabled={loading}
          >
            {loading ? <Loader2 className="animate-spin" /> : (isLogin ? 'Sign In' : 'Create Account')}
            {!loading && <ArrowRight />}
          </Button>
        </form>

        <p className="text-center mt-6 text-gray-500 text-sm">
          {isLogin ? "Don't have an account?" : "Already have an account?"} 
          <button onClick={toggleMode} className="ml-1 text-blue-600 font-bold hover:underline">
            {isLogin ? 'Create Account' : 'Sign In'}
          </button>
        </p>
      </div>
    </div>
  );
};

const RoleButton = ({ icon: Icon, label, selected, onClick }: any) => (
  <button 
    type="button"
    onClick={onClick}
    className={`flex items-center gap-3 p-4 rounded-xl border transition-all ${selected ? 'bg-blue-50 border-blue-500 ring-1 ring-blue-500' : 'bg-gray-50 border-transparent hover:bg-gray-100'}`}
  >
    <Icon className={selected ? 'text-blue-600' : 'text-gray-500'} size={20} />
    <span className={`font-medium ${selected ? 'text-blue-700' : 'text-gray-600'}`}>{label}</span>
  </button>
);

const ArrowRight = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
);
