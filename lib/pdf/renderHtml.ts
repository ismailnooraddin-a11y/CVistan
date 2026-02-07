function esc(s: any) {
  const str = String(s ?? "");
  return str
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function bullets(list: any[]) {
  const items = (list ?? []).map((x) => String(x ?? "").trim()).filter(Boolean);
  if (!items.length) return "";
  return `<ul>${items.map((b) => `<li>${esc(b)}</li>`).join("")}</ul>`;
}

function sectionTitle(t: string) {
  return `<div class="h2">${esc(t)}</div>`;
}

export function renderCvHtml(cv: any, templateId: "modern" | "classic" | "minimal") {
  const css = `
    * { box-sizing: border-box; }
    body { font-family: Arial, Helvetica, sans-serif; font-size: 12px; color: #111; }
    .wrap { padding: 0; }
    .header { display: flex; justify-content: space-between; gap: 16px; }
    .name { font-size: 26px; font-weight: 700; letter-spacing: -0.3px; }
    .title { font-size: 14px; color: #333; margin-top: 4px; }
    .meta { text-align: right; font-size: 11px; color: #555; }
    .rule { height: 1px; background: #ddd; margin: 14px 0; }
    .h2 { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.8px; margin: 0 0 8px 0; }
    .section { margin-bottom: 16px; }
    .row { display: flex; justify-content: space-between; gap: 12px; }
    .role { font-weight: 700; }
    .subtle { color: #666; }
    ul { margin: 6px 0 0 18px; padding: 0; }
    li { margin: 0 0 4px 0; }
  `;

  const profile = cv?.profile ?? {};
  const summary = String(cv?.summary ?? "").trim();

  const exp = Array.isArray(cv?.experience) ? cv.experience : [];
  const edu = Array.isArray(cv?.education) ? cv.education : [];
  const skills = Array.isArray(cv?.skills) ? cv.skills : [];
  const projects = Array.isArray(cv?.projects) ? cv.projects : [];
  const certs = Array.isArray(cv?.certifications) ? cv.certifications : [];
  const langs = Array.isArray(cv?.languages) ? cv.languages : [];

  const sectionOrder = Array.isArray(cv?.sectionOrder) ? cv.sectionOrder : [];

  function has(key: string) {
    return sectionOrder.includes(key);
  }

  const headerHtml = `
    <div class="header">
      <div>
        <div class="name">${esc(profile.fullName || "Your Name")}</div>
        <div class="title">${esc(profile.title || "Your Title")}</div>
      </div>
      <div class="meta">
        ${profile.email ? `<div>${esc(profile.email)}</div>` : ""}
        ${profile.phone ? `<div>${esc(profile.phone)}</div>` : ""}
        ${profile.location ? `<div>${esc(profile.location)}</div>` : ""}
        ${profile.website ? `<div>${esc(profile.website)}</div>` : ""}
      </div>
    </div>
  `;

  const summaryHtml = has("summary") && summary
    ? `<div class="section">${sectionTitle("Summary")}<div>${esc(summary).replaceAll("\n", "<br/>")}</div></div>`
    : "";

  const expHtml = has("experience") && exp.length
    ? `<div class="section">${sectionTitle("Experience")}
        ${exp.map((x:any) => `
          <div style="margin-bottom:10px;">
            <div class="row">
              <div class="role">${esc(x.title || "Role")} <span class="subtle">— ${esc(x.company || "Company")}</span></div>
              <div class="subtle" style="white-space:nowrap;">${esc([x.start, x.end].filter(Boolean).join(" – "))}</div>
            </div>
            ${x.location ? `<div class="subtle" style="font-size:11px;">${esc(x.location)}</div>` : ""}
            ${bullets(x.bullets || [])}
          </div>
        `).join("")}
      </div>`
    : "";

  const eduHtml = has("education") && edu.length
    ? `<div class="section">${sectionTitle("Education")}
        ${edu.map((x:any) => `
          <div style="margin-bottom:10px;">
            <div class="row">
              <div>
                <div class="role">${esc(x.school || "School")}</div>
                <div>${esc([x.degree, x.field].filter(Boolean).join(" • "))}</div>
                ${x.notes ? `<div class="subtle" style="font-size:11px; margin-top:4px;">${esc(x.notes)}</div>` : ""}
              </div>
              <div class="subtle" style="white-space:nowrap;">${esc([x.start, x.end].filter(Boolean).join(" – "))}</div>
            </div>
          </div>
        `).join("")}
      </div>`
    : "";

  const skillsHtml = has("skills") && skills.length
    ? `<div class="section">${sectionTitle("Skills")}<div>${esc(skills.join(" • "))}</div></div>`
    : "";

  const projectsHtml = has("projects") && projects.length
    ? `<div class="section">${sectionTitle("Projects")}
        ${projects.map((p:any) => `
          <div style="margin-bottom:10px;">
            <div class="row">
              <div class="role">${esc(p.name || "Project")}${p.role ? ` <span class="subtle">— ${esc(p.role)}</span>` : ""}</div>
              ${p.link ? `<div class="subtle" style="font-size:11px;">${esc(p.link)}</div>` : "<div></div>"}
            </div>
            ${bullets(p.bullets || [])}
          </div>
        `).join("")}
      </div>`
    : "";

  const certHtml = has("certifications") && certs.length
    ? `<div class="section">${sectionTitle("Certifications")}
        <div>
          ${certs.map((c:any) => `
            <div>${esc(c.name || "Certification")}${c.issuer ? ` <span class="subtle">— ${esc(c.issuer)}</span>` : ""}${c.year ? ` <span class="subtle">(${esc(c.year)})</span>` : ""}</div>
          `).join("")}
        </div>
      </div>`
    : "";

  const langHtml = has("languages") && langs.length
    ? `<div class="section">${sectionTitle("Languages")}
        <div>${esc(langs.filter((l:any)=> String(l?.name||"").trim()).map((l:any)=> `${l.name}${l.level ? " ("+l.level+")" : ""}`).join(" • "))}</div>
      </div>`
    : "";

  const body = `
    <div class="wrap">
      ${headerHtml}
      <div class="rule"></div>
      ${summaryHtml}
      ${expHtml}
      ${eduHtml}
      ${skillsHtml}
      ${projectsHtml}
      ${certHtml}
      ${langHtml}
    </div>
  `;

  return `<!doctype html>
    <html>
      <head>
        <meta charset="utf-8"/>
        <meta name="viewport" content="width=device-width, initial-scale=1"/>
        <style>${css}</style>
      </head>
      <body>${body}</body>
    </html>`;
}
