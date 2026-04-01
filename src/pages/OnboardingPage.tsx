import { useState } from "react";
import { ActivityIndicator, Platform, Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { PrimaryTextInput } from "../components/PrimaryTextInput";
import { signInWithOAuthProvider } from "../lib/oauth";
import { supabase } from "../lib/supabase";

type Mode = "login" | "signUp";

function authErrorMessage(message: string) {
  return message.replace(/^[^\s]+:\s*/, "");
}

export function OnboardingPage() {
  const [mode, setMode] = useState<Mode>("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [oauthLoading, setOauthLoading] = useState<"google" | "apple" | null>(null);

  const resetMessages = () => {
    setError(null);
    setInfo(null);
  };

  const onSubmit = async () => {
    resetMessages();
    const trimmedEmail = email.trim();
    const trimmedName = name.trim();

    if (!trimmedEmail || !password) {
      setError("Enter email and password.");
      return;
    }

    if (mode === "signUp" && !trimmedName) {
      setError("Enter your name.");
      return;
    }

    setLoading(true);
    try {
      if (mode === "login") {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email: trimmedEmail,
          password,
        });
        if (signInError) {
          setError(authErrorMessage(signInError.message));
          return;
        }
      } else {
        const { data, error: signUpError } = await supabase.auth.signUp({
          email: trimmedEmail,
          password,
          options: {
            data: { full_name: trimmedName },
          },
        });
        if (signUpError) {
          setError(authErrorMessage(signUpError.message));
          return;
        }
        if (data.session) {
          setInfo("Account created. You are signed in.");
        } else {
          setInfo("Check your email to confirm your account, then sign in.");
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const onGoogle = async () => {
    resetMessages();
    setOauthLoading("google");
    try {
      const result = await signInWithOAuthProvider("google");
      if (result.cancelled) return;
    } catch (e) {
      setError(e instanceof Error ? e.message : "Google sign-in failed.");
    } finally {
      setOauthLoading(null);
    }
  };

  const onApple = async () => {
    resetMessages();
    setOauthLoading("apple");
    try {
      const result = await signInWithOAuthProvider("apple");
      if (result.cancelled) return;
    } catch (e) {
      setError(e instanceof Error ? e.message : "Apple sign-in failed.");
    } finally {
      setOauthLoading(null);
    }
  };

  const oauthBusy = oauthLoading !== null;

  return (
    <SafeAreaView className="flex-1 bg-zinc-950">
      <ScrollView contentContainerClassName="px-5 pb-8 pt-2">
        <View className="items-center">
          <Text className="text-center text-[62px] font-black italic leading-[60px] tracking-tighter text-lime-300">
            SKATE{"\n"}SPOTS
          </Text>
        </View>

        <View className="mt-2 h-1 w-14 bg-lime-300" />
        <Text className="mt-3 text-center text-[11px] font-semibold tracking-[5px] text-zinc-500">
          ACCESS THE UNDERGROUND
        </Text>

        <View className="mt-8 border-l-2 border-lime-400 bg-zinc-900/90 p-5">
          <View className="border-b border-zinc-700 pb-2">
            <View className="flex-row gap-6">
              <Pressable onPress={() => { setMode("login"); resetMessages(); }}>
                <Text className={`text-[16px] font-black tracking-[1px] ${mode === "login" ? "text-lime-300" : "text-zinc-500"}`}>
                  LOGIN
                </Text>
                {mode === "login" ? <View className="mt-1 h-1 w-10 bg-lime-300" /> : <View className="mt-1 h-1 w-10 bg-transparent" />}
              </Pressable>
              <Pressable onPress={() => { setMode("signUp"); resetMessages(); }}>
                <Text className={`pt-[2px] text-[16px] font-black tracking-[1px] ${mode === "signUp" ? "text-lime-300" : "text-zinc-500"}`}>
                  SIGN UP
                </Text>
                {mode === "signUp" ? <View className="mt-1 h-1 w-10 bg-lime-300" /> : <View className="mt-1 h-1 w-10 bg-transparent" />}
              </Pressable>
            </View>
          </View>

          {mode === "signUp" ? (
            <>
              <Text className="mb-2 mt-7 text-[14px] font-black tracking-[1px] text-lime-300">DISPLAY NAME</Text>
              <PrimaryTextInput
                value={name}
                onChangeText={setName}
                placeholder="YOUR NAME"
                autoCapitalize="words"
                className="rounded-none border-zinc-600 px-4 py-3 text-[20px] text-zinc-300"
              />
            </>
          ) : null}

          <Text className="mb-2 mt-7 text-[14px] font-black tracking-[1px] text-lime-300">USER TERMINAL ID / EMAIL</Text>
          <PrimaryTextInput
            value={email}
            onChangeText={setEmail}
            placeholder="ENTER EMAIL"
            autoCapitalize="none"
            keyboardType="email-address"
            autoComplete="email"
            className="rounded-none border-zinc-600 px-4 py-3 text-[20px] text-zinc-300"
          />

          <View className="mt-6 flex-row items-center justify-between">
            <Text className="text-[14px] font-black leading-[17px] tracking-[1px] text-lime-300">
              SECURITY KEY /{"\n"}PASSWORD
            </Text>
            {mode === "login" ? (
              <Text className="text-[14px] font-black tracking-[1px] text-orange-500">FORGOT{"\n"}ACCESS?</Text>
            ) : (
              <View />
            )}
          </View>

          <PrimaryTextInput
            value={password}
            onChangeText={setPassword}
            placeholder="••••••••"
            secureTextEntry
            className="mt-3 rounded-none border-zinc-600 px-4 py-3 text-[20px] text-zinc-300"
          />

          {error ? <Text className="mt-4 text-sm text-orange-500">{error}</Text> : null}
          {info ? <Text className="mt-4 text-sm text-lime-300">{info}</Text> : null}

          <Pressable
            disabled={loading || oauthBusy}
            onPress={onSubmit}
            className="mt-6 flex-row items-center justify-center gap-3 bg-lime-300 py-4 opacity-100 disabled:opacity-50"
          >
            {loading ? (
              <ActivityIndicator color="#14532d" />
            ) : (
              <>
                <Text className="text-[16px] font-black tracking-[6px] text-green-950">
                  {mode === "login" ? "AUTHENTICATE" : "CREATE ACCOUNT"}
                </Text>
                <Text className="text-[20px] font-black text-green-950">→</Text>
              </>
            )}
          </Pressable>

          <View className="mt-8 flex-row items-center gap-3">
            <View className="h-px flex-1 bg-zinc-700" />
            <Text className="text-[10px] font-semibold tracking-[4px] text-zinc-500">EXTERNAL UPLINK</Text>
            <View className="h-px flex-1 bg-zinc-700" />
          </View>

          <View className="mt-6 flex-row gap-4">
            <Pressable
              disabled={loading || oauthBusy}
              onPress={onGoogle}
              className="flex-1 flex-row items-center justify-center gap-2 bg-zinc-800 py-4 opacity-100 disabled:opacity-50"
            >
              {oauthLoading === "google" ? (
                <ActivityIndicator color="#fafafa" />
              ) : (
                <>
                  <View className="h-4 w-4 items-center justify-center bg-white">
                    <Text className="text-[10px] font-black text-zinc-900">G</Text>
                  </View>
                  <Text className="text-[14px] font-black tracking-[1px] text-white">GOOGLE</Text>
                </>
              )}
            </Pressable>
            {/* {Platform.OS === "ios" ? (
              <Pressable
                disabled={loading || oauthBusy}
                onPress={onApple}
                className="flex-1 flex-row items-center justify-center gap-2 bg-zinc-800 py-4 opacity-100 disabled:opacity-50"
              >
                {oauthLoading === "apple" ? (
                  <ActivityIndicator color="#fafafa" />
                ) : (
                  <>
                    <Text className="text-[14px] font-black tracking-[1px] text-white">iOS</Text>
                    <Text className="text-[14px] font-black tracking-[1px] text-white">APPLE</Text>
                  </>
                )}
              </Pressable>
            ) : (
              <View className="flex-1 items-center justify-center border border-zinc-700 py-4">
                <Text className="text-center text-[10px] font-semibold tracking-[1px] text-zinc-600">APPLE ON iOS</Text>
              </View>
            )} */}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
