import React, { useState, useEffect, useRef } from 'react';
import { User, Save, Loader2, AlertCircle, LogOut, Camera } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Button } from '../components/ui/Button';

interface ProfileProps {
  user: any;
}

export const ProfileView: React.FC<ProfileProps> = ({ user }) => {
  const [name, setName] = useState(user.displayName || '');
  const [role, setRole] = useState('Student');
  const [avatar, setAvatar] = useState(user.photoURL || '');
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!user.uid) {
          setFetching(false);
          return;
      }
      try {
        const { data, error } = await supabase
          .from('users')
          .select('*')
          .eq('id', user.uid)
          .single();

        if (error && error.code !== 'PGRST116') {
             // PGRST116 is "Row not found", which is expected if we haven't created the profile yet
             console.error("Error fetching profile:", error);
        }

        if (data) {
          if (data.role) setRole(data.role);
          if (data.avatar) setAvatar(data.avatar);
          if (data.name) setName(data.name);
        } else {
          // Fallback to metadata if DB record doesn't exist
          if (user.role) setRole(user.role);
        }
      } catch (err) {
        console.log("Error fetching:", err);
      } finally {
        setFetching(false);
      }
    };
    fetchUserData();
  }, [user]);

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      if (!event.target.files || event.target.files.length === 0) {
        return;
      }
      
      setUploading(true);
      setMessage(null);
      
      const file = event.target.files[0];
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.uid}-${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;

      // Upload image to 'avatars' bucket
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, { upsert: true });

      if (uploadError) {
        throw uploadError;
      }

      // Get public URL
      const { data } = supabase.storage.from('avatars').getPublicUrl(filePath);
      
      if (data) {
         setAvatar(data.publicUrl);
         setMessage({ type: 'success', text: 'Photo uploaded! Click "Save Changes" to apply.' });
      }
    } catch (error: any) {
      console.error("Error uploading avatar:", error);
      setMessage({ type: 'error', text: 'Failed to upload photo. Ensure "avatars" bucket exists.' });
    } finally {
      setUploading(false);
      // Reset input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleSave = async () => {
    setLoading(true);
    setMessage(null);
    try {
      if (user.uid) {
        const updates = {
          name: name,
          role: role,
          avatar: avatar,
          updated_at: new Date().toISOString()
        };

        const { error } = await supabase
          .from('users')
          .upsert({ id: user.uid, ...updates });

        if (error) throw error;
      }
      
      // Update local user object for immediate UI feedback
      user.displayName = name;
      user.photoURL = avatar;
      
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
      
    } catch (err: any) {
      console.error(err);
      setMessage({ type: 'error', text: 'Failed to update profile.' });
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      // Auth state change listener in App.tsx will handle the redirect
    } catch (err) {
      console.error("Error signing out:", err);
      setMessage({ type: 'error', text: 'Failed to sign out.' });
    }
  };

  if (fetching) {
     return (
        <div className="h-full flex flex-col items-center justify-center text-gray-400">
            <Loader2 className="animate-spin mb-2" />
            <p>Loading profile...</p>
        </div>
     );
  }

  return (
    <div className="pb-24 pt-4 px-4 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Edit Profile</h1>
      </div>

      <div className="flex flex-col items-center py-4">
        <div className="relative mb-4 group">
            <div 
              onClick={() => !uploading && fileInputRef.current?.click()}
              className="w-28 h-28 rounded-full bg-gray-100 overflow-hidden border-4 border-white shadow-lg flex items-center justify-center relative cursor-pointer"
            >
              {avatar ? (
                <img src={avatar} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <User size={48} className="text-gray-300" />
              )}
              
              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Camera size={28} className="text-white opacity-90" />
              </div>

               {/* Uploading Overlay */}
              {uploading && (
                <div className="absolute inset-0 bg-white/80 flex items-center justify-center z-10">
                    <Loader2 className="animate-spin text-blue-600" size={24} />
                </div>
              )}
            </div>
            
            {/* Edit Badge */}
            <button 
                onClick={() => !uploading && fileInputRef.current?.click()}
                className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full shadow-md hover:bg-blue-700 transition-colors z-20"
                disabled={uploading}
            >
                <Camera size={16} />
            </button>
            
            <input 
                type="file" 
                ref={fileInputRef}
                onChange={handleAvatarUpload}
                className="hidden"
                accept="image/*"
                disabled={uploading}
            />
        </div>
        <p className="text-gray-500 font-medium">{user.email}</p>
      </div>

      <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 space-y-5">
        
        {message && (
          <div className={`p-3 rounded-xl text-sm flex items-start gap-2 ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
            <AlertCircle size={16} className="mt-0.5 flex-shrink-0" />
            <span>{message.text}</span>
          </div>
        )}

        <div>
          <label className="block text-sm font-bold text-gray-700 mb-1.5">Full Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-3 bg-gray-50 border border-transparent rounded-xl focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all"
            placeholder="Enter your full name"
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-700 mb-1.5">Role</label>
          <div className="grid grid-cols-2 gap-2">
            {['Student', 'Pupil', 'University', 'Company'].map((r) => (
                <button
                    key={r}
                    type="button"
                    onClick={() => setRole(r)}
                    className={`py-2 px-3 rounded-lg text-sm font-medium border transition-all ${role === r ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-200' : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'}`}
                >
                    {r}
                </button>
            ))}
          </div>
        </div>

        <div className="pt-2 space-y-3">
            <Button
            onClick={handleSave}
            disabled={loading}
            fullWidth
            size="lg"
            className="flex items-center justify-center gap-2"
            >
            {loading ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
            Save Changes
            </Button>

            <button
                onClick={handleSignOut}
                className="w-full py-3 flex items-center justify-center gap-2 text-red-600 font-medium hover:bg-red-50 rounded-xl transition-colors"
            >
                <LogOut size={20} />
                Sign Out
            </button>
        </div>
      </div>
    </div>
  );
};
