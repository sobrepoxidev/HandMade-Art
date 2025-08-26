import AccountClient from "@/components/account/AccountClient";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { buildMetadata } from "@/lib/metadata";

type tParams = Promise<{ id: string, locale: string }>;

export async function generateMetadata({ params }: { params: tParams }): Promise<Metadata> {
  const { locale } = await params;
  const currentLocale = locale === "es" ? "es" : "en";
  
  const pageTitle = currentLocale === 'es' ? 'Mi Cuenta' : 'My Account';

  return buildMetadata({
    locale: currentLocale,
    pathname: `/${locale}/account`,
    title: pageTitle,
  });
}


export default async function Account() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const { data: userProfile } = await supabase
    .from("user_profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  return <AccountClient user={user} initialProfile={userProfile} />;
}
