/** @type {import('next').NextConfig} */

const REST_API = process.env.NEXT_PUBLIC_AWS_REST_API || "http://localhost:5000/dev"
const nextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/chat",
        destination: `${REST_API}/chat`,
      },
    ];
  },
}

module.exports = nextConfig
