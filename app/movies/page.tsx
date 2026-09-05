"use client";

import { useState, useEffect } from "react";
import { Movie, Genre } from "@/interfaces/interfaces";
import { fetchMovies, fetchGenres } from "@/services/api";
import MovieCard from "@/components/MovieCard";
import GenreFilter from "@/components/GenreFilter";
import { Film, SlidersHorizontal, Loader2 } from "lucide-react";

export default function MoviesPage() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState("popularity.desc");
  const [year, setYear] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGenres("movie")
      .then((data) => setGenres(data))
      .catch(console.error);
  }, []);

  useEffect(() => {
    async function loadMovies() {
      try {
        setLoading(true);
        const data = await fetchMovies({
          genre: selectedGenre || undefined,
          sortBy,
          year: year || undefined,
        });
        setMovies(data);
      } catch (err) {
        console.error("Failed to load movies", err);
      } finally {
        setLoading(false);
      }
    }
    loadMovies();
  }, [selectedGenre, sortBy, year]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-black text-white flex items-center gap-3">
            <Film className="w-8 h-8 text-accent" />
            Discover Movies
          </h1>
          <p className="text-sm text-light-300 mt-1">
            Browse through thousands of top titles, blockbusters and indie gems.
          </p>
        </div>

        {/* Filters and Sorting Controls */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 bg-dark-200 border border-white/10 rounded-xl px-3 py-2 text-xs">
            <SlidersHorizontal className="w-4 h-4 text-accent" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-transparent text-white outline-none cursor-pointer"
            >
              <option value="popularity.desc" className="bg-dark-200">Most Popular</option>
              <option value="vote_average.desc" className="bg-dark-200">Highest Rated</option>
              <option value="primary_release_date.desc" className="bg-dark-200">Newest Release</option>
              <option value="revenue.desc" className="bg-dark-200">Highest Grossing</option>
            </select>
          </div>

          <input
            type="number"
            placeholder="Year (e.g. 2026)"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            className="w-32 bg-dark-200 border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-light-300 outline-none focus:border-accent"
          />
        </div>
      </div>

      {/* Genre Pills */}
      <div className="mb-8">
        <GenreFilter
          genres={genres}
          selectedGenre={selectedGenre}
          onSelectGenre={setSelectedGenre}
        />
      </div>

      {/* Movies Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-28">
          <Loader2 className="w-10 h-10 text-accent animate-spin" />
        </div>
      ) : movies.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
          {movies.map((movie) => (
            <MovieCard
              key={movie.id}
              id={movie.id}
              title={movie.title}
              poster_path={movie.poster_path}
              vote_average={movie.vote_average}
              release_date={movie.release_date}
              media_type="movie"
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-28 text-light-300">
          No movies found matching the selected filters.
        </div>
      )}
    </div>
  );
}
