/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  allowedDevOrigins: [
    'localhost:8000',
    '127.0.0.1:8000',
    '192.168.137.125:8000',
    '192.168.10.2:8000',
  ],
};

export default nextConfig;
