import { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, Pressable, RefreshControl, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";

import { SpotHeroImage } from "../components/SpotHeroImage";
import { supabase } from "../lib/supabase";
import type { SpotRow } from "../types/spot";

function formatSpotMeta(spot: SpotRow, index: number) {
  const category = spot.category?.trim() || "UNCATEGORIZED";
  const hasCoords = spot.latitude != null && spot.longitude != null;
  const distance = hasCoords ? `${(index % 2 === 1 ? 2.8 : 1.2).toFixed(1)} MI AWAY` : "LOCATION TBD";
  return `${distance} · ${category.toUpperCase()}`;
}

export function FeedPage() {
  const router = useRouter();
  const [spots, setSpots] = useState<SpotRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setError(null);
    const { data, error: qError } = await supabase
      .from("spots")
      .select("*")
      .order("created_at", { ascending: false });

    if (qError) {
      setError(qError.message);
      setSpots([]);
      return;
    }
    setSpots((data as SpotRow[]) ?? []);
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      await load();
      if (!cancelled) setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [load]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  }, [load]);

  return (
    <SafeAreaView className="flex-1 bg-zinc-950">
      <ScrollView
        contentContainerClassName="gap-3 px-4 pb-28"
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#a3e635" />}
      >
        <Text className="my-1 text-3xl font-black tracking-tight text-white">DISCOVERY FEED</Text>

        {loading ? (
          <View className="items-center py-12">
            <ActivityIndicator color="#a3e635" />
          </View>
        ) : null}

        {error ? <Text className="text-sm text-orange-500">{error}</Text> : null}

        {!loading && !error && spots.length === 0 ? (
          <Text className="text-[11px] tracking-[1.5px] text-zinc-500">NO SPOTS YET. ADD ONE FROM THE UPLOAD TAB.</Text>
        ) : null}

        {spots.map((spot, i) => (
          <View
            key={spot.id}
            className={`mb-2 border-l-4 bg-zinc-900 pb-3.5 ${i % 2 === 1 ? "border-orange-500" : "border-lime-300"}`}
          >
            <SpotHeroImage uri={spot.image_url} />
            <Text className="mx-3.5 mt-3 text-[28px] font-black tracking-tight text-white">{spot.title}</Text>
            <Text className="mx-3.5 mt-1 text-[11px] tracking-[1.5px] text-zinc-400">{formatSpotMeta(spot, i)}</Text>
            <Pressable
              className="mx-3.5 mt-3.5 items-center border-2 border-zinc-500 bg-zinc-800 py-2.5"
              onPress={() => router.push({ pathname: "/spot-details", params: { id: spot.id } })}
            >
              <Text className="text-[11px] font-bold tracking-[1.6px] text-white">VIEW SPOT DATA</Text>
            </Pressable>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}
