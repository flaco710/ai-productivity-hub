import { createFileRoute } from "@tanstack/react-router";
import { ToolPage } from "@/components/tool-page";

export const Route = createFileRoute("/meetings")({
  head: () => ({
    meta: [
      { title: "Meeting Notes Summarizer · Workplace AI" },
      { name: "description", content: "Turn meeting notes into summaries, decisions and action items." },
      { property: "og:title", content: "Meeting Notes Summarizer · Workplace AI" },
      { property: "og:description", content: "Turn meeting notes into summaries, decisions and action items." },
    ],
  }),
  component: () => (
    <ToolPage
      mode="meeting"
      title="Meeting Notes Summarizer"
      description="Paste notes or a transcript to get a summary, decisions and action items."
      cta="Summarize meeting"
      fields={[
        { name: "meeting_title", label: "Meeting title", type: "text", placeholder: "Q3 planning sync" },
        { name: "notes", label: "Notes or transcript", type: "textarea", rows: 12, required: true, placeholder: "Paste raw notes here…" },
        { name: "detail", label: "Detail level", type: "select", options: ["Standard", "Brief", "Comprehensive"] },
      ]}
    />
  ),
});
