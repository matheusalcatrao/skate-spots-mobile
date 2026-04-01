import { useState } from "react";
import { ActivityIndicator, Image, Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import type { ImagePickerAsset } from "expo-image-picker";

import { PrimaryTextInput } from "../components/PrimaryTextInput";
import { useAuth } from "../contexts/AuthContext";
import { requestSpotImage, uploadSpotImage } from "../lib/spotImageUpload";
import { supabase } from "../lib/supabase";

export function AddSpotPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [pickedImage, setPickedImage] = useState<ImagePickerAsset | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onPickImage = async () => {
    setError(null);
    const asset = await requestSpotImage();
    if (asset) {
      setPickedImage(asset);
    }
  };

  const onPublish = async () => {
    if (!user) {
      setError("Sign in to publish a spot.");
      return;
    }
    const trimmedTitle = title.trim();
    if (!trimmedTitle) {
      setError("Enter a spot designation.");
      return;
    }

    setSubmitting(true);
    setError(null);

    let imageUrl: string | null = null;
    if (pickedImage) {
      const upload = await uploadSpotImage(pickedImage, user.id);
      if ("error" in upload) {
        setError(upload.error);
        setSubmitting(false);
        return;
      }
      imageUrl = upload.publicUrl;
    }

    const { error: insertError } = await supabase.from("spots").insert({
      title: trimmedTitle,
      description: description.trim() || null,
      category: category.trim() || null,
      image_url: imageUrl,
      created_by: user.id,
    });

    setSubmitting(false);

    if (insertError) {
      setError(insertError.message);
      return;
    }

    setTitle("");
    setDescription("");
    setCategory("");
    setPickedImage(null);
    router.replace("/feed");
  };

  return (
    <SafeAreaView className="flex-1 bg-zinc-950">
      <ScrollView contentContainerClassName="gap-3 px-4 pb-28">
        <Text className="my-1 text-3xl font-black tracking-tight text-white">REGISTER SPOT</Text>
        <View className="h-44 items-center justify-center border-2 border-zinc-800 bg-black">
          <Text className="text-[10px] font-bold tracking-[2px] text-zinc-400">MINI MAP PREVIEW</Text>
        </View>

        <Text className="mb-1 mt-1 text-[10px] font-bold tracking-[2px] text-lime-300">SPOT PHOTO</Text>
        <Pressable
          onPress={onPickImage}
          disabled={submitting}
          className="flex min-h-40 items-center justify-center border-2 border-zinc-800 bg-black opacity-100 disabled:opacity-50"
        >
          {pickedImage ? (
            <Image source={{ uri: pickedImage.uri }} className="h-40 w-full" resizeMode="cover" />
          ) : (
            <Text className="text-[10px] font-bold tracking-[2px] text-zinc-400">TAP TO CHOOSE PHOTO</Text>
          )}
        </Pressable>
        {pickedImage ? (
          <Pressable onPress={() => setPickedImage(null)} disabled={submitting}>
            <Text className="text-[11px] font-bold tracking-[1.2px] text-orange-400">REMOVE PHOTO</Text>
          </Pressable>
        ) : null}

        <Text className="mb-1 mt-1 text-[10px] font-bold tracking-[2px] text-lime-300">SPOT DESIGNATION</Text>
        <PrimaryTextInput
          placeholder="E.G. 7TH ST RAIL"
          value={title}
          onChangeText={setTitle}
          editable={!submitting}
        />

        <Text className="mb-1 mt-1 text-[10px] font-bold tracking-[2px] text-lime-300">CATEGORY (OPTIONAL)</Text>
        <PrimaryTextInput
          placeholder="E.G. STREET / LEDGES"
          value={category}
          onChangeText={setCategory}
          editable={!submitting}
        />

        <Text className="mb-1 mt-1 text-[10px] font-bold tracking-[2px] text-lime-300">INTEL / DETAILS</Text>
        <PrimaryTextInput
          multiline
          numberOfLines={4}
          placeholder="Describe security, ground quality and best times..."
          className="min-h-24"
          textAlignVertical="top"
          value={description}
          onChangeText={setDescription}
          editable={!submitting}
        />

        {authLoading ? (
          <Text className="text-[11px] tracking-[1.5px] text-zinc-500">CHECKING SESSION…</Text>
        ) : !user ? (
          <Text className="text-sm text-orange-500">Sign in to publish spots.</Text>
        ) : null}

        {error ? <Text className="text-sm text-orange-500">{error}</Text> : null}

        <Pressable
          className="mt-4 items-center bg-lime-300 py-3.5 opacity-100 disabled:opacity-50"
          onPress={onPublish}
          disabled={submitting || authLoading || !user}
        >
          {submitting ? (
            <ActivityIndicator color="#14532d" />
          ) : (
            <Text className="text-[13px] font-black tracking-[2px] text-green-950">PUBLISH SPOT</Text>
          )}
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}
