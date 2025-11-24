import "./globals.css";
import MobileWrapper from "./MobileWrapper";

export const metadata = {
  icons: {
    icon: "/favicon.ico?v=1",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="bg-black">
      <body className="flex justify-center bg-black font-inter">
        <div className="w-[360px] min-h-screen bg-black text-white shadow-xl overflow-hidden relative">
          <MobileWrapper>{children}</MobileWrapper>
        </div>
      </body>
    </html>
  );
}
