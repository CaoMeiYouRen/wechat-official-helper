import { Hono } from 'hono'
import { HTTPException } from 'hono/http-exception'
import { to } from 'await-to-js'
import { json2xml, sha1, xml2json } from '@/utils/helper'
import { WX_TOKEN } from '@/env'
import winstonLogger from '@/utils/logger'
import { WexinEventBody } from '@/interfaces/WexinEventBody'
import { WexinReplyMessage } from '@/interfaces/WexinReplyMessage'

export const wechat = new Hono()

wechat.get('/', async (c) => {
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

/**
 * 回复消息
 *
 * @author CaoMeiYouRen
 * @date 2024-09-24
 * @param data
 */
function replyMessage(data: Partial<WexinReplyMessage>) {
    return json2xml({
        CreateTime: Math.floor(Date.now() / 1000),
        ...data,
    })
}

async function handleEvent(body: WexinEventBody) {
    const { FromUserName, ToUserName, MsgType } = body
    switch (MsgType) {
        case 'text': { // 文本消息
            const { Content } = body
            const RespContent = `您发送的消息是：${Content}`
            return replyMessage({
                ToUserName: FromUserName,
                FromUserName: ToUserName,
                MsgType: 'text',
                Content: RespContent,
            })
        }
        case 'image': { // 图片消息
            const { MediaId } = body
            return replyMessage({
                ToUserName: FromUserName,
                FromUserName: ToUserName,
                MsgType: 'image',
                Image: {
                    MediaId,
                },
            })
        }
        case 'event': { // 事件
            const { Event } = body
            if (Event === 'subscribe') { // 订阅
                const RespContent = '感谢订阅'
                return replyMessage({
                    ToUserName: FromUserName,
                    FromUserName: ToUserName,
                    MsgType: 'text',
                    Content: RespContent,
                })
            }
            // unsubscribe 取消订阅
            return 'success'
        }
        default:
            return 'success'
    }
}

wechat.post('/', async (c) => {
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
    const body = xmlData as WexinEventBody

    winstonLogger.isDebugEnabled() && winstonLogger.debug(`Body parameters: \n${JSON.stringify(body)}`)

    const response = await handleEvent(body)

    winstonLogger.isDebugEnabled() && winstonLogger.debug(`Response: \n${response}`)

    return c.text(response, 200)
})
