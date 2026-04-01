import * as WebBrowser from "expo-web-browser";

import { getOAuthRedirectUrl } from "../constants/oauthRedirect";
import { supabase } from "./supabase";

WebBrowser.maybeCompleteAuthSession();

export { getOAuthRedirectUrl };

export async function signInWithOAuthProvider(provider: "google" | "apple") {
  const redirectTo = getOAuthRedirectUrl();

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo,
      skipBrowserRedirect: true,
    },
  });

  if (error) throw error;
  if (!data.url) throw new Error("No OAuth URL returned");

  const result = await WebBrowser.openAuthSessionAsync(data.url, redirectTo);

  if (result.type !== "success" || !result.url) {
    return { cancelled: true as const };
  }

  const callbackUrl = result.url;
  const parsed = new URL(callbackUrl);
  const code = parsed.searchParams.get("code");

  if (code) {
    const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
    if (exchangeError) throw exchangeError;
    return { cancelled: false as const };
  }

  const hash = parsed.hash.substring(1);
  const params = new URLSearchParams(hash);
  const access_token = params.get("access_token");
  const refresh_token = params.get("refresh_token");

  if (access_token && refresh_token) {
    const { error: sessionError } = await supabase.auth.setSession({ access_token, refresh_token });
    if (sessionError) throw sessionError;
    return { cancelled: false as const };
  }

  throw new Error("Could not complete OAuth: missing code or tokens in redirect URL");
}
