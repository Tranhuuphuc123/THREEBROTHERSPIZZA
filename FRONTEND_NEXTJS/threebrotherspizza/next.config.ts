import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // 1. Cho phép NextJS load ảnh từ IP localhost
    remotePatterns: [
      {
        protocol: 'http',
        hostname: '127.0.0.1', // Dùng IP thay vì localhost để chắc chắn hơn
        port: '8080',
        pathname: '/uploads/**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8080',
        pathname: '/uploads/**',
      },
    ],
    // 2. Quan trọng: Tạm thời tắt tối ưu ảnh để bỏ qua lỗi Private IP
    unoptimized: true, 
  },
};

export default nextConfig;