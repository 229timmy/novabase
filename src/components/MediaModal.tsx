import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronDown, Clock, Star, Play } from 'lucide-react';
import { MediaType, Episode } from '../types/tmdb';
import { getMediaDetails, getSimilar, getTVSeasonDetails, getVideos } from '../services/tmdb';
import { MediaCard } from './MediaCard';
import { useFavorites } from '../context/FavoritesContext';
import { VideoPlayerModal } from './VideoPlayerModal';

interface MediaModalProps {
  item: MediaType | null;
  onClose: () => void;
  onItemClick: (item: MediaType) => void;
}

export const MediaModal: React.FC<MediaModalProps> = ({ item, onClose, onItemClick }) => {
  const [details, setDetails] = useState<MediaType | null>(null);
  const [similarItems, setSimilarItems] = useState<MediaType[]>([]);
  const [selectedSeason, setSelectedSeason] = useState<number>(1);
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [loading, setLoading] = useState(true);
  const [trailer, setTrailer] = useState<string | null>(null);
  const [showTrailer, setShowTrailer] = useState(false);
  const [showPlayer, setShowPlayer] = useState(false);
  const [selectedEpisode, setSelectedEpisode] = useState<number | null>(null);
  const { isFavorite, addFavorite, removeFavorite } = useFavorites();

  // Reset states when modal is closed
  const handleClose = () => {
    setShowTrailer(false);
    setShowPlayer(false);
    setSelectedEpisode(null);
    onClose();
  };

  useEffect(() => {
    const fetchDetails = async () => {
      if (!item) return;
      
      setLoading(true);
      try {
        const [detailsData, similarData, videosData] = await Promise.all([
          getMediaDetails(item.media_type, item.id),
          getSimilar(item.media_type, item.id),
          getVideos(item.media_type, item.id)
        ]);

        setDetails(detailsData);
        setSimilarItems(similarData.map((similar: any) => ({
          ...similar,
          media_type: item.media_type
        })));

        const trailer = videosData.find((video: any) => 
          video.type === 'Trailer' && video.site === 'YouTube'
        );
        setTrailer(trailer ? trailer.key : null);

        if (item.media_type === 'tv' && detailsData.seasons) {
          const seasonData = await getTVSeasonDetails(item.id, selectedSeason);
          setEpisodes(seasonData.episodes);
        }
      } catch (error) {
        console.error('Error fetching details:', error);
      } finally {
        setLoading(false);
      }
    };

    // Reset states when item changes
    setShowTrailer(false);
    setShowPlayer(false);
    setSelectedEpisode(null);
    fetchDetails();
  }, [item, selectedSeason]);

  if (!item || !details) return null;

  const handleSeasonChange = async (seasonNumber: number) => {
    setSelectedSeason(seasonNumber);
  };

  const handleSimilarClick = async (newItem: MediaType) => {
    onItemClick(newItem);
  };

  const formatRuntime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}h ${remainingMinutes}m`;
  };

  const isItemFavorite = isFavorite(item.id);

  const handleFavoriteClick = () => {
    if (isItemFavorite) {
      removeFavorite(item.id);
    } else {
      addFavorite(item);
    }
  };

  const handlePlayClick = (episodeNumber?: number) => {
    setSelectedEpisode(episodeNumber || null);
    setShowPlayer(true);
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 overflow-y-auto"
        onClick={handleClose}
      >
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", damping: 25 }}
          className="container mx-auto my-8 bg-[#1a1a1a] rounded-2xl overflow-hidden max-w-5xl"
          onClick={e => e.stopPropagation()}
        >
          {/* Hero Section */}
          <div className="relative h-[50vh]">
            {showTrailer && trailer ? (
              <div className="relative w-full h-full">
                <iframe
                  src={`https://www.youtube.com/embed/${trailer}?autoplay=1&origin=${window.location.origin}`}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
                <button
                  onClick={() => setShowTrailer(false)}
                  className="absolute top-4 left-4 px-4 py-2 bg-black/50 rounded-lg backdrop-blur-sm hover:bg-black/70 transition-colors text-white text-sm font-medium flex items-center gap-2"
                >
                  <X className="w-4 h-4" />
                  Stop Trailer
                </button>
              </div>
            ) : (
              <div 
                className="w-full h-full bg-cover bg-center relative group"
                style={{
                  backgroundImage: `url(https://image.tmdb.org/t/p/original${details.backdrop_path})`
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-[#1a1a1a] via-transparent" />
                <div className="absolute inset-0 flex items-center justify-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => handlePlayClick()}
                    className="flex items-center gap-2 px-6 py-3 bg-white text-black rounded-lg hover:bg-white/90 transition-colors"
                  >
                    <Play className="w-5 h-5" />
                    Watch Now
                  </button>
                  {trailer && (
                    <button
                      onClick={() => setShowTrailer(true)}
                      className="flex items-center gap-2 px-6 py-3 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-colors"
                    >
                      <Play className="w-5 h-5" />
                      Watch Trailer
                    </button>
                  )}
                </div>
              </div>
            )}
            
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 p-2 bg-black/50 rounded-full backdrop-blur-sm hover:bg-black/70 transition-colors"
            >
              <X className="w-6 h-6 text-white" />
            </button>
          </div>

          {/* Content */}
          <div className="p-8 -mt-20 relative">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-4xl font-bold">
                {details.title || details.name}
              </h1>
              <button
                onClick={handleFavoriteClick}
                className={`p-2 rounded-full transition-colors ${
                  isItemFavorite ? 'bg-yellow-400 text-black' : 'bg-white/10 text-white hover:bg-white/20'
                }`}
              >
                <Star className="w-6 h-6" />
              </button>
            </div>

            <div className="flex items-center gap-4 mb-6 text-gray-300">
              {details.genres?.map(genre => (
                <span key={genre.id} className="text-sm">
                  {genre.name}
                </span>
              ))}
              {details.runtime && (
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span className="text-sm">{formatRuntime(details.runtime)}</span>
                </div>
              )}
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 text-yellow-400" />
                <span className="text-sm">{details.vote_average.toFixed(1)}</span>
              </div>
            </div>

            <p className="text-lg text-gray-300 mb-8 max-w-3xl">
              {details.overview}
            </p>

            {/* TV Show Seasons */}
            {item.media_type === 'tv' && details.seasons && (
              <div className="mb-8">
                <div className="flex items-center gap-4 mb-4">
                  <select
                    value={selectedSeason}
                    onChange={(e) => handleSeasonChange(Number(e.target.value))}
                    className="bg-white/10 text-white px-4 py-2 rounded-lg appearance-none cursor-pointer pr-10 relative"
                  >
                    {details.seasons.map((season) => (
                      <option key={season.id} value={season.season_number}>
                        Season {season.season_number}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="w-4 h-4 -ml-8 pointer-events-none" />
                </div>

                {/* Episodes */}
                <div className="grid gap-4">
                  {episodes.map((episode) => (
                    <div
                      key={episode.id}
                      className="bg-white/5 rounded-lg p-4 hover:bg-white/10 transition-colors"
                    >
                      <div className="flex items-start gap-4">
                        {episode.still_path && (
                          <img
                            src={`https://image.tmdb.org/t/p/w300${episode.still_path}`}
                            alt={episode.name}
                            className="w-48 h-27 object-cover rounded-lg"
                          />
                        )}
                        <div className="flex-1">
                          <div className="flex items-start justify-between gap-4">
                            <div>
                              <h3 className="text-lg font-semibold mb-2">
                                {episode.episode_number}. {episode.name}
                              </h3>
                              <p className="text-gray-300 text-sm mb-2">
                                {episode.overview}
                              </p>
                              <div className="flex items-center gap-4 text-sm text-gray-400">
                                <span>{episode.air_date}</span>
                                <span>{episode.runtime} min</span>
                              </div>
                            </div>
                            <button
                              onClick={() => handlePlayClick(episode.episode_number)}
                              className="flex items-center gap-2 px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors"
                            >
                              <Play className="w-4 h-4" />
                              Play
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Similar Titles */}
            {similarItems.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold mb-4">Similar Titles</h2>
                <div className="flex gap-4 overflow-x-auto pb-4">
                  {similarItems.map((similar) => (
                    <MediaCard
                      key={similar.id}
                      item={similar}
                      onClick={handleSimilarClick}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>

      {showPlayer && (
        <VideoPlayerModal
          mediaType={item.media_type}
          id={item.id}
          season={item.media_type === 'tv' ? selectedSeason : undefined}
          episode={selectedEpisode || undefined}
          onClose={() => setShowPlayer(false)}
        />
      )}
    </AnimatePresence>
  );
};