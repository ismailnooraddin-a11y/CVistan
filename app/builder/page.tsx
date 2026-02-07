"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useReactToPrint } from "react-to-print";
import { Download, FileUp, FileDown, RotateCcw, Printer, ShieldAlert } from "lucide-react";

import { CVData, defaultCV, Templates, TemplateId } from "@/lib/cv";
import { loadCV, saveCV } from "@/lib/storage";
import BuilderForm from "@/components/BuilderForm";
import CVPreview from "@/components/CVPreview";
import { downloadJsonFile, readJsonFile } from "@/lib/json";

export default function BuilderPage() {
  const [cv, setCv] = useState<CVData>(defaultCV);
  const [templateId, setTemplateId] = useState<TemplateId>("modern");
  const [serverPdfStatus, setServerPdfStatus] = useState<"idle" | "loading" | "error">("idle");

  const printRef = useRef<HTMLDivElement>(null);

  // Load saved data once
  useEffect(() => {
    const saved = loadCV();
    if (saved) {
      setCv(saved.cv ?? defaultCV);
      setTemplateId(saved.templateId ?? "modern");
    }
  }, []);

  // Autosave
  useEffect(() => {
    saveCV({ cv, templateId });
  }, [cv, templateId]);

  const onPrint = useReactToPrint({
    content: () => printRef.current,
    documentTitle: `${cv.profile.fullName || "CV"}`,
    removeAfterPrint: false,
  });

  async function onExportJson() {
    downloadJsonFile("cv-data.json", { cv, templateId });
  }

  async function onImportJson(file: File) {
    const data = await readJsonFile(file);
    if (!data || typeof data !== "object") return;
    if ("cv" in data) setCv((data as any).cv);
    if ("templateId" in data) setTemplateId((data as any).templateId);
  }

  function onReset() {
    setCv(defaultCV);
    setTemplateId("modern");
  }

  async function downloadServerPdf() {
    setServerPdfStatus("loading");
    try {
      const res = await fetch("/api/pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cv, templateId }),
      });

      if (!res.ok) {
        setServerPdfStatus("error");
        const msg = await res.text();
        alert(
          "Server PDF failed.\n\n" +
            "This feature needs ENABLE_SERVER_PDF=true and a host that supports Playwright (recommended: Docker).\n\n" +
            msg
        );
        return;
      }

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${cv.profile.fullName || "cv"}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);

      setServerPdfStatus("idle");
    } catch (e) {
      console.error(e);
      setServerPdfStatus("error");
      alert("Server PDF failed. Use Print to PDF instead.");
    }
  }

  return (
    <main className="min-h-screen">
      <header className="no-print px-6 py-5 border-b border-zinc-200 bg-white sticky top-0 z-30">
        <div className="mx-auto max-w-7xl flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link href="/" className="font-semibold tracking-tight">CV Builder</Link>
            <span className="text-xs text-zinc-500 hidden md:inline">Production starter</span>
          </div>

          <div className="flex items-center gap-2 flex-wrap justify-end">
            <div className="flex items-center gap-2">
              <span className="text-xs text-zinc-600">Template</span>
              <select
                value={templateId}
                onChange={(e) => setTemplateId(e.target.value as TemplateId)}
                className="text-sm rounded-xl border border-zinc-200 bg-white px-3 py-2"
              >
                {Templates.map(t => (
                  <option key={t.id} value={t.id}>{t.label}</option>
                ))}
              </select>
            </div>

            <button
              onClick={onPrint}
              className="inline-flex items-center gap-2 rounded-xl bg-zinc-900 text-white px-4 py-2 text-sm font-medium hover:bg-black"
            >
              <Printer className="h-4 w-4" />
              Print to PDF
            </button>

            <button
              onClick={downloadServerPdf}
              className="inline-flex items-center gap-2 rounded-xl bg-white border border-zinc-200 px-4 py-2 text-sm font-medium hover:bg-zinc-50"
              disabled={serverPdfStatus === "loading"}
              title="Requires Docker/Node host with ENABLE_SERVER_PDF=true"
            >
              <Download className="h-4 w-4" />
              {serverPdfStatus === "loading" ? "Generating..." : "Download PDF (server)"}
            </button>

            <button
              onClick={onExportJson}
              className="inline-flex items-center gap-2 rounded-xl bg-white border border-zinc-200 px-4 py-2 text-sm font-medium hover:bg-zinc-50"
            >
              <FileDown className="h-4 w-4" />
              Export JSON
            </button>

            <label className="inline-flex items-center gap-2 rounded-xl bg-white border border-zinc-200 px-4 py-2 text-sm font-medium hover:bg-zinc-50 cursor-pointer">
              <FileUp className="h-4 w-4" />
              Import JSON
              <input
                type="file"
                accept="application/json"
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) onImportJson(f);
                  e.currentTarget.value = "";
                }}
              />
            </label>

            <button
              onClick={onReset}
              className="inline-flex items-center gap-2 rounded-xl bg-white border border-zinc-200 px-4 py-2 text-sm font-medium hover:bg-zinc-50"
            >
              <RotateCcw className="h-4 w-4" />
              Reset
            </button>
          </div>
        </div>

        <div className="mx-auto max-w-7xl mt-3 flex items-start gap-2 text-xs text-zinc-500">
          <ShieldAlert className="h-4 w-4 mt-0.5" />
          <p>
            If your CV is multi-page, <b>Print to PDF</b> gives the cleanest result (automatic pagination).
            The server PDF button needs Docker / a Node server host that supports Playwright.
          </p>
        </div>
      </header>

      <section className="px-6 py-6">
        <div className="mx-auto max-w-7xl grid lg:grid-cols-2 gap-6 items-start">
          <div className="rounded-2xl border border-zinc-200 bg-white shadow-soft">
            <div className="p-4 border-b border-zinc-100">
              <div className="text-sm font-semibold">Your details</div>
              <div className="text-xs text-zinc-500 mt-1">Fill the form. The preview updates instantly.</div>
            </div>
            <div className="p-4">
              <BuilderForm cv={cv} onChange={setCv} />
            </div>
          </div>

          <div className="rounded-2xl border border-zinc-200 bg-white shadow-soft overflow-hidden">
            <div className="p-4 border-b border-zinc-100">
              <div className="text-sm font-semibold">Preview</div>
              <div className="text-xs text-zinc-500 mt-1">A4 layout. Multi-page is supported in print.</div>
            </div>

            <div className="p-4 bg-zinc-100 overflow-auto">
              <div ref={printRef} className="print-area">
                <CVPreview cv={cv} templateId={templateId} />
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
