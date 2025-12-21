export default function InactiveTeamList({ users }) {
  if (!users.length) return null;

  return (
    <div className="mt-6 px-4">
      <h3 className="text-red-400 font-semibold mb-2">
        Inactive Team Members
      </h3>

      {users.map((u) => (
        <p key={u.id} className="text-sm text-red-300">
          {u.username}
        </p>
      ))}
    </div>
  );
}
