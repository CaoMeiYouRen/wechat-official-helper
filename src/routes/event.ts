import { Hono } from 'hono'
import { HTTPException } from 'hono/http-exception'
import { to } from 'await-to-js'
import { sha1, toCamelCase, xml2json } from '@/utils/helper'
import { REDIRECT_URL, WX_TOKEN } from '@/env'
import winstonLogger from '@/utils/logger'
import { WechatEventBody } from '@/interfaces/wechat-event-body'
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
    winstonLogger.isDebugEnabled() && winstonLogger.debug(`Query parameters: \n${JSON.stringify(query)}`)

    // 签名校验
    const tempArr = [WX_TOKEN, timestamp, nonce].sort()
    const tempStr = tempArr.join('')
    const tempSign = sha1(tempStr)
    // winstonLogger.isDebugEnabled() && winstonLogger.debug(`tempStr: ${tempStr}, tempSign: ${tempSign}, signature: ${signature}`)
    if (tempSign !== signature) {
        throw new HTTPException(400, { message: '微信签名校验失败！' })
    }

    const bodyText = await c.req.text() // 获取请求的原始文本
    const [error, xmlData] = await to(xml2json(bodyText))
    if (error) {
        throw new HTTPException(400, { message: `Invalid XML: \n${error.message}` })
    }
    const body = toCamelCase(xmlData as WechatEventBody)

    winstonLogger.isDebugEnabled() && winstonLogger.debug(`Body parameters: \n${JSON.stringify(body)}`)

    const response = await handleEvent(body)

    winstonLogger.isDebugEnabled() && winstonLogger.debug(`Response: \n${response}`)

    if (response === 'redirect') { // 本云函数未处理请求，则重定向到该地址
        winstonLogger.isDebugEnabled() && winstonLogger.debug('未处理请求，正在重定向中……')
        if (REDIRECT_URL) {
            winstonLogger.isDebugEnabled() && winstonLogger.debug(`重定向请求到 ${REDIRECT_URL}`)
            const searchParams = new URLSearchParams(query)
            return c.redirect(`${REDIRECT_URL}?${searchParams}`, 307)
        }
        winstonLogger.isDebugEnabled() && winstonLogger.debug('未设置重定向 URL，已忽略本次请求')
        c.header('Content-Type', 'text/xml')
        return c.text('success', 200)
    }
    c.header('Content-Type', 'text/xml')
    return c.text(response, 200)
})

export default app
