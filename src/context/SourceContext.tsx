import React, { createContext, useContext, useState } from 'react';
import { availableSources } from '../data/sources';
import { Source } from '../types/sources';

interface SourceContextType {
  currentSource: string;
  setCurrentSource: (source: string) => void;
  getSourceUrl: (mediaType: 'movie' | 'tv', id: number, season?: number, episode?: number) => string;
}

const SourceContext = createContext<SourceContextType | undefined>(undefined);

export const SourceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentSource, setCurrentSource] = useState('2embed');

  const getSourceUrl = (mediaType: 'movie' | 'tv', id: number, season?: number, episode?: number) => {
    const source = availableSources.find((s: Source) => s.id === currentSource);
    if (!source) return '';

    let url = source.urls[mediaType];
    url = url.replace('{id}', id.toString());
    
    if (mediaType === 'tv' && season !== undefined && episode !== undefined) {
      url = url.replace('{season}', season.toString());
      url = url.replace('{episode}', episode.toString());
    }
    
    return url;
  };

  return (
    <SourceContext.Provider value={{ currentSource, setCurrentSource, getSourceUrl }}>
      {children}
    </SourceContext.Provider>
  );
};

export const useSource = () => {
  const context = useContext(SourceContext);
  if (context === undefined) {
    throw new Error('useSource must be used within a SourceProvider');
  }
  return context;
}; 