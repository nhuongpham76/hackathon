import "./globals.css";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "AhaLead",
  description: "HireMind AI - Qualified Leads Without Human Intervention",
  openGraph: {
    title: "AhaLead",
    description: "HireMind AI - Qualified Leads Without Human Intervention",
    siteName: "AhaLead",
    images: [
      {
        url: "/logo-text-AhaLead.png",
        width: 800,
        height: 600,
      },
    ],
    locale: "en_US",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
    <body className={`${inter.className} antialiased overflow-hidden min-h-screen`}>
    {children}
    </body>
    </html>
  );
}