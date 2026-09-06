"use client";

import { useState, useEffect } from "react";
import { Movie, Genre, TrendingMovie } from "@/interfaces/interfaces";
import { fetchMovies, fetchTrending, fetchGenres } from "@/services/api";
import { getTrendingMovies } from "@/services/appwrite";
import HeroBanner from "@/components/HeroBanner";
import MovieCard from "@/components/MovieCard";
import GenreFilter from "@/components/GenreFilter";
import { Sparkles, Flame, Loader2 } from "lucide-react";
import Link from "next/link";

export default function HomePage() {
  const [trending, setTrending] = useState<Movie[]>([]);
  const [appwriteTrending, setAppwriteTrending] = useState<TrendingMovie[]>([]);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [moviesLoading, setMoviesLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadInitialData() {
      try {
        setLoading(true);
        const [trendingData, moviesData, genresData, dbTrending] = await Promise.allSettled([
          fetchTrending("all", "day"),
          fetchMovies({ sortBy: "popularity.desc" }),
          fetchGenres("movie"),
          getTrendingMovies(),
        ]);

        if (trendingData.status === "fulfilled") setTrending(trendingData.value);
        if (moviesData.status === "fulfilled") setMovies(moviesData.value);
        if (genresData.status === "fulfilled") setGenres(genresData.value);
        if (dbTrending.status === "fulfilled" && dbTrending.value && dbTrending.value.length > 0) {
          setAppwriteTrending(dbTrending.value);
        }
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Failed to load movie catalog");
      } finally {
        setLoading(false);
      }
    }
    loadInitialData();
  }, []);

  useEffect(() => {
    if (loading) return;

    async function filterByGenre() {
      try {
        setMoviesLoading(true);
        const filtered = await fetchMovies({
          genre: selectedGenre || undefined,
          sortBy: "popularity.desc",
        });
        setMovies(filtered);
      } catch (err) {
        console.error("Failed to filter by genre", err);
      } finally {
        setMoviesLoading(false);
      }
    }
    filterByGenre();
  }, [selectedGenre, loading]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] gap-3">
        <Loader2 className="w-10 h-10 text-accent animate-spin" />
        <p className="text-light-300 text-sm font-medium tracking-wide">
          Loading the best of cinema...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-md mx-auto my-20 p-6 rounded-2xl bg-dark-200 border border-red-500/20 text-center">
        <p className="text-red-400 font-semibold mb-2">Connection Error</p>
        <p className="text-xs text-light-300 mb-4">{error}</p>
        <p className="text-xs text-light-200">
          Please verify your <code className="text-accent">TMDB_API_KEY</code> is set in <code className="text-accent">.env.local</code>.
        </p>
      </div>
    );
  }

  const featuredMovie = trending.length > 0 ? trending[0] : movies[0] || null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
      {/* Featured Top Trending Hero */}
      <HeroBanner movie={featuredMovie} />

      {/* Appwrite Global Trending Searches */}
      {appwriteTrending.length > 0 && (
        <section className="mb-14">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-orange-500/20 text-orange-400">
                <Flame className="w-5 h-5" />
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                Top Trending Searches
              </h2>
            </div>
          </div>

          <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
            {appwriteTrending.map((item, index) => (
              <div key={item.movie_id} className="flex-shrink-0 w-36 sm:w-44">
                <MovieCard
                  id={item.movie_id}
                  title={item.title}
                  poster_path={item.poster_url ? item.poster_url.replace("https://image.tmdb.org/t/p/w500", "") : null}
                  vote_average={0}
                  release_date={`#${index + 1} Searched`}
                  media_type="movie"
                />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* TMDB Trending Ribbon / Carousel */}
      {trending.length > 1 && (
        <section className="mb-14">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-accent/20 text-accent">
                <Sparkles className="w-5 h-5" />
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                Trending This Week
              </h2>
            </div>
            <Link
              href="/trending"
              className="text-xs font-semibold text-accent hover:text-accent-hover transition-colors"
            >
              See All &rarr;
            </Link>
          </div>

          <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
            {trending.slice(1, 11).map((item) => (
              <div key={item.id} className="flex-shrink-0 w-36 sm:w-44">
                <MovieCard
                  id={item.id}
                  title={item.title}
                  name={item.name}
                  poster_path={item.poster_path}
                  vote_average={item.vote_average}
                  release_date={item.release_date}
                  first_air_date={item.first_air_date}
                  media_type={item.media_type}
                />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Genre Filter & Discover Catalog */}
      <section>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-accent/20 text-accent">
              <Sparkles className="w-5 h-5" />
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              Explore Popular Titles
            </h2>
          </div>
        </div>

        {/* Genre Pills */}
        <div className="mb-6">
          <GenreFilter
            genres={genres}
            selectedGenre={selectedGenre}
            onSelectGenre={setSelectedGenre}
          />
        </div>

        {/* Movie Grid */}
        {moviesLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-accent animate-spin" />
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
          <div className="text-center py-20 text-light-300">
            No movies found for the selected category.
          </div>
        )}
      </section>
    </div>
  );
}
