const jwt = require("jsonwebtoken");
const appConfig = require("../config/appConfig");

/**
 * Optional auth middleware — attaches req.user if a valid token is provided,
 * but does NOT reject the request if the token is absent or invalid.
 * Use for public endpoints that show personalised data when authenticated.
 */
module.exports = function optionalAuth(req: any, res: any, next: any) {
  try {
    const cookieToken =
      (req.cookies && (req.cookies.access_token || req.cookies.token || req.cookies.jwt)) || null;
    const header = req.headers.authorization || "";
    const bearerToken = header.startsWith("Bearer ") ? header.slice(7) : null;
    const token = cookieToken || bearerToken;

    if (!token) return next();

    try {
      const payload = jwt.verify(token, appConfig.jwt.secret);
      const id = (payload && (payload.id || payload.userId)) ||
        (payload && payload.sub ? Number(payload.sub) : null);
      if (id) req.user = { ...(payload || {}), id: Number(id) };
    } catch {
      // Invalid or expired token — treat as unauthenticated
    }

    next();
  } catch (e) {
    next();
  }
};

export {};
