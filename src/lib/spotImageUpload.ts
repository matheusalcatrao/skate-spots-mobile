import * as ImagePicker from "expo-image-picker";

import { supabase } from "./supabase";

export async function requestSpotImage(): Promise<ImagePicker.ImagePickerAsset | null> {
  const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (status !== "granted") {
    return null;
  }

  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ["images"],
    allowsEditing: true,
    aspect: [4, 3],
    quality: 0.85,
  });

  if (result.canceled || !result.assets[0]) {
    return null;
  }
  return result.assets[0];
}

function extensionFromMime(mime: string | undefined, fallbackUri: string): string {
  if (mime === "image/png") return "png";
  if (mime === "image/webp") return "webp";
  if (mime === "image/heic" || mime === "image/heif") return "heic";
  if (mime === "image/jpeg" || mime === "image/jpg") return "jpg";
  const fromUri = fallbackUri.split(".").pop()?.toLowerCase();
  if (fromUri && fromUri.length <= 5 && /^[a-z0-9]+$/i.test(fromUri)) {
    return fromUri;
  }
  return "jpg";
}

/**
 * Uploads to `spot-images/{userId}/{timestamp}.{ext}` and returns the public URL.
 */
export async function uploadSpotImage(
  asset: ImagePicker.ImagePickerAsset,
  userId: string,
): Promise<{ publicUrl: string } | { error: string }> {
  const ext = extensionFromMime(asset.mimeType, asset.uri);
  const path = `${userId}/${Date.now()}.${ext}`;

  const response = await fetch(asset.uri);
  const body = await response.arrayBuffer();

  const contentType = asset.mimeType ?? (ext === "png" ? "image/png" : "image/jpeg");

  const { error: uploadError } = await supabase.storage.from("spot-images").upload(path, body, {
    contentType,
    upsert: false,
  });

  if (uploadError) {
    return { error: uploadError.message };
  }

  const { data } = supabase.storage.from("spot-images").getPublicUrl(path);
  return { publicUrl: data.publicUrl };
}
