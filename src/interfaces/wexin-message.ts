import { CamelCaseObject } from './utils'

/**
 * 接收消息
 */
export interface BaseMessage {
    /**
     *消息类型
     */
    MsgType: string
    /**
     * 开发者微信号
     */
    ToUserName: string
    /**
     * 发送方账号（一个OpenID）
     */
    FromUserName: string
    /**
     * 消息创建时间 （整型）10 位
     */
    CreateTime: string
    /**
     * 消息id，64位整型
     */
    MsgId: string
    /**
     * 消息的数据ID（消息如果来自文章时才有）
     */
    MsgDataId: string
    /**
     * 多图文时第几篇文章，从1开始（消息如果来自文章时才有）
     */
    Idx: string
}

export type IBaseMessage = CamelCaseObject<BaseMessage>

export interface TextMessage extends BaseMessage {
    MsgType: 'text'
    /**
     * 文本消息内容
     */
    Content: string
}

export type ITextMessage = CamelCaseObject<TextMessage>

export interface ImageMessage extends BaseMessage {
    MsgType: 'image'
    /**
     * 图片链接（由系统生成）
     */
    PicUrl: string
    /**
     * 图片消息媒体id，可以调用获取临时素材接口拉取数据。
     */
    MediaId: string
}

export type IImageMessage = CamelCaseObject<ImageMessage>

export interface VoiceMessage extends BaseMessage {
    MsgType: 'voice'
    /**
     * 语音消息媒体id，可以调用获取临时素材接口拉取数据。
     */
    MediaId: string
    /**
     * 语音格式，如amr，speex等
     */
    Format: string
}

export type IVoiceMessage = CamelCaseObject<VoiceMessage>

export interface VideoMessage extends BaseMessage {
    MsgType: 'video'
    /**
     * 视频消息媒体id，可以调用获取临时素材接口拉取数据。
     */
    MediaId: string
    /**
     * 视频消息缩略图的媒体id，可以调用多媒体文件下载接口拉取数据。
     */
    ThumbMediaId: string
}

export type IVideoMessage = CamelCaseObject<VideoMessage>

export interface ShortVideoMessage extends BaseMessage {
    MsgType: 'shortvideo'
    /**
     * 视频消息媒体id，可以调用获取临时素材接口拉取数据。
     */
    MediaId: string
    /**
     * 视频消息缩略图的媒体id，可以调用多媒体文件下载接口拉取数据。
     */
    ThumbMediaId: string
}

export type IShortVideoMessage = CamelCaseObject<ShortVideoMessage>

export interface LocationMessage extends BaseMessage {
    MsgType: 'location'
    /**
     * 地理位置纬度
     */
    Location_X: string
    /**
     * 地理位置经度
     */
    Location_Y: string
    /**
     * 地图缩放大小
     */
    Scale: string
    /**
     * 地理位置信息
     */
    Label: string
}

export type ILocationMessage = CamelCaseObject<LocationMessage>

export interface LinkMessage extends BaseMessage {
    MsgType: 'link'
    /**
     * 消息标题
     */
    Title: string
    /**
     *  消息描述
     */
    Description: string
    /**
     * Url
     */
    Url: string
}

export type ILinkMessage = CamelCaseObject<LinkMessage>

export type WexinMessage = TextMessage | ImageMessage | VoiceMessage | VideoMessage | IShortVideoMessage | LocationMessage | LinkMessage

export type IWexinMessage = CamelCaseObject<WexinMessage>

