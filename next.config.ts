import type { NextConfig } from 'next'

/**
 * Security headers.
 *
 * A note on script-src: this CSP allows 'unsafe-inline' for scripts, which is
 * weaker than we would like. The App Router streams its hydration payload
 * through inline `self.__next_f.push(...)` scripts whose content differs per
 * page, so they cannot be allowlisted by hash at config time. (The theme script
 * in layout.tsx is static and hashable; Next's own are not.)
 *
 * The strict alternative is a per-request nonce injected by middleware, which
 * works but opts every route into dynamic rendering — this store is almost
 * entirely statically generated today, so that is a real cost. Make that call
 * deliberately before going to production; see
 * https://nextjs.org/docs/app/guides/content-security-policy
 *
 * Everything else below is unconditionally worth having, and the non-script
 * directives still bound what an injected script could reach.
 */
/**
 * React's development build uses eval() for debugging features, and the dev
 * server needs a websocket for HMR. Production gets neither.
 */
const isDev = process.env.NODE_ENV === 'development'
const isStaticExport = process.env.STATIC_EXPORT === 'true'

const contentSecurityPolicy = [
  `default-src 'self'`,
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ''}`,
  `style-src 'self' 'unsafe-inline'`,
  `img-src 'self' data: blob:`,
  `font-src 'self'`,
  `connect-src 'self'${isDev ? ' ws: wss:' : ''}`,
  `object-src 'none'`,
  `base-uri 'self'`,
  `form-action 'self'`,
  `frame-ancestors 'none'`,
  `upgrade-insecure-requests`,
].join('; ')

const securityHeaders = [
  { key: 'Content-Security-Policy', value: contentSecurityPolicy },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'X-Frame-Options', value: 'DENY' },
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=(), payment=()',
  },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=31536000; includeSubDomains',
  },
]

const nextConfig: NextConfig = {
  ...(isStaticExport ? { output: 'export' as const, trailingSlash: true } : {}),
  basePath: process.env.NEXT_PUBLIC_BASE_PATH ?? '',
  // This project is nested below another npm lockfile on the developer
  // machine. Pin Turbopack to this repository so local and CI builds resolve
  // this package-lock.json rather than walking into the parent workspace.
  turbopack: {
    root: __dirname,
  },

  images: {
    /**
     * The catalogue is ~330 pre-sized local files (many already WebP) served
     * from this same origin, with no CDN in front. Running them through the
     * image optimiser bought nothing and actively broke the dev server: under
     * concurrency it wedged and left product photos permanently undecoded
     * (11 of 14 on the Apple-filtered listing, stuck for 15s+). Serving them
     * directly is both correct and faster here.
     *
     * If a future version adds user-uploaded or remote imagery, turn this back
     * on for those sources.
     */
    unoptimized: true,
  },

  // GitHub Pages serves static files and cannot apply Next.js response headers.
  ...(!isStaticExport && {
    async headers() {
      return [{ source: '/:path*', headers: securityHeaders }]
    },
  }),
}

export default nextConfig
