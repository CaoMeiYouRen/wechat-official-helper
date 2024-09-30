
import { BeforeInsert, BeforeUpdate, Column, Entity } from 'typeorm'
import { Base } from './base'
import { hashPassword } from '@/utils/helper'
/**
 * 用户实体类
 *
 * @author CaoMeiYouRen
 * @date 2024-10-01
 * @export
 * @class User
 */
@Entity()
export class User extends Base {

    // 用户名
    @Column({ type: 'varchar', length: 255, nullable: false })
    username: string

    // 密码
    @Column({ type: 'varchar', length: 255, nullable: false, select: false })
    password: string

    @BeforeInsert()
    @BeforeUpdate()
    private async hashPassword() {
        if (this.password) {
            // 密码加密
            this.password = await hashPassword(this.password)
        }
    }

    // 邮箱
    @Column({ type: 'varchar', length: 255, nullable: true })
    email?: string

    // 邮箱验证状态
    @Column({ type: 'boolean', default: false })
    emailVerified: boolean

    // 微信 openid
    @Column({ type: 'varchar', length: 255, nullable: true })
    wechatOpenid: string

    // 微信 unionid
    @Column({ type: 'varchar', length: 255, nullable: true })
    wechatUnionid?: string

}
