import { Immutable, Nullable } from "./utils/types"
import ErrorTBSEngine, * as errors from "./error"
import { TBSEvent } from "./eventEmitter"
import Player, { PlayerSnapshot } from "./player"
import Players from "./players"
import { deepFreeze } from "./utils/immutable"
import Turns from "./turns"

type TBSEContext = Immutable<{
    players: PlayerSnapshot[]
    turn: {
        current: number,
        total: number
    }
    activePlayer?: PlayerSnapshot
}>

type TBSEEventCallback<T = unknown> = (ctx: TBSEContext) => T | Promise<T>

class TBSEngine {
    private _ecbMap: Map<TBSEvent, TBSEEventCallback[]> = new Map()
    public players: Players
    protected turns: Turns

    constructor(playersAmount: number, maxTurns: number) {
        this.players = new Players({
            amount: playersAmount,
            onAdd: async (data) => await this.safeRunCallback(TBSEvent.AddPlayer, data.payload.player),
            onReady: async () => await this.safeRunCallback(TBSEvent.Ready)
        })
        this.turns = new Turns({
            amount: maxTurns
        })
    }

    public async start(): Promise<Nullable<ErrorTBSEngine>> {
        if (!this.players.ready) {
            return new errors.ErrorInsufficientPlayers(...this.players.size)
        }

        const iter = this.players.rotate()
        let player = iter.next().value

        this.safeRunCallback(TBSEvent.Start, player)

        let cbs = this._ecbMap.get(TBSEvent.Turn)
        if (!cbs) {
            return new errors.ErrorUnregisteredTurnCallback()
        }
        let run = true

        while (run) {
            player = iter.next().value
            this.turns.increment()
            for (const cb of cbs) {
                const res = await cb(this.createContext(player))
                if (res === true || this.turns.done) {
                    run = false
                    break
                }
            }
        }

        this.safeRunCallback(TBSEvent.End, player)

        return null
    }

    public onAddPlayer(cb: TBSEEventCallback<void>): this {
        const event = TBSEvent.AddPlayer
        const cbs = this._ecbMap.get(event) || []
        this._ecbMap.set(event, [...cbs, cb])
        return this
    }

    public onTurn(cb: TBSEEventCallback<boolean | void>): this {
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

    private createContext(activePlayer?: Player): TBSEContext {
        const [current, total] = this.turns.size
        const players = this.players.list
        return deepFreeze({
            players,
            activePlayer: activePlayer ? activePlayer.snapshot : undefined,
            turn: {
                current,
                total
            }
        })
    }

    private async safeRunCallback(event: TBSEvent, player?: Player): Promise<boolean> {
        const cbs = this._ecbMap.get(event)
        if (!cbs) return false
        const ctx = this.createContext(player)
        for (const cb of cbs) {
            await cb(ctx)
        }
        return true
    }
}

type TurnBasedStrategyEngineOptions = {
    playersAmount: number
    maxTurns: number
}
export function createTurnBasedStrategyEngine(opts: TurnBasedStrategyEngineOptions): TBSEngine {
    return new TBSEngine(opts.playersAmount, opts.maxTurns)
}