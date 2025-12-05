import { getUser } from "@/lib/getUser";

export default async function ProfileTestPage() {
    const user = await getUser();

    return (
        <div className="p-4">
            <h1 className="text-xl font-bold">User Info</h1>
            <pre className="bg-gray-200 p-3 rounded mt-4 text-sm">
                {JSON.stringify(user, null, 2)}
            </pre>
        </div>
    );
}
