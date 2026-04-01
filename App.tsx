import "./global.css";

import { StatusBar } from "expo-status-bar";
import { useMemo, useState } from "react";
import { View } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

import { BottomNav } from "./src/components/BottomNav";
import { AddSpotPage } from "./src/pages/AddSpotPage";
import { FeedPage } from "./src/pages/FeedPage";
import { OnboardingPage } from "./src/pages/OnboardingPage";
import { ProfilePage } from "./src/pages/ProfilePage";
import { SpotDetailsPage } from "./src/pages/SpotDetailsPage";
import type { TabKey } from "./src/types/navigation";

export default function App() {
  const [tab, setTab] = useState<TabKey>("auth");

  const content = useMemo(() => {
    if (tab === "auth") return <OnboardingPage />;
    if (tab === "map") return <SpotDetailsPage />;
    if (tab === "upload") return <AddSpotPage />;
    if (tab === "skater") return <ProfilePage />;
    return <FeedPage />;
  }, [tab]);

  return (
    <SafeAreaProvider>
      <StatusBar style="light" />
        {content}
        {tab !== "auth" ? <BottomNav activeTab={tab} onChange={setTab} /> : null}
    </SafeAreaProvider>
  );
}
