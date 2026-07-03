/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.builder.io",
      },
      // add other remote patterns here if needed
    ],
  },
};

export default nextConfig;
