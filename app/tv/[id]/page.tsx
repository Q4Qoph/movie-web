"use client";

import { use, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { TVDetails } from "@/interfaces/interfaces";
import { fetchTVDetails } from "@/services/api";
import { isInWatchlist, toggleWatchlist } from "@/services/watchlist";
import CastList from "@/components/CastList";
import WatchProviders from "@/components/WatchProviders";
import MovieCard from "@/components/MovieCard";
import TrailerModal from "@/components/TrailerModal";
import {
  Star,
  Calendar,
  Play,
  Bookmark,
  ArrowLeft,
  Loader2,
  Share2,
  Tv,
  Layers,
} from "lucide-react";

export default function TVDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const tvId = resolvedParams.id;

  const [tv, setTv] = useState<TVDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [trailerOpen, setTrailerOpen] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const data = await fetchTVDetails(tvId);
        setTv(data);
        setIsBookmarked(isInWatchlist(data.id));
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Failed to load TV details");
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [tvId]);

  const handleBookmarkToggle = () => {
    if (!tv) return;
    const added = toggleWatchlist({
      id: tv.id,
      title: tv.name,
      poster_path: tv.poster_path,
      vote_average: tv.vote_average,
      release_date: tv.first_air_date,
      media_type: "tv",
    });
    setIsBookmarked(added);
  };

  const handleShare = () => {
    if (navigator.share && tv) {
      navigator.share({
        title: tv.name,
        text: tv.overview || "",
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
        <p className="text-light-300 text-sm">Fetching series details...</p>
      </div>
    );
  }

  if (error || !tv) {
    return (
      <div className="max-w-md mx-auto my-20 p-6 rounded-2xl bg-dark-200 border border-red-500/20 text-center">
        <p className="text-red-400 font-semibold mb-2">Error</p>
        <p className="text-xs text-light-300 mb-6">{error || "TV Show not found"}</p>
        <Link
          href="/tv"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent text-white text-xs font-bold"
        >
          <ArrowLeft className="w-4 h-4" /> Back to TV Shows
        </Link>
      </div>
    );
  }

  const trailer =
    tv.videos?.results?.find(
      (v) => v.type === "Trailer" && v.site === "YouTube"
    ) || tv.videos?.results?.[0];

  const firstYear = tv.first_air_date ? tv.first_air_date.split("-")[0] : "TBA";
  const similarShows = tv.recommendations?.results?.length
    ? tv.recommendations.results
    : tv.similar?.results || [];

  return (
    <div className="pb-20">
      {/* Backdrop Hero */}
      <div className="relative w-full h-[55vh] min-h-[400px] max-h-[600px] overflow-hidden">
        {tv.backdrop_path ? (
          <Image
            src={`https://image.tmdb.org/t/p/original${tv.backdrop_path}`}
            alt={tv.name}
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
            href="/tv"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-black/60 hover:bg-black/80 backdrop-blur-md text-white text-xs font-medium border border-white/10 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to TV Shows
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
                  tv.poster_path
                    ? `https://image.tmdb.org/t/p/w500${tv.poster_path}`
                    : "https://placehold.co/500x750/120f2e/a8b5db.png?text=No+Poster"
                }
                alt={tv.name}
                fill
                priority
                className="object-cover"
              />
            </div>

            {/* Actions */}
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
                  aria-label="Share show"
                  className="p-2.5 rounded-xl bg-dark-200 border border-white/10 text-white hover:bg-dark-300 transition-colors"
                >
                  <Share2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Metadata & Synopsis */}
          <div className="flex-1 flex flex-col pt-2">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
              {tv.name}
            </h1>
            {tv.tagline && (
              <p className="mt-1 text-sm sm:text-base text-light-100 italic font-medium">
                &ldquo;{tv.tagline}&rdquo;
              </p>
            )}

            {/* Badge Ribbon */}
            <div className="mt-4 flex flex-wrap items-center gap-3 text-xs font-semibold">
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-black/60 border border-amber-500/20 text-amber-300">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span className="font-bold text-sm">{tv.vote_average.toFixed(1)}</span>
                <span className="text-[10px] text-light-300">({tv.vote_count} votes)</span>
              </div>

              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-dark-200 border border-white/10 text-light-200">
                <Calendar className="w-4 h-4 text-accent" />
                <span>Premiered: {firstYear}</span>
              </div>

              {tv.number_of_seasons ? (
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-dark-200 border border-white/10 text-light-200">
                  <Layers className="w-4 h-4 text-accent" />
                  <span>
                    {tv.number_of_seasons} Season{tv.number_of_seasons > 1 ? "s" : ""}
                  </span>
                </div>
              ) : null}

              {tv.status && (
                <span className="px-3 py-1.5 rounded-lg bg-dark-200 border border-white/10 text-light-200 uppercase tracking-wider text-[10px]">
                  {tv.status}
                </span>
              )}
            </div>

            {/* Genre Pills */}
            {tv.genres && tv.genres.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {tv.genres.map((g) => (
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
                {tv.overview || "No synopsis available for this TV series."}
              </p>
            </div>

            {/* Seasons List */}
            {tv.seasons && tv.seasons.length > 0 && (
              <div className="mt-8">
                <h3 className="text-sm font-bold uppercase tracking-wider text-light-300 mb-3">
                  Seasons & Episodes
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {tv.seasons.map((season) => (
                    <div
                      key={season.id}
                      className="p-3 rounded-xl bg-dark-200/60 border border-white/5 flex items-center justify-between"
                    >
                      <div>
                        <p className="text-xs font-bold text-white">{season.name}</p>
                        <p className="text-[11px] text-light-300">
                          {season.episode_count} Episodes
                        </p>
                      </div>
                      {season.air_date && (
                        <span className="text-[10px] text-light-300 font-mono">
                          {season.air_date.split("-")[0]}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Watch Providers */}
            <WatchProviders providers={tv["watch/providers"]?.results} />
          </div>
        </div>

        {/* Cast List */}
        {tv.credits?.cast && <CastList cast={tv.credits.cast} />}

        {/* Similar TV Shows */}
        {similarShows.length > 0 && (
          <div className="mt-16">
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <Tv className="w-5 h-5 text-accent" />
              More Like This
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
              {similarShows.slice(0, 10).map((item) => (
                <MovieCard
                  key={item.id}
                  id={item.id}
                  name={item.name}
                  poster_path={item.poster_path}
                  vote_average={item.vote_average}
                  first_air_date={item.first_air_date}
                  media_type="tv"
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
          title={tv.name}
        />
      )}
    </div>
  );
}
