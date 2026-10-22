import { createFileRoute } from "@tanstack/react-router";
import { ToolPage } from "@/components/tool-page";

export const Route = createFileRoute("/email")({
  head: () => ({
    meta: [
      { title: "Smart Email Generator · Workplace AI" },
      { name: "description", content: "Draft professional emails in seconds with AI." },
      { property: "og:title", content: "Smart Email Generator · Workplace AI" },
      { property: "og:description", content: "Draft professional emails in seconds with AI." },
    ],
  }),
  component: () => (
    <ToolPage
      mode="email"
      title="Smart Email Generator"
      description="Describe what you need and get a polished, ready-to-send email."
      cta="Generate email"
      markdown={false}
      fields={[
        { name: "recipient", label: "Recipient", type: "text", placeholder: "e.g. Client, Manager, Team" },
        { name: "purpose", label: "Purpose & key points", type: "textarea", required: true, placeholder: "Follow up on last week's proposal, ask for feedback by Friday…" },
        { name: "tone", label: "Tone", type: "select", options: ["Professional", "Friendly", "Formal", "Persuasive", "Apologetic", "Concise"] },
        { name: "length", label: "Length", type: "select", options: ["Short", "Medium", "Detailed"] },
      ]}
    />
  ),
});
