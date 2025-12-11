import "./globals.css";
import { Toaster } from "react-hot-toast";


export const metadata = {
  title: "Ukaids Referral App",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-gray-200 flex justify-center">
        <div className="relative w-full max-w-[360px] min-h-screen bg-[#121212] shadow-lg overflow-x-hidden">
          {children}
          <Toaster position="top-center" />
        </div>
      </body>
    </html>
  );
}
