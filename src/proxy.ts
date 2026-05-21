import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

const handleI18nRouting = createMiddleware(routing);

const isPublicRoute = createRouteMatcher([
  "/:locale",
  "/:locale/sign-in(.*)",
  "/:locale/sign-up(.*)",
]);

export default clerkMiddleware(async (auth, request) => {
  const i18nResponse = handleI18nRouting(request);

  // If next-intl is redirecting (e.g. to add locale prefix), honour it
  if (
    i18nResponse.status === 307 ||
    i18nResponse.status === 308 ||
    i18nResponse.headers.get("location")
  ) {
    return i18nResponse;
  }

  if (!isPublicRoute(request)) {
    await auth.protect();
  }

  return i18nResponse;
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
