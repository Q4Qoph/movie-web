"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Play, Info, Star, Bookmark } from "lucide-react";
import { Movie, VideoItem } from "@/interfaces/interfaces";
import TrailerModal from "./TrailerModal";
import { toggleWatchlist } from "@/services/watchlist";

interface HeroBannerProps {
  movie: Movie | null;
}

export default function HeroBanner({ movie }: HeroBannerProps) {
  const [trailerOpen, setTrailerOpen] = useState(false);
  const [trailerKey, setTrailerKey] = useState<string | null>(null);
  const [loadingTrailer, setLoadingTrailer] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);

  if (!movie) return null;

  const title = movie.title || movie.name || "Featured Title";
  const dateStr = movie.release_date || movie.first_air_date || "";
  const year = dateStr ? dateStr.split("-")[0] : "";
  const isTV = movie.media_type === "tv" || (!movie.title && Boolean(movie.name));
  const linkHref = isTV ? `/tv/${movie.id}` : `/movies/${movie.id}`;

  const handlePlayTrailer = async () => {
    if (trailerKey) {
      setTrailerOpen(true);
      return;
    }

    try {
      setLoadingTrailer(true);
      const endpoint = isTV ? `/api/tv/${movie.id}` : `/api/movie/${movie.id}`;
      const res = await fetch(endpoint);
      if (res.ok) {
        const data = await res.json();
        const trailer =
          data.videos?.results?.find(
            (v: VideoItem) => v.type === "Trailer" && v.site === "YouTube"
          ) || data.videos?.results?.[0];

        if (trailer) {
          setTrailerKey(trailer.key);
          setTrailerOpen(true);
        } else {
          alert("Trailer not available for this title.");
        }
      }
    } catch {
      alert("Failed to load trailer.");
    } finally {
      setLoadingTrailer(false);
    }
  };

  const handleBookmarkToggle = () => {
    const added = toggleWatchlist({
      id: movie.id,
      title,
      poster_path: movie.poster_path,
      vote_average: movie.vote_average,
      release_date: dateStr,
      media_type: isTV ? "tv" : "movie",
    });
    setBookmarked(added);
  };

  return (
    <>
      <div className="relative w-full h-[70vh] min-h-[500px] max-h-[750px] overflow-hidden rounded-3xl mb-12 shadow-2xl shadow-purple-950/20 border border-white/10">
        {/* Backdrop Image */}
        {movie.backdrop_path ? (
          <Image
            src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`}
            alt={title}
            fill
            priority
            className="object-cover object-top"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-tr from-dark-100 to-dark-200" />
        )}

        {/* Gradient Mask Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#08071a] via-[#08071a]/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#08071a] via-[#08071a]/80 to-transparent w-full md:w-3/4" />

        {/* Hero Content */}
        <div className="absolute inset-0 flex flex-col justify-end p-6 sm:p-10 md:p-14 max-w-3xl">
          {/* Badges */}
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-accent text-white shadow-lg shadow-accent/30">
              #1 Trending Today
            </span>
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-black/60 backdrop-blur-md text-amber-400 border border-amber-500/20">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>{movie.vote_average ? movie.vote_average.toFixed(1) : "N/A"}</span>
            </div>
            {year && (
              <span className="text-xs font-medium text-light-200 px-2.5 py-1 rounded-full bg-white/10 backdrop-blur-md">
                {year}
              </span>
            )}
          </div>

          {/* Title */}
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-white tracking-tight leading-none drop-shadow-md line-clamp-2 mb-4">
            {title}
          </h1>

          {/* Synopsis */}
          <p className="text-sm sm:text-base text-light-200 line-clamp-3 mb-8 max-w-2xl leading-relaxed drop-shadow">
            {movie.overview || "Discover and explore full metadata, trailers, and cast details."}
          </p>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-4">
            <button
              onClick={handlePlayTrailer}
              disabled={loadingTrailer}
              className="flex items-center gap-2.5 px-6 py-3.5 rounded-full bg-accent hover:bg-accent-hover text-white font-bold text-sm sm:text-base shadow-xl shadow-accent/30 transition-all hover:scale-105 active:scale-95 disabled:opacity-50 cursor-pointer"
            >
              <Play className="w-5 h-5 fill-white" />
              {loadingTrailer ? "Loading..." : "Watch Trailer"}
            </button>

            <Link
              href={linkHref}
              className="flex items-center gap-2 px-6 py-3.5 rounded-full bg-dark-200/80 hover:bg-dark-300 text-white font-semibold text-sm sm:text-base border border-white/10 hover:border-white/20 backdrop-blur-md transition-all hover:scale-105 active:scale-95"
            >
              <Info className="w-5 h-5 text-accent" />
              More Details
            </Link>

            <button
              onClick={handleBookmarkToggle}
              aria-label="Add to Watchlist"
              className="p-3.5 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-md border border-white/10 transition-transform hover:scale-105 active:scale-95"
            >
              <Bookmark className={`w-5 h-5 ${bookmarked ? "fill-accent text-accent" : ""}`} />
            </button>
          </div>
        </div>
      </div>

      <TrailerModal
        isOpen={trailerOpen}
        onClose={() => setTrailerOpen(false)}
        videoKey={trailerKey}
        title={title}
      />
    </>
  );
}
