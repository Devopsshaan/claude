import { useCallback, useEffect, useMemo, useState } from "react";
import { AppState, Pressable, StyleSheet, Text, View, useWindowDimensions } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as Haptics from "expo-haptics";
import Animated, {
  Easing,
  FadeIn,
  FadeInUp,
  SensorType,
  useAnimatedSensor,
  useDerivedValue,
  useReducedMotion,
  useSharedValue,
  withDelay,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import { Chapel } from "@/components/Chapel";
import { loadPrayedDays, localDayNumber, streakFrom } from "@/lib/store";
import { glowFor, milestoneAt, nextMilestone, piecesFor } from "@/lib/sanctuary";
import { DAYS } from "@/lib/days";
import { loadProfile } from "@/lib/profile";
import { configurePurchases } from "@/lib/purchases";
import { colors, fonts } from "@/theme";

/**
 * Home: your sanctuary. The chapel fills the top of the screen; below it, today's
 * prayer and the next piece you are building towards. Coming back from a prayer
 * (`?grew=1`) plays the growth: the newest piece rises and the light swells.
 */
export default function Home() {
  const { width, height } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const reduceMotion = useReducedMotion();
  const params = useLocalSearchParams<{ grew?: string }>();

  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const sub = AppState.addEventListener("change", (s) => s === "active" && setNow(new Date()));
    return () => sub.remove();
  }, []);
  const today = localDayNumber(now);

  // First launch → onboarding (which leads to the paywall), otherwise load the chapel.
  const [days, setDays] = useState<number[] | null>(null);
  useEffect(() => {
    configurePurchases();
    loadProfile().then((p) => {
      if (!p?.onboarded) router.replace("/onboarding");
    });
  }, []);
  useEffect(() => {
    loadPrayedDays().then(setDays);
  }, [today, params.grew]);

  const total = days?.length ?? 0;
  const streak = days ? streakFrom(days, today) : 0;
  const prayedToday = days?.includes(today) ?? false;
  const pieces = useMemo(() => piecesFor(total), [total]);
  const justReached = params.grew === "1" ? milestoneAt(total) : undefined;
  const next = nextMilestone(total);
  const prayer = DAYS[total % DAYS.length];

  // Light and growth
  const glow = useSharedValue(0);
  const grow = useSharedValue(1);
  useEffect(() => {
    if (!days) return;
    const target = glowFor(streak, total);
    if (params.grew === "1") {
      // Swell past the target, then settle: the moment the prayer "lands".
      glow.value = withSequence(withTiming(Math.min(1, target + 0.35), { duration: 1400, easing: Easing.out(Easing.cubic) }), withTiming(target, { duration: 1800 }));
      if (justReached) {
        grow.value = 0;
        grow.value = withDelay(300, withTiming(1, { duration: 1300, easing: Easing.out(Easing.back(1.6)) }));
      }
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } else {
      glow.value = withTiming(target, { duration: 1200 });
    }
  }, [days, streak, total, params.grew, justReached, glow, grow]);

  // Tilt parallax
  const gravity = useAnimatedSensor(SensorType.GRAVITY, { interval: 16 });
  const motion = reduceMotion ? 0 : 1;
  const tiltX = useDerivedValue(() => motion * Math.max(-1, Math.min(1, gravity.sensor.value.x / 9.81)));
  const tiltY = useDerivedValue(() => motion * Math.max(-1, Math.min(1, (gravity.sensor.value.y + 6.5) / 9.81)));

  const pray = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push({ pathname: "/pray", params: { day: String(total) } });
  }, [total]);

  // The chapel stands just above the panel, whatever the phone's height.
  const panelReserve = 330 + insets.bottom;
  const ground = Math.max(height * 0.42, height - panelReserve - 112);

  return (
    <View style={styles.root}>
      <View style={StyleSheet.absoluteFill} pointerEvents="none">
        <Chapel width={width} height={height} ground={ground} days={total} pieces={pieces} newest={justReached?.piece ?? null} glow={glow} grow={grow} tiltX={tiltX} tiltY={tiltY} still={reduceMotion} />
      </View>

      <View style={[styles.top, { top: insets.top + 10 }]} pointerEvents="none">
        <Text style={styles.eyebrow}>YOUR SANCTUARY</Text>
        <Text style={styles.count}>
          {total === 0 ? "Not yet begun" : `Day ${total}`}
          {streak > 1 ? `  ·  ${streak}-day streak` : ""}
        </Text>
      </View>

      <View style={[styles.panel, { marginBottom: insets.bottom + 12 }]}>
        {justReached ? (
          <Animated.View entering={reduceMotion ? undefined : FadeInUp.duration(700).delay(400)}>
            <Text style={styles.label}>NEW · {justReached.title.toUpperCase()}</Text>
            <Text style={styles.body}>{justReached.detail}</Text>
          </Animated.View>
        ) : (
          <Animated.View entering={reduceMotion ? undefined : FadeIn.duration(500)}>
            <Text style={styles.label}>{prayedToday ? "TODAY’S PRAYER · DONE" : `TODAY’S PRAYER · ${prayer.title.toUpperCase()}`}</Text>
            <Text style={styles.body} numberOfLines={3}>
              {prayedToday
                ? next
                  ? `${next.day - total} more ${next.day - total === 1 ? "day" : "days"} of prayer and ${next.title.toLowerCase()} will appear.`
                  : "Your sanctuary is complete. Keep its light burning."
                : `“${prayer.text}”`}
            </Text>
            {!prayedToday && <Text style={styles.ref}>{prayer.ref}</Text>}
          </Animated.View>
        )}

        <Pressable onPress={pray} disabled={prayedToday} style={({ pressed }) => [styles.cta, prayedToday && styles.ctaDone, pressed && { transform: [{ scale: 0.98 }] }]} accessibilityRole="button">
          <Text style={[styles.ctaText, prayedToday && styles.ctaTextDone]}>{prayedToday ? "See you tomorrow" : total === 0 ? "Lay the first stone" : "Pray today"}</Text>
        </Pressable>
        {!prayedToday && <Text style={styles.hint}>About 2 minutes. Each prayer builds your chapel.</Text>}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.night, justifyContent: "flex-end" },
  top: { position: "absolute", left: 24, right: 24 },
  eyebrow: { color: colors.gold300, fontFamily: fonts.sansBold, fontSize: 12, letterSpacing: 3 },
  count: { color: colors.cream50, fontFamily: fonts.serif, fontSize: 30, marginTop: 4 },
  panel: { marginHorizontal: 14, marginBottom: 10, paddingHorizontal: 22, paddingTop: 22, paddingBottom: 22, gap: 14, borderRadius: 30, backgroundColor: "rgba(6,12,28,0.72)", borderWidth: 1, borderColor: "rgba(240,214,154,0.14)" },
  label: { color: colors.gold300, fontFamily: fonts.sansBold, fontSize: 12, letterSpacing: 2.5 },
  body: { color: colors.cream50, fontFamily: fonts.serifItalic, fontSize: 22, lineHeight: 30, marginTop: 8 },
  ref: { color: colors.muted, fontFamily: fonts.sansMedium, fontSize: 14, marginTop: 6 },
  cta: { marginTop: 8, minHeight: 58, borderRadius: 999, backgroundColor: colors.gold500, alignItems: "center", justifyContent: "center", shadowColor: "#ffd68c", shadowOpacity: 0.45, shadowRadius: 18 },
  ctaDone: { backgroundColor: "rgba(240,214,154,0.12)", shadowOpacity: 0 },
  ctaText: { color: colors.navy950, fontFamily: fonts.sansBold, fontSize: 18 },
  ctaTextDone: { color: colors.gold300 },
  hint: { color: colors.muted, fontFamily: fonts.sans, fontSize: 13, textAlign: "center" },
});
