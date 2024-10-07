import { Column, Entity } from 'typeorm'
import { AclBase } from './base'

/**
 * 场景类型
 */
export type SceneType = 'login' | 'register' | 'resetPassword' | 'bindWechat' | 'unbindWechat' | 'access-code'

/**
 * 验证码实体类
 *
 * @author CaoMeiYouRen
 * @date 2024-10-01
 * @export
 * @class VerifyCode
 */
@Entity()
export class VerifyCode extends AclBase {

    // 验证码
    @Column({ type: 'varchar', length: 50, nullable: false })
    code: string

    // 场景，比如登录、注册、找回密码等
    @Column({ type: 'varchar', length: 50, nullable: true })
    scene: SceneType

    // 微信 openid，也就是 fromUserName
    // @Column({ type: 'varchar', length: 255, nullable: true })
    // wechatOpenid: string

    // 过期时间
    @Column({ type: 'timestamptz', nullable: true })
    expiredAt: Date

    // 是否已经使用
    @Column({ type: 'boolean', default: false, nullable: true })
    used: boolean
}
