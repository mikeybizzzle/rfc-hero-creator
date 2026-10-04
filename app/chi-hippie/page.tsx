export default function ChiHippiePage() {
  return (
    <main style={{ display: "flex", minHeight: "100dvh", alignItems: "center", justifyContent: "center", padding: 16, boxSizing: "border-box" }}>
      <video
        src="/videos/chi-hippie.mp4"
        controls
        playsInline
        style={{ display: "block", maxWidth: "100%", maxHeight: "calc(100dvh - 32px)", border: "4px solid #ffe37e", boxSizing: "border-box" }}
      />
    </main>
  );
}
