import { ImageResponse } from "next/og";

export const socialImageSize = {
  width: 1200,
  height: 630,
};

export function createSocialImage() {
  return new ImageResponse(
    (
      <div
        style={{
          alignItems: "stretch",
          background: "#f3f7fc",
          color: "#172635",
          display: "flex",
          fontFamily: "sans-serif",
          height: "100%",
          padding: 64,
          position: "relative",
          width: "100%",
        }}
      >
        <div
          style={{
            background: "#d9ecfa",
            borderRadius: 320,
            height: 560,
            position: "absolute",
            right: -110,
            top: -220,
            width: 560,
          }}
        />
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", width: "61%" }}>
          <div style={{ alignItems: "center", display: "flex", fontSize: 26, fontWeight: 700, gap: 14 }}>
            <div
              style={{
                alignItems: "center",
                background: "#2f76b5",
                borderRadius: 10,
                color: "white",
                display: "flex",
                fontSize: 18,
                height: 42,
                justifyContent: "center",
                letterSpacing: -1,
                width: 42,
              }}
            >
              JF
            </div>
            JobFit
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ color: "#2f76b5", fontSize: 18, fontWeight: 700, letterSpacing: 3, marginBottom: 22 }}>
              CV EVIDENCE REVIEW
            </div>
            <div style={{ fontSize: 74, fontWeight: 700, letterSpacing: -5, lineHeight: 0.95, maxWidth: 660 }}>
              See what your CV can prove.
            </div>
            <div style={{ color: "#5a6c7d", fontSize: 24, lineHeight: 1.4, marginTop: 28, maxWidth: 620 }}>
              Compare one CV with one role and leave with a focused revision plan.
            </div>
          </div>
        </div>

        <div
          style={{
            alignSelf: "center",
            background: "white",
            border: "2px solid #c4d4e2",
            borderRadius: 28,
            display: "flex",
            flexDirection: "column",
            marginLeft: 58,
            padding: 34,
            width: 360,
          }}
        >
          <div style={{ color: "#5a6c7d", display: "flex", fontSize: 15, letterSpacing: 2 }}>SAMPLE REVIEW / 0048</div>
          <div style={{ color: "#2f76b5", display: "flex", fontSize: 112, fontWeight: 700, letterSpacing: -8, lineHeight: 1, marginTop: 34 }}>
            68
          </div>
          <div style={{ borderTop: "2px solid #c4d4e2", display: "flex", flexDirection: "column", marginTop: 30, paddingTop: 24 }}>
            <div style={{ display: "flex", fontSize: 19, justifyContent: "space-between", marginBottom: 18 }}>
              <span>Role essentials</span>
              <span style={{ color: "#2f76b5", fontWeight: 700 }}>7 / 9</span>
            </div>
            <div style={{ display: "flex", fontSize: 19, justifyContent: "space-between" }}>
              <span>Priority gaps</span>
              <span style={{ color: "#a44655", fontWeight: 700 }}>2</span>
            </div>
          </div>
        </div>
      </div>
    ),
    socialImageSize,
  );
}
