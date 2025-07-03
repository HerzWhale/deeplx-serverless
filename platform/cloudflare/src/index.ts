import type { IDeepLData, IDeepLDataError, IOptions, TSourceLanguage, TTargetLanguage } from 'deeplx-lib'
import type { IBody, IParams } from './types'
import { bodyData } from 'body-data'
import { parse2DeepLX, translate } from 'deeplx-lib'

export default {
  async fetch(request, env, _ctx): Promise<Response> {
    const url = new URL(request.url)
    const path = url.pathname
    const token = (env.token || '').split(',').filter(Boolean)

    const { params, body } = await bodyData<IParams, IBody>(request, { backContentType: 'application/json; charset=utf-8' })

    if (token.length) {
      if (!(params?.token && token.includes(params.token))) {
        const code = 403
        const msg = `Request missing authentication information`
        return Response.json({ code, msg }, { status: code })
      }
    }

    if (request.method.toUpperCase() === 'POST' && body) {
      if (body.source_lang) {
        body.from = body.source_lang
      }
      if (body.target_lang) {
        body.to = body.target_lang
      }

      if (path.startsWith('/translate') && body.to && body.text) {
        const text = body.text
        const from = (body.from || 'AUTO').toUpperCase() as TSourceLanguage
        const to = body.to.toUpperCase() as TTargetLanguage
        const options: IOptions = { text, from, to }
        const response = await translate(options)
        const translateData = await response.json() as IDeepLData & IDeepLDataError

        if (translateData.error) {
          const code = response.status
          return Response.json({ code, ...translateData }, { status: code })
        }

        const responseData = parse2DeepLX({ ...options, ...translateData })
        return Response.json(responseData, { status: 200 })
      }

      return Response.json({ code: 404, msg: 'Not found' }, { status: 404 })
    }
    // else if (req.method.toUpperCase() === 'GET') {

    // }
    else {
      return Response.json({ code: 404, msg: 'Not found' }, { status: 404 })
    }
  },
} satisfies ExportedHandler<Env>
