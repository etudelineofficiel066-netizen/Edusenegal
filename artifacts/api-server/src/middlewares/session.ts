import type { RequestHandler } from "express";

declare module "express" {
  interface Request {
    session: {
      userId?: number;
      role?: string;
    };
  }
}

const sessions: Map<string, { userId: number; role: string; expires: Date }> = new Map();

function generateId(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

export function sessionMiddleware(): RequestHandler {
  return (req: any, res: any, next: any) => {
    const sessionId = req.cookies?.sessionId;
    req.session = {};

    if (sessionId && sessions.has(sessionId)) {
      const sess = sessions.get(sessionId)!;
      if (sess.expires > new Date()) {
        req.session = { userId: sess.userId, role: sess.role };
      } else {
        sessions.delete(sessionId);
      }
    }

    req.session.save = (userId: number, role: string) => {
      const id = generateId();
      const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
      sessions.set(id, { userId, role, expires });
      res.cookie("sessionId", id, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });
    };

    req.session.destroy = () => {
      const sid = req.cookies?.sessionId;
      if (sid) sessions.delete(sid);
      res.clearCookie("sessionId");
      req.session = {};
    };

    next();
  };
}
