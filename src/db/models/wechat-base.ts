import { Entity, TableInheritance, Column, ChildEntity } from 'typeorm'
import { Base } from './base'
import { IBaseEvent } from '@/interfaces/wechat-event'
import { IBaseMessage } from '@/interfaces/wechat-message'

@Entity({ name: 'message' })
@TableInheritance({ column: { type: 'varchar', name: 'type' } })
export class BaseObject extends Base {
    @Column({ type: 'varchar', length: 50, nullable: false })
    msgType: string

    @Column({ type: 'varchar', length: 255, nullable: false })
    toUserName: string

    @Column({ type: 'varchar', length: 255, nullable: false })
    fromUserName: string

    @Column({ type: 'varchar', length: 20, nullable: false })
    createTime: string

    // 是否已响应该事件/消息
    @Column({ type: 'boolean', default: false, nullable: true })
    responded: boolean
}

@ChildEntity()
export class BaseEvent extends BaseObject implements IBaseEvent {

    declare msgType: 'event'

    @Column({ type: 'varchar', length: 50, nullable: false })
    event: string
}

@ChildEntity()
export class BaseMessage extends BaseObject implements IBaseMessage {

    @Column({ type: 'varchar', length: 64, nullable: true })
    msgId: string

    @Column({ type: 'varchar', length: 64, nullable: true })
    msgDataId: string

    @Column({ type: 'varchar', length: 10, nullable: true })
    idx: string
}
