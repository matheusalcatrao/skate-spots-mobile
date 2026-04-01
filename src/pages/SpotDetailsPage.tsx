import { useEffect, useState } from "react";
import { ActivityIndicator, Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";

import { SpotHeroImage } from "../components/SpotHeroImage";
import { supabase } from "../lib/supabase";
import type { SpotRow } from "../types/spot";

function paramId(raw: string | string[] | undefined): string | undefined {
  if (raw == null) return undefined;
  if (Array.isArray(raw)) return raw[0];
  return raw;
}

export function SpotDetailsPage() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id?: string | string[] }>();
  const spotId = paramId(id);

  const [spot, setSpot] = useState<SpotRow | null>(null);
  const [loading, setLoading] = useState(Boolean(spotId));
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!spotId) {
      setLoading(false);
      setSpot(null);
      return;
    }

    let cancelled = false;
    (async () => {
      setLoading(true);
      setError(null);
      const { data, error: qError } = await supabase.from("spots").select("*").eq("id", spotId).maybeSingle();

      if (cancelled) return;

      if (qError) {
        setError(qError.message);
        setSpot(null);
      } else {
        setSpot(data as SpotRow | null);
      }
      setLoading(false);
    })();

    return () => {
      cancelled = true;
    };
  }, [spotId]);

  return (
    <SafeAreaView className="flex-1 bg-zinc-950">
      <View className="px-4 pb-3 pt-2">
        <Pressable
          accessibilityRole="button"
          onPress={() => router.back()}
          className="self-start border-2 border-zinc-500 bg-zinc-900 px-3 py-2"
        >
          <Text className="text-[11px] font-bold tracking-[1.6px] text-white">BACK</Text>
        </Pressable>
      </View>

      <ScrollView contentContainerClassName="gap-3 px-4 pb-28">
        <Text className="text-3xl font-black tracking-tight text-white">SPOT DETAILS</Text>

        {loading ? (
          <View className="items-center py-8">
            <ActivityIndicator color="#a3e635" />
          </View>
        ) : null}

        {error ? <Text className="text-sm text-orange-500">{error}</Text> : null}

        {spotId && !loading && !error && !spot ? (
          <Text className="text-[11px] tracking-[1.5px] text-zinc-500">SPOT NOT FOUND.</Text>
        ) : null}

        {!spotId && !loading ? (
          <>
            <SpotHeroImage uri={null} />
            <View className="border-l-4 border-lime-300 bg-zinc-900 p-4">
              <Text className="text-[11px] font-bold tracking-[2px] text-zinc-400">SPOT DATA</Text>
              <Text className="mt-2 text-[16px] font-black tracking-[1px] text-white">COMING SOON</Text>
            </View>
          </>
        ) : null}

        {spot ? (
          <>
            <SpotHeroImage uri={spot.image_url} />
            <View className="border-l-4 border-lime-300 bg-zinc-900 p-4">
              <Text className="text-[11px] font-bold tracking-[2px] text-zinc-400">SPOT DATA</Text>
              <Text className="mt-2 text-[22px] font-black tracking-tight text-white">{spot.title}</Text>
              {spot.category ? (
                <Text className="mt-2 text-[11px] tracking-[1.5px] text-zinc-400">{spot.category.toUpperCase()}</Text>
              ) : null}
              {spot.description ? (
                <Text className="mt-3 text-[13px] leading-5 tracking-[0.5px] text-zinc-300">{spot.description}</Text>
              ) : (
                <Text className="mt-3 text-[11px] tracking-[1.5px] text-zinc-500">NO INTEL YET.</Text>
              )}
            </View>
          </>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
}
