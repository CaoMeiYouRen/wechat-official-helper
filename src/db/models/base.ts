import { PrimaryGeneratedColumn, Column } from 'typeorm'

// @Entity()
export class Base {
    @PrimaryGeneratedColumn()
    id: number

    @Column({ type: 'varchar', length: 50, nullable: false })
    msgType: string

    @Column({ type: 'varchar', length: 255, nullable: false })
    toUserName: string

    @Column({ type: 'varchar', length: 255, nullable: false })
    fromUserName: string

    @Column({ type: 'varchar', length: 20, nullable: false })
    createTime: string

}

export class BaseEvent extends Base {
    // @Column({ type: 'varchar', length: 50, nullable: false })
    // event: string
}

export class BaseMessage extends Base {
    @Column({ type: 'varchar', length: 64, nullable: true })
    msgId: string

    @Column({ type: 'varchar', length: 64, nullable: true })
    msgDataId?: string

    @Column({ type: 'varchar', length: 10, nullable: true })
    idx?: string
}
