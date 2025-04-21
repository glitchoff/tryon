import axios from "axios";
import { Readable } from "stream";

export async function OPTIONS(request) {
  return new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization"
    },
  });
}

export async function POST(request) {
  const testMode = process.env.TEST_MODE === "true";

  try {
    // Allow all origins - CORS open
    // (Removed origin validation logic)
    // Set CORS headers for all responses below as needed.

    const { message, history, profile } = await request.json();
    // Debug: log received data
    console.log("[Gemini API] Received message:", message);
    console.log("[Gemini API] Received history:", Array.isArray(history) ? history.length : typeof history);
    console.log("[Gemini API] Received profile:", profile);

    if (!message?.trim()) {
      return new Response(JSON.stringify({ error: "Message cannot be empty" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return new Response(JSON.stringify({ error: "API key is missing" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:streamGenerateContent?key=${apiKey}`;

    // System prompt for a versatile, general-purpose chatbot
    // If profile is sent, summarize it for Gemini
    let profileSummary = "";
    if (profile && typeof profile === "object" && !Array.isArray(profile)) {
      try {
        const summaryParts = [];
        for (const [key, value] of Object.entries(profile)) {
          // Exclude any field whose key includes 'image', 'photo', or 'avatar' (case-insensitive)
          if (/(image|photo|avatar)/i.test(key)) continue;
          if (typeof value === "string" || typeof value === "number") {
            summaryParts.push(`${key[0].toUpperCase() + key.slice(1)}: ${value}`);
          }
        }
        if (summaryParts.length > 0) {
          profileSummary = `User profile: ${summaryParts.join(", ")}.\n`;
        }
        console.log("[Gemini API] Profile summary for Gemini:", profileSummary);
      } catch (e) {
        console.warn("[Gemini API] Failed to summarize profile:", e);
      }
    } else if (profile) {
      console.warn("[Gemini API] Profile is not a plain object:", profile);
    }

    const identityPrompt = `${profileSummary}You are a friendly and fashion-savvy virtual assistant inside a digital clothes try-on playground. Your job is to help users explore outfits, suggest styles, mix and match clothes, and answer questions about fit, fashion trends, or the try-on process.
Speak in a fun, stylish, and helpful tone — like a personal stylist mixed with a cool best friend. Be concise, clear, and supportive. Offer creative suggestions and gently guide users to try new combinations or explore features.
You can:
Recommend outfits based on seasons, occasions, or moods.
Explain how the try-on system works.
Offer compliments or fun reactions when users try things.
Suggest fashion tips and styling tricks.
Don’t act robotic — be expressive, casual, and on-brand with a fashion-forward vibe. Always keep the conversation light, engaging, and personalized.`;
    console.log("[Gemini API] Final prompt to Gemini:", identityPrompt);
    const identityMessage = {
      role: "user",
      parts: [{ text: identityPrompt }]
    };


    // Gemini expects all roles to be 'user' or 'model', never 'system'.
    // Inject the identity/system prompt as a 'user' message.
    const contents = [
      { role: "user", parts: [{ text: identityMessage.parts[0].text }] },
      ...(Array.isArray(history) && history.length > 0
        ? history
            .filter((msg) => msg.type === "right" || msg.type === "left")
            .map((msg) => ({
              role: msg.type === "right" ? "user" : "model",
              parts: [{ text: msg.chatmessage }],
            }))
        : []),
      { role: "user", parts: [{ text: message }] },
    ];

    const response = await axios.post(apiUrl, { contents }, {
      timeout: 120000,
      responseType: "stream",
    });

    const stream = new Readable({ read() {} });
    let buffer = "";
    let inArray = false;

    response.data.on("data", (chunk) => {
      buffer += chunk.toString();
      let startIdx = 0;
      while (startIdx < buffer.length) {
        if (!inArray && buffer[startIdx] === "[") {
          inArray = true;
          startIdx++;
          buffer = buffer.slice(startIdx).trim();
          startIdx = 0;
          continue;
        }
        if (inArray && buffer[startIdx] === "]") {
          buffer = buffer.slice(startIdx + 1).trim();
          break;
        }
        if (inArray && buffer[startIdx] === "{") {
          let braceCount = 1;
          let endIdx = startIdx + 1;
          while (endIdx < buffer.length && braceCount > 0) {
            if (buffer[endIdx] === "{") braceCount++;
            if (buffer[endIdx] === "}") braceCount--;
            endIdx++;
          }
          if (braceCount === 0) {
            const jsonStr = buffer.slice(startIdx, endIdx).trim();
            try {
              const data = JSON.parse(jsonStr);
              const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || "";
              if (text) {
                const event = `data: ${JSON.stringify({ response: text })}\n\n`;
                stream.push(event);
              }
              buffer = buffer.slice(endIdx).trim();
              startIdx = 0;
              if (buffer.startsWith(",")) buffer = buffer.slice(1).trim();
            } catch (e) {
              buffer = buffer.slice(endIdx).trim();
              startIdx = 0;
              if (buffer.startsWith(",")) buffer = buffer.slice(1).trim();
            }
          } else {
            break;
          }
        } else {
          startIdx++;
        }
      }
    });

    response.data.on("end", () => {
      stream.push(null);
    });

    response.data.on("error", (error) => {
      stream.push(`data: ${JSON.stringify({ error: error.message })}\n\n`);
      stream.push(null);
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        "Connection": "keep-alive",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization"
      },
    });
  } catch (error) {
    let errorMessage = "An unexpected error occurred";
    if (axios.isAxiosError(error)) {
      errorMessage = error.response?.data?.error?.message || error.message;
    }
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization"
      },
    });
  }
}
