import Image from "next/image";
import { WatchProviderCountry } from "@/interfaces/interfaces";
import { Tv } from "lucide-react";

interface WatchProvidersProps {
  providers?: Record<string, WatchProviderCountry>;
  defaultCountry?: string;
}

export default function WatchProviders({
  providers,
  defaultCountry = "US",
}: WatchProvidersProps) {
  if (!providers) return null;

  // Look for US data or first available country data
  const countryData = providers[defaultCountry] || Object.values(providers)[0];
  if (!countryData) return null;

  const streamProviders = countryData.flatrate || [];
  const rentProviders = countryData.rent || [];
  const buyProviders = countryData.buy || [];

  const hasAny = streamProviders.length > 0 || rentProviders.length > 0 || buyProviders.length > 0;
  if (!hasAny) return null;

  return (
    <div className="mt-8 p-5 rounded-2xl bg-dark-200/70 border border-white/10">
      <h3 className="text-sm font-bold uppercase tracking-wider text-light-200 mb-4 flex items-center gap-2">
        <Tv className="w-4 h-4 text-accent" />
        Where to Watch (Powered by JustWatch)
      </h3>

      <div className="space-y-4 text-xs">
        {/* Streaming */}
        {streamProviders.length > 0 && (
          <div>
            <span className="text-light-300 font-medium block mb-2">Stream:</span>
            <div className="flex flex-wrap gap-2.5">
              {streamProviders.map((p) => (
                <div
                  key={p.provider_id}
                  title={p.provider_name}
                  className="relative w-10 h-10 rounded-xl overflow-hidden shadow-md border border-white/10 hover:border-accent hover:scale-105 transition-transform"
                >
                  <Image
                    src={`https://image.tmdb.org/t/p/w92${p.logo_path}`}
                    alt={p.provider_name}
                    fill
                    sizes="40px"
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Rent */}
        {rentProviders.length > 0 && (
          <div>
            <span className="text-light-300 font-medium block mb-2">Rent:</span>
            <div className="flex flex-wrap gap-2.5">
              {rentProviders.map((p) => (
                <div
                  key={p.provider_id}
                  title={p.provider_name}
                  className="relative w-10 h-10 rounded-xl overflow-hidden shadow-md border border-white/10 hover:border-accent hover:scale-105 transition-transform"
                >
                  <Image
                    src={`https://image.tmdb.org/t/p/w92${p.logo_path}`}
                    alt={p.provider_name}
                    fill
                    sizes="40px"
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Buy */}
        {buyProviders.length > 0 && (
          <div>
            <span className="text-light-300 font-medium block mb-2">Buy:</span>
            <div className="flex flex-wrap gap-2.5">
              {buyProviders.map((p) => (
                <div
                  key={p.provider_id}
                  title={p.provider_name}
                  className="relative w-10 h-10 rounded-xl overflow-hidden shadow-md border border-white/10 hover:border-accent hover:scale-105 transition-transform"
                >
                  <Image
                    src={`https://image.tmdb.org/t/p/w92${p.logo_path}`}
                    alt={p.provider_name}
                    fill
                    sizes="40px"
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
