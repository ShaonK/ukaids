"use client";

export default function NoticeModal({ notice, onClose }) {
  if (!notice) return null;

  return (
    <div className="fixed inset-0 z-[999] bg-black/70 flex items-end justify-center">
      <div className="w-full max-w-[360px] bg-[#1a1a1a] rounded-t-2xl p-5 text-white animate-slideUp">
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold text-orange-400">
            {notice.title}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 text-xl"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <p className="text-sm text-gray-300 leading-relaxed whitespace-pre-line">
          {notice.message}
        </p>

        {/* Footer */}
        <button
          onClick={onClose}
          className="mt-5 w-full bg-orange-500 hover:bg-orange-600 text-black font-semibold py-2 rounded-lg"
        >
          OK, Got it
        </button>
      </div>

      {/* Animation */}
      <style jsx>{`
        .animate-slideUp {
          animation: slideUp 0.3s ease-out;
        }
        @keyframes slideUp {
          from {
            transform: translateY(100%);
          }
          to {
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
