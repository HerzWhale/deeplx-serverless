import core from 'core'

export default {
  async fetch(request, env, _ctx): Promise<Response> {
    const METHODS = ['GET', 'HEAD', 'POST', 'OPTIONS']
    const method = request.method || 'GET'
    const headers = new Headers({
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': METHODS.join(', '),
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Content-Type': 'application/json; charset=utf-8',
    })

    if (!METHODS.includes(method)) {
      return new Response(null, { status: 405, headers })
    }

    const responseInit: ResponseInit = {
      headers,
    }
    if (method === 'HEAD') {
      return new Response(null, {
        headers,
        status: 200,
      })
    }
    if (method === 'OPTIONS') {
      return new Response(null, { headers })
    }

    const token = env.token
    const data = await core({ request, token })

    responseInit.status = data.code
    return new Response(JSON.stringify(data), responseInit)
  },
} satisfies ExportedHandler<Env>
