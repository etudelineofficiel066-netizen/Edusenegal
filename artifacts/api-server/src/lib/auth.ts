import bcrypt from "bcryptjs";

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export function isAuthenticated(req: any, res: any, next: any) {
  if (!req.session?.userId) {
    return res.status(401).json({ error: "Non authentifié" });
  }
  next();
}

export function isAdmin(req: any, res: any, next: any) {
  if (!req.session?.userId) {
    return res.status(401).json({ error: "Non authentifié" });
  }
  if (req.session.role !== "admin") {
    return res.status(403).json({ error: "Accès refusé. Rôle admin requis." });
  }
  next();
}
