/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
      remotePatterns: [
        {
          protocol: "https",
          hostname: "miro.medium.com",
          pathname: "/**",  // Matches any path under the domain
        },
        {
          protocol: "https",
          hostname: "medium.com",
          pathname: "/**",  // Matches any path under the domain
        },
        {
          protocol: "https",
          hostname: "img.freepik.com",
          pathname: "/**",  // Matches any path under the domain
        },
        {
          protocol: "https",
          hostname: "python-cnku.onrender.com",
          pathname: "/**",  // Matches any path under the domain
        },
        {
          protocol: "http",
          hostname: "localhost",
          port:"3001",
          pathname: "/proxy_image",  // Matches any path under the domain
        },
      ],
    },
};
export default nextConfig;
