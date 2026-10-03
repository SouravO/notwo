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
        pathname: "/sideimg.png",
      },
      {
        pathname: "/sideimg1.png",
      },
      {
        pathname: "/brand.png",
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
