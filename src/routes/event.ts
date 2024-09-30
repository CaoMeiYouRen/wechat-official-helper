import { Hono } from 'hono'
import { HTTPException } from 'hono/http-exception'
import { to } from 'await-to-js'
import { sha1, toCamelCase, xml2json } from '@/utils/helper'
import { WX_TOKEN } from '@/env'
import winstonLogger from '@/utils/logger'
import { WexinEventBody } from '@/interfaces/wexin-event-body'
import { handleEvent } from '@/services/event'
// 接收微信推送事件
const app = new Hono()

app.get('/', async (c) => {
    const query = c.req.query()
    const { signature, echostr, timestamp, nonce } = query

    // 记录日志
    winstonLogger.isDebugEnabled() && winstonLogger.debug(`Query parameters: \n${JSON.stringify(query)}`)

    // 签名校验
    const tempArr = [WX_TOKEN, timestamp, nonce].sort()
    const tempStr = tempArr.join('')
    const tempSign = sha1(tempStr)

    if (tempSign !== signature) {
        throw new HTTPException(400, { message: '微信签名校验失败！' })
    }

    return c.text(echostr)
})

app.post('/', async (c) => {
    const query = c.req.query()
    const { signature, timestamp, nonce } = query
    // 记录日志
    // winstonLogger.isDebugEnabled() && winstonLogger.debug('Query parameters:', query)

    // 签名校验
    const tempArr = [WX_TOKEN, timestamp, nonce].sort()
    const tempStr = tempArr.join('')
    const tempSign = sha1(tempStr)

    if (tempSign !== signature) {
        throw new HTTPException(400, { message: '微信签名校验失败！' })
    }

    const bodyText = await c.req.text() // 获取请求的原始文本
    const [error, xmlData] = await to(xml2json(bodyText))
    if (error) {
        throw new HTTPException(400, { message: `Invalid XML: \n${error.message}` })
    }
    const body = toCamelCase(xmlData as WexinEventBody)

    winstonLogger.isDebugEnabled() && winstonLogger.debug(`Body parameters: \n${JSON.stringify(body)}`)

    const response = await handleEvent(body)

    winstonLogger.isDebugEnabled() && winstonLogger.debug(`Response: \n${response}`)
    c.header('Content-Type', 'text/xml')
    return c.text(response, 200)
})

export default app
