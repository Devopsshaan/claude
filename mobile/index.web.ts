// Web is only used for design previews. Skia needs CanvasKit loaded before any screen imports it.
import { LoadSkiaWeb } from "@shopify/react-native-skia/lib/module/web";

LoadSkiaWeb({ locateFile: (file: string) => `/${file}` }).then(() => {
  require("expo-router/entry");
});
