import { ImageResponse } from "next/og";

export const runtime = "edge";

export function generateStaticParams() {
  return [
    { size: "192" },
    { size: "512" },
    { size: "maskable" },
    { size: "apple-touch-icon" },
  ];
}

export async function GET(
  _request: Request,
  { params }: { params: { size: string } }
) {
  const { size } = params;

  let width = 512;
  let height = 512;
  let graphicSize = 320;

  if (size === "192") {
    width = 192;
    height = 192;
    graphicSize = 120;
  } else if (size === "apple-touch-icon") {
    width = 180;
    height = 180;
    graphicSize = 110;
  } else if (size === "maskable") {
    width = 512;
    height = 512;
    // Keep well within the 80% safe zone circle (diameter 409.6px)
    graphicSize = 260;
  } else {
    // default 512
    width = 512;
    height = 512;
    graphicSize = 320;
  }

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#1558B0",
        }}
      >
        <svg
          width={graphicSize}
          height={graphicSize}
          viewBox="0 0 48 48"
          fill="none"
        >
          {/* Wheels */}
          <rect x="11" y="34" width="6" height="6" rx="2" fill="#FFFFFF" />
          <rect x="31" y="34" width="6" height="6" rx="2" fill="#FFFFFF" />
          {/* Bus Main Body */}
          <rect x="8" y="7" width="32" height="28" rx="4" fill="#FFFFFF" />
          {/* Windshield */}
          <rect x="12" y="11" width="24" height="11" rx="2" fill="#1558B0" />
          {/* Headlights */}
          <circle cx="14" cy="28" r="2.5" fill="#1558B0" />
          <circle cx="34" cy="28" r="2.5" fill="#1558B0" />
          {/* Grille */}
          <rect x="20" y="27" width="8" height="2" rx="1" fill="#1558B0" />
        </svg>
      </div>
    ),
    {
      width,
      height,
    }
  );
}
