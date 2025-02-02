import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { MediaCard } from './MediaCard';
import { MediaType } from '../types/tmdb';

interface MediaRowProps {
  title: string;
  items: MediaType[];
  onItemClick: (item: MediaType) => void;
}

export const MediaRow: React.FC<MediaRowProps> = ({ title, items, onItemClick }) => {
  const rowRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (rowRef.current) {
      const { scrollLeft, clientWidth } = rowRef.current;
      const scrollTo = direction === 'left' ? scrollLeft - clientWidth : scrollLeft + clientWidth;
      
      rowRef.current.scrollTo({
        left: scrollTo,
        behavior: 'smooth'
      });
    }
  };

  if (items.length === 0) {
    return null;
  }

  return (
    <motion.div 
      className="relative py-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-2xl font-bold mb-4 text-white">{title}</h2>
      
      <div className="relative group">
        <motion.div
          ref={rowRef}
          className="flex gap-4 overflow-x-auto overflow-y-visible scroll-smooth px-12 pt-16 pb-20"
          style={{
            marginLeft: '-3rem',
            marginRight: '-3rem',
            marginTop: '-3rem',
            marginBottom: '-4rem'
          }}
        >
          {items.map((item) => (
            <MediaCard key={item.id} item={item} onClick={onItemClick} />
          ))}
        </motion.div>

        <button
          onClick={() => scroll('left')}
          className="absolute left-8 top-1/2 -translate-y-1/2 p-2 bg-black/50 rounded-full backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity z-10"
        >
          <ChevronLeft className="w-6 h-6 text-white" />
        </button>
        <button
          onClick={() => scroll('right')}
          className="absolute right-8 top-1/2 -translate-y-1/2 p-2 bg-black/50 rounded-full backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity z-10"
        >
          <ChevronRight className="w-6 h-6 text-white" />
        </button>
      </div>
    </motion.div>
  );
};