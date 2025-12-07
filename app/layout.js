import "./globals.css";

export const metadata = {
  title: "Ukaids Referral App",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-gray-200 flex justify-center">
        <div className="w-full max-w-[430px] bg-black min-h-screen">
          {children}
        </div>
      </body>
    </html>
  );
}
