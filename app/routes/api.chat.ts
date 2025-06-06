import { type ActionFunctionArgs } from "react-router";
import { createResponse } from "../utils/ai-client";

export async function action({ request }: ActionFunctionArgs) {
  try {
    // Support both JSON and stream body
    let responseText = "";
    let conversation_id, parent_message_id, metadata;

    const contentType = request.headers.get("content-type") || "";
    if (contentType.includes("application/json")) {
      const body = await request.json();
      responseText = body.response;
      conversation_id = body.conversation_id;
      parent_message_id = body.parent_message_id;
      metadata = body.metadata;
    } else {
      // Assume stream: read as text
      responseText = await request.text();
    }

    // Use the OpenAI Responses API to create a response object
    const result = await createResponse(
      responseText,
      conversation_id,
      parent_message_id,
      metadata
    );

    return new Response(JSON.stringify(result), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Chat API error:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

export async function loader() {
  return new Response(null, { status: 405 });
}
