"use client";

export default function TeamPage() {
  return (
    <div className="w-full min-h-screen flex justify-center items-center bg-[#121212]">
      <div className="overflow-hidden w-full px-4">
        <p className="text-xl font-semibold text-white whitespace-nowrap animate-marquee">
          🚧 This Mine page is under construction 🚧
        </p>
      </div>

      <style jsx>{`
        .animate-marquee {
          display: inline-block;
          animation: marquee 8s linear infinite;
        }

        @keyframes marquee {
          0% {
            transform: translateX(100%);
          }
          100% {
            transform: translateX(-100%);
          }
        }
      `}</style>
    </div>
  );
}
