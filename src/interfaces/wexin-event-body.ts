import { CamelCaseObject } from './utils'
import { WexinEvent } from './wexin-event'
import { WexinMessage } from './wexin-message'

export type WexinEventBody = WexinMessage | WexinEvent

export type IWexinEventBody = CamelCaseObject<WexinEventBody>
