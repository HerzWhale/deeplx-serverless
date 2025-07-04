import type { VercelRequest, VercelResponse } from '@vercel/node'
import type { IDeepLData, IDeepLDataError, IOptions, TSourceLanguage, TTargetLanguage } from 'deeplx-lib'
import type { IBody, IParams } from '../types'
import process from 'node:process'
import { parse2DeepLX, translate } from 'deeplx-lib'

const token = (process.env.token || '').split(',').filter(Boolean)

export default async (request: VercelRequest, response: VercelResponse) => {
  response.setHeader('Access-Control-Allow-Origin', '*')
  response.setHeader('Content-Type', 'application/json; charset=utf-8')
  const path = request.url

  const params = request.query as unknown as IParams
  const body = await request.body as IBody

  if (token.length) {
    if (!(params?.token && token.includes(params.token))) {
      const code = 403
      const msg = `Request missing authentication information`
      response.status(code).json({ code, msg })
      return
    }
  }

  if (request.method?.toUpperCase() === 'POST') {
    if (body.source_lang) {
      body.from = body.source_lang
    }
    if (body.target_lang) {
      body.to = body.target_lang
    }

    if (path?.startsWith('/translate') && body.to && body.text) {
      const text = body.text
      const from = (body.from || 'AUTO').toUpperCase() as TSourceLanguage
      const to = body.to.toUpperCase() as TTargetLanguage
      const options: IOptions = { text, from, to }
      const translateResponse = await translate(options)
      const translateData = await translateResponse.json() as IDeepLData & IDeepLDataError

      if (translateData.error) {
        const code = translateResponse.status
        response.status(code).json({ code, ...translateData })
        return
      }

      const responseData = parse2DeepLX({ ...options, ...translateData })
      response.status(200).json(responseData)
      return
    }

    const code = 404
    response.status(code).json({ code, msg: 'Not found' })
  }
  // else if (req.method.toUpperCase() === 'GET') {

  // }
  else {
    const code = 404
    response.status(code).json({ code, msg: 'Not found' })
  }
}
