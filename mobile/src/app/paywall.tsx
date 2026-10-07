import { useEffect, useState } from "react";
import { Alert, Linking, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as Haptics from "expo-haptics";
import { buy, loadPlans, restore, type Plan } from "@/lib/purchases";
import { colors, fonts } from "@/theme";

const PRIVACY_URL = "https://oneprayer.church/privacy";
const TERMS_URL = "https://oneprayer.church/terms";

/**
 * The membership paywall. Yearly with a 7-day free trial is highlighted; weekly is the
 * flexible option. "We'll remind you before you're charged" + a trial timeline reduce
 * the fear of being billed. Closing it once offers a one-time discount screen later.
 */
export default function Paywall() {
  const insets = useSafeAreaInsets();
  const [plans, setPlans] = useState<Plan[]>([]);
  const [chosen, setChosen] = useState("annual");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    loadPlans().then(setPlans);
  }, []);

  const plan = plans.find((p) => p.id === chosen) ?? plans[0];

  const start = async () => {
    if (!plan || busy) return;
    setBusy(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    try {
      const ok = await buy(plan);
      if (ok) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        router.replace("/");
      }
    } catch {
      Alert.alert("Something went wrong", "Your purchase didn’t go through. You weren’t charged.");
    } finally {
      setBusy(false);
    }
  };

  const doRestore = async () => {
    try {
      if (await restore()) router.replace("/");
      else Alert.alert("Nothing to restore", "We couldn’t find a previous membership for this Apple ID.");
    } catch {
      Alert.alert("Couldn’t restore", "Please try again in a moment.");
    }
  };

  return (
    <LinearGradient colors={["#1a2c55", colors.navy950, colors.night]} style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={[styles.root, { paddingTop: insets.top + 12, paddingBottom: insets.bottom + 16 }]}>
        <Pressable onPress={() => router.replace({ pathname: "/", params: { skipped: "1" } })} style={styles.close} accessibilityRole="button" accessibilityLabel="Not now">
          <Text style={styles.closeText}>✕</Text>
        </Pressable>

        <View style={styles.glow} />
        <Text style={styles.eyebrow}>SANCTUARY MEMBERSHIP</Text>
        <Text style={styles.title}>Build your chapel, every day</Text>

        <View style={styles.list}>
          {[
            "A new guided prayer every day, for 365 days",
            "Your chapel grows with every prayer: 9 pieces to unlock",
            "Stained glass, bells and lights to collect for your sanctuary",
            "Share your chapel as a video or image",
          ].map((t) => (
            <View key={t} style={styles.row}>
              <Text style={styles.check}>✓</Text>
              <Text style={styles.rowText}>{t}</Text>
            </View>
          ))}
        </View>

        <View style={styles.plans}>
          {plans.map((p) => {
            const on = p.id === chosen;
            return (
              <Pressable key={p.id} onPress={() => setChosen(p.id)} style={[styles.plan, on && styles.planOn]} accessibilityRole="button" accessibilityState={{ selected: on }}>
                {p.id === "annual" && <Text style={styles.badge}>BEST VALUE · 7 DAYS FREE</Text>}
                <Text style={styles.planTitle}>
                  {p.price} / {p.period}
                </Text>
                <Text style={styles.planSub}>{p.perWeek ? `${p.perWeek} a week` : `${p.trialDays}-day free trial`}</Text>
              </Pressable>
            );
          })}
        </View>

        {plan && (
          <View style={styles.timeline}>
            <Text style={styles.tlTitle}>HOW YOUR FREE TRIAL WORKS</Text>
            <Text style={styles.tlRow}>
              <Text style={styles.tlBold}>Today</Text> · everything unlocked, your first stone laid
            </Text>
            <Text style={styles.tlRow}>
              <Text style={styles.tlBold}>Day {Math.max(1, plan.trialDays - 1)}</Text> · we remind you before you’re charged
            </Text>
            <Text style={styles.tlRow}>
              <Text style={styles.tlBold}>Day {plan.trialDays}</Text> · membership begins. Cancel anytime in Settings
            </Text>
          </View>
        )}

        <Pressable onPress={start} disabled={busy || !plan} style={({ pressed }) => [styles.cta, pressed && { transform: [{ scale: 0.98 }] }]} accessibilityRole="button">
          <Text style={styles.ctaText}>{busy ? "One moment…" : plan ? `Start my ${plan.trialDays} free days` : "Loading…"}</Text>
        </Pressable>
        <Text style={styles.fine}>{plan ? `Then ${plan.price} per ${plan.period}. Cancel anytime.` : ""}</Text>

        <View style={styles.links}>
          <Pressable onPress={doRestore} style={styles.link} accessibilityRole="button"><Text style={styles.linkText}>Restore</Text></Pressable>
          <Pressable onPress={() => Linking.openURL(TERMS_URL)} style={styles.link} accessibilityRole="link"><Text style={styles.linkText}>Terms</Text></Pressable>
          <Pressable onPress={() => Linking.openURL(PRIVACY_URL)} style={styles.link} accessibilityRole="link"><Text style={styles.linkText}>Privacy</Text></Pressable>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  root: { paddingHorizontal: 24 },
  close: { alignSelf: "flex-end", width: 44, height: 44, alignItems: "center", justifyContent: "center", marginRight: -10 },
  closeText: { color: colors.muted, fontSize: 18 },
  glow: { alignSelf: "center", width: 72, height: 72, borderRadius: 36, backgroundColor: colors.gold400, shadowColor: "#ffd68c", shadowOpacity: 0.9, shadowRadius: 40, marginBottom: 18, opacity: 0.9 },
  eyebrow: { color: colors.gold300, fontFamily: fonts.sansBold, fontSize: 12, letterSpacing: 3, textAlign: "center" },
  title: { color: colors.cream50, fontFamily: fonts.serif, fontSize: 32, textAlign: "center", marginTop: 8 },
  list: { marginTop: 22, gap: 12 },
  row: { flexDirection: "row", gap: 12, alignItems: "flex-start" },
  check: { color: colors.gold400, fontFamily: fonts.sansBold, fontSize: 16, width: 18 },
  rowText: { flex: 1, color: colors.cream50, fontFamily: fonts.sans, fontSize: 15, lineHeight: 22 },
  plans: { flexDirection: "row", gap: 10, marginTop: 24 },
  plan: { flex: 1, padding: 14, borderRadius: 18, borderWidth: 1, borderColor: "rgba(240,214,154,0.25)", backgroundColor: "rgba(16,35,74,0.5)", minHeight: 96, justifyContent: "flex-end" },
  planOn: { borderWidth: 2, borderColor: colors.gold400, backgroundColor: "rgba(217,171,63,0.14)" },
  badge: { color: colors.gold300, fontFamily: fonts.sansBold, fontSize: 10, letterSpacing: 1, marginBottom: 6 },
  planTitle: { color: colors.cream50, fontFamily: fonts.sansBold, fontSize: 17 },
  planSub: { color: colors.muted, fontFamily: fonts.sans, fontSize: 13, marginTop: 2 },
  timeline: { marginTop: 18, padding: 16, borderRadius: 18, backgroundColor: "rgba(16,35,74,0.6)", gap: 8 },
  tlTitle: { color: colors.gold300, fontFamily: fonts.sansBold, fontSize: 11, letterSpacing: 2, marginBottom: 4 },
  tlRow: { color: colors.cream50, fontFamily: fonts.sans, fontSize: 14, lineHeight: 20 },
  tlBold: { fontFamily: fonts.sansBold },
  cta: { marginTop: 20, minHeight: 58, borderRadius: 999, backgroundColor: colors.gold500, alignItems: "center", justifyContent: "center", shadowColor: "#ffd68c", shadowOpacity: 0.5, shadowRadius: 20 },
  ctaText: { color: colors.navy950, fontFamily: fonts.sansBold, fontSize: 18 },
  fine: { color: colors.muted, fontFamily: fonts.sans, fontSize: 12, textAlign: "center", marginTop: 10 },
  links: { flexDirection: "row", justifyContent: "center", gap: 22, marginTop: 10 },
  link: { minHeight: 44, justifyContent: "center" },
  linkText: { color: colors.muted, fontFamily: fonts.sansMedium, fontSize: 13, textDecorationLine: "underline" },
});
