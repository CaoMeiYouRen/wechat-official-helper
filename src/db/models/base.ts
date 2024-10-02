import { PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm'

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

