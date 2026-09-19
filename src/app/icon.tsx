import { ImageResponse } from "next/og";

export const size = {
  width: 64,
  height: 64,
};

export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          alignItems: "center",
          background: "#2f76b5",
          color: "#f5fbf7",
          display: "flex",
          fontFamily: "sans-serif",
          fontSize: 23,
          fontWeight: 700,
          height: "100%",
          justifyContent: "center",
          letterSpacing: "-2px",
          width: "100%",
        }}
      >
        JF
      </div>
    ),
    size,
  );
}
