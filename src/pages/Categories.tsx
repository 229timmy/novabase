import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import clsx from 'clsx';
import { getGenres, getByGenre } from '../services/tmdb';
import { MediaCard } from '../components/MediaCard';
import { MediaModal } from '../components/MediaModal';
import { MediaType } from '../types/tmdb';
import '../styles/card-animation.css';

type Genre = {
  id: number;
  name: string;
};

export const Categories = () => {
  const [activeTab, setActiveTab] = useState<'movie' | 'tv'>('movie');
  const [genres, setGenres] = useState<Genre[]>([]);
  const [selectedGenre, setSelectedGenre] = useState<Genre | null>(null);
  const [results, setResults] = useState<MediaType[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [selectedItem, setSelectedItem] = useState<MediaType | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loadGenres = async () => {
      try {
        const genreData = await getGenres(activeTab);
        setGenres(genreData);
      } catch (error) {
        console.error('Error loading genres:', error);
      }
    };
    loadGenres();
  }, [activeTab]);

  useEffect(() => {
    const loadResults = async () => {
      if (!selectedGenre) return;
      try {
        const data = await getByGenre(activeTab, selectedGenre.id, page);
        setResults(data.results);
        setTotalPages(Math.min(data.total_pages, 500));
      } catch (error) {
        console.error('Error loading results:', error);
      }
    };
    loadResults();
  }, [selectedGenre, page, activeTab]);

  const handleItemClick = (item: MediaType) => {
    setSelectedItem({
      ...item,
      media_type: activeTab === 'movie' ? 'movie' : 'tv'
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <button
        onClick={() => navigate(-1)}
        className="absolute top-4 right-8 text-white/80 hover:text-white transition-colors"
      >
        Back
      </button>

      <div className="flex gap-4 mb-8 justify-center">
        <button
          onClick={() => {
            setActiveTab('movie');
            setSelectedGenre(null);
            setPage(1);
          }}
          className={clsx(
            'px-6 py-2 rounded-lg transition-colors',
            activeTab === 'movie'
              ? 'bg-white/10 text-white'
              : 'text-white/80 hover:text-white hover:bg-white/5'
          )}
        >
          Movies
        </button>
        <button
          onClick={() => {
            setActiveTab('tv');
            setSelectedGenre(null);
            setPage(1);
          }}
          className={clsx(
            'px-6 py-2 rounded-lg transition-colors',
            activeTab === 'tv'
              ? 'bg-white/10 text-white'
              : 'text-white/80 hover:text-white hover:bg-white/5'
          )}
        >
          TV Shows
        </button>
      </div>

      {!selectedGenre && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {genres.map((genre) => (
            <motion.div
              key={genre.id}
              whileHover={{ scale: 1.02 }}
              className="bg-white/5 rounded-lg p-6 cursor-pointer hover:bg-white/10 transition-colors animated-card"
              onClick={() => setSelectedGenre(genre)}
            >
              <div className="flex items-center justify-between">
                <h3 className="text-xl text-white">{genre.name}</h3>
                <ArrowRight className="w-6 h-6 text-white/80" />
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {selectedGenre && (
        <>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl text-white">{selectedGenre.name}</h2>
            <button
              onClick={() => {
                setSelectedGenre(null);
                setPage(1);
              }}
              className="text-white/80 hover:text-white transition-colors"
            >
              Back to Genres
            </button>
          </div>

          <div className="grid grid-cols-2 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {results.map((item) => (
              <MediaCard
                key={item.id}
                item={item}
                onClick={handleItemClick}
              />
            ))}
          </div>

          <div className="flex justify-center gap-2 mt-8">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className={clsx(
                'px-4 py-2 rounded-lg transition-colors',
                page === 1
                  ? 'bg-white/5 text-white/40 cursor-not-allowed'
                  : 'bg-white/10 text-white hover:bg-white/20'
              )}
            >
              Previous
            </button>
            <span className="px-4 py-2 text-white">
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className={clsx(
                'px-4 py-2 rounded-lg transition-colors',
                page === totalPages
                  ? 'bg-white/5 text-white/40 cursor-not-allowed'
                  : 'bg-white/10 text-white hover:bg-white/20'
              )}
            >
              Next
            </button>
          </div>
        </>
      )}

      {selectedItem && (
        <MediaModal
          item={selectedItem}
          onClose={() => setSelectedItem(null)}
          onItemClick={handleItemClick}
        />
      )}
    </div>
  );
}; 