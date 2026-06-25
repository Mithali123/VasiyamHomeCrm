import "./globals.css";

export const metadata = {
  title: "Vasiyam CRM",
  description: "Real Estate CRM Dashboard",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}