import { useCallback, useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { BlurMask, Canvas, Circle, RadialGradient, vec } from "@shopify/react-native-skia";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as Haptics from "expo-haptics";
import Animated, { Easing, FadeIn, FadeOut, useAnimatedStyle, useReducedMotion, useSharedValue, withRepeat, withTiming } from "react-native-reanimated";
import { DAYS } from "@/lib/days";
import { markPrayedToday } from "@/lib/store";
import { colors, fonts } from "@/theme";

/**
 * Today's prayer, in three quiet steps: breathe, receive the Word, pray it.
 * Finishing marks the day and returns home, where the chapel grows.
 */
const STEPS = ["breathe", "word", "pray"] as const;

export default function Pray() {
  const insets = useSafeAreaInsets();
  const reduceMotion = useReducedMotion();
  const { day } = useLocalSearchParams<{ day?: string }>();
  const prayer = DAYS[(Number(day) || 0) % DAYS.length];
  const [step, setStep] = useState(0);
  const [saving, setSaving] = useState(false);

  // Breathing circle: 4s in, 4s out
  const breath = useSharedValue(0);
  useEffect(() => {
    if (reduceMotion) {
      breath.value = 0.5;
      return;
    }
    breath.value = withRepeat(withTiming(1, { duration: 4000, easing: Easing.inOut(Easing.sin) }), -1, true);
  }, [breath, reduceMotion]);
  const circle = useAnimatedStyle(() => ({ transform: [{ scale: 0.7 + breath.value * 0.5 }], opacity: 0.55 + breath.value * 0.45 }));
  const [phase, setPhase] = useState("Breathe in");
  useEffect(() => {
    if (step !== 0 || reduceMotion) return;
    const id = setInterval(() => setPhase((p) => (p === "Breathe in" ? "Breathe out" : "Breathe in")), 4000);
    return () => clearInterval(id);
  }, [step, reduceMotion]);

  const next = useCallback(async () => {
    Haptics.selectionAsync();
    if (step < STEPS.length - 1) {
      setStep(step + 1);
      return;
    }
    if (saving) return;
    setSaving(true);
    await markPrayedToday();
    router.replace({ pathname: "/", params: { grew: "1" } });
  }, [step, saving]);

  const current = STEPS[step];

  return (
    <LinearGradient colors={[colors.navy950, colors.night]} style={{ flex: 1 }}>
      <View style={[styles.root, { paddingTop: insets.top + 12, paddingBottom: insets.bottom + 24 }]}>
        <View style={styles.header}>
          <View style={styles.dots}>
            {STEPS.map((s, i) => (
              <View key={s} style={[styles.dot, i <= step && styles.dotOn]} />
            ))}
          </View>
          <Pressable onPress={() => router.back()} style={styles.close} accessibilityRole="button" accessibilityLabel="Close">
            <Text style={styles.closeText}>✕</Text>
          </Pressable>
        </View>

        <View style={styles.center}>
          {current === "breathe" && (
            <Animated.View key="breathe" entering={FadeIn.duration(500)} exiting={FadeOut.duration(300)} style={styles.centerInner}>
              <Animated.View style={[styles.circle, circle]}>
                <Canvas style={StyleSheet.absoluteFill}>
                  <Circle cx={130} cy={130} r={78}>
                    <RadialGradient c={vec(118, 112)} r={90} colors={["#fff3d2", "#e6c168", "#8a620f"]} />
                  </Circle>
                  <Circle cx={130} cy={130} r={84} color="rgba(255,214,140,0.45)">
                    <BlurMask blur={22} style="normal" />
                  </Circle>
                </Canvas>
              </Animated.View>
              <Text style={styles.big}>{phase}</Text>
              <Text style={styles.sub}>Set everything else down for two minutes.</Text>
            </Animated.View>
          )}
          {current === "word" && (
            <Animated.View key="word" entering={FadeIn.duration(500)} exiting={FadeOut.duration(300)} style={styles.centerInner}>
              <Text style={styles.label}>TODAY’S WORD</Text>
              <Text style={styles.verse}>“{prayer.text}”</Text>
              <Text style={styles.ref}>{prayer.ref}</Text>
            </Animated.View>
          )}
          {current === "pray" && (
            <Animated.View key="pray" entering={FadeIn.duration(500)} style={styles.centerInner}>
              <Text style={styles.label}>PRAY WITH ME</Text>
              <Text style={styles.verse}>{prayer.prayer}</Text>
              <Text style={styles.sub}>Add your own words. Then say Amen.</Text>
            </Animated.View>
          )}
        </View>

        <Pressable onPress={next} disabled={saving} style={({ pressed }) => [styles.cta, pressed && { transform: [{ scale: 0.98 }] }]} accessibilityRole="button">
          <Text style={styles.ctaText}>{current === "breathe" ? "I’m ready" : current === "word" ? "Pray this Word" : "Amen"}</Text>
        </Pressable>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, paddingHorizontal: 26 },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  dots: { flexDirection: "row", gap: 8 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: "rgba(240,214,154,0.25)" },
  dotOn: { backgroundColor: colors.gold400 },
  close: { width: 44, height: 44, alignItems: "center", justifyContent: "center", marginRight: -10 },
  closeText: { color: colors.muted, fontSize: 18 },
  center: { flex: 1, justifyContent: "center" },
  centerInner: { alignItems: "center" },
  circle: { width: 260, height: 260, marginBottom: 20 },
  big: { color: colors.cream50, fontFamily: fonts.serif, fontSize: 34 },
  sub: { color: colors.muted, fontFamily: fonts.sans, fontSize: 15, lineHeight: 22, textAlign: "center", marginTop: 14 },
  label: { color: colors.gold300, fontFamily: fonts.sansBold, fontSize: 12, letterSpacing: 3, marginBottom: 18 },
  verse: { color: colors.cream50, fontFamily: fonts.serifItalic, fontSize: 27, lineHeight: 38, textAlign: "center" },
  ref: { color: colors.gold300, fontFamily: fonts.sansBold, fontSize: 15, marginTop: 16 },
  cta: { minHeight: 58, borderRadius: 999, backgroundColor: colors.gold500, alignItems: "center", justifyContent: "center" },
  ctaText: { color: colors.navy950, fontFamily: fonts.sansBold, fontSize: 18 },
});
