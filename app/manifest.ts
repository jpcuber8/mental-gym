import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Mental Gym",
    short_name: "Mental Gym",
    description: "A private NCAA cross country mental performance app.",
    start_url: "/",
    display: "standalone",
    background_color: "#f8fafc",
    theme_color: "#0f172a",
    icons: [
      {
        src: "/webappicon.png",
        sizes: "1254x1254",
        type: "image/png",
        purpose: "any"
      },
      {
        src: "/webappicon.png",
        sizes: "1254x1254",
        type: "image/png",
        purpose: "maskable"
      }
    ]
  };
}
