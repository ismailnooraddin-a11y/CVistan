import { NextRequest } from "next/server";

export const runtime = "nodejs";

type Payload = {
  cv: any;
  templateId: "modern" | "classic" | "minimal";
};

export async function POST(req: NextRequest) {
  if (process.env.ENABLE_SERVER_PDF !== "true") {
    return new Response(
      "Server PDF is disabled. Set ENABLE_SERVER_PDF=true (recommended: Docker deploy).",
      { status: 400 }
    );
  }

  let payload: Payload | null = null;
  try {
    payload = (await req.json()) as Payload;
  } catch {
    return new Response("Invalid JSON body.", { status: 400 });
  }

  try {
    const { chromium } = await import("playwright");
    const { renderCvHtml } = await import("@/lib/pdf/renderHtml");
    const html = renderCvHtml(payload.cv, payload.templateId);

    const browser = await chromium.launch();
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: "networkidle" });

    const pdf = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: { top: "10mm", right: "10mm", bottom: "10mm", left: "10mm" },
    });

    await browser.close();

    return new Response(pdf, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": "attachment; filename=\"cv.pdf\"",
      },
    });
  } catch (e: any) {
    const msg =
      "Failed to generate server PDF. " +
      "This host must support Playwright/Chromium.\n\n" +
      (e?.message ?? String(e));
    return new Response(msg, { status: 500 });
  }
}
