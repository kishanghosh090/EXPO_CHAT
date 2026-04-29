declare global {
  namespace Express {
    interface Request {
      user: Awaited<ReturnType<typeof auth.api.getSession>>["user"];
      session: Awaited<ReturnType<typeof auth.api.getSession>>;
    }
  }
}
