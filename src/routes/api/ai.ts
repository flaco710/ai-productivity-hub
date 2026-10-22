import { createFileRoute } from "@tanstack/react-router";
import { createOpenAI } from "@ai-sdk/openai";
import { streamText, type ModelMessage } from "ai";
import { SYSTEM_PROMPTS, buildUserPrompt, type ToolMode } from "@/lib/prompts";

const MODES: ToolMode[] = ["email", "meeting", "planner", "research", "chat"];

export const Route = createFileRoute("/api/ai")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const apiKey = process.env.LOVABLE_API_KEY;
        if (!apiKey) return Response.json({ error: "AI is not configured." }, { status: 500 });
        const body = (await request.json()) as {
          mode: ToolMode;
          fields?: Record<string, string>;
          messages?: { role: "user" | "assistant"; content: string }[];
        };
        if (!MODES.includes(body.mode)) return Response.json({ error: "Invalid mode" }, { status: 400 });

        const history: ModelMessage[] =
          body.mode === "chat"
            ? (body.messages ?? []).slice(-30).map((m) => ({ role: m.role, content: String(m.content).slice(0, 20000) }))
            : [{ role: "user", content: buildUserPrompt(body.mode, body.fields ?? {}).slice(0, 40000) }];
        if (!history.length) return Response.json({ error: "Empty input" }, { status: 400 });

        const provider = createOpenAI({
          baseURL: "https://ai.gateway.lovable.dev/v1",
          apiKey,
          headers: { "Lovable-API-Key": apiKey, "X-Lovable-AIG-SDK": "vercel-ai-sdk" },
        });

        let upstreamError: string | null = null;
        const result = streamText({
          model: provider.responses("openai/gpt-6-astra"),
          messages: [{ role: "system", content: SYSTEM_PROMPTS[body.mode] }, ...history],
          abortSignal: request.signal,
          providerOptions: {
            openai: {
              forceReasoning: true,
              reasoningEffort: "low",
              reasoningSummary: "auto",
              store: false,
              include: ["reasoning.encrypted_content"],
            },
          },
          onError: ({ error }) => {
            const e = error as { statusCode?: number; message?: string };
            upstreamError =
              e?.statusCode === 429
                ? "Too many requests — please wait a moment and try again."
                : e?.statusCode === 402
                  ? "AI credits are exhausted. Please add credits to continue."
                  : e?.message || "AI request failed.";
            console.error("AI error", error);
          },
        });

        const encoder = new TextEncoder();
        const stream = new ReadableStream({
          async start(controller) {
            try {
              for await (const chunk of result.textStream) controller.enqueue(encoder.encode(chunk));
            } catch {
              /* handled below */
            }
            if (upstreamError) controller.enqueue(encoder.encode(`\n\n[[ERROR]]${upstreamError}`));
            controller.close();
          },
        });
        return new Response(stream, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
      },
    },
  },
});
