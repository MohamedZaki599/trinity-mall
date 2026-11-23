import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Trinity Mall — sales, leasing and partnerships in New Assiut City";

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
          background: "linear-gradient(135deg, #0c1017 0%, #17202e 70%, #2a241a 100%)",
          padding: "72px",
          color: "#f6f0e5",
          fontFamily: "Arial, sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "18px" }}>
          <div
            style={{
              width: "14px",
              height: "14px",
              borderRadius: "50%",
              background: "#cba960",
            }}
          />
          <span style={{ color: "#f2d995", fontSize: "22px", letterSpacing: "6px" }}>
            TRINITY MALL
          </span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "22px" }}>
          <span style={{ fontSize: "72px", lineHeight: 1.05, letterSpacing: "-2px" }}>
            The right space
          </span>
          <span style={{ fontSize: "72px", lineHeight: 1.05, letterSpacing: "-2px" }}>
            starts the right move.
          </span>
          <span style={{ fontSize: "26px", color: "#a7adb8", maxWidth: "820px" }}>
            Sales, leasing and corporate partnerships — New Assiut City, Egypt.
          </span>
        </div>

        <div style={{ display: "flex", gap: "28px", fontSize: "18px", color: "#cba960" }}>
          <span>SALE</span>
          <span>LEASE</span>
          <span>PARTNERSHIPS</span>
        </div>
      </div>
    ),
    size,
  );
}
