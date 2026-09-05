import Link from "next/link";
import { Sparkles } from "lucide-react";

export default function Footer() {
  return (
    <footer className="mt-24 border-t border-white/10 bg-dark-100 text-light-300 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <span className="text-lg font-bold text-white tracking-wider">
                MOVIE<span className="text-accent">WEB</span>
              </span>
            </Link>
            <p className="text-sm text-light-300 max-w-sm leading-relaxed">
              Your premier entertainment gateway. Discover trending movies, top-rated TV series,
              watch trailers, and track your personalized watchlist in real-time.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Explore
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="hover:text-accent transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/movies" className="hover:text-accent transition-colors">
                  Movies
                </Link>
              </li>
              <li>
                <Link href="/tv" className="hover:text-accent transition-colors">
                  TV Shows
                </Link>
              </li>
              <li>
                <Link href="/trending" className="hover:text-accent transition-colors">
                  Trending Now
                </Link>
              </li>
              <li>
                <Link href="/watchlist" className="hover:text-accent transition-colors">
                  My Watchlist
                </Link>
              </li>
            </ul>
          </div>

          {/* Attribution */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Data & API
            </h4>
            <p className="text-xs text-light-300 leading-relaxed">
              This product uses the TMDB API but is not endorsed or certified by TMDB.
            </p>
            <div className="mt-3">
              <a
                href="https://www.themoviedb.org"
                target="_blank"
                rel="noreferrer"
                className="inline-block px-3 py-1.5 rounded-lg bg-dark-200 border border-white/10 text-xs font-semibold text-accent hover:border-accent transition-colors"
              >
                The Movie Database (TMDB)
              </a>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-light-300">
          <p>© {new Date().getFullYear()} Movie-Web. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Built with Next.js 15, React 19 & Tailwind CSS.
          </p>
        </div>
      </div>
    </footer>
  );
}
