/**
 * 回复消息
 */
export interface BaseReplyMessage {
    /**
     *消息类型
    */
    MsgType: string
    /**
     * 接收方账号（收到的OpenID）
     */
    ToUserName: string
    /**
     * 开发者微信号
     */
    FromUserName: string
    /**
     * 消息创建时间 （整型）10 位
     */
    CreateTime: string | number
}

export interface ReplyTextMessage extends BaseReplyMessage {
    MsgType: 'text'
    /**
     * 文本消息内容
     */
    Content: string
}

export interface ReplyImageMessage extends BaseReplyMessage {
    MsgType: 'image'
    Image: {
        /**
         * 通过素材管理中的接口上传多媒体文件，得到的id。
         */
        MediaId: string
    }
}

export interface ReplyVoiceMessage extends BaseReplyMessage {
    MsgType: 'voice'
    Voice: {
        /**
         * 通过素材管理中的接口上传多媒体文件，得到的id。
         */
        MediaId: string
    }
}

export interface ReplyVideoMessage extends BaseReplyMessage {
    MsgType: 'video'
    Video: {
        /**
         * 通过素材管理中的接口上传多媒体文件，得到的id
         */
        MediaId: string
        /**
         * 视频消息的标题
         */
        Title?: string
        /**
         * 视频消息的描述
         */
        Description?: string
    }
}

export interface ReplyMusicMessage extends BaseReplyMessage {
    MsgType: 'music'
    Music: {
        /**
         * 音乐标题
         */
        Title?: string
        /**
         * 音乐描述
         */
        Description?: string
        /**
         * 音乐链接
         */
        MusicUrl: string
        /**
         * 高质量音乐链接，WIFI环境优先使用该链接播放音乐
         */
        HQMusicUrl?: string
        /**
         * 缩略图的媒体id，通过素材管理中的接口上传多媒体文件，得到的id
         */
        ThumbMediaId: string
    }
}

interface Item {
    /**
     * 图文消息标题
     */
    Title: string
    /**
     * 图文消息描述
     */
    Description: string
    /**
     * 图片链接，支持JPG、PNG格式，较好的效果为大图360*200，小图200*200
     */
    PicUrl: string
    /**
     * 点击图文消息跳转链接
     */
    Url: string
}

interface Articles {
    item: Item | Item[]
}

export interface ReplyNewsMessage extends BaseReplyMessage {
    MsgType: 'news'
    /**
     * 图文消息个数；当用户发送文本、图片、语音、视频、图文、地理位置这六种消息时，开发者只能回复1条图文消息；其余场景最多可回复8条图文消息
     */
    ArticleCount: number
    /**
     * 图文消息信息，注意，如果图文数超过限制，则将只发限制内的条数
     */
    Articles: Articles
}

export type WexinReplyMessage = ReplyTextMessage | ReplyImageMessage | ReplyVoiceMessage | ReplyVideoMessage | ReplyMusicMessage | ReplyNewsMessage
