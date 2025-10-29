import { auth } from "@/auth";
import { NextRequest } from "next/server";

type Handler = (
  req: NextRequest,
  context?: any,
  session?: any,
) => Promise<Response>;

export function withAuth(handler: Handler): Handler {
  return async (req, context) => {
    const session = await auth();

    if (!session) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    // If authenticated, call the original handler
    return handler(req, context, session);
  };
}
