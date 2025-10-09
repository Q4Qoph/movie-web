"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import useFetch from "@/services/useFetch";
import { fetchMovies } from "@/services/api";
// import { getTrendingMovies } from "@/services/appwrite";
import SearchBar from "@/components/SearchBar";
import MovieCard from "@/components/MovieCard";
import { icons } from "@/contants/icons";
import { images } from "@/contants/images";
// import TrendingCard from "@/components/TrendingCard";



export default function HomePage() {
  const router = useRouter();

  // const {
  //   data: trendingMovies,
  //   loading: trendingLoading,
  //   error: trendingError,
  // } = useFetch(getTrendingMovies);

  const {
    data: movies,
    loading: moviesLoading,
    error: moviesError,
  } = useFetch(() => fetchMovies(""));

  if (moviesLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-primary">
        <p className="text-white animate-pulse">Loading...</p>
      </div>
    );
  }

  if (moviesError) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-primary">
        <p className="text-red-500">
          Error: {moviesError?.message}
        </p>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-primary">
      {/* Background */}
      <Image
        src={images.bg}
        alt="background"
        fill
        className="absolute -z-10 object-cover"
      />

      <div className="relative">
        {/* Logo */}
        <div className="flex justify-center">
          <Image src={icons.logo} alt="logo" width={180} height={120} />
        </div>

        {/* Search Bar */}
        <SearchBar
          placeholder="Search for a movie"
          onPress={() => router.push("/search")}
        />

        {/* Trending Movies */}
        {/* {trendingMovies && (
          <div className="mt-10">
            <h2 className="text-lg font-bold text-white mb-3">
              Trending Movies
            </h2>
            <div className="flex gap-4 overflow-x-auto pb-4">
              {trendingMovies.map((movie: any, index: number) => (
                <TrendingCard key={movie.movie_id} movie={movie} index={index} />
              ))}
            </div>
          </div>
        )} */}

        {/* Latest Movies */}
        {movies && (
          <div className="mt-10">
            <h2 className="text-lg font-bold text-white mb-3">Latest Movies</h2>
            <div className="grid grid-cols-3 gap-5">
              {movies.map((movie: any) => (
                <MovieCard key={movie.id} {...movie} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
