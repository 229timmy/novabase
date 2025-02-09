import React, { createContext, useContext, useState, useEffect } from 'react';
import { MediaType } from '../types/tmdb';
import { useSupabase } from './SupabaseContext';
import { supabase } from '../lib/supabase';

interface FavoritesContextType {
  favorites: MediaType[];
  addFavorite: (item: MediaType) => Promise<void>;
  removeFavorite: (id: number) => Promise<void>;
  isFavorite: (id: number) => boolean;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export const FavoritesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [favorites, setFavorites] = useState<MediaType[]>([]);
  const { user } = useSupabase();

  // Fetch favorites from Supabase when user changes
  useEffect(() => {
    const fetchFavorites = async () => {
      if (!user) {
        setFavorites([]);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('favorites')
          .select('movie_data')
          .eq('user_id', user.id);

        if (error) {
          console.error('Error fetching favorites:', error);
          return;
        }

        const favoriteItems = data?.map(item => item.movie_data) || [];
        setFavorites(favoriteItems);
      } catch (error) {
        console.error('Error loading favorites:', error);
      }
    };

    fetchFavorites();
  }, [user]);

  const addFavorite = async (item: MediaType) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('favorites')
        .insert([
          {
            user_id: user.id,
            movie_id: item.id,
            movie_data: item
          }
        ]);

      if (error) {
        if (error.code === '23505') { // Unique violation error code
          return; // Item is already in favorites
        }
        throw error;
      }

      setFavorites(prev => [...prev, item]);
    } catch (error) {
      console.error('Error adding favorite:', error);
      throw error;
    }
  };

  const removeFavorite = async (id: number) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('favorites')
        .delete()
        .eq('user_id', user.id)
        .eq('movie_id', id);

      if (error) throw error;

      setFavorites(prev => prev.filter(item => item.id !== id));
    } catch (error) {
      console.error('Error removing favorite:', error);
      throw error;
    }
  };

  const isFavorite = (id: number) => {
    return favorites.some(item => item.id === id);
  };

  return (
    <FavoritesContext.Provider value={{ favorites, addFavorite, removeFavorite, isFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (context === undefined) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
};