import { Movie, TrendingMovie, WatchlistItem } from "@/interfaces/interfaces";

const ENDPOINT =
  process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT ||
  process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT ||
  "https://cloud.appwrite.io/v1";

const PROJECT_ID =
  process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID ||
  process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID ||
  "";

const DATABASE_ID =
  process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID ||
  process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID ||
  "";

const SEARCH_COLLECTION_ID =
  process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_ID ||
  process.env.EXPO_PUBLIC_APPWRITE_COLLECTION_ID ||
  "";

const WATCHLIST_COLLECTION_ID =
  process.env.NEXT_PUBLIC_APPWRITE_WATCHLIST_COLLECTION_ID ||
  process.env.EXPO_PUBLIC_APPWRITE_WATCHLIST_COLLECTION_ID ||
  "";

const FAVORITES_COLLECTION_ID =
  process.env.NEXT_PUBLIC_APPWRITE_FAVORITES_COLLECTION_ID ||
  process.env.EXPO_PUBLIC_APPWRITE_FAVORITES_COLLECTION_ID ||
  "";

const getHeaders = () => ({
  "Content-Type": "application/json",
  "X-Appwrite-Project": PROJECT_ID,
});

export const updateSearchCount = async (query: string, movie: Movie) => {
  if (!PROJECT_ID || !DATABASE_ID || !SEARCH_COLLECTION_ID) return;

  try {
    const listUrl = `${ENDPOINT}/databases/${DATABASE_ID}/collections/${SEARCH_COLLECTION_ID}/documents?queries[]=${encodeURIComponent(
      JSON.stringify({ method: "equal", attribute: "searchTerm", values: [query] })
    )}`;

    const res = await fetch(listUrl, { headers: getHeaders() });
    if (!res.ok) return;

    const data = await res.json();

    if (data.documents && data.documents.length > 0) {
      const existing = data.documents[0];
      await fetch(
        `${ENDPOINT}/databases/${DATABASE_ID}/collections/${SEARCH_COLLECTION_ID}/documents/${existing.$id}`,
        {
          method: "PATCH",
          headers: getHeaders(),
          body: JSON.stringify({
            data: { count: (existing.count || 1) + 1 },
          }),
        }
      );
    } else {
      await fetch(
        `${ENDPOINT}/databases/${DATABASE_ID}/collections/${SEARCH_COLLECTION_ID}/documents`,
        {
          method: "POST",
          headers: getHeaders(),
          body: JSON.stringify({
            documentId: "unique()",
            data: {
              searchTerm: query,
              movie_id: movie.id,
              count: 1,
              title: movie.title || movie.name || "Untitled",
              poster_url: movie.poster_path
                ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                : "",
            },
          }),
        }
      );
    }
  } catch (err) {
    console.error("Failed to update Appwrite search count", err);
  }
};

export const getTrendingMovies = async (): Promise<TrendingMovie[] | undefined> => {
  if (!PROJECT_ID || !DATABASE_ID || !SEARCH_COLLECTION_ID) return undefined;

  try {
    const url = `${ENDPOINT}/databases/${DATABASE_ID}/collections/${SEARCH_COLLECTION_ID}/documents?queries[]=${encodeURIComponent(
      JSON.stringify({ method: "orderDesc", attribute: "count" })
    )}&queries[]=${encodeURIComponent(JSON.stringify({ method: "limit", values: [5] }))}`;

    const res = await fetch(url, { headers: getHeaders() });
    if (!res.ok) return undefined;

    const data = await res.json();
    return data.documents as TrendingMovie[];
  } catch (err) {
    console.error("Failed to get Appwrite trending movies", err);
    return undefined;
  }
};

export const getCloudWatchlist = async (): Promise<WatchlistItem[]> => {
  if (!PROJECT_ID || !DATABASE_ID || !WATCHLIST_COLLECTION_ID) return [];

  try {
    const url = `${ENDPOINT}/databases/${DATABASE_ID}/collections/${WATCHLIST_COLLECTION_ID}/documents?queries[]=${encodeURIComponent(
      JSON.stringify({ method: "orderDesc", attribute: "$createdAt" })
    )}`;

    const res = await fetch(url, { headers: getHeaders() });
    if (!res.ok) return [];

    const data = await res.json();
    return data.documents.map((doc: any) => ({
      id: doc.media_id,
      title: doc.title,
      poster_path: doc.poster_path,
      vote_average: doc.vote_average,
      release_date: doc.release_date,
      media_type: doc.media_type || "movie",
      addedAt: new Date(doc.$createdAt).getTime(),
    }));
  } catch {
    return [];
  }
};

export const saveToCloudWatchlist = async (
  item: Omit<WatchlistItem, "addedAt">
) => {
  if (!PROJECT_ID || !DATABASE_ID || !WATCHLIST_COLLECTION_ID) return;

  try {
    await fetch(
      `${ENDPOINT}/databases/${DATABASE_ID}/collections/${WATCHLIST_COLLECTION_ID}/documents`,
      {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify({
          documentId: `media_${item.id}`,
          data: {
            media_id: item.id,
            title: item.title,
            poster_path: item.poster_path,
            vote_average: item.vote_average,
            release_date: item.release_date,
            media_type: item.media_type,
          },
        }),
      }
    );
  } catch (err) {
    console.error("Failed to save to cloud watchlist", err);
  }
};

export const removeFromCloudWatchlist = async (mediaId: number) => {
  if (!PROJECT_ID || !DATABASE_ID || !WATCHLIST_COLLECTION_ID) return;

  try {
    await fetch(
      `${ENDPOINT}/databases/${DATABASE_ID}/collections/${WATCHLIST_COLLECTION_ID}/documents/media_${mediaId}`,
      {
        method: "DELETE",
        headers: getHeaders(),
      }
    );
  } catch (err) {
    console.error("Failed to remove from cloud watchlist", err);
  }
};
