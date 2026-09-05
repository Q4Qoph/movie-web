import Image from "next/image";
import { CastMember } from "@/interfaces/interfaces";
import { User } from "lucide-react";

interface CastListProps {
  cast: CastMember[];
}

export default function CastList({ cast }: CastListProps) {
  if (!cast || cast.length === 0) return null;

  // Display top 15 cast members
  const topCast = cast.slice(0, 15);

  return (
    <div className="mt-10">
      <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
        <User className="w-5 h-5 text-accent" />
        Top Cast & Characters
      </h2>
      <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
        {topCast.map((member) => (
          <div
            key={member.id + member.character}
            className="flex-shrink-0 w-28 sm:w-32 flex flex-col items-center text-center group"
          >
            <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden bg-dark-300 border-2 border-white/10 group-hover:border-accent transition-colors shadow-md">
              {member.profile_path ? (
                <Image
                  src={`https://image.tmdb.org/t/p/w185${member.profile_path}`}
                  alt={member.name}
                  fill
                  sizes="120px"
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-dark-200 text-light-300">
                  <User className="w-8 h-8 opacity-40" />
                </div>
              )}
            </div>
            <p className="mt-2 text-xs font-semibold text-white group-hover:text-accent line-clamp-1 transition-colors">
              {member.name}
            </p>
            <p className="text-[11px] text-light-300 line-clamp-1">
              {member.character || "Cast"}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
