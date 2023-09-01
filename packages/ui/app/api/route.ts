import { NextResponse } from "next/server";

const REST_API =
  process.env.NEXT_PUBLIC_AWS_REST_API || "http://127.0.0.1:5000";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const res = await fetch(`${REST_API}/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const data = await res.text();

    return NextResponse.json(data);
  } catch (e) {
    console.log("req failed", e);
  }
}
