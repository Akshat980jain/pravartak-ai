import { useEffect, useMemo, useRef, useState } from "react";
import { MessageCircle, X, Send } from "lucide-react";

type ChatMessage = { id: string; role: "bot" | "user"; text: string };

const RESPONSES: Array<{ pattern: RegExp; answer: string }> = [
  { pattern: /(how\s*to\s*register|registration|create\s*account)/i, answer: "Go to Apply Now → Create account → Fill beneficiary details → Upload documents → Submit. You will get an Application ID." },
  { pattern: /(dbt\s*status|track|application\s*status|track\s*status)/i, answer: "Use 'Track Application' and enter your Application ID (DBT-PCR-XXXXXX) to view live status." },
  { pattern: /(aadhaar|update\s*aadhaar|link\s*aadhaar)/i, answer: "Aadhaar is required for eKYC & DBT. Update from UIDAI or nearest CSC; then re-verify in your dashboard." },
  { pattern: /(grievance|complaint|helpdesk)/i, answer: "Open Grievance section → Fill details → Submit. You will receive a Grievance ID for tracking." },
  { pattern: /(documents?|docs|file\s*upload)/i, answer: "Accepted formats: PDF/JPG/PNG, max 5MB each. Ensure scans are clear and readable." },
  { pattern: /(contact|support|help)/i, answer: "Helpline: 1800-000-000 • Email: support@dbt.gov. Working Hours: 9 AM – 6 PM (Mon–Fri)." },
];

function getBotReply(text: string): string {
  for (const r of RESPONSES) {
    if (r.pattern.test(text)) return r.answer;
  }
  return "I can help with: registration, DBT status, update Aadhaar, grievance help, documents, or support.";
}

export default function NyayBot() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>(() => [
    { id: "m0", role: "bot", text: "Namaste! How can I help you today? Try: 'registration process', 'DBT status', 'update Aadhaar', or 'grievance help'." },
  ]);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, open]);

  function send(text: string) {
    if (!text.trim()) return;
    const user: ChatMessage = { id: crypto.randomUUID(), role: "user", text: text.trim() };
    const bot: ChatMessage = { id: crypto.randomUUID(), role: "bot", text: getBotReply(text) };
    setMessages((m) => [...m, user, bot]);
  }

  function handleSend(e?: React.FormEvent) {
    e?.preventDefault();
    const t = input;
    setInput("");
    send(t);
  }

  return (
    <div className="fixed right-4 bottom-4 z-50">
      {/* Floating Button */}
      {!open && (
        <button
          aria-label="Open NyayBot"
          onClick={() => setOpen(true)}
          className="h-12 w-12 rounded-full bg-primary text-primary-foreground shadow-lg flex items-center justify-center hover:shadow-xl transition-shadow"
        >
          <MessageCircle className="h-6 w-6" />
        </button>
      )}

      {/* Popup */}
      {open && (
        <div className="w-[350px] h-[500px] bg-white rounded-xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 bg-slate-800 text-white">
            <div className="font-semibold">NYAYBot</div>
            <button aria-label="Close" onClick={() => setOpen(false)} className="hover:bg-slate-700 rounded p-1">
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Messages */}
          <div ref={listRef} className="flex-1 overflow-y-auto p-3 space-y-2 bg-slate-50">
            {messages.map((m) => (
              <div key={m.id} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[80%] px-3 py-2 rounded-2xl text-sm shadow ${
                    m.role === "user"
                      ? "bg-blue-600 text-white rounded-br-sm"
                      : "bg-white text-slate-900 border border-slate-200 rounded-bl-sm"
                  }`}
                >
                  {m.text}
                </div>
              </div>
            ))}
          </div>

          {/* Input */}
          <form onSubmit={handleSend} className="p-3 bg-white border-t flex items-center gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message…"
              className="flex-1 h-10 px-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="h-10 px-3 rounded-lg bg-blue-600 text-white flex items-center gap-1 hover:bg-blue-700"
            >
              <Send className="h-4 w-4" />
              Send
            </button>
          </form>
        </div>
      )}
    </div>
  );
}


