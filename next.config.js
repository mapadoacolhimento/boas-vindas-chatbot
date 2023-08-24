/** @type {import('next').NextConfig} */
const nextConfig = {
  rewrites: async () => {
    return [
      {
        source: '/api/:path*',
        destination:
          process.env.NODE_ENV === 'development'
            ? 'http://127.0.0.1:5328/api/:path*'
            : '/api/',
      },
    ]
  },
}
module.exports = {
  webpack(config) {
    config.module.rules.push({
      test: /.svg$/,
      issuer: {
        test: /.(js|ts)x?$/,
      },
      use: ['@svgr/webpack'],
    })

    return config
  },
}

module.exports = nextConfig
