// services/api.ts
export const fetchMovies = async (query?: string) => {
  const response = await fetch(`/api/movies${query ? `?query=${query}` : ""}`);
  if (!response.ok) throw new Error("Failed to fetch movies");
  return response.json();
};

export const fetchMovieDetails = async (movieId: string) => {
  const response = await fetch(`/api/movie/${movieId}`);
  if (!response.ok) throw new Error("Failed to fetch movie details");
  return response.json();
};
