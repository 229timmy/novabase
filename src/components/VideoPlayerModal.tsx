import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Settings } from 'lucide-react';
import { useSource } from '../context/SourceContext';
import { availableSources } from '../data/sources';
import { Source } from '../types/sources';

interface VideoPlayerModalProps {
  mediaType: 'movie' | 'tv';
  id: number;
  season?: number;
  episode?: number;
  onClose: () => void;
}

export const VideoPlayerModal: React.FC<VideoPlayerModalProps> = ({
  mediaType,
  id,
  season,
  episode,
  onClose
}) => {
  const { currentSource, setCurrentSource, getSourceUrl } = useSource();
  const sourceUrl = getSourceUrl(mediaType, id, season, episode);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/90 backdrop-blur-sm z-[60] flex items-center justify-center"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-7xl aspect-video bg-black rounded-lg overflow-hidden"
        >
          <div className="absolute top-4 right-4 flex items-center gap-2 z-10">
            <div className="relative group">
              <button
                className="p-2 bg-black/50 rounded-full backdrop-blur-sm hover:bg-black/70 transition-colors"
              >
                <Settings className="w-6 h-6 text-white" />
              </button>
              
              <div className="absolute right-0 top-full mt-2 bg-black/90 backdrop-blur-sm rounded-lg p-2 invisible group-hover:visible">
                <div className="w-48 space-y-1">
                  {availableSources.map((source: Source) => (
                    <button
                      key={source.id}
                      onClick={() => setCurrentSource(source.id)}
                      className={`w-full px-3 py-2 text-left rounded-lg text-sm ${
                        currentSource === source.id
                          ? 'bg-white/20 text-white'
                          : 'text-gray-300 hover:bg-white/10'
                      }`}
                    >
                      {source.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 bg-black/50 rounded-full backdrop-blur-sm hover:bg-black/70 transition-colors"
            >
              <X className="w-6 h-6 text-white" />
            </button>
          </div>

          <iframe
            src={sourceUrl}
            className="w-full h-full"
            allowFullScreen
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          />
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}; 