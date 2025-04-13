/** @type {import('next').NextConfig} */
const nextConfig = {
    env: {
        // Mặc định các biến môi trường từ .env, .env.local, .env.development, .env.production
        // sẽ được tự động nạp nếu chúng có tiền tố NEXT_PUBLIC_
    },
    images: {
        domains: ['localhost'],
    },
    // Các cài đặt khác của Next.js nếu cần
    output: 'standalone', // Optimized cho deployment
};

module.exports = nextConfig; 