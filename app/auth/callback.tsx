import { Redirect } from "expo-router";

/** OAuth redirect target; session is completed in `signInWithOAuthProvider` via the browser result. */
export default function AuthCallbackRoute() {
  return <Redirect href="/" />;
}
