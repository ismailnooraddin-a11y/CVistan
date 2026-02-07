import { CVData } from "@/lib/cv";

function cleanBullets(items: string[]) {
  return items.map(s => s.trim()).filter(Boolean);
}

export function ModernTemplate({ cv }: { cv: CVData }) {
  const order = cv.sectionOrder ?? [];
  const show = (key: string) => order.includes(key as any);

  return (
    <div className="text-[12px] leading-[1.45]">
      {/* Header */}
      <div className="flex items-start justify-between gap-6">
        <div>
          <div className="text-2xl font-bold tracking-tight">{cv.profile.fullName || "Your Name"}</div>
          <div className="text-sm text-zinc-700 mt-1">{cv.profile.title || "Your Title"}</div>
        </div>
        <div className="text-right text-[11px] text-zinc-600 space-y-1">
          {cv.profile.email ? <div>{cv.profile.email}</div> : null}
          {cv.profile.phone ? <div>{cv.profile.phone}</div> : null}
          {cv.profile.location ? <div>{cv.profile.location}</div> : null}
          {cv.profile.website ? <div>{cv.profile.website}</div> : null}
        </div>
      </div>

      <div className="mt-4 h-px bg-zinc-200" />

      {/* Sections */}
      <div className="mt-4 space-y-5">
        {show("summary") && cv.summary?.trim() ? (
          <section>
            <h2 className="text-[11px] font-semibold uppercase tracking-wide text-zinc-900">Summary</h2>
            <p className="mt-2 text-zinc-700">{cv.summary}</p>
          </section>
        ) : null}

        {show("experience") && cv.experience.length ? (
          <section>
            <h2 className="text-[11px] font-semibold uppercase tracking-wide text-zinc-900">Experience</h2>
            <div className="mt-2 space-y-3">
              {cv.experience.map((x) => (
                <div key={x.id}>
                  <div className="flex items-baseline justify-between gap-3">
                    <div className="font-semibold text-zinc-900">
                      {x.title || "Role"}{" "}
                      <span className="font-normal text-zinc-500">— {x.company || "Company"}</span>
                    </div>
                    <div className="text-[11px] text-zinc-500 whitespace-nowrap">
                      {[x.start, x.end].filter(Boolean).join(" – ")}
                    </div>
                  </div>
                  {(x.location || "").trim() ? (
                    <div className="text-[11px] text-zinc-500">{x.location}</div>
                  ) : null}
                  {cleanBullets(x.bullets).length ? (
                    <ul className="mt-2 list-disc pl-5 space-y-1 text-zinc-700">
                      {cleanBullets(x.bullets).map((b, i) => (
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
            <h2 className="text-[11px] font-semibold uppercase tracking-wide text-zinc-900">Education</h2>
            <div className="mt-2 space-y-3">
              {cv.education.map((x) => (
                <div key={x.id} className="flex items-baseline justify-between gap-3">
                  <div>
                    <div className="font-semibold text-zinc-900">
                      {x.school || "School"}
                    </div>
                    <div className="text-zinc-700">
                      {[x.degree, x.field].filter(Boolean).join(" • ")}
                    </div>
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
            <h2 className="text-[11px] font-semibold uppercase tracking-wide text-zinc-900">Skills</h2>
            <div className="mt-2 text-zinc-700">
              {cv.skills.join(" • ")}
            </div>
          </section>
        ) : null}

        {show("projects") && cv.projects.length ? (
          <section>
            <h2 className="text-[11px] font-semibold uppercase tracking-wide text-zinc-900">Projects</h2>
            <div className="mt-2 space-y-3">
              {cv.projects.map((p) => (
                <div key={p.id}>
                  <div className="flex items-baseline justify-between gap-3">
                    <div className="font-semibold text-zinc-900">
                      {p.name || "Project"}{" "}
                      {p.role?.trim() ? <span className="font-normal text-zinc-500">— {p.role}</span> : null}
                    </div>
                    {p.link?.trim() ? (
                      <div className="text-[11px] text-zinc-500">{p.link}</div>
                    ) : null}
                  </div>
                  {cleanBullets(p.bullets).length ? (
                    <ul className="mt-2 list-disc pl-5 space-y-1 text-zinc-700">
                      {cleanBullets(p.bullets).map((b, i) => (
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
            <h2 className="text-[11px] font-semibold uppercase tracking-wide text-zinc-900">Certifications</h2>
            <ul className="mt-2 list-disc pl-5 space-y-1 text-zinc-700">
              {cv.certifications.map((c) => (
                <li key={c.id}>
                  <span className="font-medium">{c.name || "Certification"}</span>
                  {c.issuer?.trim() ? <span className="text-zinc-500"> — {c.issuer}</span> : null}
                  {c.year?.trim() ? <span className="text-zinc-500"> ({c.year})</span> : null}
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        {show("languages") && cv.languages.length ? (
          <section>
            <h2 className="text-[11px] font-semibold uppercase tracking-wide text-zinc-900">Languages</h2>
            <div className="mt-2 text-zinc-700">
              {cv.languages
                .filter(l => (l.name || "").trim())
                .map((l) => `${l.name}${l.level?.trim() ? " (" + l.level + ")" : ""}`)
                .join(" • ")}
            </div>
          </section>
        ) : null}
      </div>
    </div>
  );
}
