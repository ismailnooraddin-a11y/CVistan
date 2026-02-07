    import Link from "next/link";

    export default function Home() {
      return (
        <main className="min-h-screen">
          <header className="px-6 py-6">
            <div className="mx-auto max-w-6xl flex items-center justify-between">
              <div className="font-semibold tracking-tight text-lg">CV Builder</div>
              <nav className="flex gap-3">
                <Link className="text-sm hover:underline" href="/builder">Builder</Link>
                <a className="text-sm hover:underline" href="https://nextjs.org" target="_blank" rel="noreferrer">Docs</a>
              </nav>
            </div>
          </header>

          <section className="px-6 py-10">
            <div className="mx-auto max-w-6xl grid md:grid-cols-2 gap-10 items-center">
              <div>
                <h1 className="text-4xl md:text-5xl font-bold tracking-tight leading-tight">
                  A CV builder that stays clean, no matter how long your experience is.
                </h1>
                <p className="mt-4 text-zinc-600 leading-relaxed">
                  Live preview. Strong templates. Automatic section ordering. Export with print-perfect layout.
                </p>
                <div className="mt-6 flex gap-3">
                  <Link href="/builder" className="inline-flex items-center justify-center rounded-xl bg-zinc-900 text-white px-5 py-3 text-sm font-medium shadow-soft hover:bg-black">
                    Open Builder
                  </Link>
                  <a href="#features" className="inline-flex items-center justify-center rounded-xl bg-white border border-zinc-200 px-5 py-3 text-sm font-medium hover:bg-zinc-50">
                    See features
                  </a>
                </div>

                <ul id="features" className="mt-8 space-y-2 text-sm text-zinc-700">
                  <li>• Modern + Classic + Minimal templates</li>
                  <li>• Autosave (browser) + import/export JSON</li>
                  <li>• Reorder sections</li>
                  <li>• Print-to-PDF export (works on any host)</li>
                  <li>• Optional server PDF download (Docker)</li>
                </ul>
              </div>

              <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-soft">
                <div className="text-sm text-zinc-600">Quick start</div>
                <pre className="mt-3 text-xs bg-zinc-950 text-zinc-100 rounded-xl p-4 overflow-auto">
{`npm install
npm run dev
# open http://localhost:3000`}
                </pre>
                <div className="mt-3 text-xs text-zinc-500">
                  Tip: deploy on Vercel for fastest setup. Use Docker if you want server PDF download.
                </div>
              </div>
            </div>
          </section>

          <footer className="px-6 py-10 text-xs text-zinc-500">
            <div className="mx-auto max-w-6xl flex items-center justify-between">
              <span>© {new Date().getFullYear()} CV Builder</span>
              <span>Production starter</span>
            </div>
          </footer>
        </main>
      );
    }
