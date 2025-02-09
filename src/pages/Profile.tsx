import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { User, Lock, Bell, Upload, AlertCircle } from 'lucide-react';
import clsx from 'clsx';
import { useSupabase } from '../context/SupabaseContext';
import { supabase } from '../lib/supabase';

export const Profile = () => {
  const { user, updateProfile } = useSupabase();
  const [username, setUsername] = useState(user?.email?.split('@')[0] || '');
  const [avatarUrl, setAvatarUrl] = useState(`https://ui-avatars.com/api/?name=${username || 'User'}&background=random&color=fff&bold=true&size=128`);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [notifications, setNotifications] = React.useState({
    newReleases: true,
    recommendations: true,
    watchlistUpdates: false
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAvatarChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setLoading(true);
      setError('');
      
      // Check if bucket exists, if not create it
      const { data: buckets } = await supabase.storage.listBuckets();
      const avatarsBucket = buckets?.find(b => b.name === 'avatars');
      
      if (!avatarsBucket) {
        const { error: createError } = await supabase.storage.createBucket('avatars', {
          public: true,
          fileSizeLimit: 1024 * 1024 * 2 // 2MB
        });
        if (createError) throw createError;
      }

      // Upload file to Supabase Storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${user?.id}-${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      // First, try to delete any existing avatar
      if (avatarUrl && !avatarUrl.includes('ui-avatars.com')) {
        const oldFileName = avatarUrl.split('/').pop();
        if (oldFileName) {
          await supabase.storage
            .from('avatars')
            .remove([oldFileName]);
        }
      }

      const { error: uploadError, data } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, { 
          upsert: true,
          contentType: file.type
        });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      // Update profile with new avatar URL
      await updateProfile({ avatar_url: publicUrl });
      setAvatarUrl(publicUrl);
      
    } catch (err) {
      console.error('Avatar upload error:', err);
      setError(err instanceof Error ? err.message : 'Error updating avatar');
    } finally {
      setLoading(false);
    }
  };

  const handleUsernameUpdate = async () => {
    try {
      setLoading(true);
      setError('');
      await updateProfile({ username });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error updating username');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = () => {
    // Placeholder for password change functionality
    console.log('Password change clicked');
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="text-3xl font-bold text-white mb-8">Profile Settings</h1>

      {error && (
        <div className="mb-6 p-3 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center gap-2 text-red-500">
          <AlertCircle className="w-5 h-5" />
          <span>{error}</span>
        </div>
      )}

      {/* Avatar Section */}
      <div className="bg-white/5 rounded-lg p-6 mb-6">
        <div className="flex items-center gap-6">
          <div className="relative group">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="w-24 h-24 rounded-full overflow-hidden"
            >
              <img
                src={avatarUrl}
                alt={username}
                className="w-full h-full object-cover"
              />
            </motion.div>
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={loading}
              className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-full disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
              ) : (
                <Upload className="w-6 h-6 text-white" />
              )}
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleAvatarChange}
              accept="image/*"
              className="hidden"
              disabled={loading}
            />
          </div>
          <div>
            <h2 className="text-xl text-white font-semibold">{username || user?.email?.split('@')[0]}</h2>
            <p className="text-white/60">Change your profile picture</p>
          </div>
        </div>
      </div>

      {/* Username Section */}
      <div className="bg-white/5 rounded-lg p-6 mb-6">
        <div className="flex items-center gap-4 mb-4">
          <User className="w-6 h-6 text-white/60" />
          <h2 className="text-xl text-white">Username</h2>
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="flex-1 bg-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-white/20"
            disabled={loading}
          />
          <button
            onClick={handleUsernameUpdate}
            disabled={loading}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
            ) : (
              'Save'
            )}
          </button>
        </div>
      </div>

      {/* Password Section */}
      <div className="bg-white/5 rounded-lg p-6 mb-6">
        <div className="flex items-center gap-4 mb-4">
          <Lock className="w-6 h-6 text-white/60" />
          <h2 className="text-xl text-white">Password</h2>
        </div>
        <button
          onClick={handlePasswordChange}
          disabled={loading}
          className="w-full bg-white/10 rounded-lg px-4 py-2 text-white hover:bg-white/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Change Password
        </button>
      </div>

      {/* Notifications Section */}
      <div className="bg-white/5 rounded-lg p-6">
        <div className="flex items-center gap-4 mb-4">
          <Bell className="w-6 h-6 text-white/60" />
          <h2 className="text-xl text-white">Notifications</h2>
        </div>
        <div className="space-y-4">
          {Object.entries(notifications).map(([key, value]) => (
            <div key={key} className="flex items-center justify-between">
              <label className="text-white/80">
                {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
              </label>
              <button
                onClick={() => setNotifications(prev => ({ ...prev, [key]: !value }))}
                disabled={loading}
                className={clsx(
                  'w-12 h-6 rounded-full relative transition-colors',
                  value ? 'bg-blue-500' : 'bg-white/20'
                )}
              >
                <motion.div
                  animate={{ x: value ? 24 : 2 }}
                  className="absolute top-1 left-0 w-4 h-4 bg-white rounded-full"
                />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}; 