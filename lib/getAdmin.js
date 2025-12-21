import { getUser } from "@/lib/getUser";

export async function getAdmin() {
  const user = await getUser();

  if (!user) return null;

  // ❌ role check বাদ
  return user;
}
