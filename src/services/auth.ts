import * as AppleAuthentication from "expo-apple-authentication";
import * as Crypto from "expo-crypto";
import * as WebBrowser from "expo-web-browser";
import { supabase } from "@/lib/supabase";

WebBrowser.maybeCompleteAuthSession();

// URL scheme used by app.config.js — keep these in sync.
const APP_SCHEME = "boilerplate";
const REDIRECT_URL = `${APP_SCHEME}://auth/callback`;

async function generateAppleNonce(): Promise<{
  rawNonce: string;
  hashedNonce: string;
}> {
  const randomBytes = await Crypto.getRandomBytesAsync(32);
  const rawNonce = Array.from(randomBytes)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  const hashedNonce = await Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA256,
    rawNonce
  );
  return { rawNonce, hashedNonce };
}

export async function signInWithApple() {
  try {
    const { rawNonce, hashedNonce } = await generateAppleNonce();

    const credential = await AppleAuthentication.signInAsync({
      requestedScopes: [
        AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
        AppleAuthentication.AppleAuthenticationScope.EMAIL,
      ],
      nonce: hashedNonce,
    });

    if (credential.identityToken) {
      const { data, error } = await supabase.auth.signInWithIdToken({
        provider: "apple",
        token: credential.identityToken,
        nonce: rawNonce,
      });
      if (error) throw error;
      return { data, error: null };
    }
    return { data: null, error: new Error("No identity token received") };
  } catch (error: any) {
    if (error.code === "ERR_REQUEST_CANCELED") {
      return { data: null, error: null };
    }
    return { data: null, error };
  }
}

export async function signInWithGoogle() {
  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: REDIRECT_URL,
        skipBrowserRedirect: true,
      },
    });
    if (error) throw error;

    if (data.url) {
      const result = await WebBrowser.openAuthSessionAsync(
        data.url,
        REDIRECT_URL
      );

      if (result.type === "success") {
        const params = new URLSearchParams(result.url.split("#")[1]);
        const accessToken = params.get("access_token");
        const refreshToken = params.get("refresh_token");

        if (accessToken && refreshToken) {
          const { data: sessionData, error: sessionError } =
            await supabase.auth.setSession({
              access_token: accessToken,
              refresh_token: refreshToken,
            });
          if (sessionError) throw sessionError;
          return { data: sessionData, error: null };
        }
      }
    }
    return { data: null, error: new Error("Authentication failed") };
  } catch (error: any) {
    return { data: null, error };
  }
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  return { error };
}
