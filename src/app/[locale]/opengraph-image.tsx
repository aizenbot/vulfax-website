import { ImageResponse } from "next/og";
import { siteConfig } from "@/config/site";
import { theme } from "@/config/theme";

export const alt = "VULFAX — Software & Digital Engineering";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** Social preview image (Latin text only so no extra font download is needed). */
export default function OpengraphImage() {
  const c = theme.colors;
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 80,
          background: `radial-gradient(circle at 78% 40%, ${c.primary}55, transparent 45%), radial-gradient(circle at 15% 100%, ${c.violet}33, transparent 40%), ${c.bg}`,
          color: c.text,
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: 18,
              border: `2px solid ${c.primary}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 36,
              color: c.cyan,
            }}
          >
            V
          </div>
          <div style={{ fontSize: 40, letterSpacing: 10, fontWeight: 700 }}>{siteConfig.name}</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div style={{ fontSize: 76, fontWeight: 700, lineHeight: 1.05, maxWidth: 900 }}>
            Engineering the systems your next decade runs on.
          </div>
          <div style={{ fontSize: 28, color: c.muted, letterSpacing: 6 }}>
            TECHNOLOGY · INNOVATION · FUTURE
          </div>
        </div>
      </div>
    ),
    size,
  );
}
