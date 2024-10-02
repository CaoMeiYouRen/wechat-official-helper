import { DataSource } from 'typeorm'
import { SnakeCaseNamingStrategy } from './naming-strategy'
import { SubscribeEvent, SubscribeAndScanEvent, ScanEvent, LocationEvent, ClickEvent, ViewEvent } from './models/event'
import { TextMessage, ImageMessage, VoiceMessage, VideoMessage, ShortVideoMessage, LocationMessage, LinkMessage } from './models/message'
import { BaseObject, BaseEvent, BaseMessage } from './models/wechat-base'
import { User } from './models/user'
import { VerifyCode } from './models/verify-code'
import { Rule } from './models/rule'
import { __DEV__, DATABASE_URL, TIMEOUT } from '@/env'

let dataSource: DataSource

export async function getDataSource() {
    if (!dataSource) {
        dataSource = new DataSource({
            type: 'postgres',
            url: DATABASE_URL,
            // 实体类
            entities: [
                User,
                BaseObject,
                BaseEvent,
                BaseMessage,
                TextMessage,
                ImageMessage,
                VoiceMessage,
                VideoMessage,
                ShortVideoMessage,
                LocationMessage,
                LinkMessage,
                SubscribeEvent,
                SubscribeAndScanEvent,
                ScanEvent,
                LocationEvent,
                ClickEvent,
                ViewEvent,
                VerifyCode,
                Rule,
            ],
            // 自动创建数据库架构
            synchronize: __DEV__,
            // 所有表（或集合）加的前缀
            entityPrefix: 'wechat_',
            // 表、字段命名策略，改为 snake_case
            namingStrategy: new SnakeCaseNamingStrategy(),
            // 解析 int8 到 number
            parseInt8: true,
            logger: __DEV__ ? 'debug' : 'simple-console',
            connectTimeoutMS: Math.min(30000, TIMEOUT), // 连接超时时间 30 秒
            useUTC: true, // 时间使用 UTC 时间
        })
        await dataSource.initialize()
    }
    return dataSource
}

