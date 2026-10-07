import { useCallback, useEffect, useRef, useState } from "react";
import { Pressable, StyleSheet, Text, View, useWindowDimensions } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import * as Haptics from "expo-haptics";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Animated, {
  Easing,
  SensorType,
  interpolate,
  useAnimatedSensor,
  useAnimatedStyle,
  useDerivedValue,
  useReducedMotion,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import { LightSky } from "./LightSky";
import { ArchLight } from "./ArchLight";
import { DOOR_VERSE } from "@/lib/word";
import { colors, fonts } from "@/theme";

/**
 * The door (Revelation 3:20), rebuilt natively in 3D:
 *  - GPU sky with turning rays of light, stars and dust motes (LightSky)
 *  - a stone arch whose two wooden doors swing open on real 3D hinges
 *  - the whole scene leans with the phone (gyro parallax) and the camera moves
 *    through the doorway as the light floods out
 *  - a knock, then the doors, then the light, felt through haptics
 * Skippable, and instant for people who turn on Reduce Motion.
 */
type Props = { onDone: () => void };

const OPEN_MS = 2300;
const FLOOD_AT = 1900;
const DONE_AT = 3400;

export function DoorScene({ onDone }: Props) {
  const { width, height } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const [opening, setOpening] = useState(false);
  const reduceMotion = useReducedMotion();
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const finished = useRef(false);

  useEffect(() => {
    const list = timers.current;
    return () => list.forEach(clearTimeout);
  }, []);

  // Arch size: the website's proportions (3:5), sized so it never overlaps the verse
  // and button below it, even on the smallest iPhones.
  const archTop = insets.top + Math.max(40, height * 0.07);
  const bottomBlock = 300 + insets.bottom;
  const maxArchH = Math.max(180, height - archTop - bottomBlock - 56);
  const archW = Math.min(width * 0.6, 300, (maxArchH * 3) / 5);
  const archH = (archW * 5) / 3;
  const lightCenterY = archTop + archH * 0.42;

  // Animation state
  const doors = useSharedValue(0); // 0 closed → 1 open
  const open = useSharedValue(0); // light intensity in the sky
  const reveal = useSharedValue(0); // figure in the light
  const camera = useSharedValue(0); // 0 → 1 dolly through the door
  const breath = useSharedValue(0);
  const knock = useSharedValue(0);

  useEffect(() => {
    if (reduceMotion) return;
    breath.value = withRepeat(withTiming(1, { duration: 2600, easing: Easing.inOut(Easing.sin) }), -1, true);
  }, [breath, reduceMotion]);

  // Gyro parallax: the scene leans gently with the phone.
  const gravity = useAnimatedSensor(SensorType.GRAVITY, { interval: 16 });
  const motion = reduceMotion ? 0 : 1;
  const tiltX = useDerivedValue(() => motion * Math.max(-1, Math.min(1, gravity.sensor.value.x / 9.81)));
  const tiltY = useDerivedValue(() => motion * Math.max(-1, Math.min(1, (gravity.sensor.value.y + 6.5) / 9.81)));

  const sceneStyle = useAnimatedStyle(() => {
    const s = interpolate(camera.value, [0, 0.55, 1], [1, 1.32, 2.2]);
    return {
      transform: [
        { perspective: 1000 },
        { translateY: interpolate(camera.value, [0, 1], [0, archH * 0.12]) },
        { scale: s },
        { rotateY: `${-tiltX.value * 7}deg` },
        { rotateX: `${tiltY.value * 5}deg` },
        { translateX: knock.value * 1.5 },
      ],
    };
  });

  const leftLeaf = useAnimatedStyle(() => ({
    transform: [{ perspective: 900 }, { rotateY: `${-doors.value * 112}deg` }],
  }));
  const rightLeaf = useAnimatedStyle(() => ({
    transform: [{ perspective: 900 }, { rotateY: `${doors.value * 112}deg` }],
  }));
  // A thin gold line of light around the closed doors; it widens as they part.
  const seamStyle = useAnimatedStyle(() => ({ opacity: interpolate(doors.value, [0, 0.15, 0.4], [0.55, 1, 0]) }));
  const textStyle = useAnimatedStyle(() => ({ opacity: 1 - Math.min(1, doors.value * 3) }));

  // Runs once, whether from Skip, the end of the animation, or a double tap.
  const finish = useCallback(() => {
    if (finished.current) return;
    finished.current = true;
    timers.current.forEach(clearTimeout);
    timers.current = [];
    onDone();
  }, [onDone]);

  const start = useCallback(() => {
    if (opening) return;
    setOpening(true);
    if (reduceMotion) {
      finish();
      return;
    }
    // Knock, knock.
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    knock.value = withSequence(withTiming(1, { duration: 60 }), withTiming(-1, { duration: 60 }), withTiming(0, { duration: 80 }));
    timers.current.push(setTimeout(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium), 220));

    const ease = Easing.bezier(0.6, 0.05, 0.3, 1);
    doors.value = withDelay(380, withTiming(1, { duration: OPEN_MS, easing: ease }));
    open.value = withDelay(380, withTiming(0.6, { duration: FLOOD_AT }));
    reveal.value = withDelay(900, withTiming(1, { duration: 1600, easing: Easing.out(Easing.cubic) }));
    camera.value = withDelay(380, withSequence(
      withTiming(0.55, { duration: FLOOD_AT, easing: ease }),
      withTiming(1, { duration: DONE_AT - FLOOD_AT - 200, easing: Easing.in(Easing.cubic) }),
    ));
    timers.current.push(setTimeout(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy), 420));
    timers.current.push(setTimeout(() => {
      open.value = withTiming(1, { duration: 900 });
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }, 380 + FLOOD_AT));
    timers.current.push(setTimeout(finish, 380 + DONE_AT));
  }, [opening, reduceMotion, finish, doors, open, reveal, camera, knock]);

  const leafW = archW / 2;
  const archLeft = (width - archW) / 2;

  return (
    <View style={styles.root} accessibilityViewIsModal>
      <LightSky width={width} height={height} centerY={lightCenterY} open={open} tiltX={tiltX} tiltY={tiltY} still={reduceMotion} />

      <Animated.View style={[styles.stage, { top: archTop }, sceneStyle]} pointerEvents="none" accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
        {/* Stone arch: three rings, like the website */}
        <View style={[styles.archRing, { width: archW + 64, height: archH + 34, borderTopLeftRadius: (archW + 64) / 2, borderTopRightRadius: (archW + 64) / 2, backgroundColor: colors.stone }]} />
        <View style={[styles.archRing, { width: archW + 36, height: archH + 18, top: 16, borderTopLeftRadius: (archW + 36) / 2, borderTopRightRadius: (archW + 36) / 2, backgroundColor: "#5b4a38" }]} />
        <View style={{ width: archW, height: archH, marginTop: 32, borderTopLeftRadius: archW / 2, borderTopRightRadius: archW / 2, overflow: "hidden", backgroundColor: "#0d0a07" }}>
          <ArchLight width={archW} height={archH} reveal={reveal} breath={breath} />
          <Animated.View style={[StyleSheet.absoluteFill, styles.seam, seamStyle]} />
        </View>

        {/* The two doors, on real 3D hinges (outside the clip so they can swing towards you) */}
        <Animated.View style={[styles.leaf, { left: archLeft, width: leafW, height: archH, top: 32, borderTopLeftRadius: leafW, transformOrigin: "left center" }, leftLeaf]}>
          <DoorLeaf side="left" width={leafW} height={archH} />
        </Animated.View>
        <Animated.View style={[styles.leaf, { left: archLeft + leafW, width: leafW, height: archH, top: 32, borderTopRightRadius: leafW, transformOrigin: "right center" }, rightLeaf]}>
          <DoorLeaf side="right" width={leafW} height={archH} />
        </Animated.View>

        {/* Step */}
        <LinearGradient colors={[colors.stone, colors.stoneDark]} style={{ width: archW + 110, height: 14, borderRadius: 3, marginTop: 2 }} />
      </Animated.View>

      <Pressable onPress={finish} hitSlop={12} style={[styles.skip, { top: insets.top + 8 }]} accessibilityRole="button" accessibilityLabel="Skip">
        <Text style={styles.skipText}>Skip</Text>
      </Pressable>

      <Animated.View style={[styles.bottom, { paddingBottom: insets.bottom + 28 }, textStyle]}>
        <Text style={styles.verse} accessibilityRole="header" maxFontSizeMultiplier={1.3}>“{DOOR_VERSE.text}”</Text>
        <Text style={styles.ref} maxFontSizeMultiplier={1.3}>{DOOR_VERSE.ref} ({DOOR_VERSE.translation})</Text>
        <Pressable onPress={start} disabled={opening} style={({ pressed }) => [styles.cta, pressed && { transform: [{ scale: 0.97 }] }]} accessibilityRole="button" accessibilityLabel="Open the door">
          <Text style={styles.ctaText} maxFontSizeMultiplier={1.3}>Open the door</Text>
        </Pressable>
      </Animated.View>
    </View>
  );
}

function DoorLeaf({ side, width, height }: { side: "left" | "right"; width: number; height: number }) {
  const planks = [0.2, 0.4, 0.6, 0.8];
  return (
    <LinearGradient colors={["#5a3a1f", colors.wood, colors.woodDark]} start={{ x: side === "left" ? 0 : 1, y: 0 }} end={{ x: side === "left" ? 1 : 0, y: 1 }} style={StyleSheet.absoluteFill}>
      {planks.map((x) => (
        <View key={x} style={{ position: "absolute", top: 0, bottom: 0, left: x * width, width: 1.5, backgroundColor: "rgba(0,0,0,0.35)" }} />
      ))}
      {/* Iron bands */}
      {[0.24, 0.78].map((y) => (
        <LinearGradient key={y} colors={["#2b2b2e", "#151517"]} style={{ position: "absolute", left: width * 0.08, right: width * 0.08, top: y * height, height: height * 0.045, borderRadius: 3 }} />
      ))}
      {/* Ring handle */}
      <View style={{ position: "absolute", top: height * 0.52, [side === "left" ? "right" : "left"]: width * 0.12, width: 20, height: 20, borderRadius: 10, borderWidth: 3, borderColor: "#c9a457", shadowColor: colors.gold300, shadowOpacity: 0.7, shadowRadius: 6 }} />
      {/* Edge highlight where the light leaks through */}
      <View style={{ position: "absolute", top: 0, bottom: 0, [side === "left" ? "right" : "left"]: 0, width: 3, backgroundColor: "rgba(255,220,150,0.35)" }} />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.night },
  stage: { position: "absolute", left: 0, right: 0, alignItems: "center" },
  archRing: { position: "absolute", top: 0, shadowColor: "#000", shadowOpacity: 0.7, shadowRadius: 30, shadowOffset: { width: 0, height: 20 } },
  seam: { borderWidth: 2, borderColor: "rgba(255,214,140,0.9)", borderTopLeftRadius: 999, borderTopRightRadius: 999 },
  leaf: { position: "absolute", overflow: "hidden", backfaceVisibility: "hidden" },
  skip: { position: "absolute", right: 12, minHeight: 44, minWidth: 64, paddingHorizontal: 14, alignItems: "center", justifyContent: "center", borderRadius: 999 },
  skipText: { color: "rgba(253,248,236,0.85)", fontFamily: fonts.sansMedium, fontSize: 15 },
  bottom: { position: "absolute", left: 0, right: 0, bottom: 0, paddingHorizontal: 28, alignItems: "center" },
  verse: { color: colors.cream50, fontFamily: fonts.serifItalic, fontSize: 21, lineHeight: 30, textAlign: "center", textShadowColor: "rgba(0,0,0,0.6)", textShadowRadius: 8 },
  ref: { color: colors.gold300, fontFamily: fonts.sansBold, fontSize: 14, marginTop: 10, letterSpacing: 0.4 },
  cta: { marginTop: 22, minHeight: 54, paddingHorizontal: 36, borderRadius: 999, backgroundColor: colors.gold500, alignItems: "center", justifyContent: "center", shadowColor: "#ffd68c", shadowOpacity: 0.6, shadowRadius: 22 },
  ctaText: { color: colors.navy950, fontFamily: fonts.sansBold, fontSize: 18 },
});
