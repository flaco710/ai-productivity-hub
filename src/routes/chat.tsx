import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import { ArrowUp, Bot, Square, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Disclaimer } from "@/components/disclaimer";
import { streamAI } from "@/lib/ai-client";

export const Route = createFileRoute("/chat")({
  head: () => ({
    meta: [
      { title: "AI Chat · Workplace AI" },
      { name: "description", content: "Chat with your AI workplace assistant." },
      { property: "og:title", content: "AI Chat · Workplace AI" },
      { property: "og:description", content: "Chat with your AI workplace assistant." },
    ],
  }),
  component: ChatPage,
});

type Msg = { role: "user" | "assistant"; content: string };
const SUGGESTIONS = ["How do I give constructive feedback?", "Write a LinkedIn post about our product launch", "Tips for running a better stand-up"];

function ChatPage() {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const abort = useRef<AbortController | null>(null);
  const end = useRef<HTMLDivElement>(null);
  useEffect(() => {
    end.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function send(text: string) {
    if (!text.trim() || loading) return;
    const next: Msg[] = [...messages, { role: "user", content: text.trim() }];
    setMessages([...next, { role: "assistant", content: "" }]);
    setInput("");
    setLoading(true);
    abort.current = new AbortController();
    try {
      await streamAI({ mode: "chat", messages: next }, (t) =>
        setMessages([...next, { role: "assistant", content: t }]), abort.current.signal);
    } catch (e) {
      if ((e as Error).name !== "AbortError") { toast.error((e as Error).message); setMessages(next); }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto flex h-[calc(100svh-3.5rem)] max-w-3xl flex-col p-4 md:p-6">
      <div className="flex items-center justify-between pb-3">
        <h1 className="text-2xl font-semibold">AI Chat</h1>
        {messages.length > 0 && <Button size="sm" variant="ghost" onClick={() => setMessages([])}><Trash2 /> Clear</Button>}
      </div>
      <div className="flex-1 space-y-5 overflow-y-auto py-2">
        {messages.length === 0 && (
          <div className="grid h-full place-items-center text-center">
            <div className="space-y-4">
              <div className="mx-auto grid size-12 place-items-center rounded-2xl bg-primary-soft text-primary"><Bot /></div>
              <p className="text-muted-foreground">Ask anything about your work.</p>
              <div className="flex flex-wrap justify-center gap-2">
                {SUGGESTIONS.map((s) => <Button key={s} size="sm" variant="outline" onClick={() => send(s)}>{s}</Button>)}
              </div>
            </div>
          </div>
        )}
        {messages.map((m, i) => m.role === "user" ? (
          <div key={i} className="flex justify-end">
            <div className="max-w-[85%] whitespace-pre-wrap rounded-2xl rounded-br-sm bg-primary px-4 py-2.5 text-sm text-primary-foreground">{m.content}</div>
          </div>
        ) : (
          <div key={i} className="flex gap-3">
            <div className="grid size-8 shrink-0 place-items-center rounded-lg bg-primary-soft text-primary"><Bot className="size-4" /></div>
            <div className="md min-w-0 flex-1 text-sm leading-relaxed">
              {m.content ? <ReactMarkdown>{m.content}</ReactMarkdown> : <span className="animate-pulse text-muted-foreground">Thinking…</span>}
            </div>
          </div>
        ))}
        <div ref={end} />
      </div>
      <div className="space-y-3 pt-3">
        <div className="flex items-end gap-2 rounded-2xl border bg-card p-2 shadow-card">
          <Textarea rows={1} value={input} placeholder="Message your assistant…"
            className="max-h-40 min-h-10 resize-none border-0 shadow-none focus-visible:ring-0"
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(input); } }} />
          {loading
            ? <Button size="icon" variant="outline" onClick={() => abort.current?.abort()}><Square /></Button>
            : <Button size="icon" disabled={!input.trim()} onClick={() => send(input)}><ArrowUp /></Button>}
        </div>
        <Disclaimer />
      </div>
    </div>
  );
}
