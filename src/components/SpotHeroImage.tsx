import { Image, Text, View } from "react-native";

const HERO_HEIGHT = 176;

type SpotHeroImageProps = {
  uri: string | null | undefined;
};

/** RN `Image` needs bounded layout; wrapper ensures feed/detail images actually paint. */
export function SpotHeroImage({ uri }: SpotHeroImageProps) {
  const trimmed = uri?.trim();
  if (!trimmed) {
    return (
      <View
        className="w-full items-center justify-center border-2 border-zinc-800 bg-black"
        style={{ height: HERO_HEIGHT }}
      >
        <Text className="text-[10px] font-bold tracking-[2px] text-zinc-400">SPOT IMAGE</Text>
      </View>
    );
  }

  return (
    <View className="w-full overflow-hidden border-2 border-zinc-800 bg-black" style={{ height: HERO_HEIGHT }}>
      <Image
        accessibilityLabel="Spot photo"
        source={{ uri: trimmed }}
        style={{ width: "100%", height: "100%" }}
        resizeMode="cover"
      />
    </View>
  );
}
