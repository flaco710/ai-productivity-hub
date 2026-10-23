import { useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import { Copy, Loader2, Pencil, Eye, Square, Wand2, RotateCcw, Download } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Disclaimer } from "@/components/disclaimer";
import { streamAI } from "@/lib/ai-client";
import { recordTask } from "@/lib/time-saved";

export type Field =
  | { name: string; label: string; type: "text"; placeholder?: string; required?: boolean }
  | { name: string; label: string; type: "textarea"; placeholder?: string; rows?: number; required?: boolean }
  | { name: string; label: string; type: "select"; options: string[] };

export function ToolPage(props: {
  mode: string;
  title: string;
  description: string;
  fields: Field[];
  cta: string;
  markdown?: boolean;
}) {
  const initial = Object.fromEntries(props.fields.map((f) => [f.name, f.type === "select" ? (f.options[0] ?? "") : ""]));
  const [values, setValues] = useState<Record<string, string>>(initial);
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(false);
  const abort = useRef<AbortController | null>(null);

  const missing = props.fields.some((f) => f.type !== "select" && f.required && !values[f.name]?.trim());

  async function run() {
    abort.current = new AbortController();
    setLoading(true);
    setEditing(false);
    setOutput("");
    try {
      await streamAI({ mode: props.mode, fields: values }, setOutput, abort.current.signal);
      recordTask(props.mode);
    } catch (e) {
      if ((e as Error).name !== "AbortError") toast.error((e as Error).message);
    } finally {
      setLoading(false);
    }
  }

  function download() {
    const blob = new Blob([output], { type: "text/markdown" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `${props.mode}-output.md`;
    a.click();
  }

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-4 md:p-8">
      <header>
        <h1 className="text-2xl font-semibold md:text-3xl">{props.title}</h1>
        <p className="mt-1 text-muted-foreground">{props.description}</p>
      </header>
      <div className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
        <section className="space-y-4 rounded-2xl border bg-card p-5 shadow-card">
          {props.fields.map((f) => (
            <div key={f.name} className="space-y-1.5">
              <Label htmlFor={f.name}>{f.label}</Label>
              {f.type === "text" && (
                <Input id={f.name} placeholder={f.placeholder} value={values[f.name] ?? ""}
                  onChange={(e) => setValues({ ...values, [f.name]: e.target.value })} />
              )}
              {f.type === "textarea" && (
                <Textarea id={f.name} rows={f.rows ?? 5} placeholder={f.placeholder} value={values[f.name] ?? ""}
                  onChange={(e) => setValues({ ...values, [f.name]: e.target.value })} />
              )}
              {f.type === "select" && (
                <Select value={values[f.name] ?? ""} onValueChange={(v) => setValues({ ...values, [f.name]: v })}>
                  <SelectTrigger id={f.name}><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {f.options.map((o) => <SelectItem key={o} value={o}>{o}</SelectItem>)}
                  </SelectContent>
                </Select>
              )}
            </div>
          ))}
          {loading ? (
            <Button variant="outline" className="w-full" onClick={() => abort.current?.abort()}>
              <Square /> Stop
            </Button>
          ) : (
            <Button className="w-full" disabled={missing} onClick={run}>
              <Wand2 /> {props.cta}
            </Button>
          )}
        </section>

        <section className="flex min-h-[420px] flex-col rounded-2xl border bg-card shadow-card">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b px-4 py-2.5">
            <div className="flex items-center gap-2 text-sm font-medium">
              {loading && <Loader2 className="size-4 animate-spin text-primary" />}
              {loading ? "Generating…" : output ? "AI output · editable" : "Output"}
            </div>
            {output && !loading && (
              <div className="flex gap-1">
                <Button size="sm" variant="ghost" onClick={() => setEditing(!editing)}>
                  {editing ? <><Eye /> Preview</> : <><Pencil /> Edit</>}
                </Button>
                <Button size="sm" variant="ghost" onClick={() => { navigator.clipboard.writeText(output); toast.success("Copied"); }}>
                  <Copy /> Copy
                </Button>
                <Button size="sm" variant="ghost" onClick={download}><Download /></Button>
                <Button size="sm" variant="ghost" onClick={run}><RotateCcw /></Button>
              </div>
            )}
          </div>
          <div className="flex-1 p-4">
            {!output && !loading && (
              <div className="grid h-full place-items-center text-center text-sm text-muted-foreground">
                Fill in the details and generate. You can edit the result afterwards.
              </div>
            )}
            {(output || loading) && (editing ? (
              <Textarea className="h-full min-h-[360px] font-mono text-sm" value={output}
                onChange={(e) => setOutput(e.target.value)} />
            ) : props.markdown === false ? (
              <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed">{output}</pre>
            ) : (
              <div className="md text-sm leading-relaxed"><ReactMarkdown>{output}</ReactMarkdown></div>
            ))}
          </div>
        </section>
      </div>
      <Disclaimer />
    </div>
  );
}
