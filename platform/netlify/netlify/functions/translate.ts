import process from 'node:process'
import core from 'core'

const token = process.env.token

export default async (request: Request) => {
  return core({ request, token })
}

export const config = {
  path: '/*',
}
