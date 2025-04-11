import type { NextConfig } from "next";
import dotenv from 'dotenv';
import dotenvExpand from 'dotenv-expand';

const config = dotenv.config();
dotenvExpand.expand(config);

const nextConfig: NextConfig = {
  env:{
    OPENROUTER_API_KEY: process.env.NEXT_PUBLIC_OPENROUTER_API_KEY,
    OPENROUTER_URL: process.env.NEXT_PUBLIC_OPENROUTER_URL,
  }
};

export default nextConfig;
