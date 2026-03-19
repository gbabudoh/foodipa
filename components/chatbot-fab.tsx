"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, Loader2 } from "lucide-react";

type Message = { role: "user" | "assistant"; content: string };

const QUICK_PROMPTS = ["What's trending?", "Surprise me 🎲", "Fridge raid 🥦"];

export function ChatbotFab() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Hey foodie! 🍜 I'm Pip, your culinary AI. Ask me anything — recipes, history, ingredient swaps, or what to cook tonight.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  async function handleSend(text?: string) {
    const content = (text ?? input).trim();
    if (!content || loading) return;

    const userMessage: Message = { role: "user", content };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: [...messages, userMessage] }),
      });
      const data = await res.json();
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.content || "Hmm, let me think… 🤔" },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Oops, something went wrong. Try again! 🙏" },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {/* ── Chat panel ── */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 16 }}
            transition={{ type: "spring", stiffness: 380, damping: 28 }}
            style={{
              position: "fixed",
              bottom: "96px",
              right: "20px",
              zIndex: 50,
              width: "340px",
              borderRadius: "24px",
              overflow: "hidden",
              background: "var(--glass-bg)",
              backdropFilter: "blur(32px)",
              WebkitBackdropFilter: "blur(32px)",
              border: "1px solid var(--glass-border)",
              boxShadow: "0 24px 64px rgba(0,0,0,0.18), 0 4px 16px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,0.6)",
              display: "flex",
              flexDirection: "column",
              maxHeight: "480px",
            }}
          >
            {/* Header */}
            <div style={{
              padding: "16px 18px",
              display: "flex",
              alignItems: "center",
              gap: "12px",
              borderBottom: "1px solid var(--glass-border)",
              background: "linear-gradient(135deg, var(--accent) 0%, #FF9A4C 100%)",
              flexShrink: 0,
            }}>
              <div style={{
                width: "38px", height: "38px", borderRadius: "12px",
                background: "rgba(255,255,255,0.22)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "18px", flexShrink: 0,
              }}>
                🍜
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ color: "white", fontSize: "14px", fontWeight: 800, letterSpacing: "-0.2px" }}>Pip</p>
                <div style={{ display: "flex", alignItems: "center", gap: "5px", marginTop: "1px" }}>
                  <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#4ade80", display: "inline-block" }} />
                  <p style={{ color: "rgba(255,255,255,0.8)", fontSize: "11px", fontWeight: 500 }}>Culinary AI · Online</p>
                </div>
              </div>
              <button
                onClick={() => setOpen(false)}
                style={{
                  width: "30px", height: "30px", borderRadius: "10px",
                  background: "rgba(255,255,255,0.18)",
                  border: "none", cursor: "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <X size={15} color="white" />
              </button>
            </div>

            {/* Messages */}
            <div style={{
              flex: 1,
              overflowY: "auto",
              padding: "16px",
              display: "flex",
              flexDirection: "column",
              gap: "10px",
              minHeight: 0,
            }}>
              {messages.map((msg, i) => (
                <div key={i} style={{ display: "flex", justifyContent: msg.role === "user" ? "flex-end" : "flex-start" }}>
                  {msg.role === "assistant" && (
                    <div style={{ width: "26px", height: "26px", borderRadius: "8px", background: "linear-gradient(135deg, var(--accent), #FF9A4C)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "13px", flexShrink: 0, marginRight: "8px", alignSelf: "flex-end", marginBottom: "2px" }}>
                      🍜
                    </div>
                  )}
                  <div style={{
                    maxWidth: "76%",
                    padding: "10px 14px",
                    borderRadius: msg.role === "user" ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
                    fontSize: "13px",
                    lineHeight: 1.55,
                    fontWeight: 450,
                    ...(msg.role === "user"
                      ? {
                          background: "linear-gradient(135deg, var(--accent), #FF9A4C)",
                          color: "white",
                          boxShadow: "0 3px 12px rgba(255,107,43,0.3)",
                        }
                      : {
                          background: "var(--glass-bg)",
                          color: "var(--foreground)",
                          border: "1px solid var(--glass-border)",
                          backdropFilter: "blur(12px)",
                        }),
                  }}>
                    {msg.content}
                  </div>
                </div>
              ))}

              {loading && (
                <div style={{ display: "flex", justifyContent: "flex-start", alignItems: "flex-end", gap: "8px" }}>
                  <div style={{ width: "26px", height: "26px", borderRadius: "8px", background: "linear-gradient(135deg, var(--accent), #FF9A4C)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "13px" }}>
                    🍜
                  </div>
                  <div style={{ padding: "12px 16px", borderRadius: "18px 18px 18px 4px", background: "var(--glass-bg)", border: "1px solid var(--glass-border)", display: "flex", gap: "4px", alignItems: "center" }}>
                    {[0, 1, 2].map(i => (
                      <motion.div key={i} animate={{ y: [0, -4, 0] }} transition={{ duration: 0.7, repeat: Infinity, delay: i * 0.15 }} style={{ width: "5px", height: "5px", borderRadius: "50%", background: "var(--accent)" }} />
                    ))}
                  </div>
                </div>
              )}
              <div ref={bottomRef} />
            </div>

            {/* Quick prompts */}
            {messages.length === 1 && (
              <div style={{ padding: "0 16px 10px", display: "flex", gap: "6px", flexWrap: "wrap" }}>
                {QUICK_PROMPTS.map(p => (
                  <button key={p} onClick={() => handleSend(p)} style={{ padding: "6px 12px", borderRadius: "50px", fontSize: "11px", fontWeight: 600, background: "rgba(255,107,43,0.1)", color: "var(--accent)", border: "1px solid rgba(255,107,43,0.2)", cursor: "pointer" }}>
                    {p}
                  </button>
                ))}
              </div>
            )}

            {/* Input */}
            <div style={{
              padding: "12px 14px",
              borderTop: "1px solid var(--glass-border)",
              display: "flex",
              alignItems: "center",
              gap: "10px",
              flexShrink: 0,
            }}>
              <input
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === "Enter" && handleSend()}
                placeholder="Ask Pip anything…"
                style={{
                  flex: 1,
                  background: "transparent",
                  border: "none",
                  outline: "none",
                  fontSize: "13px",
                  color: "var(--foreground)",
                  fontFamily: "inherit",
                }}
              />
              <motion.button
                whileTap={{ scale: 0.88 }}
                onClick={() => handleSend()}
                disabled={!input.trim() || loading}
                style={{
                  width: "34px", height: "34px",
                  borderRadius: "11px",
                  background: input.trim() ? "var(--accent)" : "var(--glass-border)",
                  border: "none",
                  cursor: input.trim() ? "pointer" : "default",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  flexShrink: 0,
                  transition: "background 0.2s",
                  boxShadow: input.trim() ? "0 3px 10px rgba(255,107,43,0.35)" : "none",
                }}
              >
                {loading
                  ? <Loader2 size={14} color="white" style={{ animation: "spin 1s linear infinite" }} />
                  : <Send size={14} color={input.trim() ? "white" : "var(--muted)"} />
                }
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── FAB button ── */}
      <div style={{ position: "fixed", bottom: "84px", right: "20px", zIndex: 50 }}>
        {/* Pulse ring — only when closed */}
        {!open && (
          <motion.div
            animate={{ scale: [1, 1.55], opacity: [0.35, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeOut" }}
            style={{
              position: "absolute", inset: 0,
              borderRadius: "50%",
              background: "var(--accent)",
              pointerEvents: "none",
            }}
          />
        )}

        <motion.button
          whileTap={{ scale: 0.9 }}
          whileHover={{ scale: 1.08 }}
          onClick={() => setOpen(o => !o)}
          aria-label="Chat with Pip"
          style={{
            position: "relative",
            width: "56px",
            height: "56px",
            borderRadius: "50%",
            background: open
              ? "var(--glass-bg)"
              : "linear-gradient(145deg, #FF7A3C 0%, #FF5500 100%)",
            backdropFilter: open ? "blur(20px)" : undefined,
            WebkitBackdropFilter: open ? "blur(20px)" : undefined,
            border: open ? "1px solid var(--glass-border)" : "2px solid rgba(255,255,255,0.25)",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: open
              ? "var(--glass-shadow)"
              : "0 8px 28px rgba(255,85,0,0.5), 0 2px 8px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.3)",
            transition: "background 0.25s, box-shadow 0.25s, border 0.25s",
          }}
        >
          <AnimatePresence mode="wait" initial={false}>
            {open ? (
              <motion.div
                key="close"
                initial={{ scale: 0, rotate: -45 }}
                animate={{ scale: 1, rotate: 0 }}
                exit={{ scale: 0, rotate: 45 }}
                transition={{ duration: 0.18, type: "spring", stiffness: 400, damping: 22 }}
              >
                <X size={20} color="var(--foreground)" />
              </motion.div>
            ) : (
              <motion.div
                key="pip"
                initial={{ scale: 0, rotate: 45 }}
                animate={{ scale: 1, rotate: 0 }}
                exit={{ scale: 0, rotate: -45 }}
                transition={{ duration: 0.18, type: "spring", stiffness: 400, damping: 22 }}
                style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "1px" }}
              >
                {/* Custom chat icon: two overlapping chat bubbles */}
                <svg width="26" height="24" viewBox="0 0 26 24" fill="none">
                  <path d="M18 2H4C2.9 2 2 2.9 2 4V14C2 15.1 2.9 16 4 16H6V20L10.5 16H18C19.1 16 20 15.1 20 14V4C20 2.9 19.1 2 18 2Z" fill="white" fillOpacity="0.9"/>
                  <path d="M22 6H20V14C20 15.1 19.1 16 18 16H10L8 18H18.5L23 22V18H24C25.1 18 26 17.1 26 16V8C26 6.9 25.1 6 24 6H22Z" fill="white" fillOpacity="0.55"/>
                </svg>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>

        {/* "Pip" label — only when closed */}
        {!open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            style={{
              position: "absolute",
              top: "-8px",
              right: "-4px",
              background: "linear-gradient(135deg, #FF7A3C, #FF5500)",
              borderRadius: "99px",
              padding: "2px 7px",
              fontSize: "9px",
              fontWeight: 800,
              color: "white",
              letterSpacing: "0.04em",
              pointerEvents: "none",
              boxShadow: "0 2px 8px rgba(255,85,0,0.4)",
              border: "1.5px solid rgba(255,255,255,0.3)",
            }}
          >
            F
          </motion.div>
        )}
      </div>
    </>
  );
}
