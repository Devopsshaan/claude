import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import * as WebBrowser from "expo-web-browser";
import { SITE } from "@/lib/api";
import { LinearGradient } from "expo-linear-gradient";
import { SymbolView } from "expo-symbols";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { colors, fonts } from "@/theme";

/**
 * ONE PRAYER Membership. Prayer stays free for everyone, as the website promises;
 * membership adds the premium tools. Purchasing is wired up with RevenueCat in the
 * next step, so this screen shows the offer without a buy button yet.
 */
const BENEFITS = [
  { icon: "book.pages", title: "Ask the Bible", text: "Answers built only on real verses, with the reference every time." },
  { icon: "hands.sparkles", title: "Pray for yourself", text: "Say what’s on your heart and receive a personal prayer built on Scripture." },
  { icon: "heart.text.square", title: "Pray for others, with words", text: "When you pray for someone, receive a prayer written for their need." },
  { icon: "headphones", title: "Premium audio", text: "Bible chapters and guided prayers to listen to offline." },
  { icon: "sparkles", title: "A new guided challenge every month", text: "Lent, Advent, New Year and more." },
] as const;

const ABOUT = [
  { label: "Privacy policy", path: "/privacy" },
  { label: "Terms of service", path: "/terms" },
  { label: "Community guidelines", path: "/guidelines" },
  { label: "Contact us", path: "/contact" },
];

const FREE = ["Sharing prayer requests", "Being prayed for and praying for others", "Live prayer room", "Your Word for Today", "Reading the whole Bible"];

export default function Membership() {
  const insets = useSafeAreaInsets();
  return (
    <LinearGradient colors={[colors.navy950, "#1a2c55"]} style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={{ paddingTop: insets.top + 24, paddingHorizontal: 20, paddingBottom: 40 }}>
        <Text style={styles.eyebrow}>ONE PRAYER MEMBERSHIP</Text>
        <Text style={styles.title} accessibilityRole="header" maxFontSizeMultiplier={1.4}>
          Go deeper, every day
        </Text>
        <Text style={styles.sub}>Prayer on ONE PRAYER stays free for everyone. Membership adds tools to help you pray and understand Scripture.</Text>

        <View style={styles.card}>
          {BENEFITS.map((b) => (
            <View key={b.title} style={styles.benefit}>
              <SymbolView name={b.icon} tintColor={colors.gold400} size={26} />
              <View style={{ flex: 1 }}>
                <Text style={styles.bTitle}>{b.title}</Text>
                <Text style={styles.bText}>{b.text}</Text>
              </View>
            </View>
          ))}
        </View>

        <View style={styles.soon}>
          <Text style={styles.soonText}>Membership opens soon in the app.</Text>
        </View>

        <Text style={styles.section}>ALWAYS FREE, FOR EVERYONE</Text>
        {FREE.map((f) => (
          <Text key={f} style={styles.free}>
            ✓  {f}
          </Text>
        ))}
        <Text style={styles.small}>Membership never buys priority for prayer requests, and no prayer or outcome is promised in exchange for payment.</Text>

        <Text style={styles.section}>ABOUT ONE PRAYER</Text>
        {ABOUT.map((a) => (
          <Pressable key={a.path} onPress={() => WebBrowser.openBrowserAsync(`${SITE}${a.path}`)} style={styles.aboutRow} accessibilityRole="link">
            <Text style={styles.aboutText}>{a.label}</Text>
          </Pressable>
        ))}
        <Text style={styles.small}>Scripture quotations from the World English Bible (public domain).</Text>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  eyebrow: { color: colors.gold300, fontFamily: fonts.sansBold, fontSize: 12, letterSpacing: 2.5 },
  title: { color: colors.cream50, fontFamily: fonts.serif, fontSize: 36, marginTop: 4 },
  sub: { color: "rgba(253,248,236,0.88)", fontFamily: fonts.sans, fontSize: 15, lineHeight: 22, marginTop: 8 },
  card: { marginTop: 22, borderRadius: 24, padding: 18, gap: 18, backgroundColor: "rgba(16,35,74,0.8)", borderWidth: 1, borderColor: "rgba(240,214,154,0.2)" },
  benefit: { flexDirection: "row", gap: 14, alignItems: "flex-start" },
  bTitle: { color: colors.cream50, fontFamily: fonts.sansBold, fontSize: 16 },
  bText: { color: colors.muted, fontFamily: fonts.sans, fontSize: 14, lineHeight: 20, marginTop: 2 },
  soon: { marginTop: 18, minHeight: 54, borderRadius: 999, backgroundColor: "rgba(217,171,63,0.18)", borderWidth: 1, borderColor: colors.gold500, alignItems: "center", justifyContent: "center" },
  soonText: { color: colors.gold300, fontFamily: fonts.sansBold, fontSize: 15 },
  section: { color: colors.gold300, fontFamily: fonts.sansBold, fontSize: 12, letterSpacing: 2.5, marginTop: 28, marginBottom: 10 },
  free: { color: colors.cream50, fontFamily: fonts.sans, fontSize: 15, lineHeight: 26 },
  aboutRow: { minHeight: 44, justifyContent: "center", borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: "rgba(240,214,154,0.2)" },
  aboutText: { color: colors.cream50, fontFamily: fonts.sans, fontSize: 15 },
  small: { color: colors.muted, fontFamily: fonts.sans, fontSize: 12, lineHeight: 18, marginTop: 16 },
});
