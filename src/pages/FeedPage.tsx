import { Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";

const cards = ["MUNI LEDGES", "THE UNDERCROFT", "VERTICAL VOID"];

export function FeedPage() {
  const router = useRouter();
  
  return (
    <SafeAreaView className="flex-1 bg-zinc-950">
      <ScrollView contentContainerClassName="gap-3 px-4 pb-28">
        <Text className="my-1 text-3xl font-black tracking-tight text-white">DISCOVERY FEED</Text>
        {cards.map((name, i) => (
          <View key={name} className={`mb-2 border-l-4 bg-zinc-900 pb-3.5 ${i === 1 ? "border-orange-500" : "border-lime-300"}`}>
            <View className="h-44 items-center justify-center border-2 border-zinc-800 bg-black">
              <Text className="text-[10px] font-bold tracking-[2px] text-zinc-400">SPOT IMAGE</Text>
            </View>
            <Text className="mx-3.5 mt-3 text-[28px] font-black tracking-tight text-white">{name}</Text>
            <Text className="mx-3.5 mt-1 text-[11px] tracking-[1.5px] text-zinc-400">
              {i === 1 ? "2.8 MI AWAY" : "1.2 MI AWAY"} · STREET / LEDGES
            </Text>
            <Pressable className="mx-3.5 mt-3.5 items-center border-2 border-zinc-500 bg-zinc-800 py-2.5" onPress={() => router.push("/spot-details")}>
              <Text className="text-[11px] font-bold tracking-[1.6px] text-white">VIEW SPOT DATA</Text>
            </Pressable>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}
