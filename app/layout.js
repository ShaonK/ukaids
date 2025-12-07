import "./globals.css";

export const metadata = {
  title: "Ukaids Referral App",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-gray-200 flex justify-center">

        {/* MOBILE FRAME */}
        <div className="relative w-full max-w-[360px] min-h-screen bg-white shadow-lg overflow-x-hidden">
          {children}
        </div>

      </body>
    </html>
  );
}
