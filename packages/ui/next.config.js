/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/chat",
        destination: `${process.env.NEXT_PUBLIC_AWS_REST_API}/chat`,
      },
    ];
  },
}

module.exports = nextConfig
