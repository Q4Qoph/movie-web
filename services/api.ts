import { Movie, MovieDetails, TVShow, TVDetails, Genre } from "@/interfaces/interfaces";

export interface FetchMoviesParams {
  query?: string;
  genre?: string;
  sortBy?: string;
  year?: string;
  page?: number;
}

export interface FetchTVParams {
  query?: string;
  genre?: string;
  sortBy?: string;
  page?: number;
}

export const fetchMovies = async (params: FetchMoviesParams = {}) => {
  const queryParams = new URLSearchParams();
  if (params.query) queryParams.append("query", params.query);
  if (params.genre) queryParams.append("genre", params.genre);
  if (params.sortBy) queryParams.append("sort_by", params.sortBy);
  if (params.year) queryParams.append("year", params.year);
  if (params.page) queryParams.append("page", params.page.toString());

  const response = await fetch(`/api/movies?${queryParams.toString()}`);
  if (!response.ok) throw new Error("Failed to fetch movies");
  const data = await response.json();
  return data.results ? data.results : data;
};

export const fetchMovieDetails = async (movieId: string | number): Promise<MovieDetails> => {
  const response = await fetch(`/api/movie/${movieId}`);
  if (!response.ok) throw new Error("Failed to fetch movie details");
  return response.json();
};

export const fetchTVShows = async (params: FetchTVParams = {}) => {
  const queryParams = new URLSearchParams();
  if (params.query) queryParams.append("query", params.query);
  if (params.genre) queryParams.append("genre", params.genre);
  if (params.sortBy) queryParams.append("sort_by", params.sortBy);
  if (params.page) queryParams.append("page", params.page.toString());

  const response = await fetch(`/api/tv?${queryParams.toString()}`);
  if (!response.ok) throw new Error("Failed to fetch TV shows");
  const data = await response.json();
  return data.results ? data.results : data;
};

export const fetchTVDetails = async (tvId: string | number): Promise<TVDetails> => {
  const response = await fetch(`/api/tv/${tvId}`);
  if (!response.ok) throw new Error("Failed to fetch TV details");
  return response.json();
};

export const fetchTrending = async (
  type: "all" | "movie" | "tv" = "all",
  time: "day" | "week" = "day"
): Promise<Movie[]> => {
  const response = await fetch(`/api/trending?type=${type}&time=${time}`);
  if (!response.ok) throw new Error("Failed to fetch trending media");
  const data = await response.json();
  return data.results || [];
};

export const fetchGenres = async (type: "movie" | "tv" = "movie"): Promise<Genre[]> => {
  const response = await fetch(`/api/genres?type=${type}`);
  if (!response.ok) throw new Error("Failed to fetch genres");
  return response.json();
};

export const searchMulti = async (
  query: string,
  type: "multi" | "movie" | "tv" = "multi",
  page: number = 1
) => {
  const response = await fetch(
    `/api/search?query=${encodeURIComponent(query)}&type=${type}&page=${page}`
  );
  if (!response.ok) throw new Error("Failed to execute search");
  return response.json();
};
