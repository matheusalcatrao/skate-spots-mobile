import { Redirect } from "expo-router";
import { ActivityIndicator, View } from "react-native";

import { useAuth } from "@/contexts/AuthContext";
import { OnboardingPage } from "@/pages/OnboardingPage";

export default function IndexRoute() {
  const { session, loading } = useAuth();

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-zinc-950">
        <ActivityIndicator color="#bef264" />
      </View>
    );
  }

  if (session) {
    return <Redirect href="/feed" />;
  }

  return <OnboardingPage />;
}
