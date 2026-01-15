import { CheckCircle, XCircle } from "lucide-react";

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
        {users.map((u) => {
          const deposit = Number(u.totalDeposit || 0);

          return (
            <div
              key={u.id}
              className="flex justify-between items-center p-3 rounded bg-[#1a1a1a]"
            >
              {/* Left */}
              <div>
                <p className="font-semibold text-white">
                  {u.username}
                </p>
                <p className="text-xs text-blue-400">
                  Deposit: {deposit.toFixed(2)}
                </p>
              </div>

              {/* Right (Readonly task status) */}
              <div className="opacity-80">
                {u.isActive ? (
                  <CheckCircle
                    className="text-green-500"
                    size={20}
                  />
                ) : (
                  <XCircle
                    className="text-gray-500"
                    size={20}
                  />
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
