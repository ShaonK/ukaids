import Card from "@/app/components/Card";

export default function UsersList() {
    const users = [
        { name: "UserA", mobile: "0123456789", status: "active" },
        { name: "UserB", mobile: "0198765432", status: "blocked" },
    ];

    return (
        <div className="space-y-3">
            <h2 className="text-xl font-bold">Users</h2>

            {users.map((u, i) => (
                <Card key={i}>
                    <h3 className="font-bold">{u.name}</h3>
                    <p className="text-sm text-gray-600">{u.mobile}</p>
                    <p
                        className={`text-xs mt-1 ${u.status === "active" ? "text-green-600" : "text-red-600"
                            }`}
                    >
                        {u.status}
                    </p>
                </Card>
            ))}
        </div>
    );
}
