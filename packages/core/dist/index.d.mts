import { IncomingMessage } from 'node:http';

type TMethod = 'GET' | 'POST'

interface IParams {
  token: string
}

interface IBody {
  from: string
  to: string
  text: string
  source_lang: string
  target_lang: string
}

interface IOptions {
  request: IncomingMessage | Request
  token?: string | string[]
}

interface IResultData {
  code: number
  msg: string
}

declare const _default: (options: IOptions) => Promise<Response>;

declare function handle(options: IOptions): Promise<Response>;

export { _default as default, handle };
export type { IBody, IOptions, IParams, IResultData, TMethod };
