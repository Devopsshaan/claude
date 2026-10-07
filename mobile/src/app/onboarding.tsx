import { useState } from "react";
import { KeyboardAvoidingView, Platform, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as Haptics from "expo-haptics";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";
import { REASONS, TIMES, saveProfile, type Profile } from "@/lib/profile";
import { scheduleDailyReminder } from "@/lib/notifications";
import { colors, fonts } from "@/theme";

/**
 * First launch: three short questions, then the promise, then the paywall.
 * Short on purpose: the chapel itself is the hook; this just personalises it.
 */
export default function Onboarding() {
  const insets = useSafeAreaInsets();
  const [step, setStep] = useState(0);
  const [name, setName] = useState("");
  const [reason, setReason] = useState<Profile["reason"] | null>(null);
  const [time, setTime] = useState<Profile["time"] | null>(null);

  const go = async (n: number) => {
    Haptics.selectionAsync();
    if (n > 3) {
      await saveProfile({ name: name.trim(), reason: reason ?? "closer", time: time ?? "morning", onboarded: true });
      // Ask for the daily reminder right after they chose a time, when the value is obvious.
      scheduleDailyReminder(time ?? "morning", name.trim() || undefined).catch(() => {});
      router.replace("/paywall");
      return;
    }
    setStep(n);
  };

  const canNext = step === 0 || (step === 1 && !!reason) || (step === 2 && !!time) || step === 3;

  return (
    <LinearGradient colors={[colors.navy950, colors.night]} style={{ flex: 1 }}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={[styles.root, { paddingTop: insets.top + 16, paddingBottom: insets.bottom + 20 }]}>
        <View style={styles.dots}>
          {[0, 1, 2, 3].map((i) => (
            <View key={i} style={[styles.dot, i <= step && styles.dotOn]} />
          ))}
        </View>

        <View style={styles.body}>
          {step === 0 && (
            <Animated.View key="s0" entering={FadeIn.duration(500)} exiting={FadeOut.duration(200)}>
              <Text style={styles.eyebrow}>SANCTUARY</Text>
              <Text style={styles.title}>A chapel, built one prayer at a time.</Text>
              <Text style={styles.sub}>Pray for two minutes a day. Every day you pray, your chapel gains a stone, a window, a light. In forty days it stands complete.</Text>
              <Text style={styles.sub}>What should we call you?</Text>
              <TextInput value={name} onChangeText={setName} placeholder="Your first name" placeholderTextColor="rgba(183,192,214,0.6)" style={styles.input} autoCapitalize="words" returnKeyType="done" accessibilityLabel="Your first name" />
            </Animated.View>
          )}
          {step === 1 && (
            <Animated.View key="s1" entering={FadeIn.duration(500)} exiting={FadeOut.duration(200)}>
              <Text style={styles.eyebrow}>ONE QUESTION</Text>
              <Text style={styles.title}>{name ? `${name}, what` : "What"} brings you to prayer right now?</Text>
              <View style={styles.options}>
                {REASONS.map((r) => (
                  <Pressable key={r.id} onPress={() => setReason(r.id)} style={[styles.option, reason === r.id && styles.optionOn]} accessibilityRole="button" accessibilityState={{ selected: reason === r.id }}>
                    <Text style={styles.optionLabel}>{r.label}</Text>
                    <Text style={styles.optionSub}>{r.sub}</Text>
                  </Pressable>
                ))}
              </View>
            </Animated.View>
          )}
          {step === 2 && (
            <Animated.View key="s2" entering={FadeIn.duration(500)} exiting={FadeOut.duration(200)}>
              <Text style={styles.eyebrow}>YOUR TWO MINUTES</Text>
              <Text style={styles.title}>When will you pray?</Text>
              <Text style={styles.sub}>We’ll keep a candle lit for you at that time, with a gentle reminder.</Text>
              <View style={styles.options}>
                {TIMES.map((t) => (
                  <Pressable key={t.id} onPress={() => setTime(t.id)} style={[styles.option, time === t.id && styles.optionOn]} accessibilityRole="button" accessibilityState={{ selected: time === t.id }}>
                    <Text style={styles.optionLabel}>{t.label}</Text>
                    <Text style={styles.optionSub}>{t.hour > 12 ? `${t.hour - 12}:00 pm` : `${t.hour}:00 am`}</Text>
                  </Pressable>
                ))}
              </View>
            </Animated.View>
          )}
          {step === 3 && (
            <Animated.View key="s3" entering={FadeIn.duration(500)}>
              <Text style={styles.eyebrow}>A PROMISE</Text>
              <Text style={styles.title}>I will pray every day, and build this sanctuary with God.</Text>
              <Text style={styles.sub}>Miss a day and the light dims, but nothing you have built is ever lost.</Text>
            </Animated.View>
          )}
        </View>

        <Pressable onPress={() => go(step + 1)} disabled={!canNext} style={({ pressed }) => [styles.cta, !canNext && styles.ctaOff, pressed && { transform: [{ scale: 0.98 }] }]} accessibilityRole="button">
          <Text style={styles.ctaText}>{step === 3 ? "I promise" : "Continue"}</Text>
        </Pressable>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, paddingHorizontal: 26 },
  dots: { flexDirection: "row", gap: 8 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: "rgba(240,214,154,0.25)" },
  dotOn: { backgroundColor: colors.gold400 },
  body: { flex: 1, justifyContent: "center" },
  eyebrow: { color: colors.gold300, fontFamily: fonts.sansBold, fontSize: 12, letterSpacing: 3, marginBottom: 14 },
  title: { color: colors.cream50, fontFamily: fonts.serif, fontSize: 32, lineHeight: 40 },
  sub: { color: colors.muted, fontFamily: fonts.sans, fontSize: 16, lineHeight: 24, marginTop: 14 },
  input: { marginTop: 16, minHeight: 54, borderRadius: 16, paddingHorizontal: 18, backgroundColor: "rgba(16,35,74,0.8)", borderWidth: 1, borderColor: "rgba(240,214,154,0.3)", color: colors.cream50, fontFamily: fonts.sansMedium, fontSize: 18 },
  options: { marginTop: 22, gap: 10 },
  option: { minHeight: 60, paddingHorizontal: 18, paddingVertical: 12, borderRadius: 16, backgroundColor: "rgba(16,35,74,0.6)", borderWidth: 1, borderColor: "rgba(240,214,154,0.18)" },
  optionOn: { borderColor: colors.gold400, backgroundColor: "rgba(217,171,63,0.16)" },
  optionLabel: { color: colors.cream50, fontFamily: fonts.sansBold, fontSize: 16 },
  optionSub: { color: colors.muted, fontFamily: fonts.sans, fontSize: 13, marginTop: 2 },
  cta: { minHeight: 58, borderRadius: 999, backgroundColor: colors.gold500, alignItems: "center", justifyContent: "center" },
  ctaOff: { opacity: 0.4 },
  ctaText: { color: colors.navy950, fontFamily: fonts.sansBold, fontSize: 18 },
});
