/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        source: "/showcase1.png",
        headers: [{ key: "Cache-Control", value: "no-store, max-age=0" }],
      },
      {
        source: "/showcase2.png",
        headers: [{ key: "Cache-Control", value: "no-store, max-age=0" }],
      },
      {
        source: "/showcase3.png",
        headers: [{ key: "Cache-Control", value: "no-store, max-age=0" }],
      },
      {
        source: "/showcase4.png",
        headers: [{ key: "Cache-Control", value: "no-store, max-age=0" }],
      },
    ];
  },
  images: {
    localPatterns: [
      {
        pathname: "/feature-*.png",
      },
      {
        pathname: "/mobile.png",
      },
      {
        pathname: "/sideimg.png",
      },
      {
        pathname: "/sideimg1.png",
      },
      {
        pathname: "/brand.png",
      },
      {
        pathname: "/logo.png",
      },
      {
        pathname: "/pdt*.png",
      },
      {
        pathname: "/showcase*.png",
      },
      {
        pathname: "/products-bg.jpg",
      },
    ],
  },
};

export default nextConfig;
