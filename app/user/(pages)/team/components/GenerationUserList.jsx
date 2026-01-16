import { CheckCircle, XCircle } from "lucide-react";

export default function GenerationUserList({ users, generation }) {
  return (
    <div className="mt-4 px-4">
      <h3 className="font-semibold mb-2">
        Generation {generation} Members
      </h3>

      {users.length === 0 && (
        <p className="text-gray-400 text-sm">
          No members found
        </p>
      )}

      <div className="space-y-2">
        {users.map((u) => {
          const deposit = Number(u.totalDeposit || 0);

          return (
            <div
              key={u.id}
              className={`flex justify-between items-center p-3 rounded
                ${
                  u.isActive
                    ? "bg-[#1a1a1a]"
                    : "bg-[#2a1212] border border-red-500"
                }`}
            >
              {/* Left */}
              <div>
                <p
                  className={`font-semibold ${
                    u.isActive
                      ? "text-white"
                      : "text-red-400"
                  }`}
                >
                  {u.username}
                </p>

                <p className="text-xs text-blue-400">
                  Deposit: {deposit.toFixed(2)}
                </p>
              </div>

              {/* Right: TASK STATUS */}
              <div className="opacity-90">
                {u.taskCompletedToday ? (
                  <CheckCircle
                    className="text-green-500"
                    size={20}
                  />
                ) : (
                  <XCircle
                    className="text-red-500"
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
