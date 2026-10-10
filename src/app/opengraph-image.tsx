import { ImageResponse } from "next/og";
import { publication } from "@/lib/publication";
export const alt = "The Tomorrow Times · All reporting is fictional";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export default function Image() {
  return new ImageResponse(
    <div
      style={{
        background: "#0b0d14",
        color: "#f3f2f8",
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: 75,
        borderTop: "18px solid #c3b1ff",
      }}
    >
      <div
        style={{
          fontSize: 22,
          letterSpacing: 5,
          color: "#c3b1ff",
          marginBottom: 28,
        }}
      >
        ALL REPORTING IS FICTIONAL
      </div>
      <div style={{ fontSize: 77, fontWeight: 700, lineHeight: 1.1 }}>
        {publication.name}
      </div>
      <div style={{ fontSize: 34, marginTop: 25 }}>{publication.tagline}</div>
      <div
        style={{
          fontSize: 22,
          marginTop: 60,
          borderTop: "1px solid #303646",
          paddingTop: 25,
        }}
      >
        Famous across worlds. Human everywhere.
      </div>
    </div>,
    size,
  );
}
