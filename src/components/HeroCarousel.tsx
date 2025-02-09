import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { MediaType } from '../types/tmdb';

interface HeroCarouselProps {
  items: MediaType[];
  onItemClick: (item: MediaType) => void;
}

export const HeroCarousel: React.FC<HeroCarouselProps> = ({ items, onItemClick }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setDirection(1);
      setCurrentIndex((prev) => (prev + 1) % items.length);
    }, 20000);

    return () => clearInterval(timer);
  }, [items.length]);

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000
    }),
    center: {
      zIndex: 1,
      x: 0
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000
    })
  };

  return (
    <div className="relative h-[70vh] overflow-hidden rounded-2xl">
      <AnimatePresence initial={false} custom={direction} mode="popLayout">
        <motion.div
          key={currentIndex}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            x: { type: "spring", stiffness: 50, damping: 20, duration: 2 }
          }}
          className="absolute inset-0"
        >
          <div 
            className="w-full h-full bg-cover bg-center relative"
            style={{
              backgroundImage: `url(https://image.tmdb.org/t/p/original${items[currentIndex]?.backdrop_path})`,
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent" />
            <motion.div 
              initial={{ y: 20 }}
              animate={{ y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="absolute bottom-0 left-0 p-8 text-white"
            >
              <h2 className="text-4xl font-bold mb-4">
                {items[currentIndex]?.title || items[currentIndex]?.name}
              </h2>
              <p className="text-lg max-w-2xl line-clamp-3">
                {items[currentIndex]?.overview}
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onItemClick(items[currentIndex])}
                className="mt-4 px-6 py-2 bg-white text-black rounded-lg hover:bg-white/90 transition-colors"
              >
                Learn More
              </motion.button>
            </motion.div>
          </div>
        </motion.div>
      </AnimatePresence>

      <div className="absolute inset-x-0 bottom-4 flex justify-center gap-2 z-10">
        {items.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              setDirection(index > currentIndex ? 1 : -1);
              setCurrentIndex(index);
            }}
            className={`w-2 h-2 rounded-full transition-all ${
              index === currentIndex 
                ? 'bg-white w-6' 
                : 'bg-white/50 hover:bg-white/75'
            }`}
          />
        ))}
      </div>
    </div>
  );
};