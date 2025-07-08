import type { VercelRequest, VercelResponse } from '@vercel/node'
import process from 'node:process'
import core from 'core'

const token = process.env.token

export default async (request: VercelRequest, response: VercelResponse) => {
  const METHODS = ['GET', 'HEAD', 'POST', 'OPTIONS']
  const method = request.method || 'GET'
  response.setHeader('Access-Control-Allow-Origin', '*')
  response.setHeader('Access-Control-Allow-Methods', METHODS.join(', '))
  response.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  response.setHeader('Content-Type', 'application/json; charset=utf-8')

  if (!METHODS.includes(method)) {
    response.writeHead(405)
    return response.end()
  }

  if (method === 'HEAD') {
    response.writeHead(200)
    return response.end()
  }

  if (method === 'OPTIONS') {
    response.writeHead(200)
    return response.end()
  }

  const data = await core({ request, token })

  response.writeHead(data.code)
  response.end(JSON.stringify(data))
}
