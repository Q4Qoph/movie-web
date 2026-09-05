import { NextResponse } from "next/server";

const BASE_URL = "https://api.themoviedb.org/3";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const mediaType = searchParams.get("type") || "all"; // all, movie, tv
  const timeWindow = searchParams.get("time") || "day"; // day, week

  const endpoint = `${BASE_URL}/trending/${mediaType}/${timeWindow}`;

  try {
    const response = await fetch(endpoint, {
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${process.env.TMDB_API_KEY}`,
      },
      next: { revalidate: 1800 },
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: "Failed to fetch trending from TMDB" },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
