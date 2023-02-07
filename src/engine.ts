import { Immutable, Nullable } from "./utils/types"
import ErrorTBSEngine, * as errors from "./error"
import { TBSEvent } from "./eventEmitter"
import { PlayerSnapshot } from "./player"
import Players from "./players"
import { deepFreeze } from "./utils/immutable"

type TBSEContext = Immutable<{
    players: readonly PlayerSnapshot[]
}>

type TBSEEventCallback<T = unknown> = (ctx: TBSEContext) => T | Promise<T>

class TBSEngine {
    public players: Players

    private _ecbMap: Map<TBSEvent, TBSEEventCallback[]> = new Map()

    constructor(playersAmount: number) {
        this.players = new Players({
            amount: playersAmount,
            onAdd: async (_) => await this.safeRunCallback(TBSEvent.AddPlayer),
            onReady: async () => await this.safeRunCallback(TBSEvent.Ready)
        })
    }

    public async start(): Promise<Nullable<ErrorTBSEngine>> {
        if (!this.players.ready) {
            return new errors.ErrorInsufficientPlayers(...this.players.size)
        }

        this.safeRunCallback(TBSEvent.Start)

        let cbs = this._ecbMap.get(TBSEvent.Turn)
        if (!cbs) {
            return new errors.ErrorUnregisteredTurnCallback()
        }
        let run = true
        while (run) {
            for (const cb of cbs) {
                const ctx = this.createContext()
                const res = await cb(ctx)
                if (res === false) {
                    run = false
                    break
                }
            }
        }

        this.safeRunCallback(TBSEvent.End)

        return null
    }

    public onAddPlayer(cb: TBSEEventCallback<void>): this {
        const event = TBSEvent.AddPlayer
        const cbs = this._ecbMap.get(event) || []
        this._ecbMap.set(event, [...cbs, cb])
        return this
    }

    public onTurn(cb: TBSEEventCallback<boolean>): this {
        const event = TBSEvent.Turn
        const cbs = this._ecbMap.get(event) || []
        this._ecbMap.set(event, [...cbs, cb])
        return this
    }

    public onReady(cb: TBSEEventCallback<void>): this {
        const event = TBSEvent.Ready
        const cbs = this._ecbMap.get(event) || []
        this._ecbMap.set(event, [...cbs, cb])
        return this
    }

    public onStart(cb: TBSEEventCallback<void>): this {
        const event = TBSEvent.Start
        const cbs = this._ecbMap.get(event) || []
        this._ecbMap.set(event, [...cbs, cb])
        return this
    }

    public onEnd(cb: TBSEEventCallback<void>): this {
        const event = TBSEvent.End
        const cbs = this._ecbMap.get(event) || []
        this._ecbMap.set(event, [...cbs, cb])
        return this
    }

    private createContext(): TBSEContext {
        return deepFreeze({
            players: this.players.list
        })
    }

    private async safeRunCallback(event: TBSEvent): Promise<boolean> {
        const cbs = this._ecbMap.get(event)
        if (!cbs) return false
        const ctx = this.createContext()
        for (const cb of cbs) {
            await cb(ctx)
        }
        return true

    }
}

interface TurnBasedStrategyEngineOptions {
    playersAmount: number
}

export function createTurnBasedStrategyEngine(opts: TurnBasedStrategyEngineOptions): TBSEngine {
    const engine = new TBSEngine(opts.playersAmount)

    return engine
}