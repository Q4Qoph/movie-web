"use client";

import { Genre } from "@/interfaces/interfaces";

interface GenreFilterProps {
  genres: Genre[];
  selectedGenre: string | null;
  onSelectGenre: (genreId: string | null) => void;
}

export default function GenreFilter({
  genres,
  selectedGenre,
  onSelectGenre,
}: GenreFilterProps) {
  if (!genres || genres.length === 0) return null;

  return (
    <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar py-2">
      <button
        onClick={() => onSelectGenre(null)}
        className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
          selectedGenre === null
            ? "bg-accent text-white shadow-md shadow-accent/30 scale-105"
            : "bg-dark-200 text-light-200 hover:text-white hover:bg-dark-300 border border-white/5"
        }`}
      >
        All Genres
      </button>

      {genres.map((g) => {
        const isSelected = selectedGenre === g.id.toString();
        return (
          <button
            key={g.id}
            onClick={() => onSelectGenre(isSelected ? null : g.id.toString())}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              isSelected
                ? "bg-accent text-white shadow-md shadow-accent/30 scale-105"
                : "bg-dark-200 text-light-200 hover:text-white hover:bg-dark-300 border border-white/5"
            }`}
          >
            {g.name}
          </button>
        );
      })}
    </div>
  );
}
