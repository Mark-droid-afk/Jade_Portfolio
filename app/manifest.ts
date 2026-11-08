import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Mark Jade D. Gurrobat",
    short_name: "Mark Jade",
    description: "Portfolio of Mark Jade D. Gurrobat, BSIT student and full-stack developer.",
    start_url: "/home",
    display: "standalone",
    background_color: "#04201A",
    theme_color: "#04201A",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
      { src: "/icon-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
