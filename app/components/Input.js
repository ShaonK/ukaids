export default function Input({ placeholder, type = "text", value, onChange }) {
    return (
        <input
            placeholder={placeholder}
            type={type}
            value={value}
            onChange={onChange}
            className="border p-3 rounded-lg w-full outline-none focus:ring-2 focus:ring-blue-500 transition"
        />
    );
}
