import { NextResponse } from "next/server";

const BASE_URL = "https://api.themoviedb.org/3";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("query");
  const genre = searchParams.get("genre");
  const sortBy = searchParams.get("sort_by") || "popularity.desc";
  const page = searchParams.get("page") || "1";

  let endpoint = "";

  if (query) {
    endpoint = `${BASE_URL}/search/tv?query=${encodeURIComponent(query)}&page=${page}&include_adult=false`;
  } else {
    const params = new URLSearchParams({
      sort_by: sortBy,
      page,
      include_adult: "false",
    });

    if (genre) params.append("with_genres", genre);

    endpoint = `${BASE_URL}/discover/tv?${params.toString()}`;
  }

  try {
    const response = await fetch(endpoint, {
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${process.env.TMDB_API_KEY}`,
      },
      next: { revalidate: 3600 },
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: "Failed to fetch TV shows from TMDB" },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
