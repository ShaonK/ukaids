export const dynamic = "force-dynamic";

import { getUser } from "@/lib/getUser";
import ProfileHeader from "./components/ProfileHeader";
import ProfileAvatar from "./components/ProfileAvatar";
import ProfileForm from "./components/ProfileForm";
import ChangePassword from "./components/ChangePassword";

export default async function ProfilePage() {
  const user = await getUser();
  if (!user) return null;

  // ✅ sanitize user for Client Components
  const safeUser = {
    email: user.email,
    name: user.name ?? "",
    phone: user.phone ?? "",
    country: user.country ?? "",
    username: user.username,
    avatar: user.avatar ?? null,
  };

  return (
    <div className="w-[360px] mx-auto min-h-screen bg-[#121212] text-white px-4 pb-10">
      <ProfileHeader />

      <ProfileAvatar
        avatar={safeUser.avatar}
        username={safeUser.username}
      />

      <ProfileForm user={safeUser} />

      <ChangePassword />
    </div>
  );
}
