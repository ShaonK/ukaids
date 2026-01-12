export default function GenerationUserList({ users, generation }) {
  return (
    <div className="mt-4 px-4">
      <h3 className="font-semibold mb-2">
        Generation {generation} Members
      </h3>

      {users.length === 0 && (
        <p className="text-gray-400 text-sm">No members found</p>
      )}

      <div className="space-y-2">
        {users.map((u) => (
          <div
            key={u.id}
            className={`p-3 rounded ${
              u.isActive ? "bg-[#1a1a1a]" : "bg-red-900/20"
            }`}
          >
            {/* ✅ ONLY USERNAME */}
            <p className="font-semibold text-white">
              {u.username}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
