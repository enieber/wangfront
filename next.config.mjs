/** @type {import('next').NextConfig} */
const nextConfig = {
  staticPageGenerationTimeout: 120,
  reactStrictMode: true,
  webpack: (config) => {
    config.module.rules.push({
      test: /\.(eot|ttf|woff|woff2|svg)$/,
      use: {
        loader: 'file-loader',
        options: {
          name: '[name].[ext]',
          outputPath: 'fonts/',
        },
      },
    });
    return config;
  },
};

export default nextConfig;
