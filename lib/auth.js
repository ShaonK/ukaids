import { jwtVerify } from "jose";

const SECRET = new TextEncoder().encode(process.env.JWT_SECRET);

export async function verifyUserFromToken(token) {
  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, SECRET);
    return payload; // payload.id, payload.isBlocked
  } catch {
    return null;
  }
}
