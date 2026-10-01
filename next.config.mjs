/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    localPatterns: [
      {
        pathname: "/feature-*.png",
      },
      {
        pathname: "/mobile.png",
      },
      {
        pathname: "/pdt*.png",
      },
      {
        pathname: "/products-bg.jpg",
      },
    ],
  },
};

export default nextConfig;
