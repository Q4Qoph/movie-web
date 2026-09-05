"use client";

import { useState, useEffect, useCallback } from "react";
import { WatchlistItem } from "@/interfaces/interfaces";
import { getWatchlist, getFavorites } from "@/services/watchlist";
import MovieCard from "@/components/MovieCard";
import { Bookmark, Heart, Trash2, Film, Sparkles } from "lucide-react";
import Link from "next/link";

export default function WatchlistPage() {
  const [activeTab, setActiveTab] = useState<"watchlist" | "favorites">("watchlist");
  const [items, setItems] = useState<WatchlistItem[]>([]);

  const reloadData = useCallback(() => {
    setItems(activeTab === "watchlist" ? getWatchlist() : getFavorites());
  }, [activeTab]);

  useEffect(() => {
    reloadData();

    const handleUpdate = () => reloadData();
    window.addEventListener("watchlist-updated", handleUpdate);
    window.addEventListener("favorites-updated", handleUpdate);

    return () => {
      window.removeEventListener("watchlist-updated", handleUpdate);
      window.removeEventListener("favorites-updated", handleUpdate);
    };
  }, [reloadData]);

  const handleClearAll = () => {
    if (confirm(`Are you sure you want to clear your ${activeTab}?`)) {
      const storageKey =
        activeTab === "watchlist"
          ? "movieweb_user_watchlist"
          : "movieweb_user_favorites";
      localStorage.removeItem(storageKey);
      setItems([]);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-black text-white flex items-center gap-3">
            <Bookmark className="w-8 h-8 text-accent" />
            My Saved Library
          </h1>
          <p className="text-sm text-light-300 mt-1">
            Keep track of movies and TV shows you want to watch or loved.
          </p>
        </div>

        {/* Tab switcher & Actions */}
        <div className="flex items-center gap-3">
          <div className="flex p-1 rounded-xl bg-dark-200 border border-white/10 text-xs">
            <button
              onClick={() => setActiveTab("watchlist")}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg font-semibold transition-colors cursor-pointer ${
                activeTab === "watchlist"
                  ? "bg-accent text-white shadow-md shadow-accent/25"
                  : "text-light-300 hover:text-white"
              }`}
            >
              <Bookmark className="w-3.5 h-3.5" />
              Watchlist ({getWatchlist().length})
            </button>
            <button
              onClick={() => setActiveTab("favorites")}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg font-semibold transition-colors cursor-pointer ${
                activeTab === "favorites"
                  ? "bg-accent text-white shadow-md shadow-accent/25"
                  : "text-light-300 hover:text-white"
              }`}
            >
              <Heart className="w-3.5 h-3.5" />
              Favorites ({getFavorites().length})
            </button>
          </div>

          {items.length > 0 && (
            <button
              onClick={handleClearAll}
              title="Clear all items"
              className="p-2.5 rounded-xl bg-dark-200 hover:bg-red-500/20 text-light-300 hover:text-red-400 border border-white/10 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Grid of Saved Items */}
      {items.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
          {items.map((item) => (
            <MovieCard
              key={item.id}
              id={item.id}
              title={item.media_type === "movie" ? item.title : undefined}
              name={item.media_type === "tv" ? item.title : undefined}
              poster_path={item.poster_path}
              vote_average={item.vote_average}
              release_date={item.release_date}
              media_type={item.media_type}
            />
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="max-w-md mx-auto my-20 p-8 rounded-3xl bg-dark-200/50 border border-white/5 text-center">
          <div className="w-14 h-14 rounded-2xl bg-accent/10 text-accent flex items-center justify-center mx-auto mb-4">
            <Film className="w-7 h-7" />
          </div>
          <h3 className="text-lg font-bold text-white mb-2">
            Your {activeTab === "watchlist" ? "Watchlist" : "Favorites"} is Empty
          </h3>
          <p className="text-xs text-light-300 mb-6 leading-relaxed">
            Browse movies and TV shows and click the bookmark button on any title to save it for later.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-accent hover:bg-accent-hover text-white text-xs font-bold transition-all shadow-lg shadow-accent/25"
          >
            <Sparkles className="w-4 h-4" /> Explore Titles
          </Link>
        </div>
      )}
    </div>
  );
}
