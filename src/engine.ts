import { Nullable } from "./utils/types"
import ErrorTBSEngine, * as errors from "./error"
import { TBSEngineEvent } from "./eventEmitter"
import { PlayerSnapshot } from "./player"
import Players from "./players"

// TODO transform to Immutable
type TBSEContext = Readonly<{
    players: readonly PlayerSnapshot[]
}>

class TBSEngine {
    public players: Players

    // TODO Based on the EventType, expect different return
    private _ecbMap: Map<TBSEngineEvent, ((ctx: TBSEContext) => Promise<boolean>)[]> = new Map()

    constructor(playersAmount: number) {
        this.players = new Players({
            amount: playersAmount,
            onAdd: async (_) => {
                const cbs = this._ecbMap.get(TBSEngineEvent.AddPlayer)
                if (!cbs) return

                const ctx = this.createContext()
                for (const cb of cbs) {
                    await cb(ctx)
                }
            },
        })
    }

    public async start(): Promise<Nullable<ErrorTBSEngine>> {
        if (!this.players.ready) {
            return new errors.ErrorInsufficientPlayers(...this.players.size)
        }

        const cbs = this._ecbMap.get(TBSEngineEvent.NewTurn)
        if (!cbs) {
            return new errors.ErrorUnregisteredNewTurnCallback()
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

        {
            const cbs = this._ecbMap.get(TBSEngineEvent.End)
            if (cbs) {
                const ctx = this.createContext()
                for (const cb of cbs) {
                    await cb(ctx)
                }
            }
        }

        return null
    }

    public on(event: TBSEngineEvent, cb: (ctx: TBSEContext) => Promise<boolean>): this {
        const cbs = this._ecbMap.get(event)
        if (!cbs) {
            this._ecbMap.set(event, [cb])
        } else {
            this._ecbMap.set(event, [...cbs, cb])
        }
        return this
    }

    private createContext(): TBSEContext {
        return {
            players: this.players.list
        }
    }
}

interface TurnBasedStrategyEngineOptions {
    playersAmount: number
}

export function createTurnBasedStrategyEngine(opts: TurnBasedStrategyEngineOptions): TBSEngine {
    const engine = new TBSEngine(opts.playersAmount)

    return engine
}