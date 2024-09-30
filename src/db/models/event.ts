import { Column, ChildEntity } from 'typeorm'
import { BaseEvent } from './wechat-base'
import { IClickEvent, ILocationEvent, IScanEvent, ISubscribeAndScanEvent, ISubscribeEvent, IViewEvent } from '@/interfaces/wechat-event'

@ChildEntity()
export class SubscribeEvent extends BaseEvent implements ISubscribeEvent {

    declare event: 'subscribe' | 'unsubscribe'
}

@ChildEntity()
export class SubscribeAndScanEvent extends BaseEvent implements ISubscribeAndScanEvent {

    declare event: 'subscribe'

    @Column({ type: 'varchar', length: 255, nullable: true })
    eventKey: string

    @Column({ type: 'varchar', length: 255, nullable: true })
    ticket: string
}

@ChildEntity()
export class ScanEvent extends BaseEvent implements IScanEvent {

    declare event: 'SCAN'

    @Column({ type: 'varchar', length: 255, nullable: true })
    eventKey: string

    @Column({ type: 'varchar', length: 255, nullable: true })
    ticket: string
}

@ChildEntity()
export class LocationEvent extends BaseEvent implements ILocationEvent {

    declare event: 'LOCATION'

    @Column({ type: 'varchar', length: 255, nullable: true })
    latitude: string

    @Column({ type: 'varchar', length: 255, nullable: true })
    longitude: string

    @Column({ type: 'varchar', length: 255, nullable: true })
    precision: string
}

@ChildEntity()
export class ClickEvent extends BaseEvent implements IClickEvent {

    declare event: 'CLICK'

    @Column({ type: 'varchar', length: 255, nullable: true })
    eventKey: string
}

@ChildEntity()
export class ViewEvent extends BaseEvent implements IViewEvent {

    declare event: 'VIEW'

    @Column({ type: 'varchar', length: 255, nullable: true })
    eventKey: string
}
