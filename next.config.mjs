const useProxy = process.env.USE_PROXY == undefined
/** @type {import('next').NextConfig} */
const nextConfig = {
    // reactStrictMode: true,
    // assetPrefix: useProxy ? "/editor-static" : ""
    async redirects() {
        return [{
            source: "/dashboard/templates/:path*",
            destination: "http://localhost:3001/dashboard/templates/:path*",
            permanent: false
        }]
    },
    async headers() {
        return [
            {
                source: '/:path*/uploads/:path*',
                headers: [
                    {
                        key: 'Access-Control-Allow-Origin',
                        value: '*'
                    },
                    {
                        key: 'Access-Control-Allow-Methods',
                        value: 'GET, PUT, POST, DELETE, OPTIONS'
                    },
                ]
            }
        ]
    }
};

export default nextConfig;
