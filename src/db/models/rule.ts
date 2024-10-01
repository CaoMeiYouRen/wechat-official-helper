import { Column, Entity } from 'typeorm'
import { Base } from './base'

export type MsgType = 'text' | 'image' | 'voice' | 'video' | 'shortvideo' | 'location' | 'link' | 'event.subscribe' | 'event.unsubscribe' | 'event.scan' | 'event.location' | 'event.click' | 'event.view'

export type ActionType = 'reply' | 'forward' | 'block' | 'verify' | 'login'

/**
 * 规则实体类
 * 用于配置接收到用户消息时，需要执行的操作
 *
 * @author CaoMeiYouRen
 * @date 2024-10-01
 * @export
 * @class Rule
 */
@Entity()
export class Rule extends Base {

    // 规则名称
    @Column({ type: 'varchar', length: 255, nullable: false })
    name: string

    // 规则描述
    @Column({ type: 'varchar', length: 1024, nullable: true })
    description?: string

    // 规则是否启用
    @Column({ type: 'boolean', default: true })
    enabled: boolean

    // 规则优先级
    @Column({ type: 'int', default: 0 })
    priority: number

    // 响应的消息和事件类型，多选
    @Column({ type: 'varchar', length: 50, nullable: true })
    msgTypes: MsgType[]

    // 规则类型，文本或正则
    @Column({ type: 'varchar', length: 50, nullable: false })
    type: 'text' | 'regex'

    // 规则匹配的文本或正则
    @Column({ type: 'varchar', length: 1024, nullable: true })
    match?: string

    // 规则执行的操作，回复文本/转发/屏蔽/验证码/登录链接(OAuth2)
    @Column({ type: 'varchar', length: 50, nullable: false })
    action: ActionType

    // 回复内容，如果是回复，则需要填写
    @Column({ type: 'varchar', length: 1024, nullable: true })
    content?: string

    // 转发的目标，如果是转发，则需要填写
    @Column({ type: 'varchar', length: 255, nullable: true })
    target?: string

    // OAuth2 登录的 url，会用 POST 方法请求该地址，提交内容为 appId、token、timestamp、sign
    // token 为用户的 jwtToken，timestamp 为当前时间戳，sign 为 appId + appSecret + token + timeStamp 的 sha256 哈希值
    @Column({ type: 'varchar', length: 1024, nullable: true })
    url?: string

    // OAuth2 登录的目标 AppId，用于区分要登录哪个 App
    @Column({ type: 'varchar', length: 255, nullable: true })
    appId?: string

    // OAuth2 登录的目标 AppSecret，用于请求签名
    @Column({ type: 'varchar', length: 255, nullable: true })
    appSecret?: string

}
