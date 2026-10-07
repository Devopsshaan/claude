import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AppState, Pressable, ScrollView, Share, StyleSheet, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as Haptics from "expo-haptics";
import Animated, { FadeInDown, useReducedMotion } from "react-native-reanimated";
import { ScratchCard } from "@/components/ScratchCard";
import { wordForDate } from "@/lib/word";
import { loadPrayedDays, localDayNumber, markPrayedToday, rememberRevealed, revealedWordDate, streakFrom } from "@/lib/store";
import { colors, fonts } from "@/theme";

const DAY_LETTERS = ["S", "M", "T", "W", "T", "F", "S"];

export default function Today() {
  const insets = useSafeAreaInsets();
  const reduceMotion = useReducedMotion();
  // Re-read the date whenever the app comes back to the foreground, so a phone left
  // open overnight shows the new Word (covered again) and the right day.
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const sub = AppState.addEventListener("change", (s) => s === "active" && setNow(new Date()));
    return () => sub.remove();
  }, []);
  const word = useMemo(() => wordForDate(now), [now]);
  const today = localDayNumber(now);
  const [days, setDays] = useState<number[]>([]);
  const [revealed, setRevealed] = useState(false);
  const [showPrayer, setShowPrayer] = useState(false);
  const revealing = useRef(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let alive = true;
    revealing.current = false;
    setShowPrayer(false);
    Promise.all([loadPrayedDays(), revealedWordDate()]).then(([d, lastWord]) => {
      if (!alive) return;
      setDays(d);
      const done = lastWord === word.date;
      setRevealed(done);
      revealing.current = done;
      setReady(true);
    });
    return () => {
      alive = false;
    };
  }, [word.date]);

  // Runs once per Word, whether revealed by scratching or by the button.
  const onReveal = useCallback(async () => {
    if (revealing.current) return;
    revealing.current = true;
    setRevealed(true);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    await rememberRevealed(word.date);
    setDays(await markPrayedToday());
  }, [word.date]);

  const share = useCallback(() => {
    Share.share({ message: `“${word.verse.text}”\n— ${word.verse.ref} (WEB)\n\nYour Word for Today on ONE PRAYER: https://oneprayer.church/word` });
  }, [word]);

  const streak = streakFrom(days, today);
  const week = Array.from({ length: 7 }, (_, i) => today - 6 + i);

  return (
    <LinearGradient colors={[colors.navy950, colors.navy900, "#1d3a72"]} style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={[styles.page, { paddingTop: insets.top + 24, paddingBottom: 40 }]}>
        <Text style={styles.eyebrow}>ONE PRAYER</Text>
        <Text style={styles.title} accessibilityRole="header" maxFontSizeMultiplier={1.4}>
          Your Word for Today
        </Text>
        <Text style={styles.sub}>{revealed ? "Take a quiet moment with today’s Scripture." : "Take a quiet moment. Scratch below to reveal today’s Scripture."}</Text>

        <View style={styles.card}>
          <Text style={styles.cardLabel}>TODAY&apos;S SCRIPTURE</Text>
          {!ready ? (
            <View style={{ minHeight: 170 }} />
          ) : (
          <ScratchCard key={word.date} revealed={revealed} onReveal={onReveal}>
            <View style={styles.verseBox}>
              <Text style={styles.verse}>“{word.verse.text}”</Text>
              <Text style={styles.ref}>
                {word.verse.ref} <Text style={styles.refMuted}>(WEB)</Text>
              </Text>
            </View>
          </ScratchCard>
          )}
          {ready && !revealed && (
            <Pressable onPress={onReveal} style={styles.revealBtn} accessibilityRole="button">
              <Text style={styles.revealText}>Reveal it for me</Text>
            </Pressable>
          )}
        </View>

        {revealed && (
          <Animated.View entering={reduceMotion ? undefined : FadeInDown.duration(600)}>
            <View style={styles.streak}>
              <View style={{ flex: 1 }}>
                <Text style={styles.streakTitle}>
                  {streak} {streak === 1 ? "day" : "days"} with God
                </Text>
                <Text style={styles.streakSub}>You received today&apos;s Word. See you tomorrow.</Text>
              </View>
              <View style={styles.week} accessible accessibilityLabel={`Received your Word on ${week.filter((d) => days.includes(d)).length} of the last 7 days`}>
                {week.map((d) => {
                  const on = days.includes(d);
                  const letter = DAY_LETTERS[new Date(d * 86_400_000).getUTCDay()];
                  return (
                    <View key={d} style={styles.dayCol}>
                      <View style={[styles.dot, on && styles.dotOn]} />
                      <Text style={styles.dayLetter}>{letter}</Text>
                    </View>
                  );
                })}
              </View>
            </View>

            <Text style={styles.section}>A SHORT REFLECTION</Text>
            <Text style={styles.body}>{word.reflection}</Text>

            <Pressable onPress={() => setShowPrayer((v) => !v)} style={styles.primary} accessibilityRole="button">
              <Text style={styles.primaryText}>{showPrayer ? "Amen" : "Pray with this Word"}</Text>
            </Pressable>
            {showPrayer && (
              <Animated.View entering={reduceMotion ? undefined : FadeInDown.duration(400)} style={styles.prayerBox}>
                <Text style={styles.prayer}>{word.prayer}</Text>
              </Animated.View>
            )}

            <Pressable onPress={share} style={styles.secondary} accessibilityRole="button">
              <Text style={styles.secondaryText}>Share today&apos;s Word</Text>
            </Pressable>
          </Animated.View>
        )}
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  page: { paddingHorizontal: 20 },
  eyebrow: { color: colors.gold300, fontFamily: fonts.sansBold, fontSize: 13, letterSpacing: 3, textAlign: "center" },
  title: { color: colors.cream50, fontFamily: fonts.serif, fontSize: 38, textAlign: "center", marginTop: 6 },
  sub: { color: "rgba(253,248,236,0.85)", fontFamily: fonts.sans, fontSize: 15, lineHeight: 22, textAlign: "center", marginTop: 8, marginBottom: 22 },
  card: { borderRadius: 26, padding: 18, backgroundColor: "rgba(16,35,74,0.75)", borderWidth: 1, borderColor: "rgba(240,214,154,0.18)" },
  cardLabel: { color: colors.gold300, fontFamily: fonts.sansBold, fontSize: 12, letterSpacing: 2.5, marginBottom: 12 },
  verseBox: { padding: 14, minHeight: 160, justifyContent: "center" },
  verse: { color: colors.cream50, fontFamily: fonts.serifItalic, fontSize: 23, lineHeight: 32 },
  ref: { color: colors.cream50, fontFamily: fonts.sansBold, fontSize: 14, marginTop: 12 },
  refMuted: { color: colors.muted, fontFamily: fonts.sans },
  revealBtn: { marginTop: 8, alignSelf: "flex-start", minHeight: 44, justifyContent: "center", paddingRight: 12 },
  revealText: { color: colors.cream50, fontFamily: fonts.sansMedium, fontSize: 15, textDecorationLine: "underline" },
  streak: { flexDirection: "row", alignItems: "center", marginTop: 18, padding: 16, borderRadius: 20, backgroundColor: "rgba(16,35,74,0.75)", borderWidth: 1, borderColor: "rgba(240,214,154,0.18)" },
  streakTitle: { color: colors.cream50, fontFamily: fonts.sansBold, fontSize: 16 },
  streakSub: { color: colors.muted, fontFamily: fonts.sans, fontSize: 13, marginTop: 2 },
  week: { flexDirection: "row", gap: 6 },
  dayCol: { alignItems: "center", gap: 4 },
  dot: { width: 14, height: 14, borderRadius: 7, borderWidth: 1.5, borderColor: "rgba(183,192,214,0.6)" },
  dotOn: { backgroundColor: colors.gold500, borderColor: colors.gold400 },
  dayLetter: { color: colors.muted, fontFamily: fonts.sans, fontSize: 10 },
  section: { color: colors.gold300, fontFamily: fonts.sansBold, fontSize: 12, letterSpacing: 2.5, marginTop: 26, marginBottom: 8 },
  body: { color: "rgba(253,248,236,0.92)", fontFamily: fonts.sans, fontSize: 16, lineHeight: 25 },
  primary: { marginTop: 22, alignSelf: "flex-start", minHeight: 50, paddingHorizontal: 22, borderRadius: 999, backgroundColor: colors.gold500, justifyContent: "center" },
  primaryText: { color: colors.navy950, fontFamily: fonts.sansBold, fontSize: 16 },
  prayerBox: { marginTop: 14, padding: 16, borderRadius: 18, backgroundColor: "rgba(250,240,214,0.08)" },
  prayer: { color: colors.cream50, fontFamily: fonts.serifItalic, fontSize: 19, lineHeight: 28 },
  secondary: { marginTop: 14, alignSelf: "flex-start", minHeight: 46, paddingHorizontal: 18, borderRadius: 999, borderWidth: 1, borderColor: "rgba(240,214,154,0.4)", justifyContent: "center" },
  secondaryText: { color: colors.gold300, fontFamily: fonts.sansMedium, fontSize: 15 },
});
