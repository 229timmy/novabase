import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useFavorites } from '../context/FavoritesContext';
import { MediaCard } from '../components/MediaCard';
import { MediaModal } from '../components/MediaModal';
import { MediaType } from '../types/tmdb';

export const Favorites = () => {
  const { favorites } = useFavorites();
  const [activeTab, setActiveTab] = useState<'movies' | 'tv'>('movies');
  const [selectedMedia, setSelectedMedia] = useState<MediaType | null>(null);

  const movies = favorites.filter(item => item.media_type === 'movie');
  const tvShows = favorites.filter(item => item.media_type === 'tv');

  return (
    <>
      <div className="mb-8">
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setActiveTab('movies')}
            className={`px-6 py-2 rounded-lg transition-colors ${
              activeTab === 'movies'
                ? 'bg-white text-black'
                : 'bg-white/10 text-white'
            }`}
          >
            Movies
          </button>
          <button
            onClick={() => setActiveTab('tv')}
            className={`px-6 py-2 rounded-lg transition-colors ${
              activeTab === 'tv'
                ? 'bg-white text-black'
                : 'bg-white/10 text-white'
            }`}
          >
            TV Shows
          </button>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6"
          >
            {(activeTab === 'movies' ? movies : tvShows).map(item => (
              <MediaCard
                key={item.id}
                item={item}
                onClick={setSelectedMedia}
              />
            ))}
          </motion.div>
        </AnimatePresence>
      </div>

      <MediaModal
        item={selectedMedia}
        onClose={() => setSelectedMedia(null)}
        onItemClick={setSelectedMedia}
      />
    </>
  );
};