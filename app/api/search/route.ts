import { NextResponse } from "next/server";

const BASE_URL = "https://api.themoviedb.org/3";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("query");
  const type = searchParams.get("type") || "multi"; // multi, movie, tv, person
  const page = searchParams.get("page") || "1";

  if (!query) {
    return NextResponse.json({ results: [], total_results: 0, total_pages: 0 });
  }

  const endpoint = `${BASE_URL}/search/${type}?query=${encodeURIComponent(query)}&page=${page}&include_adult=false`;

  try {
    const response = await fetch(endpoint, {
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${process.env.TMDB_API_KEY}`,
      },
      next: { revalidate: 600 },
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: "Failed to search TMDB" },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
