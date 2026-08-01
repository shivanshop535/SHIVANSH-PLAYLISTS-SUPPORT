import { Unbounded, Manrope } from "next/font/google";
import "./globals.css";

const display = Unbounded({
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  variable: "--font-display",
  display: "swap",
});

const body = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-body",
  display: "swap",
});

export const metadata = {
  title: "Shivansh Playlists — Unlock the Support Vault",
  description:
    "Support Shivansh Playlists by unlocking today's link. Hit the daily goal of 50 supporters, climb the leaderboard, and keep your streak alive.",
  openGraph: {
    title: "Shivansh Playlists — Unlock the Support Vault",
    description:
      "Support Shivansh Playlists by unlocking today's link. Hit the daily goal of 50 supporters, climb the leaderboard, and keep your streak alive.",
    type: "website",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable}`}>
      <body className="bg-void bg-vault-gradient min-h-screen antialiased">
        {children}
      </body>
    </html>
  );
}
