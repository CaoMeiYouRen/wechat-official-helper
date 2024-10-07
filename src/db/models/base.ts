import { PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm'

/**
 * 基类
 *
 * @author CaoMeiYouRen
 * @date 2024-10-07
 * @export
 * @abstract
 * @class Base
 */
export abstract class Base {
    @PrimaryGeneratedColumn()
    id: number

    @CreateDateColumn({
        type: 'timestamptz',
    })
    createdAt: Date

    @UpdateDateColumn({
        type: 'timestamptz',
    })
    updatedAt: Date
}

