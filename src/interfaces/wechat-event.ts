import { CamelCaseObject } from './utils'

export interface BaseEvent {
    /**
     *消息类型
     */
    MsgType: 'event'
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
     * 事件类型
     */
    Event: string
}

export type IBaseEvent = CamelCaseObject<BaseEvent>

export interface SubscribeEvent extends BaseEvent {
    /**
     * 事件类型，subscribe(订阅)、unsubscribe(取消订阅)
     */
    Event: 'subscribe' | 'unsubscribe'
}

export type ISubscribeEvent = CamelCaseObject<SubscribeEvent>

/**
 * 用户未关注时，进行关注后的事件推送
 *
 * @author CaoMeiYouRen
 * @date 2023-11-14
 * @export
 * @interface SubscribeAndScanEvent
 */
export interface SubscribeAndScanEvent extends BaseEvent {
    Event: 'subscribe'
    /**
     * 事件KEY值，qrscene_为前缀，后面为二维码的参数值
     */
    EventKey: string
    /**
     * 二维码的ticket，可用来换取二维码图片
     */
    Ticket: string
}

export type ISubscribeAndScanEvent = CamelCaseObject<SubscribeAndScanEvent>

export interface ScanEvent extends BaseEvent {
    Event: 'SCAN'
    /**
     * 事件KEY值，是一个32位无符号整数，即创建二维码时的二维码scene_id
     */
    EventKey: string
    /**
     * 二维码的ticket，可用来换取二维码图片
     */
    Ticket: string
}

export type IScanEvent = CamelCaseObject<ScanEvent>

export interface LocationEvent extends BaseEvent {
    Event: 'LOCATION'
    /**
     * 地理位置纬度
     */
    Latitude: string
    /**
     * 地理位置经度
     */
    Longitude: string
    /**
     * 地理位置精度
     */
    Precision: string
}

export type ILocationEvent = CamelCaseObject<LocationEvent>

/**
 * 点击菜单拉取消息时的事件推送
 *
 * @author CaoMeiYouRen
 * @date 2023-11-14
 * @export
 * @interface ClickEvent
 */
export interface ClickEvent extends BaseEvent {
    Event: 'CLICK'
    /**
     *  事件KEY值，与自定义菜单接口中KEY值对应
     */
    EventKey: string
}

export type IClickEvent = CamelCaseObject<ClickEvent>

/**
 *点击菜单跳转链接时的事件推送
 *
 * @author CaoMeiYouRen
 * @date 2023-11-14
 * @export
 * @interface ViewEvent
 */
export interface ViewEvent extends BaseEvent {
    Event: 'VIEW'
    /**
     *  事件KEY值，设置的跳转URL
     */
    EventKey: string
}

export type IViewEvent = CamelCaseObject<ViewEvent>

export type WechatEvent = SubscribeEvent | SubscribeAndScanEvent | ScanEvent | LocationEvent | ClickEvent | ViewEvent

export type IWechatEvent = CamelCaseObject<WechatEvent>
