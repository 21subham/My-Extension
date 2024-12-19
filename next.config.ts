import path from "path";
import { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  typescript: {
    ignoreBuildErrors: true,
  },
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.target = "web";
    }

    config.output = {
      ...config.output,
      filename: "[name].js", // Change filename structure for extension
      chunkFilename: "[name].js", // Same for chunks
    };

    config.module.rules.push({
      test: /\.json$/,
      type: "asset/resource",
      include: [path.resolve(__dirname, "public")],
    });

    return config;
  },
  distDir: "chrome-extension",
  exportTrailingSlash: true,
  output: "export",
};

export default nextConfig;
