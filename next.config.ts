import type { NextConfig } from "next";

/**
 * Deployment: Vercel serves the whole site. Truehost holds the domain, DNS and
 * the mailboxes only — point createch.co.ke at Vercel and leave the MX records
 * alone, or anvi@createch.co.ke stops working.
 *
 * Images: we keep pre-built WebP variants (scripts/build-image-variants.mjs +
 * lib/image-loader.ts) rather than Vercel's on-demand optimizer. They are
 * already generated, cost nothing per request, and keep the site portable if it
 * ever moves hosts again. To switch to Vercel's optimizer instead, delete the
 * `loader`/`loaderFile` lines below — the <Image> call sites need no changes.
 *
 * The security headers here replace the .htaccess that an Apache host would
 * have used. Unlike a static export, `headers()` works on Vercel.
 */
const IMAGE_WIDTHS = [640, 1280, 1920];

const SECURITY_HEADERS = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
  },
  {
    key: "Strict-Transport-Security",
    value: "max-age=31536000; includeSubDomains",
  },
  {
    // next/font self-hosts Fraunces and Inter, so the page needs no third-party
    // origins. Vercel Analytics and Speed Insights are served from /_vercel/*
    // on this same origin, so 'self' covers them too.
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline'",
      "style-src 'self' 'unsafe-inline'",
      "font-src 'self'",
      "img-src 'self' data:",
      "connect-src 'self'",
      "form-action 'self'",
      "frame-ancestors 'self'",
      "base-uri 'self'",
      "object-src 'none'",
    ].join("; "),
  },
];

const nextConfig: NextConfig = {
  images: {
    loader: "custom",
    loaderFile: "./lib/image-loader.ts",
    deviceSizes: IMAGE_WIDTHS,
    imageSizes: [],
  },

  async headers() {
    return [
      { source: "/:path*", headers: SECURITY_HEADERS },
      {
        // the photographs are addressed by name, so a long life is safe
        source: "/images/:path*",
        headers: [
          { key: "Cache-Control", value: "public, max-age=15552000, immutable" },
        ],
      },
    ];
  },
};

export default nextConfig;
