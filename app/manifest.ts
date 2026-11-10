import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "BRT Lagos (unofficial demo)",
    short_name: "BRT Lagos",
    description: "Classic minimal BRT Lagos departures, flat fares, and bus stop guide",
    start_url: "/",
    display: "standalone",
    background_color: "#FFFFFF",
    theme_color: "#1558B0",
    orientation: "portrait",
    icons: [
      {
        src: "/icons/192",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/512",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/maskable",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}

