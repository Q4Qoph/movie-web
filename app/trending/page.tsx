"use client";

import { useState, useEffect } from "react";
import { Movie } from "@/interfaces/interfaces";
import { fetchTrending } from "@/services/api";
import MovieCard from "@/components/MovieCard";
import { Flame, Calendar, Clock, Loader2 } from "lucide-react";

export default function TrendingPage() {
  const [mediaType, setMediaType] = useState<"all" | "movie" | "tv">("all");
  const [timeWindow, setTimeWindow] = useState<"day" | "week">("day");
  const [items, setItems] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadTrending() {
      try {
        setLoading(true);
        const data = await fetchTrending(mediaType, timeWindow);
        setItems(data);
      } catch (err) {
        console.error("Failed to load trending items", err);
      } finally {
        setLoading(false);
      }
    }
    loadTrending();
  }, [mediaType, timeWindow]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div>
          <h1 className="text-3xl font-black text-white flex items-center gap-3">
            <Flame className="w-8 h-8 text-orange-400 animate-pulse" />
            Trending Right Now
          </h1>
          <p className="text-sm text-light-300 mt-1">
            Real-time viral hits, trending movies, and most-talked-about TV series.
          </p>
        </div>

        {/* Filter Controls */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Media Type Tabs */}
          <div className="flex p-1 rounded-xl bg-dark-200 border border-white/10 text-xs">
            {(["all", "movie", "tv"] as const).map((type) => (
              <button
                key={type}
                onClick={() => setMediaType(type)}
                className={`px-3 py-1.5 rounded-lg font-semibold uppercase tracking-wider transition-colors cursor-pointer ${
                  mediaType === type
                    ? "bg-accent text-white shadow-md shadow-accent/25"
                    : "text-light-300 hover:text-white"
                }`}
              >
                {type === "all" ? "All" : type === "movie" ? "Movies" : "TV"}
              </button>
            ))}
          </div>

          {/* Time Window Tabs */}
          <div className="flex p-1 rounded-xl bg-dark-200 border border-white/10 text-xs">
            <button
              onClick={() => setTimeWindow("day")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition-colors cursor-pointer ${
                timeWindow === "day"
                  ? "bg-accent text-white shadow-md shadow-accent/25"
                  : "text-light-300 hover:text-white"
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              Today
            </button>
            <button
              onClick={() => setTimeWindow("week")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition-colors cursor-pointer ${
                timeWindow === "week"
                  ? "bg-accent text-white shadow-md shadow-accent/25"
                  : "text-light-300 hover:text-white"
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              This Week
            </button>
          </div>
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-28">
          <Loader2 className="w-10 h-10 text-accent animate-spin" />
        </div>
      ) : items.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
          {items.map((item, index) => (
            <div key={item.id} className="relative">
              {/* Ranking Number Ribbon */}
              <div className="absolute -top-2 -left-2 z-20 w-8 h-8 rounded-full bg-gradient-to-tr from-accent to-purple-600 border-2 border-[#08071a] flex items-center justify-center font-black text-xs text-white shadow-lg">
                {index + 1}
              </div>
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
      ) : (
        <div className="text-center py-28 text-light-300">
          No trending items found.
        </div>
      )}
    </div>
  );
}
