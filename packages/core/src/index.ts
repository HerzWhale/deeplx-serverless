import type { IOptions as deepLXOptions, IDeepLData, IDeepLDataError, TSourceLanguage, TTargetLanguage } from 'deeplx-lib'
import type { IBody, IOptions, IParams, TResultData } from './types'
import { bodyData, toWebRequest } from 'body-data'
import { parse2DeepLX, translate } from 'deeplx-lib'
import { authToken, parseToken } from './utils'

export * from './types.d'

export default async (options: IOptions): Promise<TResultData> => {
  const { token } = options
  const request = toWebRequest(options.request)
  const url = new URL(request.url)
  const path = url.pathname

  const { params, body } = await bodyData<IParams, IBody>(request, { backContentType: 'application/json; charset=utf-8' })

  const tokens = parseToken(token)
  const authorization = request.headers.get('authorization')
  const auth = authToken({ tokens, authorization, token: params.token })
  if (!auth) {
    const code = 403
    const msg = `Request missing authentication information`
    return { code, msg }
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
      const options: deepLXOptions = { text, from, to }
      const response = await translate(options)
      const translateData = await response.json() as IDeepLData & IDeepLDataError

      if (translateData.error) {
        const code = response.status
        return { code, ...translateData }
      }

      const responseData = parse2DeepLX({ ...options, ...translateData })
      return responseData
    }

    return { code: 404, msg: 'Not found' }
  }
  // else if (req.method.toUpperCase() === 'GET') {

  // }
  else {
    return { code: 404, msg: 'Not found' }
  }
}
