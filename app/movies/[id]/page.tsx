"use client";

import { use, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { MovieDetails } from "@/interfaces/interfaces";
import { fetchMovieDetails } from "@/services/api";
import { isInWatchlist, toggleWatchlist } from "@/services/watchlist";
import CastList from "@/components/CastList";
import WatchProviders from "@/components/WatchProviders";
import MovieCard from "@/components/MovieCard";
import TrailerModal from "@/components/TrailerModal";
import {
  Star,
  Clock,
  Calendar,
  Play,
  Bookmark,
  ArrowLeft,
  Loader2,
  Share2,
  Film,
} from "lucide-react";

export default function MovieDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const movieId = resolvedParams.id;

  const [movie, setMovie] = useState<MovieDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [trailerOpen, setTrailerOpen] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const data = await fetchMovieDetails(movieId);
        setMovie(data);
        setIsBookmarked(isInWatchlist(data.id));
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Failed to load movie details");
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [movieId]);

  const handleBookmarkToggle = () => {
    if (!movie) return;
    const added = toggleWatchlist({
      id: movie.id,
      title: movie.title,
      poster_path: movie.poster_path,
      vote_average: movie.vote_average,
      release_date: movie.release_date,
      media_type: "movie",
    });
    setIsBookmarked(added);
  };

  const handleShare = () => {
    if (navigator.share && movie) {
      navigator.share({
        title: movie.title,
        text: movie.overview || "",
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard!");
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] gap-3">
        <Loader2 className="w-10 h-10 text-accent animate-spin" />
        <p className="text-light-300 text-sm">Fetching movie details...</p>
      </div>
    );
  }

  if (error || !movie) {
    return (
      <div className="max-w-md mx-auto my-20 p-6 rounded-2xl bg-dark-200 border border-red-500/20 text-center">
        <p className="text-red-400 font-semibold mb-2">Error</p>
        <p className="text-xs text-light-300 mb-6">{error || "Movie not found"}</p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent text-white text-xs font-bold"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Link>
      </div>
    );
  }

  // Format runtime to "Xh Ym"
  const formatRuntime = (minutes?: number | null) => {
    if (!minutes) return "N/A";
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return `${h > 0 ? `${h}h ` : ""}${m}m`;
  };

  const trailer =
    movie.videos?.results?.find(
      (v) => v.type === "Trailer" && v.site === "YouTube"
    ) || movie.videos?.results?.[0];

  const releaseYear = movie.release_date ? movie.release_date.split("-")[0] : "TBA";
  const similarMovies = movie.recommendations?.results?.length
    ? movie.recommendations.results
    : movie.similar?.results || [];

  return (
    <div className="pb-20">
      {/* Backdrop Hero Header */}
      <div className="relative w-full h-[55vh] min-h-[400px] max-h-[600px] overflow-hidden">
        {movie.backdrop_path ? (
          <Image
            src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`}
            alt={movie.title}
            fill
            priority
            className="object-cover object-top opacity-50"
          />
        ) : (
          <div className="w-full h-full bg-dark-200" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#08071a] via-[#08071a]/80 to-transparent" />
        <div className="absolute top-6 left-4 sm:left-8 z-10">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-black/60 hover:bg-black/80 backdrop-blur-md text-white text-xs font-medium border border-white/10 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back
          </Link>
        </div>
      </div>

      {/* Main Details Body */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-44 relative z-10">
        <div className="flex flex-col md:flex-row gap-8 lg:gap-12">
          {/* Poster Column */}
          <div className="w-48 sm:w-64 md:w-80 flex-shrink-0 mx-auto md:mx-0">
            <div className="relative aspect-[2/3] rounded-2xl overflow-hidden shadow-2xl shadow-black/80 border border-white/15 bg-dark-300">
              <Image
                src={
                  movie.poster_path
                    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                    : "https://placehold.co/500x750/120f2e/a8b5db.png?text=No+Poster"
                }
                alt={movie.title}
                fill
                priority
                className="object-cover"
              />
            </div>

            {/* Action Buttons under poster */}
            <div className="mt-4 flex flex-col gap-2.5">
              {trailer && (
                <button
                  onClick={() => setTrailerOpen(true)}
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-accent hover:bg-accent-hover text-white font-bold text-sm shadow-lg shadow-accent/25 transition-all hover:scale-[1.02] active:scale-98 cursor-pointer"
                >
                  <Play className="w-4 h-4 fill-white" />
                  Watch Trailer
                </button>
              )}

              <div className="flex gap-2">
                <button
                  onClick={handleBookmarkToggle}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border text-xs font-semibold transition-all ${
                    isBookmarked
                      ? "bg-accent/20 border-accent text-accent"
                      : "bg-dark-200 border-white/10 text-white hover:bg-dark-300"
                  }`}
                >
                  <Bookmark className={`w-4 h-4 ${isBookmarked ? "fill-accent" : ""}`} />
                  {isBookmarked ? "In Watchlist" : "Add to Watchlist"}
                </button>

                <button
                  onClick={handleShare}
                  aria-label="Share movie"
                  className="p-2.5 rounded-xl bg-dark-200 border border-white/10 text-white hover:bg-dark-300 transition-colors"
                >
                  <Share2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Metadata & Synopsis Column */}
          <div className="flex-1 flex flex-col pt-2">
            {/* Title & Tagline */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
              {movie.title}
            </h1>
            {movie.tagline && (
              <p className="mt-1 text-sm sm:text-base text-light-100 italic font-medium">
                &ldquo;{movie.tagline}&rdquo;
              </p>
            )}

            {/* Quick Metrics Badge Ribbon */}
            <div className="mt-4 flex flex-wrap items-center gap-3 text-xs font-semibold">
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-black/60 border border-amber-500/20 text-amber-300">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span className="font-bold text-sm">{movie.vote_average.toFixed(1)}</span>
                <span className="text-[10px] text-light-300">({movie.vote_count} votes)</span>
              </div>

              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-dark-200 border border-white/10 text-light-200">
                <Calendar className="w-4 h-4 text-accent" />
                <span>{releaseYear}</span>
              </div>

              {movie.runtime ? (
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-dark-200 border border-white/10 text-light-200">
                  <Clock className="w-4 h-4 text-accent" />
                  <span>{formatRuntime(movie.runtime)}</span>
                </div>
              ) : null}

              {movie.status && (
                <span className="px-3 py-1.5 rounded-lg bg-dark-200 border border-white/10 text-light-200 uppercase tracking-wider text-[10px]">
                  {movie.status}
                </span>
              )}
            </div>

            {/* Genre Pills */}
            {movie.genres && movie.genres.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {movie.genres.map((g) => (
                  <span
                    key={g.id}
                    className="px-3 py-1 rounded-full text-xs font-medium bg-dark-200 border border-white/10 text-light-100"
                  >
                    {g.name}
                  </span>
                ))}
              </div>
            )}

            {/* Overview */}
            <div className="mt-6">
              <h2 className="text-base font-bold text-white mb-2 uppercase tracking-wider text-xs text-light-300">
                Storyline
              </h2>
              <p className="text-sm sm:text-base text-light-200 leading-relaxed max-w-3xl">
                {movie.overview || "No synopsis available for this title."}
              </p>
            </div>

            {/* Watch Providers (Where to Stream) */}
            <WatchProviders providers={movie["watch/providers"]?.results} />
          </div>
        </div>

        {/* Cast List */}
        {movie.credits?.cast && <CastList cast={movie.credits.cast} />}

        {/* Similar & Recommended Movies */}
        {similarMovies.length > 0 && (
          <div className="mt-16">
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <Film className="w-5 h-5 text-accent" />
              More Like This
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
              {similarMovies.slice(0, 10).map((item) => (
                <MovieCard
                  key={item.id}
                  id={item.id}
                  title={item.title}
                  poster_path={item.poster_path}
                  vote_average={item.vote_average}
                  release_date={item.release_date}
                  media_type="movie"
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Trailer Modal */}
      {trailer && (
        <TrailerModal
          isOpen={trailerOpen}
          onClose={() => setTrailerOpen(false)}
          videoKey={trailer.key}
          title={movie.title}
        />
      )}
    </div>
  );
}
