import { createHash, randomBytes } from "crypto";
import { NextRequest } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { supabaseServer } from "@/lib/supabaseServer";
import { CheckoutOrderRow } from "@/lib/checkout/types";

const AUTHORIZED_ADMINS = new Set(["sobrepoxidev@gmail.com", "bryamlopez4@gmail.com"]);

export function createCheckoutToken() {
  const token = randomBytes(32).toString("base64url");
  return {
    token,
    hash: hashCheckoutToken(token),
  };
}

export function hashCheckoutToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

export function getBearerOrQueryToken(request: NextRequest) {
  const authorization = request.headers.get("authorization");
  if (authorization?.startsWith("Bearer ")) {
    return authorization.slice("Bearer ".length).trim();
  }

  return new URL(request.url).searchParams.get("token");
}

export async function getSessionUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return user;
}

export async function assertAdminRequest() {
  const user = await getSessionUser();
  if (!user?.email || !AUTHORIZED_ADMINS.has(user.email)) {
    throw new Error("Unauthorized admin request");
  }

  return user;
}

export async function getAuthorizedOrder(orderId: number, checkoutToken?: string | null) {
  const user = await getSessionUser();
  const { data: order, error } = await supabaseServer
    .from("orders")
    .select("*")
    .eq("id", orderId)
    .single();

  if (error || !order) {
    return { order: null, user, authorized: false, reason: "not_found" as const };
  }

  const checkoutOrder = order as CheckoutOrderRow;

  if (user?.id && checkoutOrder.user_id === user.id) {
    return { order: checkoutOrder, user, authorized: true, reason: "user" as const };
  }

  if (checkoutToken && checkoutOrder.checkout_token_hash) {
    const tokenMatches = hashCheckoutToken(checkoutToken) === checkoutOrder.checkout_token_hash;
    const tokenActive = checkoutOrder.checkout_token_expires_at
      ? new Date(checkoutOrder.checkout_token_expires_at).getTime() > Date.now()
      : false;

    if (tokenMatches && tokenActive) {
      return { order: checkoutOrder, user, authorized: true, reason: "token" as const };
    }
  }

  return { order: checkoutOrder, user, authorized: false, reason: "forbidden" as const };
}

