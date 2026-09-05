//1import Image from "next/image";
//import Hero from "@/components/home/Hero";
//import ValueProposition from "@/components/home/ValueProposition";
//import Testimonials from "@/components/home/Testimonials";
import type { Metadata } from "next";
import { buildMetadata } from "@/lib/metadata";
import HomeContainer from "./HomeContainer";
import React from "react"; // Import React

type tParams = Promise<{ locale: string }>;

export async function generateMetadata({
  params,
}: {
  params: tParams;
}): Promise<Metadata> {
  const { locale } = await params;
  const isEs = locale === "es";

  const title = isEs
    ? "Artesanías con propósito en Costa Rica — espejos, chorreadores y regalos únicos"
    : "Handmade with purpose from Costa Rica — mirrors, coffee drippers & unique gifts";

  const description = isEs
    ? "Compra arte hecho a mano con calidad real. Espejos, chorreadores y piezas únicas. Envíos en todo el país. Cada compra apoya la reinserción social."
    : "Shop handmade mirrors, coffee drippers and one-of-a-kind pieces. Fast shipping. Every purchase supports social reintegration.";

  return await buildMetadata({
    locale: isEs ? "es" : "en",
    pathname: `/${locale}`,
    title,
    description,
  });
}

export default async function Home({ params }: { params: tParams }) {
  const { locale } = await params;
  return <HomeContainer locale={locale.toString()} />;
}
