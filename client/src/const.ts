export { COOKIE_NAME, ONE_YEAR_MS } from "@shared/const";

export const APP_TITLE = import.meta.env.VITE_APP_TITLE || "App";
export const APP_WORDMARK =
  import.meta.env.VITE_APP_WORDMARK || APP_TITLE?.split(" ")[0] || "Discover";

export const APP_LOGO = "/logo.png";

let loggedMissingOauthConfig = false;

// Generate login URL at runtime so redirect URI reflects the current origin.
export const getLoginUrl = () => {
  const oauthPortalUrl = import.meta.env.VITE_OAUTH_PORTAL_URL;
  const appId = import.meta.env.VITE_APP_ID;
  const redirectUri = `${window.location.origin}/api/oauth/callback`;
  const state = btoa(redirectUri);

  if (!oauthPortalUrl || !appId) {
    if (!loggedMissingOauthConfig) {
      console.warn(
        "Missing VITE_OAUTH_PORTAL_URL or VITE_APP_ID. Falling back to local login stub."
      );
      loggedMissingOauthConfig = true;
    }
    const fallbackUrl = new URL(`${window.location.origin}/login`);
    fallbackUrl.searchParams.set("state", state);
    return fallbackUrl.toString();
  }

  const url = new URL(`${oauthPortalUrl}/app-auth`);
  url.searchParams.set("appId", appId);
  url.searchParams.set("redirectUri", redirectUri);
  url.searchParams.set("state", state);
  url.searchParams.set("type", "signIn");

  return url.toString();
};
