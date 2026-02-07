import { CVData } from "@/lib/cv";

function clean(items: string[]) {
  return items.map(s => s.trim()).filter(Boolean);
}

export function MinimalTemplate({ cv }: { cv: CVData }) {
  const order = cv.sectionOrder ?? [];
  const show = (key: string) => order.includes(key as any);

  return (
    <div className="text-[12px] leading-[1.5]">
      <div className="flex items-end justify-between gap-6">
        <div>
          <div className="text-2xl font-semibold tracking-tight">{cv.profile.fullName || "Your Name"}</div>
          <div className="text-sm text-zinc-700">{cv.profile.title || "Your Title"}</div>
        </div>
        <div className="text-[11px] text-zinc-600 text-right">
          <div>{[cv.profile.email, cv.profile.phone].filter(Boolean).join(" • ")}</div>
          <div>{[cv.profile.location, cv.profile.website].filter(Boolean).join(" • ")}</div>
        </div>
      </div>

      <div className="mt-4 space-y-5">
        {show("summary") && cv.summary?.trim() ? (
          <section>
            <div className="text-[11px] uppercase tracking-wide text-zinc-500">Summary</div>
            <div className="mt-2 text-zinc-800">{cv.summary}</div>
          </section>
        ) : null}

        {show("experience") && cv.experience.length ? (
          <section>
            <div className="text-[11px] uppercase tracking-wide text-zinc-500">Experience</div>
            <div className="mt-2 space-y-3">
              {cv.experience.map((x) => (
                <div key={x.id}>
                  <div className="flex items-baseline justify-between gap-3">
                    <div className="font-medium text-zinc-900">{x.title || "Role"}</div>
                    <div className="text-[11px] text-zinc-500 whitespace-nowrap">
                      {[x.start, x.end].filter(Boolean).join(" – ")}
                    </div>
                  </div>
                  <div className="text-zinc-700">{x.company || "Company"}{x.location?.trim() ? ` • ${x.location}` : ""}</div>
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
            <div className="text-[11px] uppercase tracking-wide text-zinc-500">Education</div>
            <div className="mt-2 space-y-3">
              {cv.education.map((x) => (
                <div key={x.id} className="flex items-baseline justify-between gap-3">
                  <div>
                    <div className="font-medium text-zinc-900">{x.school || "School"}</div>
                    <div className="text-zinc-700">{[x.degree, x.field].filter(Boolean).join(" • ")}</div>
                    {x.notes?.trim() ? <div className="text-[11px] text-zinc-500 mt-1">{x.notes}</div> : null}
                  </div>
                  <div className="text-[11px] text-zinc-500 whitespace-nowrap">
                    {[x.start, x.end].filter(Boolean).join(" – ")}
                  </div>
                </div>
              ))}
            </div>
          </section>
        ) : null}

        {show("skills") && cv.skills.length ? (
          <section>
            <div className="text-[11px] uppercase tracking-wide text-zinc-500">Skills</div>
            <div className="mt-2 text-zinc-700">{cv.skills.join(" • ")}</div>
          </section>
        ) : null}

        {show("projects") && cv.projects.length ? (
          <section>
            <div className="text-[11px] uppercase tracking-wide text-zinc-500">Projects</div>
            <div className="mt-2 space-y-3">
              {cv.projects.map((p) => (
                <div key={p.id}>
                  <div className="flex items-baseline justify-between gap-3">
                    <div className="font-medium text-zinc-900">{p.name || "Project"}</div>
                    {p.link?.trim() ? <div className="text-[11px] text-zinc-500">{p.link}</div> : null}
                  </div>
                  {p.role?.trim() ? <div className="text-zinc-700">{p.role}</div> : null}
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
            <div className="text-[11px] uppercase tracking-wide text-zinc-500">Certifications</div>
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
            <div className="text-[11px] uppercase tracking-wide text-zinc-500">Languages</div>
            <div className="mt-2 text-zinc-700">
              {cv.languages.filter(l => l.name?.trim()).map(l => `${l.name}${l.level?.trim() ? ` (${l.level})` : ""}`).join(" • ")}
            </div>
          </section>
        ) : null}
      </div>
    </div>
  );
}
