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

  return (
    <div className="relative py-4">
      <h2 className="text-2xl font-bold mb-4 text-white">{title}</h2>
      
      <div className="relative group">
        <motion.div
          ref={rowRef}
          className="flex gap-4 overflow-x-auto scroll-smooth"
          style={{
            overflowY: 'visible',
            paddingBottom: '1rem',
            marginBottom: '-1rem'
          }}
        >
          {items.map((item) => (
            <MediaCard key={item.id} item={item} onClick={onItemClick} />
          ))}
        </motion.div>

        <button
          onClick={() => scroll('left')}
          className="absolute left-0 top-1/2 -translate-y-1/2 p-2 bg-black/50 rounded-full backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <ChevronLeft className="w-6 h-6 text-white" />
        </button>
        <button
          onClick={() => scroll('right')}
          className="absolute right-0 top-1/2 -translate-y-1/2 p-2 bg-black/50 rounded-full backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <ChevronRight className="w-6 h-6 text-white" />
        </button>
      </div>
    </div>
  );
};