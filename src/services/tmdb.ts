import axios from 'axios';

const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = 'https://api.themoviedb.org/3';

const tmdbApi = axios.create({
  baseURL: BASE_URL,
  params: {
    api_key: TMDB_API_KEY,
  },
});

export const getTrending = async (mediaType: 'all' | 'movie' | 'tv' = 'all', timeWindow: 'day' | 'week' = 'week') => {
  const response = await tmdbApi.get(`/trending/${mediaType}/${timeWindow}`);
  return response.data.results;
};

export const getPopular = async (mediaType: 'movie' | 'tv') => {
  const response = await tmdbApi.get(`/${mediaType}/popular`);
  return response.data.results;
};

export const getTopRated = async (mediaType: 'movie' | 'tv') => {
  const response = await tmdbApi.get(`/${mediaType}/top_rated`);
  return response.data.results;
};

export const getUpcoming = async () => {
  const response = await tmdbApi.get('/movie/upcoming');
  return response.data.results;
};

export const getNowPlaying = async () => {
  const response = await tmdbApi.get('/movie/now_playing');
  return response.data.results;
};

export const getAiringToday = async () => {
  const response = await tmdbApi.get('/tv/airing_today');
  return response.data.results;
};

export const getOnTheAir = async () => {
  const response = await tmdbApi.get('/tv/on_the_air');
  return response.data.results;
};

export const getMediaDetails = async (mediaType: 'movie' | 'tv', id: number) => {
  const response = await tmdbApi.get(`/${mediaType}/${id}`);
  return response.data;
};

export const getSimilar = async (mediaType: 'movie' | 'tv', id: number) => {
  const response = await tmdbApi.get(`/${mediaType}/${id}/similar`);
  return response.data.results;
};

export const getTVSeasonDetails = async (tvId: number, seasonNumber: number) => {
  const response = await tmdbApi.get(`/tv/${tvId}/season/${seasonNumber}`);
  return response.data;
};

export const getVideos = async (mediaType: 'movie' | 'tv', id: number) => {
  const response = await tmdbApi.get(`/${mediaType}/${id}/videos`);
  return response.data.results;
};

export const searchMedia = async (query: string, page: number = 1) => {
  const response = await tmdbApi.get('/search/multi', {
    params: {
      query,
      page,
      include_adult: false
    }
  });
  return response.data;
};

export const getGenres = async (mediaType: 'movie' | 'tv') => {
  const response = await tmdbApi.get(`/genre/${mediaType}/list`);
  return response.data.genres;
};

export const getByGenre = async (mediaType: 'movie' | 'tv', genreId: number, page: number = 1) => {
  const response = await tmdbApi.get(`/discover/${mediaType}`, {
    params: {
      with_genres: genreId,
      page,
      sort_by: 'popularity.desc'
    }
  });
  return response.data;
};