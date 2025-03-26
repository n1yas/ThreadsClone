/** @type {import('next').NextConfig} */
const nextConfig = {
    async rewrites(){
        return[
            {
                source:'/api/external/:path*',
                destination:'http://social-media-rest-apis-1.onrender.com/api/:path*'
            }
        ];
    }
};

export default nextConfig;
