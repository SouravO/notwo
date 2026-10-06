import "./globals.css";
import { DM_Sans } from "next/font/google";
import favicon from "./assets/favicon.png";

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  display: "swap",
});

export const metadata = {
  title: "NO TWO | Skincare Made for Your Skin",
  description:
    "Discover skincare that adapts to you. NO TWO pairs intelligent skin analysis with thoughtfully formulated products to build a routine for your skin today.",
  icons: { icon: favicon.src },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${dmSans.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col">
        {children}
      </body>
    </html>
  );
}
