/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    localPatterns: [
      {
        pathname: "/feature-*.png",
        search: "?v=2",
      },
      {
        pathname: "/skin.png",
      },
      {
        pathname: "/mobile.png",
      },
      {
        pathname: "/Banner.png",
      },
      {
        pathname: "/pdtbanner.png",
      },
      {
        pathname: "/pdt*.png",
      },
    ],
  },
};

export default nextConfig;
