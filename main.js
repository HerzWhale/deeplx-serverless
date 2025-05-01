import process from 'node:process'
import BodyData from 'body-data'
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

  const query = getQuery(req)

  if (token.length) {
    if (!token.includes(query.token)) {
      const code = 403
      const msg = `Request missing authentication information`
      res.statusCode = code
      res.end(JSON.stringify({ code, msg }))
      return
    }
  }

  if (req.method.toUpperCase() === 'POST') {
    const data = await BodyData(req)
    if (data.source_lang) {
      data.from = data.source_lang
    }
    if (data.target_lang) {
      data.to = data.target_lang
    }

    if (req.url.startsWith('/translate') && data.to && data.text) {
      const text = data.text
      const from = (data.from || 'AUTO').toUpperCase()
      const to = data.to.toUpperCase()
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

/**
 * Get get request data
 * @param {IncomingMessage} req Request object
 * @returns {object} object
 */
function getQuery(req) {
  // if not directly return the empty object
  if (!req.url) {
    return {}
  }

  const { searchParams } = new URL(req.url, `http://${req.headers.host}`)

  return Object.fromEntries(searchParams)
}
