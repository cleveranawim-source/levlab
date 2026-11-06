/** @type {import('next').NextConfig} */
const nextConfig = {
  // App Store links use both forms. Serve both without a redirect round trip.
  skipTrailingSlashRedirect: true,
  async rewrites() {
    return [
      { source: "/gangdannote/:page(support|privacy)", destination: "/gangdannote/:page/index.html" },
      { source: "/gangdannote/:page(support|privacy)/", destination: "/gangdannote/:page/index.html" },
    ];
  },
};

export default nextConfig;
