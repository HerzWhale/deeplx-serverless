import type { VercelRequest, VercelResponse } from '@vercel/node'
import process from 'node:process'
import core from 'core'

const token = process.env.token

export default async (request: VercelRequest, response: VercelResponse) => {
  const webResponse = await core({ request, token })
  webResponse.headers.forEach((value, key) => response.setHeader(key, value))

  response.writeHead(webResponse.status)
  if (webResponse.body) {
    await webResponse.body.pipeTo(new WritableStream({
      write(chunk) { response.write(chunk) },
      close() { response.end() },
    }))
  }
}
