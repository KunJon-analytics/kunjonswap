import { Navbar } from "@/components";
import { Poppins } from "next/font/google";
import { Providers } from "./providers";

import "@rainbow-me/rainbowkit/styles.css";
import "./globals.css";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  display: "swap",
});

export const metadata = {
  title: "Kunjon Swap",
  description: "Swap aggregator using 0x API",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={poppins.className}>
        <Providers>
          <div className="flex justify-center min-h-screen sm:px-16 px-6 bg-black">
            <div className="flex justify-between items-center flex-col max-w-[1280px] w-full">
              <Navbar />
              {children}
            </div>
          </div>
        </Providers>
      </body>
    </html>
  );
}
