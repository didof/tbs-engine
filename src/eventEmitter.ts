import EventEmitter from "events"
import { Nullable } from "./utils/types"

export enum Event {
    AddPlayer = "add-player",
    Turn = "new-turn",
    Ready = "ready",
    Start = "start",
    End = "end"
}

export interface EventData<P extends object, M extends Nullable<object> = null> {
    payload: P
    meta?: M
}

export default class TBSEngineEventEmitter extends EventEmitter {
    public structuredEmit<P extends object, M extends Nullable<object> = null>(event: Event, data?: EventData<P, M>): boolean {
        return this.emit(event, data)
    }
}
