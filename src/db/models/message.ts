import { Column, ChildEntity } from 'typeorm'
import { BaseMessage } from './wechat-base'
import { IImageMessage, ILinkMessage, ILocationMessage, IShortVideoMessage, ITextMessage, IVideoMessage, IVoiceMessage } from '@/interfaces/wechat-message'

@ChildEntity()
export class TextMessage extends BaseMessage implements ITextMessage {

    declare msgType: 'text'

    @Column({ type: 'varchar', length: 1024, nullable: true })
    content: string
}

@ChildEntity()
export class ImageMessage extends BaseMessage implements IImageMessage {

    declare msgType: 'image'

    @Column({ type: 'varchar', length: 255, nullable: true })
    picUrl: string

    @Column({ type: 'varchar', length: 255, nullable: true })
    mediaId: string
}

@ChildEntity()
export class VoiceMessage extends BaseMessage implements IVoiceMessage {

    declare msgType: 'voice'

    @Column({ type: 'varchar', length: 255, nullable: true })
    mediaId: string

    @Column({ type: 'varchar', length: 50, nullable: true })
    format: string
}

@ChildEntity()
export class VideoMessage extends BaseMessage implements IVideoMessage {

    declare msgType: 'video'

    @Column({ type: 'varchar', length: 255, nullable: true })
    mediaId: string

    @Column({ type: 'varchar', length: 255, nullable: true })
    thumbMediaId: string
}

@ChildEntity()
export class ShortVideoMessage extends BaseMessage implements IShortVideoMessage {

    declare msgType: 'shortvideo'

    @Column({ type: 'varchar', length: 255, nullable: true })
    mediaId: string

    @Column({ type: 'varchar', length: 255, nullable: true })
    thumbMediaId: string
}

@ChildEntity()
export class LocationMessage extends BaseMessage implements ILocationMessage {

    declare msgType: 'location'

    @Column({ type: 'varchar', length: 255, nullable: true })
    locationX: string

    @Column({ type: 'varchar', length: 255, nullable: true })
    locationY: string

    @Column({ type: 'varchar', length: 255, nullable: true })
    scale: string

    @Column({ type: 'varchar', length: 255, nullable: true })
    label: string
}

@ChildEntity()
export class LinkMessage extends BaseMessage implements ILinkMessage {

    declare msgType: 'link'

    @Column({ type: 'varchar', length: 255, nullable: true })
    title: string

    @Column({ type: 'varchar', length: 1024, nullable: true })
    description: string

    @Column({ type: 'varchar', length: 255, nullable: true })
    url: string
}
