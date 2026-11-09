import type { Metadata } from "next";
import { getPlace } from "@/lib/brt-local";
import PlaceBoard from "./place-board";

interface PlacePageProps {
  params: {
    slug: string;
  };
}

export function generateMetadata({ params }: PlacePageProps): Metadata {
  const place = getPlace(params.slug);
  if (!place) {
    return { title: "Place not found" };
  }
  return {
    title: place.name,
  };
}

export default function PlacePage({ params }: PlacePageProps) {
  return <PlaceBoard slug={params.slug} />;
}
