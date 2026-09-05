"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { Star, Bookmark, Film, Tv } from "lucide-react";
import { isInWatchlist, toggleWatchlist } from "@/services/watchlist";

interface MovieCardProps {
  id: number;
  title?: string;
  name?: string; // for TV
  poster_path: string | null;
  vote_average: number;
  release_date?: string;
  first_air_date?: string; // for TV
  media_type?: "movie" | "tv" | "person";
}

export default function MovieCard({
  id,
  title,
  name,
  poster_path,
  vote_average,
  release_date,
  first_air_date,
  media_type = "movie",
}: MovieCardProps) {
  const displayTitle = title || name || "Untitled";
  const dateStr = release_date || first_air_date || "";
  const year = dateStr ? dateStr.split("-")[0] : "";
  const isTV = media_type === "tv" || (!title && Boolean(name));
  const linkHref = isTV ? `/tv/${id}` : `/movies/${id}`;

  const [bookmarked, setBookmarked] = useState(false);

  useEffect(() => {
    setBookmarked(isInWatchlist(id));

    const handleWatchlistUpdate = () => {
      setBookmarked(isInWatchlist(id));
    };

    window.addEventListener("watchlist-updated", handleWatchlistUpdate);
    return () => window.removeEventListener("watchlist-updated", handleWatchlistUpdate);
  }, [id]);

  const handleBookmarkClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const added = toggleWatchlist({
      id,
      title: displayTitle,
      poster_path,
      vote_average,
      release_date: dateStr,
      media_type: isTV ? "tv" : "movie",
    });
    setBookmarked(added);
  };

  return (
    <div className="group relative flex flex-col rounded-2xl bg-dark-200/60 hover:bg-dark-200 border border-white/5 hover:border-accent/40 p-2.5 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-accent/10">
      <Link href={linkHref} className="block relative w-full aspect-[2/3] overflow-hidden rounded-xl bg-dark-300">
        <Image
          src={
            poster_path
              ? `https://image.tmdb.org/t/p/w500${poster_path}`
              : "https://placehold.co/500x750/120f2e/a8b5db.png?text=No+Poster"
          }
          alt={displayTitle}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Gradient overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 opacity-60 group-hover:opacity-80 transition-opacity" />

        {/* Top Badges */}
        <div className="absolute top-2 left-2 right-2 flex items-center justify-between pointer-events-none">
          {/* Media Type Badge */}
          <span className="inline-flex items-center gap-1 rounded-md bg-black/60 backdrop-blur-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-light-100 border border-white/10">
            {isTV ? <Tv className="w-3 h-3 text-accent" /> : <Film className="w-3 h-3 text-accent" />}
            {isTV ? "TV" : "Movie"}
          </span>

          {/* Rating Badge */}
          <span className="inline-flex items-center gap-1 rounded-md bg-black/70 backdrop-blur-md px-2 py-0.5 text-[11px] font-bold text-amber-300 border border-amber-500/20">
            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
            {vote_average ? vote_average.toFixed(1) : "NR"}
          </span>
        </div>

        {/* Quick Bookmark Button */}
        <button
          onClick={handleBookmarkClick}
          aria-label={bookmarked ? "Remove from Watchlist" : "Add to Watchlist"}
          className={`absolute bottom-2 right-2 p-2 rounded-full backdrop-blur-md transition-all duration-200 pointer-events-auto ${
            bookmarked
              ? "bg-accent text-white shadow-lg shadow-accent/40 scale-105"
              : "bg-black/60 text-light-200 hover:text-white hover:bg-black/90 opacity-0 group-hover:opacity-100"
          }`}
        >
          <Bookmark className={`w-4 h-4 ${bookmarked ? "fill-white" : ""}`} />
        </button>
      </Link>

      {/* Info Section */}
      <div className="mt-3 flex flex-col gap-1 px-1">
        <Link href={linkHref} className="focus:outline-none">
          <h3 className="font-semibold text-sm text-white group-hover:text-accent transition-colors line-clamp-1">
            {displayTitle}
          </h3>
        </Link>
        <div className="flex items-center justify-between text-xs text-light-300">
          <span>{year || "TBA"}</span>
          <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-white/5 border border-white/5">
            HD
          </span>
        </div>
      </div>
    </div>
  );
}
