import { NextResponse } from "next/server";

const BASE_URL = "https://api.themoviedb.org/3";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const type = searchParams.get("type") || "movie"; // movie or tv

  const endpoint = `${BASE_URL}/genre/${type}/list`;

  try {
    const response = await fetch(endpoint, {
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${process.env.TMDB_API_KEY}`,
      },
      next: { revalidate: 86400 }, // Genres change very rarely (cache 24h)
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: "Failed to fetch genres from TMDB" },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data.genres || []);
  } catch {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
