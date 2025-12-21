export default function GenerationTabs({ active, onChange }) {
    return (
        <div className="flex gap-2 mt-4">
            {[1, 2, 3, 4, 5].map(g => (
                <button
                    key={g}
                    onClick={() => onChange(g)}
                    className={`px-3 py-1 rounded ${active === g ? "bg-orange-500" : "bg-gray-700"
                        }`}
                >
                    Gen {g}
                </button>
            ))}
        </div>
    );
}
