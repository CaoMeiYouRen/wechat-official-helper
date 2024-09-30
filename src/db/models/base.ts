import { PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm'

export abstract class Base {
    @PrimaryGeneratedColumn()
    id: number

    @CreateDateColumn()
    createdAt: Date

    @UpdateDateColumn()
    updatedAt: Date
}

