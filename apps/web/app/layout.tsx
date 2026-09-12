import "./globals.css";

export const metadata = {
  title: "FlowMix - Make every playlist flow",
  description: "An intelligent music transition platform.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-paper-50 text-ink-950 font-sans">
        {children}
      </body>
    </html>
  );
}
