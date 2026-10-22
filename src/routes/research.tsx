import { createFileRoute } from "@tanstack/react-router";
import { ToolPage } from "@/components/tool-page";

export const Route = createFileRoute("/research")({
  head: () => ({
    meta: [
      { title: "AI Research Assistant · Workplace AI" },
      { name: "description", content: "Get structured research briefs on any business topic." },
      { property: "og:title", content: "AI Research Assistant · Workplace AI" },
      { property: "og:description", content: "Get structured research briefs on any business topic." },
    ],
  }),
  component: () => (
    <ToolPage
      mode="research"
      title="AI Research Assistant"
      description="Ask a question and receive a structured, editable research brief."
      cta="Research topic"
      fields={[
        { name: "topic", label: "Topic or question", type: "textarea", rows: 4, required: true, placeholder: "What are best practices for hybrid work policies?" },
        { name: "audience", label: "Audience", type: "select", options: ["Executives", "Team members", "Clients", "Technical"] },
        { name: "depth", label: "Depth", type: "select", options: ["Overview", "In-depth"] },
      ]}
    />
  ),
});
