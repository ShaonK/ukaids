"use client";

import { useEffect, useState } from "react";

export default function UserHeader() {
    const [user, setUser] = useState(null);

    useEffect(() => {
        async function fetchUser() {
            const res = await fetch("/user/api/me");
            const data = await res.json();
            setUser(data.user);
        }
        fetchUser();
    }, []);

    return (
        <header className="w-full bg-blue-600 text-white p-4 shadow-md">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-lg font-bold">{user?.username || "Loading..."}</h2>
                    <p className="text-xs opacity-80">
                        Rank: {user?.rank || "New User"}
                    </p>
                </div>

                <div className="bg-white text-blue-600 text-xs px-3 py-1 rounded-full shadow">
                    Profile
                </div>
            </div>
        </header>
    );
}
