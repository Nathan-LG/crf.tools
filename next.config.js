/** @type {import('next').NextConfig} */
module.exports = {
  output: "standalone",

  async redirects() {
    return [
      {
        source: "/auth/signin",
        has: [
          {
            type: "cookie",
            key: "authjs.session-token",
          },
        ],
        permanent: false,
        destination: "/dashboard",
      },
      {
        source: "/",
        has: [
          {
            type: "cookie",
            key: "authjs.session-token",
          },
        ],
        permanent: false,
        destination: "/dashboard",
      },
      {
        source: "/",
        missing: [
          {
            type: "cookie",
            key: "authjs.session-token",
          },
        ],
        permanent: false,
        destination: "/auth/signin",
      },
    ];
  },
};
