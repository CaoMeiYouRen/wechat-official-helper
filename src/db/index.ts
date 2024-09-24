import { DataSource } from 'typeorm'
import { SnakeCaseNamingStrategy } from './naming-strategy'
import { SubscribeEvent, SubscribeAndScanEvent, ScanEvent, LocationEvent, ClickEvent, ViewEvent } from './models/event'
import { TextMessage, ImageMessage, VoiceMessage, VideoMessage, ShortvideoMessage, LocationMessage, LinkMessage } from './models/message'
import { __DEV__ } from '@/env'

let dataSource: DataSource

export async function getDataSource() {
    if (!dataSource) {
        dataSource = new DataSource({
            type: 'postgres',
            // 实体类
            entities: [
                TextMessage,
                ImageMessage,
                VoiceMessage,
                VideoMessage,
                ShortvideoMessage,
                LocationMessage,
                LinkMessage,
                SubscribeEvent,
                SubscribeAndScanEvent,
                ScanEvent,
                LocationEvent,
                ClickEvent,
                ViewEvent,
            ],
            // 自动创建数据库架构
            synchronize: __DEV__,
            // 所有表（或集合）加的前缀
            entityPrefix: 'wx_',
            // 表、字段命名策略，改为 snake_case
            namingStrategy: new SnakeCaseNamingStrategy(),
            // 解析 int8 到 number
            parseInt8: true,
        })
    }
    await dataSource.initialize()
    return dataSource
}

