import { useCallback, useState } from "react";
import { ActionSheetIOS, ActivityIndicator, Alert, FlatList, Pressable, RefreshControl, StyleSheet, Text, View } from "react-native";
import { useFocusEffect } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as Haptics from "expo-haptics";
import { SITE, listPrayers, timeAgo, type PrayerRequest } from "@/lib/api";
import { hideRequest, loadHidden } from "@/lib/hidden";
import { colors, fonts } from "@/theme";

/**
 * The prayer forum, shared with oneprayer.church. Reading is live today. "I Prayed" and
 * posting open the site in an in-app browser until mobile sign-in is added to the server.
 * Every request can be hidden or reported (requests are also moderated on the server).
 */
const open = (path: string) => WebBrowser.openBrowserAsync(`${SITE}${path}`, { presentationStyle: WebBrowser.WebBrowserPresentationStyle.PAGE_SHEET });

export default function Pray() {
  const insets = useSafeAreaInsets();
  const [items, setItems] = useState<PrayerRequest[]>([]);
  const [hidden, setHidden] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setError(null);
    try {
      const [page, h] = await Promise.all([listPrayers(), loadHidden()]);
      setItems(page.items);
      setHidden(h);
    } catch {
      setError("We couldn’t load prayer requests. Check your connection and try again.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  // Refresh whenever the tab comes into view.
  useFocusEffect(
    useCallback(() => {
      load();
    }, [load]),
  );

  const prayFor = (p: PrayerRequest) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    open(`/prayers/${p.id}`);
  };

  const more = (p: PrayerRequest) => {
    ActionSheetIOS.showActionSheetWithOptions(
      { options: ["Report this request", "Hide this request", "Cancel"], destructiveButtonIndex: 0, cancelButtonIndex: 2, title: p.title },
      async (i) => {
        if (i === 0) {
          setHidden(await hideRequest(p.id));
          Alert.alert("Thank you", "This request is hidden for you. Tell our moderators what’s wrong and they will review it.", [
            { text: "Not now", style: "cancel" },
            { text: "Contact moderators", onPress: () => open(`/contact?subject=${encodeURIComponent(`Report: prayer request ${p.id}`)}`) },
          ]);
        } else if (i === 1) {
          setHidden(await hideRequest(p.id));
        }
      },
    );
  };

  const visible = items.filter((p) => !hidden.includes(p.id));

  return (
    <View style={[styles.root, { paddingTop: insets.top + 16 }]}>
      <Text style={styles.eyebrow}>PRAY FOR SOMEONE TODAY</Text>
      <Text style={styles.title} accessibilityRole="header" maxFontSizeMultiplier={1.4}>
        You don&apos;t have to pray alone
      </Text>
      {error && visible.length > 0 && <Text style={styles.banner}>{error}</Text>}
      <FlatList
        data={visible}
        keyExtractor={(p) => p.id}
        contentContainerStyle={{ padding: 20, paddingBottom: 40, gap: 12 }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => {
              setRefreshing(true);
              load();
            }}
            tintColor={colors.gold300}
          />
        }
        ListEmptyComponent={
          loading ? (
            <ActivityIndicator color={colors.gold300} style={{ marginTop: 30 }} />
          ) : error ? (
            <View style={styles.emptyBox}>
              <Text style={styles.empty}>{error}</Text>
              <Pressable onPress={load} style={styles.retry} accessibilityRole="button">
                <Text style={styles.retryText}>Try again</Text>
              </Pressable>
            </View>
          ) : (
            <Text style={styles.empty}>Be the first to share a prayer request.</Text>
          )
        }
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.metaRow}>
              <Text style={styles.meta}>
                {item.isAnonymous ? "Anonymous" : item.displayName ?? "A member"} · {timeAgo(item.createdAt)}
              </Text>
              <Pressable onPress={() => more(item)} style={styles.moreBtn} accessibilityRole="button" accessibilityLabel="Report or hide this request">
                <Text style={styles.moreText}>•••</Text>
              </Pressable>
            </View>
            <Text style={styles.cardTitle}>{item.title}</Text>
            <Text style={styles.body} numberOfLines={5}>
              {item.body}
            </Text>
            <View style={styles.row}>
              <Text style={styles.count}>{item.prayedCount > 0 ? `${item.prayedCount} praying` : "Be the first to pray"}</Text>
              <Pressable onPress={() => prayFor(item)} style={styles.prayBtn} accessibilityRole="button" accessibilityLabel={`I prayed for ${item.title}`}>
                <Text style={styles.prayText}>I Prayed</Text>
              </Pressable>
            </View>
          </View>
        )}
        ListFooterComponent={
          <View>
            <Pressable onPress={() => open("/prayers/new")} style={styles.share} accessibilityRole="button">
              <Text style={styles.shareText}>Share a prayer request</Text>
            </Pressable>
            <View style={styles.links}>
              <Pressable onPress={() => open("/guidelines")} style={styles.link} accessibilityRole="link">
                <Text style={styles.linkText}>Community guidelines</Text>
              </Pressable>
              <Pressable onPress={() => open("/contact")} style={styles.link} accessibilityRole="link">
                <Text style={styles.linkText}>Contact</Text>
              </Pressable>
            </View>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.navy950 },
  eyebrow: { color: colors.gold300, fontFamily: fonts.sansBold, fontSize: 12, letterSpacing: 2.5, paddingHorizontal: 20 },
  title: { color: colors.cream50, fontFamily: fonts.serif, fontSize: 32, paddingHorizontal: 20, marginTop: 4 },
  banner: { color: colors.gold300, fontFamily: fonts.sans, fontSize: 13, paddingHorizontal: 20, marginTop: 8 },
  emptyBox: { alignItems: "center", marginTop: 30, gap: 14 },
  empty: { color: colors.muted, fontFamily: fonts.sans, fontSize: 15, lineHeight: 22, textAlign: "center", marginTop: 30 },
  retry: { minHeight: 44, paddingHorizontal: 22, borderRadius: 999, backgroundColor: colors.gold500, justifyContent: "center" },
  retryText: { color: colors.navy950, fontFamily: fonts.sansBold, fontSize: 15 },
  card: { borderRadius: 20, padding: 16, backgroundColor: colors.navy900, borderWidth: 1, borderColor: "rgba(240,214,154,0.14)" },
  metaRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  meta: { color: colors.muted, fontFamily: fonts.sans, fontSize: 13, flexShrink: 1 },
  moreBtn: { minWidth: 44, minHeight: 44, alignItems: "flex-end", justifyContent: "center", marginVertical: -10 },
  moreText: { color: colors.muted, fontSize: 16, letterSpacing: 1 },
  cardTitle: { color: colors.cream50, fontFamily: fonts.sansBold, fontSize: 17, marginTop: 2 },
  body: { color: "rgba(253,248,236,0.9)", fontFamily: fonts.sans, fontSize: 15, lineHeight: 22, marginTop: 6 },
  row: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: 14 },
  count: { color: colors.gold300, fontFamily: fonts.sansMedium, fontSize: 14 },
  prayBtn: { minHeight: 44, paddingHorizontal: 18, borderRadius: 999, borderWidth: 1.5, borderColor: colors.gold400, justifyContent: "center" },
  prayText: { color: colors.gold300, fontFamily: fonts.sansBold, fontSize: 14 },
  share: { marginTop: 8, minHeight: 52, borderRadius: 999, backgroundColor: colors.gold500, alignItems: "center", justifyContent: "center" },
  shareText: { color: colors.navy950, fontFamily: fonts.sansBold, fontSize: 16 },
  links: { flexDirection: "row", justifyContent: "center", gap: 18, marginTop: 10 },
  link: { minHeight: 44, justifyContent: "center" },
  linkText: { color: colors.muted, fontFamily: fonts.sans, fontSize: 13, textDecorationLine: "underline" },
});
