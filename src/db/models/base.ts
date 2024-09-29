import { PrimaryGeneratedColumn, Column, Entity, TableInheritance, ChildEntity, CreateDateColumn } from 'typeorm'
import { IBaseMessage } from '@/interfaces/wexin-message'
import { IBaseEvent } from '@/interfaces/wexin-event'

@Entity()
@TableInheritance({ column: { type: 'varchar', name: 'type' } })
export class Base {
    @PrimaryGeneratedColumn()
    id: number

    @CreateDateColumn()
    createdAt: Date

    @Column({ type: 'varchar', length: 50, nullable: false })
    msgType: string

    @Column({ type: 'varchar', length: 255, nullable: false })
    toUserName: string

    @Column({ type: 'varchar', length: 255, nullable: false })
    fromUserName: string

    @Column({ type: 'varchar', length: 20, nullable: false })
    createTime: string

}

@ChildEntity()
export class BaseEvent extends Base implements IBaseEvent {

    declare msgType: 'event'

    @Column({ type: 'varchar', length: 50, nullable: false })
    event: string
}

@ChildEntity()
export class BaseMessage extends Base implements IBaseMessage {
    @Column({ type: 'varchar', length: 64, nullable: true })
    msgId: string

    @Column({ type: 'varchar', length: 64, nullable: true })
    msgDataId: string

    @Column({ type: 'varchar', length: 10, nullable: true })
    idx: string
}
