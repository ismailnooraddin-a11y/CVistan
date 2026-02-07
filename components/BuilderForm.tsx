"use client";

import { useMemo } from "react";
import { Plus, Trash2, GripVertical } from "lucide-react";
import { DndContext, closestCenter } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy, useSortable, arrayMove } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import { CVData, SectionKey, defaultSectionOrder } from "@/lib/cv";
import { Button, Field, Input, Textarea, Section } from "@/components/ui";

function SortableItem({ id, label }: { id: SectionKey; label: string }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });
  const style = { transform: CSS.Transform.toString(transform), transition };
  return (
    <div
      ref={setNodeRef}
      style={style}
      className={
        "flex items-center justify-between rounded-xl border border-zinc-200 bg-white px-3 py-2 " +
        (isDragging ? "opacity-70" : "")
      }
    >
      <div className="flex items-center gap-2">
        <span className="text-zinc-400" {...attributes} {...listeners}>
          <GripVertical className="h-4 w-4" />
        </span>
        <span className="text-sm">{label}</span>
      </div>
    </div>
  );
}

export default function BuilderForm({ cv, onChange }: { cv: CVData; onChange: (v: CVData) => void }) {
  const sectionOrder = cv.sectionOrder ?? defaultSectionOrder;

  const sectionLabels: Record<SectionKey, string> = useMemo(
    () => ({
      profile: "Profile",
      summary: "Summary",
      experience: "Experience",
      education: "Education",
      skills: "Skills",
      projects: "Projects",
      certifications: "Certifications",
      languages: "Languages",
    }),
    []
  );

  function set<K extends keyof CVData>(key: K, value: CVData[K]) {
    onChange({ ...cv, [key]: value });
  }

  function onDragEnd(event: any) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = sectionOrder.indexOf(active.id);
    const newIndex = sectionOrder.indexOf(over.id);
    const newOrder = arrayMove(sectionOrder, oldIndex, newIndex);
    set("sectionOrder", newOrder);
  }

  function addExperience() {
    const next = [
      ...cv.experience,
      { id: crypto.randomUUID(), title: "", company: "", location: "", start: "", end: "", bullets: [""] },
    ];
    set("experience", next);
  }

  function removeExperience(id: string) {
    set("experience", cv.experience.filter((x) => x.id !== id));
  }

  function addEducation() {
    const next = [
      ...cv.education,
      { id: crypto.randomUUID(), school: "", degree: "", field: "", start: "", end: "", notes: "" },
    ];
    set("education", next);
  }

  function removeEducation(id: string) {
    set("education", cv.education.filter((x) => x.id !== id));
  }

  function addProject() {
    const next = [
      ...cv.projects,
      { id: crypto.randomUUID(), name: "", role: "", link: "", bullets: [""] },
    ];
    set("projects", next);
  }

  function removeProject(id: string) {
    set("projects", cv.projects.filter((x) => x.id !== id));
  }

  function addCert() {
    const next = [
      ...cv.certifications,
      { id: crypto.randomUUID(), name: "", issuer: "", year: "" },
    ];
    set("certifications", next);
  }

  function removeCert(id: string) {
    set("certifications", cv.certifications.filter((x) => x.id !== id));
  }

  function addLanguage() {
    const next = [
      ...cv.languages,
      { id: crypto.randomUUID(), name: "", level: "" },
    ];
    set("languages", next);
  }

  function removeLanguage(id: string) {
    set("languages", cv.languages.filter((x) => x.id !== id));
  }

  return (
    <div className="space-y-8">
      <Section title="Section order (drag to reorder)">
        <DndContext collisionDetection={closestCenter} onDragEnd={onDragEnd}>
          <SortableContext items={sectionOrder} strategy={verticalListSortingStrategy}>
            <div className="space-y-2">
              {sectionOrder.map((k) => (
                <SortableItem key={k} id={k} label={sectionLabels[k]} />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      </Section>

      <Section title="Profile">
        <div className="grid md:grid-cols-2 gap-3">
          <Field label="Full name">
            <Input value={cv.profile.fullName} onChange={(e) => set("profile", { ...cv.profile, fullName: e.target.value })} />
          </Field>
          <Field label="Title (e.g., Data Analyst)">
            <Input value={cv.profile.title} onChange={(e) => set("profile", { ...cv.profile, title: e.target.value })} />
          </Field>
          <Field label="Email">
            <Input value={cv.profile.email} onChange={(e) => set("profile", { ...cv.profile, email: e.target.value })} />
          </Field>
          <Field label="Phone">
            <Input value={cv.profile.phone} onChange={(e) => set("profile", { ...cv.profile, phone: e.target.value })} />
          </Field>
          <Field label="Location">
            <Input value={cv.profile.location} onChange={(e) => set("profile", { ...cv.profile, location: e.target.value })} />
          </Field>
          <Field label="LinkedIn / Website" hint="optional">
            <Input value={cv.profile.website} onChange={(e) => set("profile", { ...cv.profile, website: e.target.value })} />
          </Field>
        </div>
      </Section>

      <Section title="Summary">
        <Field label="Professional summary" hint="2–4 strong lines">
          <Textarea rows={4} value={cv.summary} onChange={(e) => set("summary", e.target.value)} />
        </Field>
      </Section>

      <Section title="Experience">
        <div className="space-y-4">
          {cv.experience.map((exp, idx) => (
            <div key={exp.id} className="rounded-2xl border border-zinc-200 bg-white p-3">
              <div className="flex items-center justify-between mb-2">
                <div className="text-xs text-zinc-500">Role #{idx + 1}</div>
                <button
                  className="inline-flex items-center gap-2 text-xs text-red-600 hover:underline"
                  onClick={() => removeExperience(exp.id)}
                  type="button"
                >
                  <Trash2 className="h-4 w-4" /> Remove
                </button>
              </div>

              <div className="grid md:grid-cols-2 gap-3">
                <Field label="Title">
                  <Input value={exp.title} onChange={(e) => {
                    const next = cv.experience.map(x => x.id === exp.id ? { ...x, title: e.target.value } : x);
                    set("experience", next);
                  }} />
                </Field>
                <Field label="Company">
                  <Input value={exp.company} onChange={(e) => {
                    const next = cv.experience.map(x => x.id === exp.id ? { ...x, company: e.target.value } : x);
                    set("experience", next);
                  }} />
                </Field>
                <Field label="Location" hint="optional">
                  <Input value={exp.location} onChange={(e) => {
                    const next = cv.experience.map(x => x.id === exp.id ? { ...x, location: e.target.value } : x);
                    set("experience", next);
                  }} />
                </Field>
                <Field label="Dates" hint="e.g., Jan 2022 – Present">
                  <Input value={`${exp.start}${exp.end ? " – " + exp.end : ""}`} onChange={(e) => {
                    const raw = e.target.value;
                    const parts = raw.split("–").map(s => s.trim());
                    const start = parts[0] ?? "";
                    const end = parts[1] ?? "";
                    const next = cv.experience.map(x => x.id === exp.id ? { ...x, start, end } : x);
                    set("experience", next);
                  }} />
                </Field>
              </div>

              <div className="mt-3">
                <div className="text-xs font-medium text-zinc-700 mb-2">Bullets</div>
                <div className="space-y-2">
                  {exp.bullets.map((b, i) => (
                    <div key={i} className="flex gap-2">
                      <Input
                        value={b}
                        placeholder="Impact bullet (start with a verb + result)."
                        onChange={(e) => {
                          const next = cv.experience.map(x => {
                            if (x.id !== exp.id) return x;
                            const bullets = [...x.bullets];
                            bullets[i] = e.target.value;
                            return { ...x, bullets };
                          });
                          set("experience", next);
                        }}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        onClick={() => {
                          const next = cv.experience.map(x => {
                            if (x.id !== exp.id) return x;
                            const bullets = x.bullets.filter((_, j) => j !== i);
                            return { ...x, bullets: bullets.length ? bullets : [""] };
                          });
                          set("experience", next);
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => {
                      const next = cv.experience.map(x => x.id === exp.id ? { ...x, bullets: [...x.bullets, ""] } : x);
                      set("experience", next);
                    }}
                  >
                    <Plus className="h-4 w-4 mr-2" /> Add bullet
                  </Button>
                </div>
              </div>
            </div>
          ))}

          <Button type="button" onClick={addExperience}>
            <Plus className="h-4 w-4 mr-2" /> Add experience
          </Button>
        </div>
      </Section>

      <Section title="Education">
        <div className="space-y-4">
          {cv.education.map((ed, idx) => (
            <div key={ed.id} className="rounded-2xl border border-zinc-200 bg-white p-3">
              <div className="flex items-center justify-between mb-2">
                <div className="text-xs text-zinc-500">Education #{idx + 1}</div>
                <button
                  className="inline-flex items-center gap-2 text-xs text-red-600 hover:underline"
                  onClick={() => removeEducation(ed.id)}
                  type="button"
                >
                  <Trash2 className="h-4 w-4" /> Remove
                </button>
              </div>

              <div className="grid md:grid-cols-2 gap-3">
                <Field label="School">
                  <Input value={ed.school} onChange={(e) => {
                    const next = cv.education.map(x => x.id === ed.id ? { ...x, school: e.target.value } : x);
                    set("education", next);
                  }} />
                </Field>
                <Field label="Degree">
                  <Input value={ed.degree} onChange={(e) => {
                    const next = cv.education.map(x => x.id === ed.id ? { ...x, degree: e.target.value } : x);
                    set("education", next);
                  }} />
                </Field>
                <Field label="Field" hint="optional">
                  <Input value={ed.field} onChange={(e) => {
                    const next = cv.education.map(x => x.id === ed.id ? { ...x, field: e.target.value } : x);
                    set("education", next);
                  }} />
                </Field>
                <Field label="Dates" hint="e.g., 2018 – 2022">
                  <Input value={`${ed.start}${ed.end ? " – " + ed.end : ""}`} onChange={(e) => {
                    const raw = e.target.value;
                    const parts = raw.split("–").map(s => s.trim());
                    const start = parts[0] ?? "";
                    const end = parts[1] ?? "";
                    const next = cv.education.map(x => x.id === ed.id ? { ...x, start, end } : x);
                    set("education", next);
                  }} />
                </Field>
              </div>

              <div className="mt-3">
                <Field label="Notes" hint="optional">
                  <Textarea rows={3} value={ed.notes} onChange={(e) => {
                    const next = cv.education.map(x => x.id === ed.id ? { ...x, notes: e.target.value } : x);
                    set("education", next);
                  }} />
                </Field>
              </div>
            </div>
          ))}

          <Button type="button" onClick={addEducation}>
            <Plus className="h-4 w-4 mr-2" /> Add education
          </Button>
        </div>
      </Section>

      <Section title="Skills">
        <Field label="Skills (comma separated)" hint="e.g., SQL, Python, Power BI">
          <Input value={cv.skills.join(", ")} onChange={(e) => set("skills", e.target.value.split(",").map(s => s.trim()).filter(Boolean))} />
        </Field>
      </Section>

      <Section title="Projects">
        <div className="space-y-4">
          {cv.projects.map((p, idx) => (
            <div key={p.id} className="rounded-2xl border border-zinc-200 bg-white p-3">
              <div className="flex items-center justify-between mb-2">
                <div className="text-xs text-zinc-500">Project #{idx + 1}</div>
                <button
                  className="inline-flex items-center gap-2 text-xs text-red-600 hover:underline"
                  onClick={() => removeProject(p.id)}
                  type="button"
                >
                  <Trash2 className="h-4 w-4" /> Remove
                </button>
              </div>

              <div className="grid md:grid-cols-2 gap-3">
                <Field label="Name">
                  <Input value={p.name} onChange={(e) => {
                    const next = cv.projects.map(x => x.id === p.id ? { ...x, name: e.target.value } : x);
                    set("projects", next);
                  }} />
                </Field>
                <Field label="Role" hint="optional">
                  <Input value={p.role} onChange={(e) => {
                    const next = cv.projects.map(x => x.id === p.id ? { ...x, role: e.target.value } : x);
                    set("projects", next);
                  }} />
                </Field>
                <Field label="Link" hint="optional">
                  <Input value={p.link} onChange={(e) => {
                    const next = cv.projects.map(x => x.id === p.id ? { ...x, link: e.target.value } : x);
                    set("projects", next);
                  }} />
                </Field>
              </div>

              <div className="mt-3">
                <div className="text-xs font-medium text-zinc-700 mb-2">Bullets</div>
                <div className="space-y-2">
                  {p.bullets.map((b, i) => (
                    <div key={i} className="flex gap-2">
                      <Input
                        value={b}
                        placeholder="What did you build? What impact?"
                        onChange={(e) => {
                          const next = cv.projects.map(x => {
                            if (x.id !== p.id) return x;
                            const bullets = [...x.bullets];
                            bullets[i] = e.target.value;
                            return { ...x, bullets };
                          });
                          set("projects", next);
                        }}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        onClick={() => {
                          const next = cv.projects.map(x => {
                            if (x.id !== p.id) return x;
                            const bullets = x.bullets.filter((_, j) => j !== i);
                            return { ...x, bullets: bullets.length ? bullets : [""] };
                          });
                          set("projects", next);
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => {
                      const next = cv.projects.map(x => x.id === p.id ? { ...x, bullets: [...x.bullets, ""] } : x);
                      set("projects", next);
                    }}
                  >
                    <Plus className="h-4 w-4 mr-2" /> Add bullet
                  </Button>
                </div>
              </div>
            </div>
          ))}

          <Button type="button" onClick={addProject}>
            <Plus className="h-4 w-4 mr-2" /> Add project
          </Button>
        </div>
      </Section>

      <Section title="Certifications">
        <div className="space-y-3">
          {cv.certifications.map((c) => (
            <div key={c.id} className="grid md:grid-cols-4 gap-2 items-end">
              <Field label="Name">
                <Input value={c.name} onChange={(e) => {
                  const next = cv.certifications.map(x => x.id === c.id ? { ...x, name: e.target.value } : x);
                  set("certifications", next);
                }} />
              </Field>
              <Field label="Issuer" hint="optional">
                <Input value={c.issuer} onChange={(e) => {
                  const next = cv.certifications.map(x => x.id === c.id ? { ...x, issuer: e.target.value } : x);
                  set("certifications", next);
                }} />
              </Field>
              <Field label="Year" hint="optional">
                <Input value={c.year} onChange={(e) => {
                  const next = cv.certifications.map(x => x.id === c.id ? { ...x, year: e.target.value } : x);
                  set("certifications", next);
                }} />
              </Field>
              <Button type="button" variant="ghost" onClick={() => removeCert(c.id)}>
                <Trash2 className="h-4 w-4 mr-2" /> Remove
              </Button>
            </div>
          ))}
          <Button type="button" onClick={addCert}>
            <Plus className="h-4 w-4 mr-2" /> Add certification
          </Button>
        </div>
      </Section>

      <Section title="Languages">
        <div className="space-y-3">
          {cv.languages.map((l) => (
            <div key={l.id} className="grid md:grid-cols-3 gap-2 items-end">
              <Field label="Language">
                <Input value={l.name} onChange={(e) => {
                  const next = cv.languages.map(x => x.id === l.id ? { ...x, name: e.target.value } : x);
                  set("languages", next);
                }} />
              </Field>
              <Field label="Level" hint="e.g., Native, B2, Fluent">
                <Input value={l.level} onChange={(e) => {
                  const next = cv.languages.map(x => x.id === l.id ? { ...x, level: e.target.value } : x);
                  set("languages", next);
                }} />
              </Field>
              <Button type="button" variant="ghost" onClick={() => removeLanguage(l.id)}>
                <Trash2 className="h-4 w-4 mr-2" /> Remove
              </Button>
            </div>
          ))}
          <Button type="button" onClick={addLanguage}>
            <Plus className="h-4 w-4 mr-2" /> Add language
          </Button>
        </div>
      </Section>
    </div>
  );
}
