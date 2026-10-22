export async function streamAI(
  payload: { mode: string; fields?: Record<string, string>; messages?: { role: string; content: string }[] },
  onText: (full: string) => void,
  signal?: AbortSignal,
): Promise<string> {
  const res = await fetch("/api/ai", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    signal: signal ?? null,
  });
  if (!res.ok || !res.body) {
    const j = await res.json().catch(() => ({}));
    throw new Error(j.error || "Request failed");
  }
  const reader = res.body.getReader();
  const dec = new TextDecoder();
  let full = "";
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    full += dec.decode(value, { stream: true });
    const idx = full.indexOf("[[ERROR]]");
    if (idx >= 0) throw new Error(full.slice(idx + 9));
    onText(full);
  }
  return full;
}
