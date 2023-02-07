import EventEmitter from "events"

export enum TBSEvent {
    AddPlayer = "add-player",
    Turn = "new-turn",
    Ready = "ready",
    Start = "start",
    End = "end"
}

export interface TBSEventData {
    payload: Record<string, any>
    meta?: Record<string, any>
}

export default class TBSEngineEventEmitter extends EventEmitter {
    public structuredEmit(event: TBSEvent, data?: TBSEventData): boolean {
        return this.emit(event, data)
    }
}
