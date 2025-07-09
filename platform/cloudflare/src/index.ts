import core from 'core'

export default {
  async fetch(request, env, _ctx): Promise<Response> {
    const token = env.token
    return core({ request, token })
  },
} satisfies ExportedHandler<Env>
