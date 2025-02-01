import React from 'react';
import { HeroCarousel } from '../components/HeroCarousel';
import { MediaRow } from '../components/MediaRow';
import { MediaModal } from '../components/MediaModal';
import { useTMDB } from '../hooks/useTMDB';

export const TVShows = () => {
  const {
    popularTVShows,
    topRatedTVShows,
    airingTodayShows,
    onTheAirShows,
    selectedMedia,
    setSelectedMedia
  } = useTMDB();

  return (
    <>
      {airingTodayShows.length > 0 && (
        <HeroCarousel
          items={airingTodayShows.slice(0, 5)}
          onItemClick={setSelectedMedia}
        />
      )}

      <div className="mt-8 space-y-8">
        <MediaRow
          title="Airing Today"
          items={airingTodayShows}
          onItemClick={setSelectedMedia}
        />
        
        <MediaRow
          title="Currently Airing"
          items={onTheAirShows}
          onItemClick={setSelectedMedia}
        />
        
        <MediaRow
          title="Popular TV Shows"
          items={popularTVShows}
          onItemClick={setSelectedMedia}
        />
        
        <MediaRow
          title="Top Rated TV Shows"
          items={topRatedTVShows}
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