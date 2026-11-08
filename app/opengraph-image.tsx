import { ImageResponse } from "next/og";

export const alt = "Mark Jade D. Gurrobat, BSIT Student & Full-Stack Developer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          background: "#04201A",
          color: "#ffffff",
          padding: "80px",
        }}
      >
        <div style={{ display: "flex", fontSize: 84, fontWeight: 800, lineHeight: 1.05 }}>
          Mark Jade D. Gurrobat
        </div>
        <div style={{ display: "flex", marginTop: 24, fontSize: 40, color: "#72F2B0" }}>
          BSIT Student & Full-Stack Developer
        </div>
        <div style={{ display: "flex", marginTop: 12, fontSize: 28, color: "#A9D6C2" }}>
          Ask Gurrabot, my AI assistant, about my work
        </div>
        <div style={{ display: "flex", marginTop: 56, width: 140, height: 10, background: "#72F2B0" }} />
      </div>
    ),
    size
  );
}
