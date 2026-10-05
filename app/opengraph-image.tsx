import { ImageResponse } from "next/og";

export const alt = "AUREL & ASH — Designed for the everyday";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#f6f3ee",
          color: "#121110",
          padding: "80px",
        }}
      >
        <div style={{ display: "flex", fontSize: 26, letterSpacing: "0.34em" }}>
          AUREL <span style={{ color: "#6b521f" }}>&amp;</span> ASH
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div style={{ fontSize: 96, lineHeight: 1.04, letterSpacing: "-0.035em", fontWeight: 600 }}>
            Designed for the everyday.
          </div>
          <div style={{ fontSize: 28, color: "#4a4741" }}>
            Five pieces in heavyweight cotton and washed canvas.
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ display: "flex", height: 2, width: 120, background: "#8a6d33" }} />
          <div style={{ display: "flex", fontSize: 20, letterSpacing: "0.2em", color: "#6e6a63" }}>
            SHOP THE COLLECTION
          </div>
        </div>
      </div>
    ),
    size,
  );
}