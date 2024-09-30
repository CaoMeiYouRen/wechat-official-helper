import { CamelCaseObject } from './utils'
import { WechatEvent } from './wechat-event'
import { WechatMessage } from './wechat-message'

export type WechatEventBody = WechatMessage | WechatEvent

export type IWechatEventBody = CamelCaseObject<WechatEventBody>
