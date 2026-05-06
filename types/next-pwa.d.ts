declare module "next-pwa" {
  import { NextConfig } from "next";
  
  function withPWA(config: NextConfig): NextConfig;
  
  export default function withPWAInit(options: {
    dest?: string;
    disable?: boolean;
    register?: boolean;
    scope?: string;
    sw?: string;
    skipWaiting?: boolean;
    [key: string]: unknown;
  }): typeof withPWA;
}
