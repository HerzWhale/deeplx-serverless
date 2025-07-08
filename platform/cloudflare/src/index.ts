import core from 'core'

export default {
  async fetch(request, env, _ctx): Promise<Response> {
    const token = env.token
    const data = await core({ request, token })
    return Response.json(data, { status: data.code })
  },
} satisfies ExportedHandler<Env>
