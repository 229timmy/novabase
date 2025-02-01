import { useState, useEffect } from 'react';
import { getTrending, getPopular, getTopRated, getUpcoming, getNowPlaying, getAiringToday, getOnTheAir } from '../services/tmdb';
import { MediaType } from '../types/tmdb';

export const useTMDB = () => {
  const [trending, setTrending] = useState<MediaType[]>([]);
  const [popularMovies, setPopularMovies] = useState<MediaType[]>([]);
  const [popularTVShows, setPopularTVShows] = useState<MediaType[]>([]);
  const [topRatedMovies, setTopRatedMovies] = useState<MediaType[]>([]);
  const [topRatedTVShows, setTopRatedTVShows] = useState<MediaType[]>([]);
  const [upcomingMovies, setUpcomingMovies] = useState<MediaType[]>([]);
  const [nowPlayingMovies, setNowPlayingMovies] = useState<MediaType[]>([]);
  const [airingTodayShows, setAiringTodayShows] = useState<MediaType[]>([]);
  const [onTheAirShows, setOnTheAirShows] = useState<MediaType[]>([]);
  const [selectedMedia, setSelectedMedia] = useState<MediaType | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [
          trendingData,
          moviesData,
          tvData,
          topMoviesData,
          topTVData,
          upcomingData,
          nowPlayingData,
          airingTodayData,
          onTheAirData
        ] = await Promise.all([
          getTrending('all', 'week'),
          getPopular('movie'),
          getPopular('tv'),
          getTopRated('movie'),
          getTopRated('tv'),
          getUpcoming(),
          getNowPlaying(),
          getAiringToday(),
          getOnTheAir()
        ]);

        setTrending(trendingData.map((item: any) => ({
          ...item,
          media_type: item.media_type || (item.title ? 'movie' : 'tv')
        })));
        
        setPopularMovies(moviesData.map((movie: any) => ({
          ...movie,
          media_type: 'movie'
        })));
        
        setPopularTVShows(tvData.map((show: any) => ({
          ...show,
          media_type: 'tv'
        })));

        setTopRatedMovies(topMoviesData.map((movie: any) => ({
          ...movie,
          media_type: 'movie'
        })));

        setTopRatedTVShows(topTVData.map((show: any) => ({
          ...show,
          media_type: 'tv'
        })));

        setUpcomingMovies(upcomingData.map((movie: any) => ({
          ...movie,
          media_type: 'movie'
        })));

        setNowPlayingMovies(nowPlayingData.map((movie: any) => ({
          ...movie,
          media_type: 'movie'
        })));

        setAiringTodayShows(airingTodayData.map((show: any) => ({
          ...show,
          media_type: 'tv'
        })));

        setOnTheAirShows(onTheAirData.map((show: any) => ({
          ...show,
          media_type: 'tv'
        })));
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  return {
    trending,
    popularMovies,
    popularTVShows,
    topRatedMovies,
    topRatedTVShows,
    upcomingMovies,
    nowPlayingMovies,
    airingTodayShows,
    onTheAirShows,
    selectedMedia,
    setSelectedMedia
  };
};