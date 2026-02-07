"use client";

import { CVData, TemplateId } from "@/lib/cv";
import { ModernTemplate } from "@/components/templates/ModernTemplate";
import { ClassicTemplate } from "@/components/templates/ClassicTemplate";
import { MinimalTemplate } from "@/components/templates/MinimalTemplate";

export default function CVPreview({ cv, templateId }: { cv: CVData; templateId: TemplateId }) {
  const content =
    templateId === "classic" ? (
      <ClassicTemplate cv={cv} />
    ) : templateId === "minimal" ? (
      <MinimalTemplate cv={cv} />
    ) : (
      <ModernTemplate cv={cv} />
    );

  return (
    <div className="mx-auto w-fit">
      <div className="a4 a4-shadow print-reset">
        {content}
      </div>
    </div>
  );
}
