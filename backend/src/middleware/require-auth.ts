import type { NextFunction, Request, Response } from "express";
import { auth } from "../lib/auth";
import { ApiError } from "../utils/ApiError";

export async function requireAuth(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const session = await auth.api.getSession({
      headers: req.headers as unknown as Headers,
    });
    if (!session?.user.id) {
      return res.status(401).json(new ApiError(401, "Unauthorized"));
    }

    const typedReq = req as Request & {
      user: typeof session.user;
      session: typeof session;
    };
    typedReq.user = session.user;
    typedReq.session = session;
    return next();
  } catch (error) {
    return res.status(401).json(new ApiError(401, "Unauthorized"));
  }
}
