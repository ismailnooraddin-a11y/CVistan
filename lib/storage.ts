import { CVData, TemplateId } from "@/lib/cv";

const KEY = "cv_builder_storage_v1";

export function saveCV(data: { cv: CVData; templateId: TemplateId }) {
  try {
    localStorage.setItem(KEY, JSON.stringify(data));
  } catch {
    // ignore
  }
}

export function loadCV(): { cv: CVData; templateId: TemplateId } | null {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return parsed;
  } catch {
    return null;
  }
}
