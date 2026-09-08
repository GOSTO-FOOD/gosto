import { createHmac, timingSafeEqual } from "node:crypto";
import { Router, type IRouter, type NextFunction, type Request, type Response } from "express";

const router: IRouter = Router();
const SESSION_COOKIE = "gosto_dashboard_session";
const SESSION_MAX_AGE_SECONDS = 60 * 60 * 8;
const usesCrossOriginFrontend = Boolean(process.env.GOSTO_FRONTEND_ORIGIN?.trim());

function getSessionSecret() {
  const secret = process.env.SESSION_SECRET;
  if (!secret) throw new Error("SESSION_SECRET is not configured");
  return secret;
}

function digest(value: string) {
  return createHmac("sha256", getSessionSecret()).update(value).digest();
}

function safeEqual(left: string, right: string) {
  const leftDigest = digest(left);
  const rightDigest = digest(right);
  return timingSafeEqual(leftDigest, rightDigest);
}

function createSessionToken() {
  const expiresAt = Math.floor(Date.now() / 1000) + SESSION_MAX_AGE_SECONDS;
  const payload = String(expiresAt);
  const signature = createHmac("sha256", getSessionSecret())
    .update(payload)
    .digest("base64url");
  return `${payload}.${signature}`;
}

function readCookie(request: Request, name: string) {
  const cookieHeader = request.headers.cookie ?? "";
  const cookie = cookieHeader
    .split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${name}=`));
  return cookie?.slice(name.length + 1);
}

function hasDashboardSession(request: Request) {
  const token = readCookie(request, SESSION_COOKIE);
  if (!token) return false;

  const [expiresAt, signature] = token.split(".");
  if (!expiresAt || !signature || Number(expiresAt) <= Math.floor(Date.now() / 1000)) {
    return false;
  }

  const expectedSignature = createHmac("sha256", getSessionSecret())
    .update(expiresAt)
    .digest("base64url");
  return safeEqual(signature, expectedSignature);
}

export function requireDashboardSession(
  request: Request,
  response: Response,
  next: NextFunction,
) {
  try {
    if (hasDashboardSession(request)) {
      next();
      return;
    }
  } catch (error) {
    request.log.error({ err: error }, "Dashboard session verification failed");
    response.status(503).json({ error: "حماية الداشبورد غير مهيأة" });
    return;
  }

  response.status(401).json({ error: "يجب تسجيل الدخول إلى الداشبورد" });
}

router.get("/dashboard/session", (request, response) => {
  response.setHeader("Cache-Control", "no-store");
  try {
    response.json({ authenticated: hasDashboardSession(request) });
  } catch (error) {
    request.log.error({ err: error }, "Dashboard session check failed");
    response.status(503).json({ error: "حماية الداشبورد غير مهيأة" });
  }
});

router.post("/dashboard/login", (request, response) => {
  response.setHeader("Cache-Control", "no-store");
  const configuredPassword = process.env.DASHBOARD_PASSWORD;
  if (!configuredPassword) {
    response.status(503).json({ error: "كلمة سر الداشبورد غير مهيأة" });
    return;
  }

  const password = typeof request.body?.password === "string" ? request.body.password : "";
  if (!safeEqual(password, configuredPassword)) {
    response.status(401).json({ error: "كلمة السر غير صحيحة" });
    return;
  }

  response.setHeader(
    "Set-Cookie",
    `${SESSION_COOKIE}=${createSessionToken()}; Path=/; HttpOnly; SameSite=${
      usesCrossOriginFrontend ? "None" : "Lax"
    }; Max-Age=${SESSION_MAX_AGE_SECONDS}${
      process.env.NODE_ENV === "production" || usesCrossOriginFrontend ? "; Secure" : ""
    }`,
  );
  response.json({ authenticated: true });
});

router.post("/dashboard/logout", (_request, response) => {
  response.setHeader("Cache-Control", "no-store");
  response.setHeader(
    "Set-Cookie",
    `${SESSION_COOKIE}=; Path=/; HttpOnly; SameSite=${
      usesCrossOriginFrontend ? "None" : "Lax"
    }; Max-Age=0; Expires=Thu, 01 Jan 1970 00:00:00 GMT${
      process.env.NODE_ENV === "production" || usesCrossOriginFrontend ? "; Secure" : ""
    }`,
  );
  response.json({ authenticated: false });
});

export default router;