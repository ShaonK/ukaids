export default function Card({ children }) {
    return (
        <div className="bg-white shadow p-4 rounded-xl mb-3 border">
            {children}
        </div>
    );
}
