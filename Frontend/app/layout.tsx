import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "API Monitor",
  description: "Sistem Monitoring REST API",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Mono:wght@400;500&display=swap"
        />
      </head>
      <body style={{ margin: 0, padding: 0, background: "#020617" }}>
        {children}
      </body>
    </html>
  );
}
