import { Slot, usePathname, useRouter } from "expo-router";
import { View } from "react-native";

import { BottomNav } from "@/components/BottomNav";
import type { TabKey } from "@/types/navigation";

function tabFromPathname(pathname: string): TabKey {
  if (pathname.includes("add-spot")) return "upload";
  if (pathname.includes("profile")) return "skater";
  return "explore";
}

export default function MainLayout() {
  const pathname = usePathname();
  const router = useRouter();
  const activeTab = tabFromPathname(pathname);

  const onChange = (key: TabKey) => {
    if (key === "explore") router.replace("/feed");
    else if (key === "upload") router.replace("/add-spot");
    else if (key === "skater") router.replace("/profile");
  };

  return (
    <View className="flex-1">
      <Slot />
      <BottomNav activeTab={activeTab} onChange={onChange} />
    </View>
  );
}
