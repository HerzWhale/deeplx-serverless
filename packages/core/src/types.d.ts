import type { IDeepLData, IDeepLDataError, IDeepLXData } from 'deeplx-lib'
import type { IncomingMessage } from 'node:http'

export type TMethod = 'GET' | 'POST'

export interface IParams {
  token: string
}

export interface IBody {
  from: string
  to: string
  text: string
  source_lang: string
  target_lang: string
}

export interface IOptions {
  request: IncomingMessage | Request
  token?: string | string[]
}

export interface IResultData {
  code: number
  msg: string
}

export type TDeepLData = IDeepLData & IDeepLDataError & { code: number }

export type TResultData = IResultData | IDeepLXData | TDeepLData
