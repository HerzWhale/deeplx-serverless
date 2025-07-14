import process from 'node:process'
import deeplxServerless from 'deeplx-serverless'

const token = process.env.token

export default async (request: Request) => {
  return deeplxServerless({ request, token })
}

export const config = {
  path: '/*',
}
