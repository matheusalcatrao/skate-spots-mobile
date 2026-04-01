import { useEffect, useMemo, useRef, useState } from "react";
import { Animated, LayoutChangeEvent, Pressable, Text, View } from "react-native";

import type { TabKey } from "../types/navigation";

type Props = {
  activeTab: TabKey;
  onChange: (tab: TabKey) => void;
};

const items: Array<{ key: Exclude<TabKey, "auth">; label: string }> = [
  { key: "explore", label: "EXPLORE" },
  { key: "upload", label: "UPLOAD" },
  { key: "skater", label: "SKATER" },
];

export function BottomNav({ activeTab, onChange }: Props) {
  const [navWidth, setNavWidth] = useState(0);
  const indicatorX = useRef(new Animated.Value(0)).current;
  const itemScale = useRef(items.map(() => new Animated.Value(1))).current;

  const activeIndex = useMemo(() => items.findIndex((item) => item.key === activeTab), [activeTab]);
  const tabWidth = navWidth > 0 ? navWidth / items.length : 0;

  useEffect(() => {
    if (!tabWidth || activeIndex < 0) return;

    Animated.spring(indicatorX, {
      toValue: activeIndex * tabWidth,
      useNativeDriver: true,
      damping: 14,
      stiffness: 220,
      mass: 0.7,
    }).start();
  }, [activeIndex, indicatorX, tabWidth]);

  useEffect(() => {
    if (activeIndex < 0) return;

    const animations = itemScale.map((value, index) =>
      Animated.spring(value, {
        toValue: index === activeIndex ? 1.06 : 1,
        useNativeDriver: true,
        damping: 12,
        stiffness: 220,
      }),
    );

    Animated.parallel(animations).start();
  }, [activeIndex, itemScale]);

  const onLayout = (event: LayoutChangeEvent) => setNavWidth(event.nativeEvent.layout.width);

  return (
    <View onLayout={onLayout} className="absolute bottom-0 left-0 right-0 h-[68px] flex-row border-t-4 border-zinc-800 bg-zinc-950">
      {tabWidth > 0 ? (
        <Animated.View
          className="absolute bottom-2 top-2 rounded-md bg-lime-300"
          style={{
            width: tabWidth - 12,
            left: 6,
            transform: [{ translateX: indicatorX }],
          }}
        />
      ) : null}

      {items.map((item, index) => {
        const active = item.key === activeTab;
        return (
          <Pressable key={item.key} onPress={() => onChange(item.key)} className="flex-1 items-center justify-center">
            <Animated.View style={{ transform: [{ scale: itemScale[index] }] }}>
              <Text className={`text-[10px] font-extrabold tracking-[1.4px] ${active ? "text-zinc-950" : "text-zinc-500"}`}>
                {item.label}
              </Text>
            </Animated.View>
          </Pressable>
        );
      })}
    </View>
  );
}
