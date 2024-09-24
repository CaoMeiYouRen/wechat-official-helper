import { Entity, Column } from 'typeorm'
import { BaseEvent } from './base'

@Entity()
export class SubscribeEvent extends BaseEvent {
    @Column({ type: 'varchar', length: 50, nullable: true })
    event: 'subscribe' | 'unsubscribe'
}

@Entity()
export class SubscribeAndScanEvent extends BaseEvent {
    @Column({ type: 'varchar', length: 50, nullable: true })
    event: 'subscribe'

    @Column({ type: 'varchar', length: 255, nullable: true })
    eventKey: string

    @Column({ type: 'varchar', length: 255, nullable: true })
    ticket: string
}

@Entity()
export class ScanEvent extends BaseEvent {
    @Column({ type: 'varchar', length: 50, nullable: true })
    event: 'SCAN'

    @Column({ type: 'varchar', length: 255, nullable: true })
    eventKey: string

    @Column({ type: 'varchar', length: 255, nullable: true })
    ticket: string
}

@Entity()
export class LocationEvent extends BaseEvent {
    @Column({ type: 'varchar', length: 50, nullable: true })
    event: 'LOCATION'

    @Column({ type: 'varchar', length: 255, nullable: true })
    latitude: string

    @Column({ type: 'varchar', length: 255, nullable: true })
    longitude: string

    @Column({ type: 'varchar', length: 255, nullable: true })
    precision: string
}

@Entity()
export class ClickEvent extends BaseEvent {
    @Column({ type: 'varchar', length: 50, nullable: true })
    event: 'CLICK'

    @Column({ type: 'varchar', length: 255, nullable: true })
    eventKey: string
}

@Entity()
export class ViewEvent extends BaseEvent {
    @Column({ type: 'varchar', length: 50, nullable: true })
    event: 'VIEW'

    @Column({ type: 'varchar', length: 255, nullable: true })
    eventKey: string
}
