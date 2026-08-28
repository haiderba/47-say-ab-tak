import { useState } from "react";
import { Bot, Send } from "lucide-react";

export function PakWakilAi() {
  const [query, setQuery] = useState("");
  const [messages, setMessages] = useState<{ sender: "user" | "bot"; text: string }[]>([
    { sender: "bot", text: "اسلام علیکم! I am PakWakil, your AI Citizen & Legal Assistant. Ask me anything regarding Pakistani law, NADRA, or property transfer in English or Urdu!" }
  ]);

  const handleSend = () => {
    if (!query.trim()) return;
    setMessages(prev => [
      ...prev,
      { sender: "user", text: query },
      { sender: "bot", text: "Under Pakistani law and administrative rules, original documents and CNIC verification are required at the respective counter or Pak-ID / e-Pay portal." }
    ]);
    setQuery("");
  };

  return (
    <div className="rounded-3xl border border-border bg-surface p-6 shadow-card md:p-10 space-y-6">
      <div className="flex items-center gap-3 border-b border-border pb-4">
        <Bot className="size-6 text-primary" />
        <h2 className="font-display text-xl font-black text-primary">PakWakil (پاک وکیل) AI Assistant</h2>
      </div>
      <div className="h-64 overflow-y-auto space-y-3 rounded-2xl bg-bg/50 p-4 border border-border">
        {messages.map((m, i) => (
          <div key={i} className={`p-3 rounded-xl text-xs ${m.sender === "user" ? "bg-primary text-surface ml-auto max-w-xs" : "bg-surface border border-border max-w-md"}`}>
            {m.text}
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <input type="text" value={query} onChange={e => setQuery(e.target.value)} onKeyDown={e => e.key === "Enter" && handleSend()} placeholder="Ask a question..." className="flex-1 rounded-xl border border-border bg-bg px-4 py-2.5 text-xs" />
        <button type="button" onClick={handleSend} className="bg-primary text-surface px-4 py-2.5 rounded-xl text-xs font-bold">Send</button>
      </div>
    </div>
  );
}
