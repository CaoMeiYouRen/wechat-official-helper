import { createVerifyCode, generateCode } from './code'
import { getDataSource } from '@/db'
import { BaseMessage } from '@/db/models/wechat-base'
import { ClickEvent, LocationEvent, ScanEvent, SubscribeAndScanEvent, SubscribeEvent, ViewEvent } from '@/db/models/event'
import { ImageMessage, LinkMessage, LocationMessage, ShortVideoMessage, TextMessage, VideoMessage, VoiceMessage } from '@/db/models/message'
import { IWechatEventBody } from '@/interfaces/wechat-event-body'
import { IWechatReplyMessage } from '@/interfaces/wechat-reply-message'
import { json2xml, toPascalCase } from '@/utils/helper'
import { User } from '@/db/models/user'
import { BASE_URL } from '@/env'

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
    // 如果是消息，则根据 msgId 去重复
    if (body.msgType !== 'event') {
        // 根据 msgId 去重复
        const exist = await entityManager.findOneBy(BaseMessage, { msgId: body.msgId })
        if (exist) {
            return 'success'
        }
    }
    // 如果是事件，则不处理重复

    await saveEvent(body)

    switch (msgType) {
        case 'text': { // 文本消息
            const { content } = body
            // 如果发送的是 '验证码'，则创建新的验证码
            // TODO 验证码关键词应该可以自定义
            if (content === '验证码') {
                const verifyCode = await createVerifyCode(fromUserName, 'login')
                const respContent = `您的验证码是：${verifyCode.code}`
                return replyMessage({
                    toUserName: fromUserName,
                    fromUserName: toUserName,
                    msgType: 'text',
                    content: respContent,
                })
            }
            if (content === '登录') {
                // 直接返回一个登录链接
                const verifyCode = await createVerifyCode(fromUserName, 'login')
                const url = new URL(BASE_URL)
                url.pathname = '/login'
                url.searchParams.set('code', verifyCode.code)
                const loginLink = url.toString()
                const respContent = `请点击链接登录：${loginLink}`
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
                // TODO 处理用户订阅事件
                // case 'subscribe': { // 订阅
                //     const respContent = '感谢订阅'
                //     return replyMessage({
                //         toUserName: fromUserName,
                //         fromUserName: toUserName,
                //         msgType: 'text',
                //         content: respContent,
                //     })
                // }
                // case 'unsubscribe': // 取消订阅
                //     return 'success'
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
    const { msgType, fromUserName } = body
    const entityManager = (await getDataSource()).manager
    // 保存用户信息
    await saveUser(fromUserName)

    switch (msgType) {
        case 'text': { // 文本消息
            await entityManager.save(entityManager.create(TextMessage, body))
            return
        }
        case 'image': { // 图片消息
            await entityManager.save(entityManager.create(ImageMessage, body))
            return
        }
        case 'event': { // 事件
            const { event } = body
            switch (event) {
                case 'subscribe': { // 订阅
                    if ((body as SubscribeAndScanEvent).eventKey) {
                        await entityManager.save(entityManager.create(SubscribeAndScanEvent, body as SubscribeAndScanEvent))
                        return
                    }
                    await entityManager.save(entityManager.create(SubscribeEvent, body))
                    return
                }
                case 'unsubscribe': // 取消订阅
                    await entityManager.save(entityManager.create(SubscribeEvent, body))
                    return
                case 'CLICK': // 点击菜单拉取消息时的事件推送
                    await entityManager.save(entityManager.create(ClickEvent, body))
                    return
                case 'SCAN': // 扫描带参数二维码事件的事件推送
                    await entityManager.save(entityManager.create(ScanEvent, body))
                    return
                case 'LOCATION': // 上报地理位置事件
                    await entityManager.save(entityManager.create(LocationEvent, body))
                    return
                case 'VIEW': // 点击菜单跳转链接时的事件推送
                    await entityManager.save(entityManager.create(ViewEvent, body))
                    return
                default:
                    return
            }
        }
        case 'voice': { // 语音消息
            await entityManager.save(entityManager.create(VoiceMessage, body))
            return
        }
        case 'video': {   // 视频消息
            await entityManager.save(entityManager.create(VideoMessage, body))
            return
        }
        case 'shortvideo': { // 小视频消息
            await entityManager.save(entityManager.create(ShortVideoMessage, body))
            return
        }
        case 'location': { // 位置消息
            await entityManager.save(entityManager.create(LocationMessage, body))
            return
        }
        case 'link': { // 链接消息
            await entityManager.save(entityManager.create(LinkMessage, body))
            return
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
            password: generateCode(32), // 生成随机密码
            email: null,
            emailVerified: false,
            wechatOpenid,
            wechatUnionid: null,
        })
        user = await userRepository.save(user)
    }
    return user
}
