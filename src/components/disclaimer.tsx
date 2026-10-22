import { ShieldAlert } from "lucide-react";

export function Disclaimer() {
  return (
    <div className="flex gap-3 rounded-xl border border-warning/30 bg-warning-soft p-3 text-sm text-foreground">
      <ShieldAlert className="mt-0.5 size-4 shrink-0 text-warning" />
      <p>
        <span className="font-semibold">Responsible AI:</span> Content is AI-generated and may contain errors or
        bias. Review, fact-check and edit before sharing. Don't enter confidential, personal or sensitive data.
      </p>
    </div>
  );
}
