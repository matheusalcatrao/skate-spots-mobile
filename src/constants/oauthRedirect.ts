import Constants from "expo-constants";

/** Must stay in sync with `expo.scheme` in app.json when not using an env override. */
const DEFAULT_SCHEME = "stitch-mobile";

const CALLBACK_PATH = "auth/callback";

function schemeFromExpoConfig(): string {
  const s = Constants.expoConfig?.scheme;
  if (typeof s === "string" && s.length > 0) return s;
  if (Array.isArray(s) && s[0]) return s[0];
  return DEFAULT_SCHEME;
}

/**
 * OAuth redirect URL sent to Supabase (`redirectTo`) and used as the second argument to
 * `WebBrowser.openAuthSessionAsync`. Must be listed verbatim under Supabase → Authentication → URL Configuration → Redirect URLs.
 *
 * - Default: `{scheme}://auth/callback` (stable for dev/production builds using your app scheme).
 * - Override: set `EXPO_PUBLIC_OAUTH_REDIRECT_URL` to the exact string you add in Supabase (e.g. Expo Go).
 */
export function getOAuthRedirectUrl(): string {
  const override = process.env.EXPO_PUBLIC_OAUTH_REDIRECT_URL?.trim();
  if (override) return override;

  const scheme = schemeFromExpoConfig();
  return `${scheme}://${CALLBACK_PATH}`;
}
