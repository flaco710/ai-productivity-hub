import { createFileRoute } from "@tanstack/react-router";
import { Cloud, Moon, Settings } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { useWorkspaceSettings } from "@/components/workspace-settings";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Workspace Settings · Workplace AI" },
      { name: "description", content: "Manage your Workplace AI appearance and cloud motion preferences." },
      { property: "og:title", content: "Workspace Settings · Workplace AI" },
      { property: "og:description", content: "Manage your Workplace AI appearance and cloud motion preferences." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: SettingsPage,
});

function SettingsPage() {
  const { darkSurfaces, cloudMotion, setDarkSurfaces, setCloudMotion } = useWorkspaceSettings();
  return (
    <div className="mx-auto max-w-3xl space-y-8 p-4 md:p-8">
      <header className="flex items-center gap-3">
        <div className="grid size-11 shrink-0 place-items-center rounded-lg bg-card text-primary shadow-card"><Settings className="size-5" /></div>
        <h1 className="text-2xl font-semibold md:text-3xl">Settings</h1>
      </header>
      <section className="bg-card px-5 py-2 text-card-foreground md:px-6">
        <h2 className="border-b py-4 text-lg font-semibold">Appearance</h2>
        <div className="flex items-center justify-between gap-4 border-b py-6">
          <label htmlFor="dark-surfaces" className="flex items-center gap-3 font-medium"><Moon className="size-5 shrink-0 text-muted-foreground" />Dark surfaces</label>
          <Switch id="dark-surfaces" checked={darkSurfaces} onCheckedChange={setDarkSurfaces} />
        </div>
        <div className="flex items-center justify-between gap-4 py-6">
          <label htmlFor="cloud-motion" className="flex items-center gap-3 font-medium"><Cloud className="size-5 shrink-0 text-muted-foreground" />Cloud animation</label>
          <Switch id="cloud-motion" checked={cloudMotion} onCheckedChange={setCloudMotion} />
        </div>
      </section>
    </div>
  );
}