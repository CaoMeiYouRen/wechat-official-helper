import { ManyToOne, Column } from 'typeorm'
import { User } from './user'
import { Base } from './base'
/**
 * 带有用户的基类
 *
 * @author CaoMeiYouRen
 * @date 2024-10-07
 * @export
 * @abstract
 * @class AclBase
 */
export abstract class AclBase extends Base {
    @Column({
        type: 'int',
        nullable: true,
    })
    userId?: number

    @ManyToOne(() => User)
    user?: User
}
