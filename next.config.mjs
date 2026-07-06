/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {},
  output: "export",
  trailingSlash: true,
  // Disable the built-in file watcher to avoid EMFILE errors on macOS
  // when the system open-file-descriptor limit is too low.
  // Run `launchctl limit maxfiles 65536 200000` or `ulimit -n 65536` to fix permanently.
  webpack: (config, { dev }) => {
    if (dev) {
      config.watchOptions = {
        poll: 1000,
        aggregateTimeout: 300,
      };
    }
    return config;
  },
};

export default nextConfig;
