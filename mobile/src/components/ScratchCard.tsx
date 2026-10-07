import { useEffect, useState, type ReactNode } from "react";
import { StyleSheet, Text, View, type LayoutChangeEvent } from "react-native";
import { Canvas, Circle, Group, LinearGradient, Path, Rect, Skia, vec } from "@shopify/react-native-skia";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, { runOnJS, useAnimatedStyle, useDerivedValue, useSharedValue, withTiming } from "react-native-reanimated";
import * as Haptics from "expo-haptics";
import { colors, fonts } from "@/theme";

/**
 * "Gently rub the light away": a golden cover over today's Word, scratched off with a
 * finger (like oneprayer.church). Reveals itself once about half is cleared, or with
 * the "Reveal it for me" button in the parent.
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
  const pts = useSharedValue<number[]>([]);
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

  const path = useDerivedValue(() => {
    const a = pts.value;
    let d = "";
    for (let i = 0; i < a.length; i += 3) {
      d += `${a[i + 2] === 1 ? "M" : "L"}${a[i].toFixed(1)} ${a[i + 1].toFixed(1)} `;
    }
    return Skia.Path.MakeFromSVGString(d || "M0 0") ?? Skia.Path.Make();
  });

  const addPoint = (x: number, y: number, first: boolean, w: number, h: number) => {
    "worklet";
    pts.value = [...pts.value, x, y, first ? 1 : 0];
    const c = Math.min(COLS - 1, Math.max(0, Math.floor((x / w) * COLS)));
    const r = Math.min(ROWS - 1, Math.max(0, Math.floor((y / h) * ROWS)));
    const id = r * COLS + c;
    if (!cells.value.includes(id)) {
      cells.value = [...cells.value, id];
      if (cells.value.length >= COLS * ROWS * 0.5 && done.value === 0) {
        done.value = 0.001;
        runOnJS(onReveal)("scratch");
      }
    }
  };

  const pan = Gesture.Pan()
    .minDistance(0)
    .onBegin((e) => {
      if (started.value === 0) {
        started.value = 1;
        runOnJS(Haptics.selectionAsync)();
      }
      addPoint(e.x, e.y, true, size.w, size.h);
    })
    .onUpdate((e) => addPoint(e.x, e.y, false, size.w, size.h));

  const coverStyle = useAnimatedStyle(() => ({ opacity: 1 - done.value }));
  const hintStyle = useAnimatedStyle(() => ({ opacity: Math.max(0, 1 - cells.value.length / 8) * (1 - done.value) }));

  const onLayout = (e: LayoutChangeEvent) => setSize({ w: e.nativeEvent.layout.width, h: e.nativeEvent.layout.height });

  return (
    <View style={styles.wrap} onLayout={onLayout}>
      <View style={styles.content}>{children}</View>
      {!gone ? (
        <GestureDetector gesture={pan}>
          <Animated.View style={[StyleSheet.absoluteFill, coverStyle]} pointerEvents={revealed ? "none" : "auto"} accessibilityLabel="Scratch to reveal today's Word" accessible>
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
              <Text style={styles.hintTitle}>Touch here to receive today&apos;s Word</Text>
              <Text style={styles.hintSub}>Gently rub the light away</Text>
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
  hintTitle: { color: "#3d2a0c", fontFamily: fonts.sansBold, fontSize: 17, textAlign: "center" },
  hintSub: { color: colors.gold700, fontFamily: fonts.sans, fontSize: 13, marginTop: 6 },
});
