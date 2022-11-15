/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ["avatars.dicebear.com", "pzibwpunxuyxxnigfthq.nhost.run"],
  },
};

module.exports = nextConfig;
