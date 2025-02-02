import React from 'react';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';
import { MediaType } from '../types/tmdb';
import { useFavorites } from '../context/FavoritesContext';
import '../styles/card-animation.css';

interface MediaCardProps {
  item: MediaType;
  onClick: (item: MediaType) => void;
}

export const MediaCard: React.FC<MediaCardProps> = ({ item, onClick }) => {
  const { isFavorite, addFavorite, removeFavorite } = useFavorites();
  const isItemFavorite = isFavorite(item.id);

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isItemFavorite) {
      removeFavorite(item.id);
    } else {
      addFavorite(item);
    }
  };

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className="relative flex-shrink-0 w-48 cursor-pointer group hover:z-10 animated-card"
      onClick={() => onClick(item)}
      style={{ transformOrigin: 'center center' }}
    >
      <img
        src={`https://image.tmdb.org/t/p/w500${item.poster_path}`}
        alt={item.title || item.name}
        className="w-full h-72 object-cover rounded-lg relative z-[1]"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent rounded-lg z-[2]" />
      <div className="absolute bottom-0 left-0 p-4 text-white z-[2]">
        <h3 className="text-sm font-semibold line-clamp-2">
          {item.title || item.name}
        </h3>
      </div>
      <button
        onClick={handleFavoriteClick}
        className={`absolute top-2 right-2 p-2 rounded-full transition-colors z-[2] ${
          isItemFavorite ? 'bg-yellow-400 text-black' : 'bg-black/50 text-white hover:bg-white/20'
        }`}
      >
        <Star className="w-4 h-4" />
      </button>
    </motion.div>
  );
};