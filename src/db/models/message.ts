import { Entity, Column, OneToOne, JoinColumn } from 'typeorm'
import { BaseMessage } from './base'

@Entity()
export class TextMessage extends BaseMessage {
    @Column({ type: 'varchar', length: 1024, nullable: true })
    content: string
}

@Entity()
export class ImageMessage extends BaseMessage {
    @Column({ type: 'varchar', length: 255, nullable: true })
    picUrl: string

    @Column({ type: 'varchar', length: 255, nullable: true })
    mediaId: string
}

@Entity()
export class VoiceMessage extends BaseMessage {
    @Column({ type: 'varchar', length: 255, nullable: true })
    mediaId: string

    @Column({ type: 'varchar', length: 50, nullable: true })
    format: string
}

@Entity()
export class VideoMessage extends BaseMessage {
    @Column({ type: 'varchar', length: 255, nullable: true })
    mediaId: string

    @Column({ type: 'varchar', length: 255, nullable: true })
    thumbMediaId: string
}

@Entity()
export class ShortvideoMessage extends BaseMessage {
    @Column({ type: 'varchar', length: 255, nullable: true })
    mediaId: string

    @Column({ type: 'varchar', length: 255, nullable: true })
    thumbMediaId: string
}

@Entity()
export class LocationMessage extends BaseMessage {
    @Column({ type: 'varchar', length: 255, nullable: true })
    locationX: string

    @Column({ type: 'varchar', length: 255, nullable: true })
    locationY: string

    @Column({ type: 'varchar', length: 255, nullable: true })
    scale: string

    @Column({ type: 'varchar', length: 255, nullable: true })
    label: string
}

@Entity()
export class LinkMessage extends BaseMessage {
    @Column({ type: 'varchar', length: 255, nullable: true })
    title: string

    @Column({ type: 'varchar', length: 1024, nullable: true })
    description: string

    @Column({ type: 'varchar', length: 255, nullable: true })
    url: string
}
