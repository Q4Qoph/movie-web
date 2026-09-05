"use client";

import { useState, useEffect } from "react";
import { TVShow, Genre } from "@/interfaces/interfaces";
import { fetchTVShows, fetchGenres } from "@/services/api";
import MovieCard from "@/components/MovieCard";
import GenreFilter from "@/components/GenreFilter";
import { Tv, SlidersHorizontal, Loader2 } from "lucide-react";

export default function TVPage() {
  const [tvShows, setTVShows] = useState<TVShow[]>([]);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState("popularity.desc");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGenres("tv")
      .then((data) => setGenres(data))
      .catch(console.error);
  }, []);

  useEffect(() => {
    async function loadTV() {
      try {
        setLoading(true);
        const data = await fetchTVShows({
          genre: selectedGenre || undefined,
          sortBy,
        });
        setTVShows(data);
      } catch (err) {
        console.error("Failed to load TV shows", err);
      } finally {
        setLoading(false);
      }
    }
    loadTV();
  }, [selectedGenre, sortBy]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-black text-white flex items-center gap-3">
            <Tv className="w-8 h-8 text-accent" />
            Discover TV Shows & Series
          </h1>
          <p className="text-sm text-light-300 mt-1">
            Binge-worthy shows, drama series, comedies, and anime.
          </p>
        </div>

        {/* Sorting Controls */}
        <div className="flex items-center gap-2 bg-dark-200 border border-white/10 rounded-xl px-3 py-2 text-xs">
          <SlidersHorizontal className="w-4 h-4 text-accent" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-transparent text-white outline-none cursor-pointer"
          >
            <option value="popularity.desc" className="bg-dark-200">Most Popular</option>
            <option value="vote_average.desc" className="bg-dark-200">Highest Rated</option>
            <option value="first_air_date.desc" className="bg-dark-200">Recently Aired</option>
          </select>
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

      {/* TV Shows Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-28">
          <Loader2 className="w-10 h-10 text-accent animate-spin" />
        </div>
      ) : tvShows.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
          {tvShows.map((show) => (
            <MovieCard
              key={show.id}
              id={show.id}
              name={show.name}
              poster_path={show.poster_path}
              vote_average={show.vote_average}
              first_air_date={show.first_air_date}
              media_type="tv"
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-28 text-light-300">
          No TV shows found matching the selected genre.
        </div>
      )}
    </div>
  );
}
