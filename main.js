import process from 'node:process'
import { bodyData } from 'body-data'

import { translate } from './translate.js'
import 'dotenv/config'

const token = (process.env.token || '').split(',').filter(Boolean)

export default main

/**
 *
 * @param { import('http').IncomingMessage } req
 * @param { import('http').ServerResponse } res
 */
export async function main(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Content-Type', 'application/json; charset=utf-8')

  const { params, body } = await bodyData(req, { backContentType: 'application/json; charset=utf-8' })

  if (token.length) {
    if (!token.includes(params.token)) {
      const code = 403
      const msg = `Request missing authentication information`
      res.statusCode = code
      res.end(JSON.stringify({ code, msg }))
      return
    }
  }

  if (req.method.toUpperCase() === 'POST') {
    if (body.source_lang) {
      body.from = body.source_lang
    }
    if (body.target_lang) {
      body.to = body.target_lang
    }

    if (req.url.startsWith('/translate') && body.to && body.text) {
      const text = body.text
      const from = (body.from || 'AUTO').toUpperCase()
      const to = body.to.toUpperCase()
      const translateData = await translate({ text, from, to })

      const result = translateData.result
      const texts = result.texts[0]
      const responseData = {
        code: 200,
        id: translateData.id,
        method: 'Free',
        from: result.lang,
        to,
        source_lang: result.lang,
        target_lang: to,
        data: texts.text,
        alternatives: texts.alternatives,
      }
      return res.end(JSON.stringify(responseData))
    }

    return NotFound('Not found')
  }
  // else if (req.method.toUpperCase() === 'GET') {

  // }
  else {
    return NotFound('Not found')
  }

  /**
   *
   * @param { string= } msg
   */
  function NotFound(msg) {
    const code = 404
    res.statusCode = code
    res.end(JSON.stringify({ code, msg }))
  }
}
