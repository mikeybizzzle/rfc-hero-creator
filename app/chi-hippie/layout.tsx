export default function ChiHippieLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body style={{ margin: 0, background: "#0b0a09" }}>{children}</body>
    </html>
  );
}
