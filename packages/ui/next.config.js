/** @type {import('next').NextConfig} */

const REST_API =
  process.env.NEXT_PUBLIC_AWS_REST_API || "http://localhost:5000/dev";
const nextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/chat",
        destination: `${REST_API}/chat`,
      },
      {
        source: "/api/chat/assessment",
        destination: `${REST_API}/assessment`,
      },
      {
        source: "/api/chat/feedback",
        destination: `${REST_API}/feedback`,
      },
    ];
  },
};

module.exports = nextConfig;
