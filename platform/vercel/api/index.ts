import type { VercelRequest, VercelResponse } from '@vercel/node'
import process from 'node:process'
import core from 'core'

const token = process.env.token

export default async (request: VercelRequest, response: VercelResponse) => {
  const data = await core({ request, token })
  response.status(data.code).json(data)
}
