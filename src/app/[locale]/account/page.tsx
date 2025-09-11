// src/app/[locale]/account/page.tsx
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import type { Database } from "@/types-db";
import AccountClient from "@/components/account/AccountClient";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type tParams = Promise<{ locale: string }>;

export default async function AccountPage({ params }: {
  params: tParams;
}) {
  const supabase = createServerComponentClient<Database>({ cookies });
  const { data: { user } } = await supabase.auth.getUser();
  const { locale } = await params;

  if (!user) {
    // preserva el idioma y vuelve a /account tras iniciar sesión
    redirect(`/${locale}/login?returnUrl=/${locale}/account`);
  }

  const { data: userProfile } = await supabase
    .from("user_profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  return <AccountClient user={user} initialProfile={userProfile} />;
}
