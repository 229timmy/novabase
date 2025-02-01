import React from 'react';
import { HeroCarousel } from '../components/HeroCarousel';
import { MediaRow } from '../components/MediaRow';
import { MediaModal } from '../components/MediaModal';
import { useTMDB } from '../hooks/useTMDB';

export const Movies = () => {
  const {
    popularMovies,
    topRatedMovies,
    upcomingMovies,
    nowPlayingMovies,
    selectedMedia,
    setSelectedMedia
  } = useTMDB();

  return (
    <>
      {nowPlayingMovies.length > 0 && (
        <HeroCarousel
          items={nowPlayingMovies.slice(0, 5)}
          onItemClick={setSelectedMedia}
        />
      )}

      <div className="mt-8 space-y-8">
        <MediaRow
          title="Now Playing"
          items={nowPlayingMovies}
          onItemClick={setSelectedMedia}
        />
        
        <MediaRow
          title="Popular Movies"
          items={popularMovies}
          onItemClick={setSelectedMedia}
        />
        
        <MediaRow
          title="Upcoming Movies"
          items={upcomingMovies}
          onItemClick={setSelectedMedia}
        />
        
        <MediaRow
          title="Top Rated Movies"
          items={topRatedMovies}
          onItemClick={setSelectedMedia}
        />
      </div>

      <MediaModal
        item={selectedMedia}
        onClose={() => setSelectedMedia(null)}
        onItemClick={setSelectedMedia}
      />
    </>
  );
};