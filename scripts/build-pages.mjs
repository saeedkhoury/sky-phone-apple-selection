import { spawnSync } from 'node:child_process'
import { writeFile } from 'node:fs/promises'

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? '/skyphone-ca'
if (!/^\/[a-zA-Z0-9_-]+$/.test(basePath)) {
  throw new Error('NEXT_PUBLIC_BASE_PATH must be a single repository path, such as /skyphone-ca')
}

const result = spawnSync(process.execPath, ['node_modules/next/dist/bin/next', 'build'], {
  stdio: 'inherit',
  env: {
    ...process.env,
    STATIC_EXPORT: 'true',
    NEXT_PUBLIC_BASE_PATH: basePath,
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL ?? 'https://saeedkhoury.github.io',
  },
})
if (result.error) throw result.error
if (result.status !== 0) process.exit(result.status ?? 1)

// Static hosting has no language-routing proxy. Provide a real root entry with
// browser-language selection and working links when JavaScript is disabled.
await writeFile('out/index.html', `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="robots" content="noindex,nofollow"><title>Sky Phone — Apple Selection</title>
<link rel="icon" type="image/png" sizes="32x32" href="${basePath}/favicon-32.png?v=sky-phone-1">
<link rel="shortcut icon" href="${basePath}/favicon.ico?v=sky-phone-1">
<style>body{margin:0;background:#111;color:#f5f5f7;font:18px system-ui;display:grid;min-height:100vh;place-items:center;text-align:center}h1{font:32px Georgia,serif;letter-spacing:.2em}nav{display:flex;gap:24px;justify-content:center}a{color:#2997ff}</style>
</head><body><main><h1>SKY PHONE</h1><nav aria-label="Language"><a href="${basePath}/he/" lang="he">עברית</a><a href="${basePath}/ar/" lang="ar">العربية</a><a href="${basePath}/en/" lang="en">English</a></nav></main>
<script>const supported=['he','ar','en'];const locale=(navigator.languages||[navigator.language]).map(tag=>tag.split('-')[0]).find(tag=>supported.includes(tag))||'he';location.replace('${basePath}/'+locale+'/'+location.search+location.hash);</script>
</body></html>`)
await writeFile('out/.nojekyll', '')
console.log(`GitHub Pages output ready: out/ → ${basePath}/`)
