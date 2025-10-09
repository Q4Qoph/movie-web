"use client";

import { icons } from "@/contants/icons";
import Image from "next/image";
import Link from "next/link";


type Movie = {
  id: number;
  poster_path: string | null;
  title: string;
  vote_average: number;
  release_date: string;
};

const MovieCard = ({ id, poster_path, title, vote_average, release_date }: Movie) => {
  return (
    <Link href={`/movies/${id}`} className="block w-[30%]">
      {/* Poster */}
      <div className="relative w-full h-52">
        <Image
          src={
            poster_path
              ? `https://image.tmdb.org/t/p/w500${poster_path}`
              : "https://placehold.co/600x400/1a1a1a/fffff.png"
          }
          alt={title}
          fill
          className="rounded-lg object-cover"
        />
      </div>

      {/* Title */}
      <p className="mt-2 truncate text-sm font-bold text-white">{title}</p>

      {/* Rating */}
      <div className="mt-1 flex items-center gap-1">
        <Image src={icons.star} alt="star" width={16} height={16} />
        <span className="text-xs font-bold uppercase text-white">
          {Math.round(vote_average)}
        </span>
      </div>

      {/* Release Date */}
      <div className="flex items-center justify-between">
        <span className="mt-1 text-xs font-medium text-light-300">
          {release_date?.split("-")[0]}
        </span>
      </div>
    </Link>
  );
};

export default MovieCard;
