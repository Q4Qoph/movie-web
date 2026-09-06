"use client";

import { useState, useEffect } from "react";
import { Movie } from "@/interfaces/interfaces";
import { searchMulti } from "@/services/api";
import { updateSearchCount } from "@/services/appwrite";
import MovieCard from "@/components/MovieCard";
import { Search, X, Loader2, Film, Tv, Sparkles } from "lucide-react";

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [activeType, setActiveType] = useState<"multi" | "movie" | "tv">("multi");
  const [results, setResults] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalResults, setTotalResults] = useState(0);

  // Debounced search
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setTotalResults(0);
      setLoading(false);
      return;
    }

    setLoading(true);
    const handler = setTimeout(async () => {
      try {
        const data = await searchMulti(query, activeType);
        const filtered = (data.results || []).filter(
          (item: Movie) => item.media_type !== "person" && (item.poster_path || item.backdrop_path)
        );
        setResults(filtered);
        setTotalResults(data.total_results || 0);

        if (filtered.length > 0) {
          updateSearchCount(query, filtered[0]).catch(() => {});
        }
      } catch (err) {
        console.error("Search error", err);
      } finally {
        setLoading(false);
      }
    }, 350);

    return () => clearTimeout(handler);
  }, [query, activeType]);

  const quickPicks = [
    "Avengers",
    "Inception",
    "Stranger Things",
    "Breaking Bad",
    "Spider-Man",
    "Interstellar",
    "The Dark Knight",
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Search Header */}
      <div className="max-w-3xl mx-auto text-center mb-8">
        <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight mb-3">
          Search & Explore
        </h1>
        <p className="text-sm text-light-300">
          Find any movie, TV show, anime, or franchise from TMDB&apos;s vast library.
        </p>
      </div>

      {/* Search Bar Input */}
      <div className="max-w-2xl mx-auto mb-6">
        <div className="relative flex items-center bg-dark-200 border-2 border-white/10 focus-within:border-accent rounded-2xl px-5 py-3.5 shadow-xl transition-all">
          <Search className="w-5 h-5 text-accent flex-shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type a title, actor, or franchise..."
            className="ml-3 flex-1 bg-transparent text-white placeholder-light-300 text-sm sm:text-base outline-none"
            autoFocus
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="p-1 rounded-lg bg-white/10 hover:bg-white/20 text-white"
              aria-label="Clear search query"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Media Type Tabs */}
        <div className="flex items-center justify-center gap-2 mt-4">
          <button
            onClick={() => setActiveType("multi")}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-colors cursor-pointer ${
              activeType === "multi"
                ? "bg-accent text-white"
                : "bg-dark-200 text-light-300 hover:text-white"
            }`}
          >
            All Results
          </button>
          <button
            onClick={() => setActiveType("movie")}
            className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-semibold transition-colors cursor-pointer ${
              activeType === "movie"
                ? "bg-accent text-white"
                : "bg-dark-200 text-light-300 hover:text-white"
            }`}
          >
            <Film className="w-3.5 h-3.5" /> Movies
          </button>
          <button
            onClick={() => setActiveType("tv")}
            className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-semibold transition-colors cursor-pointer ${
              activeType === "tv"
                ? "bg-accent text-white"
                : "bg-dark-200 text-light-300 hover:text-white"
            }`}
          >
            <Tv className="w-3.5 h-3.5" /> TV Shows
          </button>
        </div>
      </div>

      {/* Results or Quick Suggestions */}
      {loading ? (
        <div className="flex items-center justify-center py-24">
          <Loader2 className="w-8 h-8 text-accent animate-spin" />
        </div>
      ) : query.trim() ? (
        <div>
          <div className="flex items-center justify-between mb-6">
            <p className="text-xs text-light-300 uppercase tracking-wider font-semibold">
              Found {totalResults} result{totalResults === 1 ? "" : "s"} for &ldquo;{query}&rdquo;
            </p>
          </div>

          {results.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
              {results.map((item) => (
                <MovieCard
                  key={item.id}
                  id={item.id}
                  title={item.title}
                  name={item.name}
                  poster_path={item.poster_path}
                  vote_average={item.vote_average}
                  release_date={item.release_date}
                  first_air_date={item.first_air_date}
                  media_type={item.media_type}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-dark-200/40 rounded-2xl border border-white/5">
              <p className="text-light-200 font-medium">No matches found.</p>
              <p className="text-xs text-light-300 mt-1">
                Try checking for typos or searching for a different keyword.
              </p>
            </div>
          )}
        </div>
      ) : (
        /* Empty State with Quick Suggestions */
        <div className="max-w-xl mx-auto mt-12 text-center">
          <div className="inline-flex p-3 rounded-full bg-accent/10 text-accent mb-4">
            <Sparkles className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-white mb-2">Popular Searches</h3>
          <p className="text-xs text-light-300 mb-6">
            Looking for something to watch? Try one of these trending queries:
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            {quickPicks.map((pick) => (
              <button
                key={pick}
                onClick={() => setQuery(pick)}
                className="px-3.5 py-1.5 rounded-full bg-dark-200 hover:bg-dark-300 border border-white/10 hover:border-accent text-xs font-medium text-light-200 hover:text-white transition-all cursor-pointer"
              >
                {pick}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
