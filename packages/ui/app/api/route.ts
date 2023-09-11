import { LlamaIndexStream } from "../../utils/LlamaIndexStream";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const stream = await LlamaIndexStream(body);

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
      },
    });
  } catch (e) {
    console.log("req failed", e);
    return new Response("Internal Server Error", { status: 500 });
  }
}
