"use client";
import { useRef, useState, useEffect } from "react";

export default function GeminiChatbot() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [profile, setProfile] = useState(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (open && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, open]);

  // Read profile from localStorage when chat is opened
  useEffect(() => {
    if (open) {
      try {
        const savedProfile = localStorage.getItem("styleAIProfile");
        if (savedProfile) {
          setProfile(JSON.parse(savedProfile));
        } else {
          setProfile(null);
        }
      } catch (e) {
        setProfile(null);
      }
    }
  }, [open]);

  // Send message to Gemini backend
  const sendMessage = async () => {
    if (!input.trim()) return;
    setLoading(true);
    setError("");
    const newMsg = { chatmessage: input, type: "right" };
    setMessages((prev) => [...prev, newMsg]);
    setInput("");
    try {
      // Only send the last 10 messages to Gemini (including the new one)
      const history = [...messages, newMsg].slice(-10);
      const body = { message: input, history };
      if (profile) {
        // Exclude any field whose key includes 'image', 'photo', or 'avatar' (case-insensitive)
        const filteredProfile = Object.fromEntries(
          Object.entries(profile).filter(
            ([key, _]) => !/(image|photo|avatar)/i.test(key)
          )
        );
        body.profile = filteredProfile;
      }
      const res = await fetch("/api/gemini", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.body) throw new Error("No response body");
      const reader = res.body.getReader();
      let fullText = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = new TextDecoder().decode(value);
        try {
          const lines = chunk.split("\n").filter(Boolean);
          for (const line of lines) {
            if (line.startsWith("data:")) {
              const data = JSON.parse(line.slice(5));
              if (data.response) {
                fullText += data.response;
                setMessages((prev) => {
                  const last = prev[prev.length - 1];
                  if (last && last.type === "left") {
                    // Update last
                    return [...prev.slice(0, -1), { ...last, chatmessage: fullText }];
                  } else {
                    // Add new
                    return [...prev, { chatmessage: fullText, type: "left" }];
                  }
                });
              }
              if (data.error) setError(data.error);
            }
          }
        } catch (e) {
          // ignore
        }
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setOpen((o) => !o)}
        className="fixed bottom-6 right-6 z-50 bg-gradient-to-r from-teal-500 to-purple-500 text-white p-4 rounded-full shadow-lg hover:scale-105 focus:outline-none"
        aria-label={open ? "Close chatbot" : "Open chatbot"}
      >
        {open ? (
          <svg width="28" height="28" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" strokeWidth="2" d="M18 6L6 18M6 6l12 12"/></svg>
        ) : (
          <svg width="28" height="28" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" strokeWidth="2" d="M12 4v16m8-8H4"/></svg>
        )}
      </button>
      {/* Chatbot Popup */}
      {open && (
        <div className="fixed bottom-24 right-6 z-50 w-80 max-w-full bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col" style={{ height: 480 }}>
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-gradient-to-r from-teal-500 to-purple-500 rounded-t-2xl">
            <span className="text-white font-semibold text-lg">StyleAI Gemini Chat</span>
            <button onClick={() => setOpen(false)} className="text-white hover:text-gray-200">
              <svg width="22" height="22" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" strokeWidth="2" d="M18 6L6 18M6 6l12 12"/></svg>
            </button>
          </div>
          <div className="flex-1 overflow-y-auto px-4 py-3 bg-gray-50" style={{ minHeight: 0 }}>
            {messages.length === 0 && (
              <div className="text-gray-400 text-center mt-10">Ask about clothes, style, or anything! 👗🧥👚</div>
            )}
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`mb-2 flex ${msg.type === "right" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`rounded-xl px-3 py-2 max-w-[80%] text-sm whitespace-pre-line shadow ${
                    msg.type === "right"
                      ? "bg-gradient-to-r from-teal-400 to-purple-400 text-white"
                      : "bg-white border border-gray-200 text-gray-700"
                  }`}
                >
                  {msg.chatmessage}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start mb-2">
                <div className="rounded-xl px-3 py-2 max-w-[80%] text-sm bg-white border border-gray-200 text-gray-400 flex items-center gap-2">
                  <span className="animate-pulse">Thinking</span>
                  <span className="inline-block w-2 h-2 bg-gradient-to-r from-teal-400 to-purple-400 rounded-full animate-bounce" style={{animationDelay: '0ms'}}></span>
                  <span className="inline-block w-2 h-2 bg-gradient-to-r from-teal-400 to-purple-400 rounded-full animate-bounce" style={{animationDelay: '100ms'}}></span>
                  <span className="inline-block w-2 h-2 bg-gradient-to-r from-teal-400 to-purple-400 rounded-full animate-bounce" style={{animationDelay: '200ms'}}></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
          {error && <div className="text-red-500 text-xs px-4 pb-1">{error}</div>}
          <div className="p-3 border-t border-gray-100 bg-white flex gap-2">
            <textarea
              className="flex-1 resize-none rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400 bg-gray-50 min-h-[36px] max-h-20"
              rows={1}
              placeholder="Ask about clothes, style, or anything..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={loading}
            />
            <button
              onClick={sendMessage}
              disabled={loading || !input.trim()}
              className="bg-gradient-to-r from-teal-500 to-purple-500 text-white px-3 py-2 rounded-lg shadow hover:scale-105 transition-transform disabled:opacity-50"
              aria-label="Send"
            >
              <svg width="22" height="22" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" strokeWidth="2" d="M5 12h14M12 5l7 7-7 7"/></svg>
            </button>
          </div>
        </div>
      )}
    </>
  );
}
