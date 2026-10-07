import { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, FlatList, Linking, Pressable, RefreshControl, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as Haptics from "expo-haptics";
import { SITE, listPrayers, timeAgo, type PrayerRequest } from "@/lib/api";
import { colors, fonts } from "@/theme";

/**
 * The prayer forum, shared with oneprayer.church. Reading is live today.
 * "I Prayed" and posting open the website until mobile sign-in is added to the server.
 */
export default function Pray() {
  const insets = useSafeAreaInsets();
  const [items, setItems] = useState<PrayerRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setError(null);
    try {
      setItems((await listPrayers()).items);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not load prayer requests.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const prayFor = (p: PrayerRequest) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Linking.openURL(`${SITE}/prayers/${p.id}`);
  };

  return (
    <View style={[styles.root, { paddingTop: insets.top + 16 }]}>
      <Text style={styles.eyebrow}>PRAY FOR SOMEONE TODAY</Text>
      <Text style={styles.title}>You don&apos;t have to pray alone</Text>
      <FlatList
        data={items}
        keyExtractor={(p) => p.id}
        contentContainerStyle={{ padding: 20, paddingBottom: 40, gap: 12 }}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={load} tintColor={colors.gold300} />}
        ListEmptyComponent={
          loading ? (
            <ActivityIndicator color={colors.gold300} />
          ) : (
            <Text style={styles.empty}>{error ?? "Be the first to share a prayer request."}</Text>
          )
        }
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.meta}>
              {item.isAnonymous ? "Anonymous" : item.displayName ?? "A member"} · {timeAgo(item.createdAt)}
            </Text>
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
          <Pressable onPress={() => Linking.openURL(`${SITE}/prayers/new`)} style={styles.share} accessibilityRole="button">
            <Text style={styles.shareText}>Share a prayer request</Text>
          </Pressable>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.navy950 },
  eyebrow: { color: colors.gold300, fontFamily: fonts.sansBold, fontSize: 12, letterSpacing: 2.5, paddingHorizontal: 20 },
  title: { color: colors.cream50, fontFamily: fonts.serif, fontSize: 32, paddingHorizontal: 20, marginTop: 4 },
  empty: { color: colors.muted, fontFamily: fonts.sans, fontSize: 15, textAlign: "center", marginTop: 30 },
  card: { borderRadius: 20, padding: 16, backgroundColor: colors.navy900, borderWidth: 1, borderColor: "rgba(240,214,154,0.14)" },
  meta: { color: colors.muted, fontFamily: fonts.sans, fontSize: 13 },
  cardTitle: { color: colors.cream50, fontFamily: fonts.sansBold, fontSize: 17, marginTop: 6 },
  body: { color: "rgba(253,248,236,0.9)", fontFamily: fonts.sans, fontSize: 15, lineHeight: 22, marginTop: 6 },
  row: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: 14 },
  count: { color: colors.gold300, fontFamily: fonts.sansMedium, fontSize: 14 },
  prayBtn: { minHeight: 40, paddingHorizontal: 16, borderRadius: 999, borderWidth: 1.5, borderColor: colors.gold400, justifyContent: "center" },
  prayText: { color: colors.gold300, fontFamily: fonts.sansBold, fontSize: 14 },
  share: { marginTop: 8, minHeight: 52, borderRadius: 999, backgroundColor: colors.gold500, alignItems: "center", justifyContent: "center" },
  shareText: { color: colors.navy950, fontFamily: fonts.sansBold, fontSize: 16 },
});
