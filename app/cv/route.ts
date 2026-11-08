import { getContent } from "@/lib/content";
import { buildCv } from "@/lib/cv";
import { logEvent, reportError } from "@/lib/monitor";

export const dynamic = "force-dynamic";

// A CV generated from the same content as the site, so it never goes out of date.
export async function GET(req: Request) {
  try {
    const content = await getContent();
    const bytes = await buildCv(content);
    const download = new URL(req.url).searchParams.has("download");
    if (download) void logEvent("cv_download");
    return new Response(Buffer.from(bytes), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `${download ? "attachment" : "inline"}; filename="Mark-Jade-Gurrobat-CV.pdf"`,
        "Cache-Control": "public, max-age=300",
      },
    });
  } catch (e) {
    await reportError("cv", e);
    return new Response("Could not generate the CV right now.", { status: 500 });
  }
}
