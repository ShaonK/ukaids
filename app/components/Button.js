export default function Button({ label, onClick, className }) {
    return (
        <button
            onClick={onClick}
            className={`w-full bg-blue-600 text-white p-3 rounded-lg active:scale-95 transition font-medium ${className}`}
        >
            {label}
        </button>
    );
}
