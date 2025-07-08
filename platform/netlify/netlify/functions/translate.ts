import process from 'node:process'
import core from 'core'

const token = process.env.token

export default async (request: Request) => {
  const data = await core({ request, token })
  return Response.json(data, { status: data.code })
}

export const config = {
  path: '/translate',
}
