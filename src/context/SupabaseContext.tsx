import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

interface SupabaseContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, username: string) => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (data: { username?: string; avatar_url?: string }) => Promise<void>;
  favorites: number[];
  addToFavorites: (movieId: number) => Promise<void>;
  removeFromFavorites: (movieId: number) => Promise<void>;
  isFavorite: (movieId: number) => boolean;
  avatarUrl: string | null;
}

const SupabaseContext = createContext<SupabaseContextType | undefined>(undefined);

export const useSupabase = () => {
  const context = useContext(SupabaseContext);
  if (!context) {
    throw new Error('useSupabase must be used within a SupabaseProvider');
  }
  return context;
};

export const SupabaseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  // Fetch favorites when user changes
  useEffect(() => {
    const fetchFavorites = async () => {
      if (user) {
        const { data, error } = await supabase
          .from('favorites')
          .select('movie_id')
          .eq('user_id', user.id);

        if (!error && data) {
          setFavorites(data.map(fav => fav.movie_id));
        }
      } else {
        setFavorites([]);
      }
    };

    fetchFavorites();
  }, [user]);

  useEffect(() => {
    // Check active sessions and subscribe to auth changes
    const initializeAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      if (session?.user) {
        const { data } = await supabase
          .from('profiles')
          .select('avatar_url')
          .eq('id', session.user.id)
          .single();
        setAvatarUrl(data?.avatar_url ?? null);
      }
      setLoading(false);
    };

    initializeAuth();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        const { data } = await supabase
          .from('profiles')
          .select('avatar_url')
          .eq('id', session.user.id)
          .single();
        setAvatarUrl(data?.avatar_url ?? null);
      } else {
        setAvatarUrl(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
  };

  const signUp = async (email: string, password: string, username: string) => {
    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
    });
    if (signUpError) throw signUpError;

    if (data.user) {
      // Add a small delay to allow the session to be established
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Create profile after successful signup - ignore error as it's not critical
      try {
        await supabase
          .from('profiles')
          .insert([{ id: data.user.id, username }]);
      } catch (error) {
        // Silently handle the profile creation error
        console.debug('Profile creation delayed - will be created on next login');
      }
    }
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  };

  const updateProfile = async (data: { username?: string; avatar_url?: string }) => {
    if (!user) throw new Error('No user logged in');

    const { error } = await supabase
      .from('profiles')
      .update(data)
      .eq('id', user.id);

    if (error) throw error;
    
    if (data.avatar_url) {
      setAvatarUrl(data.avatar_url);
    }
  };

  const addToFavorites = async (movieId: number) => {
    if (!user) throw new Error('No user logged in');

    const { error } = await supabase
      .from('favorites')
      .insert([{ user_id: user.id, movie_id: movieId }]);

    if (error) {
      if (error.code === '23505') { // Unique violation error code
        return; // Movie is already in favorites
      }
      throw error;
    }

    setFavorites(prev => [...prev, movieId]);
  };

  const removeFromFavorites = async (movieId: number) => {
    if (!user) throw new Error('No user logged in');

    const { error } = await supabase
      .from('favorites')
      .delete()
      .eq('user_id', user.id)
      .eq('movie_id', movieId);

    if (error) throw error;

    setFavorites(prev => prev.filter(id => id !== movieId));
  };

  const isFavorite = (movieId: number) => favorites.includes(movieId);

  return (
    <SupabaseContext.Provider
      value={{
        user,
        loading,
        signIn,
        signUp,
        signOut,
        updateProfile,
        favorites,
        addToFavorites,
        removeFromFavorites,
        isFavorite,
        avatarUrl,
      }}
    >
      {children}
    </SupabaseContext.Provider>
  );
}; 