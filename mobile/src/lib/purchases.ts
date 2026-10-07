import { Platform } from "react-native";
import Constants from "expo-constants";

/**
 * Membership via RevenueCat. The native module isn't in Expo Go, so in Expo Go (and on
 * web previews) this falls back to a mock that shows the paywall and "buys" locally,
 * which lets the whole flow be tested before the App Store build.
 *
 * Set the public SDK key in app.json → expo.extra.revenueCatIosKey (it is safe to ship).
 */
export type Plan = { id: string; title: string; price: string; period: "year" | "week"; perWeek?: string; trialDays: number; pkg?: unknown };

const ENTITLEMENT = "sanctuary";
const inExpoGo = Constants.appOwnership === "expo" || Platform.OS === "web";

let Purchases: typeof import("react-native-purchases").default | null = null;
if (!inExpoGo) {
  try {
    Purchases = require("react-native-purchases").default;
  } catch {
    Purchases = null;
  }
}

const MOCK_PLANS: Plan[] = [
  { id: "annual", title: "Yearly", price: "$49.99", period: "year", perWeek: "$0.96", trialDays: 7 },
  { id: "weekly", title: "Weekly", price: "$5.99", period: "week", trialDays: 3 },
];
let mockMember = false;

export async function configurePurchases(): Promise<void> {
  const key = (Constants.expoConfig?.extra as { revenueCatIosKey?: string } | undefined)?.revenueCatIosKey;
  if (!Purchases || !key) return;
  Purchases.configure({ apiKey: key });
}

export async function isMember(): Promise<boolean> {
  if (!Purchases) return mockMember;
  try {
    const info = await Purchases.getCustomerInfo();
    return !!info.entitlements.active[ENTITLEMENT];
  } catch {
    return false;
  }
}

export async function loadPlans(): Promise<Plan[]> {
  if (!Purchases) return MOCK_PLANS;
  try {
    const offerings = await Purchases.getOfferings();
    const current = offerings.current;
    if (!current) return MOCK_PLANS;
    const plans: Plan[] = [];
    if (current.annual) {
      const p = current.annual.product;
      plans.push({ id: "annual", title: "Yearly", price: p.priceString, period: "year", perWeek: p.currencyCode ? `${(p.price / 52).toLocaleString(undefined, { style: "currency", currency: p.currencyCode })}` : undefined, trialDays: 7, pkg: current.annual });
    }
    if (current.weekly) {
      plans.push({ id: "weekly", title: "Weekly", price: current.weekly.product.priceString, period: "week", trialDays: 3, pkg: current.weekly });
    }
    return plans.length ? plans : MOCK_PLANS;
  } catch {
    return MOCK_PLANS;
  }
}

/** Returns true when the user is now a member (purchase done or already active). */
export async function buy(plan: Plan): Promise<boolean> {
  if (!Purchases || !plan.pkg) {
    mockMember = true;
    return true;
  }
  try {
    const result = await Purchases.purchasePackage(plan.pkg as Parameters<typeof Purchases.purchasePackage>[0]);
    return !!result.customerInfo.entitlements.active[ENTITLEMENT];
  } catch (e) {
    if ((e as { userCancelled?: boolean }).userCancelled) return false;
    throw e;
  }
}

export async function restore(): Promise<boolean> {
  if (!Purchases) return mockMember;
  const info = await Purchases.restorePurchases();
  return !!info.entitlements.active[ENTITLEMENT];
}
