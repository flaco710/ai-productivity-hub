import { createFileRoute } from "@tanstack/react-router";
import { ToolPage } from "@/components/tool-page";

export const Route = createFileRoute("/planner")({
  head: () => ({
    meta: [
      { title: "AI Task Planner · Workplace AI" },
      { name: "description", content: "Prioritize tasks and build a realistic schedule with AI." },
      { property: "og:title", content: "AI Task Planner · Workplace AI" },
      { property: "og:description", content: "Prioritize tasks and build a realistic schedule with AI." },
    ],
  }),
  component: () => (
    <ToolPage
      mode="planner"
      title="AI Task Planner"
      description="List your goal and tasks — get a prioritized plan and schedule."
      cta="Build my plan"
      fields={[
        { name: "goal", label: "Goal", type: "text", required: true, placeholder: "Launch the new onboarding flow" },
        { name: "tasks", label: "Tasks (one per line)", type: "textarea", rows: 8, required: true, placeholder: "Write spec\nReview designs\nQA testing" },
        { name: "available_time", label: "Available time", type: "select", options: ["Today (8 hours)", "This week", "Two weeks", "This month"] },
        { name: "constraints", label: "Deadlines / constraints", type: "text", placeholder: "Demo on Thursday 2pm" },
      ]}
    />
  ),
});
