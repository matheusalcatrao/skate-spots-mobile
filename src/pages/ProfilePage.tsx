import { ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const stats = ["SPOTS 42", "REVIEWS 128", "STREAK 15D", "RANK #12"];

export function ProfilePage() {
  return (
    <SafeAreaView className="flex-1 bg-zinc-950">
      <ScrollView contentContainerClassName="gap-3 px-4 pb-28">
        <Text className="text-[42px] font-black italic tracking-tighter text-white">TONY_TRICKSET</Text>
        <Text className="text-[11px] tracking-[1.5px] text-zinc-400">EST. 2021 // BROOKLYN, NY</Text>

        <View className="mt-2 flex-row flex-wrap gap-2">
          {stats.map((value, i) => (
            <View key={value} className={`min-w-[48%] border-l-4 bg-zinc-900 p-3 ${i > 1 ? "border-orange-500" : "border-lime-300"}`}>
              <Text className="text-xs font-extrabold tracking-[1px] text-white">{value}</Text>
            </View>
          ))}
        </View>

        <View className="mt-2 bg-zinc-900 p-3.5">
          <Text className="text-[13px] font-extrabold tracking-[1.6px] text-lime-300">LEVEL 2: POPSICLE DECK</Text>
          <View className="mt-2.5 h-3.5 bg-zinc-800">
            <View className="h-full w-[83%] bg-lime-300" />
          </View>
          <Text className="mt-2 text-[11px] tracking-[1.5px] text-zinc-400">2500 XP / 3000 XP</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
