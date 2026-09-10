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
        pathname: "/Banner.png",
      },
    ],
  },
};

export default nextConfig;
