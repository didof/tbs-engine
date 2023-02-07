import EventEmitter from "events"

export enum TBSEngineEvent {
    AddPlayer = "add-player",
    NewTurn = "new-turn",
    End = "end"
}

export interface TBSEngineEventData {
    payload: Record<string, any>
    meta?: Record<string, any>
}

export default class TBSEngineEventEmitter extends EventEmitter {
    public structuredEmit(event: TBSEngineEvent, data: TBSEngineEventData): boolean {
        return this.emit(event, data)
    }
}
