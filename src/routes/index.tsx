import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowRight, Clock } from "lucide-react";
import { readTimeSaved, totalMinutes, type TimeSaved } from "@/lib/time-saved";
import { NAV } from "@/components/app-sidebar";
import { Disclaimer } from "@/components/disclaimer";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "AI Workplace Productivity Assistant" },
      { name: "description", content: "Automate emails, meeting notes, planning and research with AI." },
      { property: "og:title", content: "AI Workplace Productivity Assistant" },
      { property: "og:description", content: "Automate emails, meeting notes, planning and research with AI." },
    ],
  }),
  component: Dashboard,
});

const DESC: Record<string, string> = {
  "/email": "Draft polished emails by tone and length.",
  "/meetings": "Summaries, decisions and action items from notes.",
  "/planner": "Prioritized plans and time-blocked schedules.",
  "/research": "Structured briefs on any business topic.",
  "/chat": "A conversational assistant for anything at work.",
};

function Dashboard() {
  const tools = NAV.filter((n) => n.url !== "/");
  const [saved, setSaved] = useState<TimeSaved>({});
  useEffect(() => setSaved(readTimeSaved()), []);
  const minutes = totalMinutes(saved);
  const tasks = Object.values(saved).reduce((a, b) => a + b, 0);
  return (
    <div className="mx-auto max-w-6xl space-y-8 p-4 md:p-8">
      <section className="rounded-3xl bg-hero p-8 text-primary-foreground md:p-12">
        <p className="text-sm font-medium opacity-80">Welcome back</p>
        <h1 className="mt-2 max-w-2xl text-3xl font-semibold md:text-4xl">Your AI workplace assistant</h1>
        <p className="mt-3 max-w-xl opacity-85">Automate the busywork — write, summarize, plan and research in seconds, then refine every result.</p>
        <Link to="/email" className="mt-6 inline-flex items-center gap-2 rounded-lg bg-card px-4 py-2 text-sm font-semibold text-foreground">
          Start with an email <ArrowRight className="size-4" />
        </Link>
      </section>
      <section className="flex items-center gap-5 rounded-2xl border bg-card p-5 shadow-card">
        <div className="grid size-12 place-items-center rounded-xl bg-primary-soft text-primary"><Clock className="size-6" /></div>
        <div className="flex-1">
          <p className="text-sm text-muted-foreground">Hours saved</p>
          <p className="text-3xl font-semibold">{(minutes / 60).toFixed(1)}</p>
        </div>
        <p className="text-right text-sm text-muted-foreground">{tasks} task{tasks === 1 ? "" : "s"} completed<br />Estimated time saved</p>
      </section>
      <section>
        <h2 className="mb-4 text-lg font-semibold">Tools</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {tools.map((t) => (
            <Link key={t.url} to={t.url} className="group rounded-2xl border bg-card p-5 shadow-card transition hover:-translate-y-0.5 hover:border-primary/40">
              <div className="grid size-10 place-items-center rounded-xl bg-primary-soft text-primary"><t.icon className="size-5" /></div>
              <h3 className="mt-4 font-semibold">{t.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{DESC[t.url]}</p>
              <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary">Open <ArrowRight className="size-4 transition group-hover:translate-x-0.5" /></span>
            </Link>
          ))}
        </div>
      </section>
      <Disclaimer />
    </div>
  );
}
