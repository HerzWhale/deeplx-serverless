import { toWebRequest, bodyData } from 'body-data';
import { translate, parse2DeepLX } from 'deeplx-lib';

function parseToken(token = "") {
  if (Array.isArray(token)) {
    return token;
  }
  const tokens = token.split(",").filter(Boolean).map((i) => i.trim());
  return tokens;
}
function authToken({ tokens, authorization, token }) {
  if (!tokens.length) {
    return true;
  }
  if (authorization) {
    authorization = authorization.replace("Bearer ", "").trim();
    return tokens.includes(authorization);
  }
  if (token) {
    return tokens.includes(token);
  }
  return true;
}

const index = async (options) => {
  const { token } = options;
  const request = toWebRequest(options.request);
  const url = new URL(request.url);
  const path = url.pathname;
  const { params, body } = await bodyData(request, { backContentType: "application/json; charset=utf-8" });
  const tokens = parseToken(token);
  const authorization = request.headers.get("authorization");
  const auth = authToken({ tokens, authorization, token: params.token });
  if (!auth) {
    const code = 403;
    const msg = `Request missing authentication information`;
    return { code, msg };
  }
  if (request.method.toUpperCase() === "POST" && body) {
    if (body.source_lang) {
      body.from = body.source_lang;
    }
    if (body.target_lang) {
      body.to = body.target_lang;
    }
    if (path.startsWith("/translate") && body.to && body.text) {
      const text = body.text;
      const from = (body.from || "AUTO").toUpperCase();
      const to = body.to.toUpperCase();
      const options2 = { text, from, to };
      const response = await translate(options2);
      const translateData = await response.json();
      if (translateData.error) {
        const code = response.status;
        return { code, ...translateData };
      }
      const responseData = parse2DeepLX({ ...options2, ...translateData });
      return responseData;
    }
    return { code: 404, msg: "Not found" };
  } else {
    return { code: 404, msg: "Not found" };
  }
};

export { index as default };
