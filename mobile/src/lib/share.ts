import { Platform, Share } from "react-native";
import type { RefObject } from "react";
import type { CanvasRef } from "@shopify/react-native-skia";
import { File, Paths } from "expo-file-system";
import * as Sharing from "expo-sharing";

/**
 * Share the chapel as an image: a snapshot of the live scene, saved to the cache and
 * handed to the iOS share sheet. This is the TikTok / Instagram asset.
 */
export async function shareChapel(ref: RefObject<CanvasRef | null>, days: number): Promise<void> {
  const message = `Day ${days} of building my sanctuary, one prayer at a time.`;
  const canvas = ref.current;
  if (!canvas || Platform.OS === "web") {
    await Share.share({ message });
    return;
  }
  try {
    const image = await canvas.makeImageSnapshotAsync();
    const bytes = image.encodeToBytes();
    const file = new File(Paths.cache, `sanctuary-day-${days}.png`);
    file.write(bytes);
    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(file.uri, { mimeType: "image/png", dialogTitle: message });
    } else {
      await Share.share({ message, url: file.uri });
    }
  } catch {
    await Share.share({ message });
  }
}
