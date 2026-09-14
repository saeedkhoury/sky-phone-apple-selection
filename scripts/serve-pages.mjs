import { createServer } from 'node:http'
import { createReadStream } from 'node:fs'
import { stat } from 'node:fs/promises'
import { extname, resolve, sep } from 'node:path'

const root = resolve('out')
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? '/skyphone-ca'
const port = Number(process.env.PORT ?? 4173)
const types = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript',
  '.css': 'text/css', '.json': 'application/json', '.txt': 'text/plain',
  '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg',
  '.webp': 'image/webp', '.svg': 'image/svg+xml', '.ico': 'image/x-icon',
  '.mp4': 'video/mp4', '.woff2': 'font/woff2',
}

createServer(async (request, response) => {
  try {
    const url = new URL(request.url, 'http://localhost')
    const pathname = decodeURIComponent(url.pathname)
    if (pathname !== basePath && !pathname.startsWith(`${basePath}/`)) {
      response.writeHead(404).end()
      return
    }
    let file = resolve(root, `.${pathname.slice(basePath.length) || '/'}`)
    if (file !== root && !file.startsWith(`${root}${sep}`)) {
      response.writeHead(403).end()
      return
    }
    let info = await stat(file)
    if (info.isDirectory()) {
      if (!url.pathname.endsWith('/')) {
        response.writeHead(308, { Location: `${url.pathname}/${url.search}` }).end()
        return
      }
      file = resolve(file, 'index.html')
      info = await stat(file)
    }
    response.writeHead(200, {
      'Content-Type': types[extname(file)] ?? 'application/octet-stream',
      'Content-Length': info.size,
    })
    if (request.method === 'HEAD') response.end()
    else createReadStream(file).pipe(response)
  } catch {
    response.writeHead(404).end()
  }
}).listen(port, '127.0.0.1', () => {
  console.log(`Static storefront: http://127.0.0.1:${port}${basePath}/`)
})
