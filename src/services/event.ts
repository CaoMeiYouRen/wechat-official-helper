import { createVerifyCode } from './code'
import { getDataSource } from '@/db'
import { BaseEvent, BaseMessage } from '@/db/models/wechat-base'
import { ClickEvent, LocationEvent, ScanEvent, SubscribeAndScanEvent, SubscribeEvent, ViewEvent } from '@/db/models/event'
import { ImageMessage, LinkMessage, LocationMessage, ShortVideoMessage, TextMessage, VideoMessage, VoiceMessage } from '@/db/models/message'
import { IWechatEventBody } from '@/interfaces/wechat-event-body'
import { IWechatReplyMessage } from '@/interfaces/wechat-reply-message'
import { generateRandomString, json2xml, toPascalCase } from '@/utils/helper'
import { User } from '@/db/models/user'

/**
 * 回复消息
 *
 * @author CaoMeiYouRen
 * @date 2024-09-24
 * @param data
 */
export function replyMessage(data: Partial<IWechatReplyMessage>) {
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
export async function handleEvent(body: IWechatEventBody) {
    const { fromUserName, toUserName, msgType } = body
    // 存储用户消息到数据库
    const entityManager = (await getDataSource()).manager
    const message = await saveEvent(body)
    if (message.responded) { // 如果已经响应了，则直接返回
        return 'success'
    }
    // 保存用户信息
    const userRepository = (await getDataSource()).getRepository(User)
    const user = await saveUser(fromUserName)
    switch (msgType) {
        case 'text': { // 文本消息
            const { content } = body
            // 如果发送的是 '验证码'，则创建新的验证码
            // TODO 验证码关键词应该可以自定义
            if (content === '验证码') {
                const verifyCode = await createVerifyCode(user, 'login')
                const respContent = `您的验证码是：${verifyCode.code}`
                message.responded = true // 标记已响应
                await entityManager.save(message)
                return replyMessage({
                    toUserName: fromUserName,
                    fromUserName: toUserName,
                    msgType: 'text',
                    content: respContent,
                })
            }
            if (/^查询ID$/i.test(content)) {
                const respContent = `您的 ID 是：${fromUserName}`
                message.responded = true // 标记已响应
                await entityManager.save(message)
                return replyMessage({
                    toUserName: fromUserName,
                    fromUserName: toUserName,
                    msgType: 'text',
                    content: respContent,
                })
            }
            // 未匹配到关键词，则转发请求到下一个服务器
            return 'redirect'
        }
        case 'image': { // 图片消息
            return 'redirect'
        }
        case 'event': { // 事件
            const { event } = body
            switch (event) {
                case 'subscribe': { // 订阅
                    user.subscribed = true
                    await userRepository.save(user)
                    return 'redirect' // 默认为重定向
                }
                case 'unsubscribe': { // 取消订阅
                    user.subscribed = false
                    await userRepository.save(user)
                    return 'redirect'
                }
                // case 'CLICK': // 点击菜单拉取消息时的事件推送
                //     return 'success'
                // case 'SCAN': // 扫描带参数二维码事件的事件推送
                //     return 'success'
                // case 'LOCATION': // 上报地理位置事件
                //     return 'success'
                // case 'VIEW': // 点击菜单跳转链接时的事件推送
                //     return 'success'
                default:
                    return 'redirect' // 默认为重定向
            }
        }
        // case 'voice': { // 语音消息
        //     return 'success'
        // }
        // case 'video': {   // 视频消息
        //     return 'success'
        // }
        // case 'shortvideo': { // 小视频消息
        //     return 'success'
        // }
        // case 'location': { // 位置消息
        //     return 'success'
        // }
        // case 'link': { // 链接消息
        //     return 'success'
        // }
        default:
            return 'redirect' // 默认为重定向
    }
}

/**
 * 存储用户消息到数据库
 *
 * @author CaoMeiYouRen
 * @date 2024-09-30
 * @export
 * @param body
 */
export async function saveEvent(body: IWechatEventBody) {
    const { msgType, fromUserName, createTime } = body
    const entityManager = (await getDataSource()).manager

    if (body.msgType === 'event') {
        // 如果是事件，则根据 fromUserName + createTime 去重复
        const exist = await entityManager.findOneBy(BaseEvent, { fromUserName, createTime })
        if (exist) {
            return exist
        }
    } else {
        // 如果是消息，则根据 msgId 去重复
        const exist = await entityManager.findOneBy(BaseMessage, { msgId: body.msgId })
        if (exist) {
            return exist
        }
    }
    // 保存信息
    switch (msgType) {
        case 'text': { // 文本消息
            const message = await entityManager.save(entityManager.create(TextMessage, body))
            return message
        }
        case 'image': { // 图片消息
            const message = await entityManager.save(entityManager.create(ImageMessage, body))
            return message
        }
        case 'event': { // 事件
            const { event } = body
            switch (event) {
                case 'subscribe': { // 订阅
                    if ((body as SubscribeAndScanEvent).eventKey) {
                        const message = await entityManager.save(entityManager.create(SubscribeAndScanEvent, body as SubscribeAndScanEvent))
                        return message
                    }
                    const message = await entityManager.save(entityManager.create(SubscribeEvent, body))
                    return message
                }
                case 'unsubscribe': { // 取消订阅
                    const message = await entityManager.save(entityManager.create(SubscribeEvent, body))
                    return message
                }
                case 'CLICK': { // 点击菜单拉取消息时的事件推送
                    const message = await entityManager.save(entityManager.create(ClickEvent, body))
                    return message
                }
                case 'SCAN': { // 扫描带参数二维码事件的事件推送
                    const message = await entityManager.save(entityManager.create(ScanEvent, body))
                    return message
                }
                case 'LOCATION': { // 上报地理位置事件
                    const message = await entityManager.save(entityManager.create(LocationEvent, body))
                    return message
                }
                case 'VIEW': { // 点击菜单跳转链接时的事件推送
                    const message = await entityManager.save(entityManager.create(ViewEvent, body))
                    return message
                }
                default:
                    return null
            }
        }
        case 'voice': { // 语音消息
            const message = await entityManager.save(entityManager.create(VoiceMessage, body))
            return message
        }
        case 'video': {   // 视频消息
            const message = await entityManager.save(entityManager.create(VideoMessage, body))
            return message
        }
        case 'shortvideo': { // 小视频消息
            const message = await entityManager.save(entityManager.create(ShortVideoMessage, body))
            return message
        }
        case 'location': { // 位置消息
            const message = await entityManager.save(entityManager.create(LocationMessage, body))
            return message
        }
        case 'link': { // 链接消息
            const message = await entityManager.save(entityManager.create(LinkMessage, body))
            return message
        }
        default:
            return null
    }
}

export async function saveUser(wechatOpenid: string) {
    const userRepository = (await getDataSource()).getRepository(User)
    let user = await userRepository.findOneBy({ wechatOpenid })
    if (!user) {
        user = userRepository.create({
            username: wechatOpenid,
            password: generateRandomString(32), // 生成随机密码
            email: null,
            emailVerified: false,
            wechatOpenid,
            wechatUnionid: null,
            subscribed: true,
        })
        user = await userRepository.save(user)
    }
    return user
}

