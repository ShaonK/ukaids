export default function GlassCard({ children }) {
  return (
    <section
      className="
        glass-card
        bg-white/5 backdrop-blur
        border border-white/10
        rounded-2xl
        shadow-lg shadow-black/40
        p-5
        space-y-3
      "
    >
      {children}
    </section>
  );
}
