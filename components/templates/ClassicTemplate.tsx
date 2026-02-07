import { CVData } from "@/lib/cv";

function clean(items: string[]) {
  return items.map(s => s.trim()).filter(Boolean);
}

export function ClassicTemplate({ cv }: { cv: CVData }) {
  const order = cv.sectionOrder ?? [];
  const show = (key: string) => order.includes(key as any);

  return (
    <div className="text-[12px] leading-[1.45]">
      <div className="text-center">
        <div className="text-2xl font-bold tracking-tight">{cv.profile.fullName || "Your Name"}</div>
        <div className="text-sm text-zinc-700 mt-1">{cv.profile.title || "Your Title"}</div>
        <div className="mt-2 text-[11px] text-zinc-600">
          {[cv.profile.email, cv.profile.phone, cv.profile.location, cv.profile.website].filter(Boolean).join(" • ")}
        </div>
      </div>

      <div className="mt-4 h-px bg-zinc-300" />

      <div className="mt-4 space-y-5">
        {show("summary") && cv.summary?.trim() ? (
          <section>
            <h2 className="text-[12px] font-bold text-zinc-900">SUMMARY</h2>
            <p className="mt-2 text-zinc-700">{cv.summary}</p>
          </section>
        ) : null}

        {show("experience") && cv.experience.length ? (
          <section>
            <h2 className="text-[12px] font-bold text-zinc-900">EXPERIENCE</h2>
            <div className="mt-2 space-y-3">
              {cv.experience.map((x) => (
                <div key={x.id}>
                  <div className="flex items-baseline justify-between gap-3">
                    <div className="font-semibold">
                      {x.title || "Role"} — {x.company || "Company"}
                    </div>
                    <div className="text-[11px] text-zinc-600 whitespace-nowrap">
                      {[x.start, x.end].filter(Boolean).join(" – ")}
                    </div>
                  </div>
                  {x.location?.trim() ? <div className="text-[11px] text-zinc-600">{x.location}</div> : null}
                  {clean(x.bullets).length ? (
                    <ul className="mt-2 list-disc pl-5 space-y-1 text-zinc-700">
                      {clean(x.bullets).map((b, i) => (
                        <li key={i}>{b}</li>
                      ))}
                    </ul>
                  ) : null}
                </div>
              ))}
            </div>
          </section>
        ) : null}

        {show("education") && cv.education.length ? (
          <section>
            <h2 className="text-[12px] font-bold text-zinc-900">EDUCATION</h2>
            <div className="mt-2 space-y-3">
              {cv.education.map((x) => (
                <div key={x.id} className="flex items-baseline justify-between gap-3">
                  <div>
                    <div className="font-semibold">{x.school || "School"}</div>
                    <div className="text-zinc-700">
                      {[x.degree, x.field].filter(Boolean).join(" • ")}
                    </div>
                    {x.notes?.trim() ? <div className="text-[11px] text-zinc-600 mt-1">{x.notes}</div> : null}
                  </div>
                  <div className="text-[11px] text-zinc-600 whitespace-nowrap">
                    {[x.start, x.end].filter(Boolean).join(" – ")}
                  </div>
                </div>
              ))}
            </div>
          </section>
        ) : null}

        {show("skills") && cv.skills.length ? (
          <section>
            <h2 className="text-[12px] font-bold text-zinc-900">SKILLS</h2>
            <div className="mt-2 text-zinc-700">{cv.skills.join(", ")}</div>
          </section>
        ) : null}

        {show("projects") && cv.projects.length ? (
          <section>
            <h2 className="text-[12px] font-bold text-zinc-900">PROJECTS</h2>
            <div className="mt-2 space-y-3">
              {cv.projects.map((p) => (
                <div key={p.id}>
                  <div className="font-semibold">
                    {p.name || "Project"}{p.role?.trim() ? ` — ${p.role}` : ""}
                  </div>
                  {p.link?.trim() ? <div className="text-[11px] text-zinc-600">{p.link}</div> : null}
                  {clean(p.bullets).length ? (
                    <ul className="mt-2 list-disc pl-5 space-y-1 text-zinc-700">
                      {clean(p.bullets).map((b, i) => (
                        <li key={i}>{b}</li>
                      ))}
                    </ul>
                  ) : null}
                </div>
              ))}
            </div>
          </section>
        ) : null}

        {show("certifications") && cv.certifications.length ? (
          <section>
            <h2 className="text-[12px] font-bold text-zinc-900">CERTIFICATIONS</h2>
            <div className="mt-2 text-zinc-700">
              {cv.certifications.map((c) => (
                <div key={c.id}>
                  {c.name || "Certification"}{c.issuer?.trim() ? ` — ${c.issuer}` : ""}{c.year?.trim() ? ` (${c.year})` : ""}
                </div>
              ))}
            </div>
          </section>
        ) : null}

        {show("languages") && cv.languages.length ? (
          <section>
            <h2 className="text-[12px] font-bold text-zinc-900">LANGUAGES</h2>
            <div className="mt-2 text-zinc-700">
              {cv.languages.filter(l => l.name?.trim()).map(l => `${l.name}${l.level?.trim() ? ` (${l.level})` : ""}`).join(", ")}
            </div>
          </section>
        ) : null}
      </div>
    </div>
  );
}
