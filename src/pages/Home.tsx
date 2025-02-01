import React from 'react';
import { HeroCarousel } from '../components/HeroCarousel';
import { MediaRow } from '../components/MediaRow';
import { MediaModal } from '../components/MediaModal';
import { useTMDB } from '../hooks/useTMDB';
import { MediaType } from '../types/tmdb';

export const Home = () => {
  const { trending, popularMovies, popularTVShows, selectedMedia, setSelectedMedia } = useTMDB();

  const handleMediaClick = (item: MediaType) => {
    setSelectedMedia(item);
  };

  return (
    <>
      {trending.length > 0 && (
        <HeroCarousel
          items={trending.slice(0, 5)}
          onItemClick={handleMediaClick}
        />
      )}

      <div className="mt-8 space-y-8">
        <MediaRow
          title="Popular Movies"
          items={popularMovies}
          onItemClick={handleMediaClick}
        />
        
        <MediaRow
          title="Popular TV Shows"
          items={popularTVShows}
          onItemClick={handleMediaClick}
        />
        
        <MediaRow
          title="Trending This Week"
          items={trending}
          onItemClick={handleMediaClick}
        />
      </div>

      <MediaModal
        item={selectedMedia}
        onClose={() => setSelectedMedia(null)}
        onItemClick={handleMediaClick}
      />
    </>
  );
};