// https://developers.deepl.com/docs/api-reference/translate
/**
 * Translates text from one language to another.
 *
 * @param {object} options - The translation options.
 * @param {string} options.text - The text to translate.
 * @param {"AUTO"|"BG"|"CS"|"DA"|"DE"|"EL"|"EN"|"ES"|"ET"|"FI"|"FR"|"HU"|"ID"|"IT"|"JA"|"KO"|"LT"|"LV"|"NB"|"NL"|"PL"|"PT"|"RO"|"RU"|"SK"|"SL"|"SV"|"TR"|"UK"|"ZH"} options.from - The source language code.
 * @param {"AR"|"BG"|"CS"|"DA"|"DE"|"EL"|"EN-GB"|"EN-US"|"ES"|"ET"|"FI"|"FR"|"HU"|"ID"|"IT"|"JA"|"KO"|"LT"|"LV"|"NB"|"NL"|"PL"|"PT-BR"|"PT-PT"|"RO"|"RU"|"SK"|"SL"|"SV"|"TR"|"UK"|"ZH"|"ZH-HANS"|"ZH-HANT"} options.to - The target language code.
 * @returns {Promise<string>} The translated text.
 */
export async function translate(options) {
  const { text, from, to } = options

  const url = 'https://www2.deepl.com/jsonrpc'
  const random = getRandomNumber()
  const iCount = getICount(text)
  const timestamp = getTimestamp(iCount)

  const bodyString = JSON.stringify({
    jsonrpc: '2.0',
    method: 'LMT_handle_texts',
    params: {
      splitting: 'newlines',
      lang: {
        source_lang_user_selected: from,
        target_lang: to,
      },
      texts: [{ text, requestAlternatives: 3 }],
      timestamp,
    },
    id: random,
  })

  const body = handlerBodyMethod(random, bodyString)

  try {
    const response = await fetch(url, {
      method: 'POST',
      body,
      headers: { 'Content-Type': 'application/json' },
    })
    if (response.status === 429) {
      throw new Error(
        `Too many requests, your IP has been blocked by DeepL temporarily, please don't request it frequently in a short time.`,
      )
    }

    if (response.ok) {
      return response.json()
    }

    throw new Error(`request failed`)
  }
  catch (error) {
    console.error('request error:', error)
  }
}

function handlerBodyMethod(random, body) {
  const calc = (random + 5) % 29 === 0 || (random + 3) % 13 === 0
  const method = calc ? '"method" : "' : '"method": "'
  return body.replace('"method":"', method)
}

function getTimestamp(iCount) {
  const ts = Date.now()
  if (iCount !== 0) {
    iCount = iCount + 1
    return ts - (ts % iCount) + iCount
  }
  else {
    return ts
  }
}

function getICount(translate_text) {
  return translate_text.split('i').length - 1
}

function getRandomNumber() {
  const random = Math.floor(Math.random() * 99999) + 100000
  return random * 1000
}
