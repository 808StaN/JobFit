"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function GlobalError({ error, retry }: Readonly<{ error: Error & { digest?: string }; retry: () => void }>) {
  useEffect(() => {
    console.error("[app] Root render failed", { digest: error.digest });
  }, [error]);

  return (
    <html lang="en">
      <body style={{ alignItems: "center", background: "#f3f7fc", color: "#172635", display: "flex", fontFamily: "system-ui, sans-serif", justifyContent: "center", margin: 0, minHeight: "100vh", padding: "24px" }}>
        <main style={{ background: "#ffffff", border: "1px solid #c4d4e2", borderRadius: "20px", boxShadow: "0 1.5rem 4rem -2.5rem rgba(43, 91, 132, 0.25)", maxWidth: "560px", padding: "40px" }}>
          <p style={{ color: "#2f76b5", fontSize: "14px", fontWeight: 700, margin: 0 }}>JobFit</p>
          <h1 style={{ fontSize: "32px", letterSpacing: "-0.04em", lineHeight: 1.05, margin: "12px 0 0" }}>We could not load JobFit.</h1>
          <p style={{ color: "#5a6c7d", lineHeight: 1.6, margin: "16px 0 0" }}>Try again, or return to the homepage and start a new review.</p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "12px", marginTop: "28px" }}>
            <button type="button" onClick={retry} style={{ background: "#2f76b5", border: 0, borderRadius: "10px", color: "#ffffff", cursor: "pointer", font: "inherit", fontWeight: 700, padding: "12px 16px" }}>
              Try again
            </button>
            <Link href="/" style={{ border: "1px solid #c4d4e2", borderRadius: "10px", color: "#172635", fontWeight: 700, padding: "12px 16px", textDecoration: "none" }}>
              Return home
            </Link>
          </div>
        </main>
      </body>
    </html>
  );
}
