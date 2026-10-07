import { useEffect, useMemo, useState, type ReactNode } from "react";
import { StyleSheet, Text, View, type LayoutChangeEvent } from "react-native";
import { Canvas, Circle, Group, LinearGradient, Path, Rect, Skia, notifyChange, vec } from "@shopify/react-native-skia";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, { runOnJS, useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import * as Haptics from "expo-haptics";
import { fonts } from "@/theme";

/**
 * "Gently rub the light away": a golden cover over today's Word, scratched off with a
 * finger (like oneprayer.church). Reveals itself once about half is cleared, or with
 * the "Reveal it for me" button in the parent (or VoiceOver's activate action).
 */
const COLS = 12;
const ROWS = 6;
const BRUSH = 26;

const SPARKLES = Array.from({ length: 26 }, (_, i) => ({
  x: ((i * 97) % 100) / 100,
  y: ((i * 61) % 100) / 100,
  r: 0.8 + ((i * 7) % 5) * 0.35,
}));

type Props = { children: ReactNode; revealed: boolean; onReveal: (how: "scratch" | "button") => void };

export function ScratchCard({ children, revealed, onReveal }: Props) {
  const [size, setSize] = useState({ w: 0, h: 0 });
  // One path, extended in place on the UI thread (no per-frame rebuilds).
  const path = useSharedValue(Skia.Path.Make());
  const cells = useSharedValue<number[]>([]);
  const done = useSharedValue(revealed ? 1 : 0);
  const started = useSharedValue(0);
  const [gone, setGone] = useState(revealed);

  // Fade the cover away when revealed (by scratching or by the button), then remove it.
  useEffect(() => {
    if (!revealed) return;
    done.value = withTiming(1, { duration: 500 });
    const t = setTimeout(() => setGone(true), 520);
    return () => clearTimeout(t);
  }, [revealed, done]);

  const pan = useMemo(() => {
    const { w, h } = size;
    const addPoint = (x: number, y: number, first: boolean) => {
      "worklet";
      if (done.value !== 0 || w === 0) return;
      if (first) path.value.moveTo(x, y);
      else path.value.lineTo(x, y);
      notifyChange(path);
      const c = Math.min(COLS - 1, Math.max(0, Math.floor((x / w) * COLS)));
      const r = Math.min(ROWS - 1, Math.max(0, Math.floor((y / h) * ROWS)));
      const id = r * COLS + c;
      if (!cells.value.includes(id)) {
        cells.value = [...cells.value, id];
        if (cells.value.length >= COLS * ROWS * 0.5) {
          done.value = 0.001;
          runOnJS(onReveal)("scratch");
        }
      }
    };
    return Gesture.Pan()
      .minDistance(0)
      .onBegin((e) => {
        if (started.value === 0) {
          started.value = 1;
          runOnJS(Haptics.selectionAsync)();
        }
        addPoint(e.x, e.y, true);
      })
      .onUpdate((e) => addPoint(e.x, e.y, false));
  }, [size, path, cells, done, started, onReveal]);

  const coverStyle = useAnimatedStyle(() => ({ opacity: 1 - done.value }));
  const hintStyle = useAnimatedStyle(() => ({ opacity: Math.max(0, 1 - cells.value.length / 8) * (1 - done.value) }));

  const onLayout = (e: LayoutChangeEvent) => setSize({ w: e.nativeEvent.layout.width, h: e.nativeEvent.layout.height });

  return (
    <View style={styles.wrap} onLayout={onLayout}>
      {/* Hidden from VoiceOver until revealed, so the verse isn't read out under the cover. */}
      <View style={styles.content} accessibilityElementsHidden={!gone} importantForAccessibility={gone ? "auto" : "no-hide-descendants"}>
        {children}
      </View>
      {!gone ? (
        <GestureDetector gesture={pan}>
          <Animated.View
            style={[StyleSheet.absoluteFill, coverStyle]}
            pointerEvents={revealed ? "none" : "auto"}
            accessible
            accessibilityRole="button"
            accessibilityLabel="Today's Word, covered in gold"
            accessibilityHint="Double-tap to reveal today's Scripture"
            accessibilityActions={[{ name: "activate" }]}
            onAccessibilityAction={() => onReveal("button")}
          >
            {size.w > 0 && (
              <Canvas style={StyleSheet.absoluteFill}>
                <Group>
                  <Rect x={0} y={0} width={size.w} height={size.h}>
                    <LinearGradient
                      start={vec(0, 0)}
                      end={vec(size.w, size.h)}
                      colors={["#b8863a", "#e6c168", "#fff3d6", "#e3b75a", "#a8742c"]}
                      positions={[0, 0.3, 0.5, 0.72, 1]}
                    />
                  </Rect>
                  {SPARKLES.map((s, i) => (
                    <Circle key={i} cx={s.x * size.w} cy={s.y * size.h} r={s.r} color="rgba(255,255,255,0.75)" />
                  ))}
                  <Path path={path} style="stroke" strokeWidth={BRUSH * 2} strokeCap="round" strokeJoin="round" color="black" blendMode="clear" />
                </Group>
              </Canvas>
            )}
            <Animated.View style={[styles.hint, hintStyle]} pointerEvents="none">
              <View style={styles.plate}>
                <Text style={styles.hintTitle}>Touch here to receive today&apos;s Word</Text>
                <Text style={styles.hintSub}>Gently rub the light away</Text>
              </View>
            </Animated.View>
          </Animated.View>
        </GestureDetector>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { borderRadius: 20, overflow: "hidden", minHeight: 170 },
  content: { padding: 4 },
  hint: { position: "absolute", top: 0, left: 0, right: 0, bottom: 0, alignItems: "center", justifyContent: "center", paddingHorizontal: 16 },
  // A soft light plate keeps the hint readable over every part of the gold gradient.
  plate: { paddingHorizontal: 14, paddingVertical: 10, borderRadius: 14, backgroundColor: "rgba(255,246,220,0.55)", alignItems: "center" },
  hintTitle: { color: "#2a1c06", fontFamily: fonts.sansBold, fontSize: 17, textAlign: "center" },
  hintSub: { color: "#4a3410", fontFamily: fonts.sans, fontSize: 13, marginTop: 6 },
});
