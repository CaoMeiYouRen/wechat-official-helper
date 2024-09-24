import { CamelCaseObject } from '@/interfaces/utils'
import { WexinEventBody } from '@/interfaces/wexin-event-body'
import { WexinReplyMessage } from '@/interfaces/wexin-reply-message'
import { json2xml, toPascalCase } from '@/utils/helper'

/**
 * 回复消息
 *
 * @author CaoMeiYouRen
 * @date 2024-09-24
 * @param data
 */
export function replyMessage(data: Partial<CamelCaseObject<WexinReplyMessage>>) {
    return json2xml(toPascalCase({
        createTime: Math.floor(Date.now() / 1000),
        ...data,
    }))
}

/**
 * 接收微信推送事件
 *
 * @author CaoMeiYouRen
 * @date 2024-09-25
 * @export
 * @param body
 */
export async function handleEvent(body: CamelCaseObject<WexinEventBody>) {
    const { fromUserName, toUserName, msgType } = body
    switch (msgType) {
        case 'text': { // 文本消息
            const { content } = body
            const RespContent = `您发送的消息是：${content}`
            return replyMessage({
                toUserName: fromUserName,
                fromUserName: toUserName,
                msgType: 'text',
                content: RespContent,
            })
        }
        case 'image': { // 图片消息
            const { mediaId } = body
            return replyMessage({
                toUserName: fromUserName,
                fromUserName: toUserName,
                msgType: 'image',
                image: {
                    MediaId: mediaId,
                },
            })
        }
        case 'event': { // 事件
            const { event } = body
            if (event === 'subscribe') { // 订阅
                const RespContent = '感谢订阅'
                return replyMessage({
                    toUserName: fromUserName,
                    fromUserName: toUserName,
                    msgType: 'text',
                    content: RespContent,
                })
            }
            // unsubscribe 取消订阅
            return 'success'
        }
        default:
            return 'success'
    }
}
