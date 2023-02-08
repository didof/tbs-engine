import { Immutable, Nullable } from "./utils/types"
import ErrorTBSEngine, * as errors from "./error"
import { Event } from "./eventEmitter"
import { PlayerSnapshot } from "./player"
import Players from "./players"
import { deepFreeze } from "./utils/immutable"
import Turns from "./turns"

type Context = Immutable<{
    players: PlayerSnapshot[]
    turn: {
        current: number,
        total: number
    }
}>

type WithActivePlayer = {
    activePlayer: PlayerSnapshot
}

type WithAddedPlayer = {
    addedPlayer: PlayerSnapshot
}

type EventCallback<C, R = void> = (ctx: C) => R | Promise<R>
type EventCallbackAddPlayer = EventCallback<Context & WithAddedPlayer>
type EventCallbackTurn = EventCallback<Context & WithActivePlayer, boolean | void>
type EventCallbackReady = EventCallback<Context & WithActivePlayer>
type EventCallbackStart = EventCallback<Context & WithActivePlayer>
type EventCallbackEnd = EventCallback<Context & WithActivePlayer>

class TBSEngine {
    private readonly _callbacks: {
        [Event.AddPlayer]: EventCallbackAddPlayer[]
        [Event.Turn]: EventCallbackTurn[]
        [Event.Ready]: EventCallbackReady[]
        [Event.Start]: EventCallbackStart[]
        [Event.End]: EventCallbackEnd[]
    } = {
            [Event.AddPlayer]: [],
            [Event.Turn]: [],
            [Event.Ready]: [],
            [Event.Start]: [],
            [Event.End]: []
        }
    public players: Players
    protected _activePlayerSnapshot: Nullable<PlayerSnapshot> = null
    protected turns: Turns

    constructor(playersAmount: number, maxTurns: number) {
        this.players = new Players({
            amount: playersAmount,
            onAdd: async ({ payload }) => {
                const cbs = this._callbacks[Event.AddPlayer]
                if (cbs.length > 0) {
                    const [current, total] = this.turns.size
                    const ctx: Context & WithAddedPlayer = deepFreeze({
                        players: this.players.list,
                        turn: { current, total },
                        addedPlayer: payload.player
                    })
                    for (const cb of cbs) {
                        await cb(ctx)
                    }
                }
            },
            onReady: async () => {
                const cbs = this._callbacks[Event.Ready]
                if (cbs.length > 0) {
                    const [current, total] = this.turns.size
                    const ctx: Context & WithActivePlayer = deepFreeze({
                        players: this.players.list,
                        turn: { current, total },
                        activePlayer: this._activePlayerSnapshot!
                    })
                    for (const cb of cbs) {
                        await cb(ctx)
                    }
                }
            }
        })
        this.turns = new Turns({
            amount: maxTurns
        })
    }

    public async start(): Promise<Nullable<ErrorTBSEngine>> {
        if (!this.players.ready) {
            return new errors.ErrorInsufficientPlayers(...this.players.size)
        }

        let [current, total] = this.turns.size
        const players = this.players.list
        const iter = this.players.rotate()
        this._activePlayerSnapshot = iter.next().value

        {
            const cbs = this._callbacks[Event.Start]
            if (cbs.length > 0) {
                const ctx: Context & WithActivePlayer = deepFreeze({
                    players,
                    turn: { current, total },
                    activePlayer: this._activePlayerSnapshot
                })
                for (const cb of cbs) {
                    await cb(ctx)
                }
            }
        }

        {
            const cbs = this._callbacks[Event.Turn]
            if (!cbs) {
                return new errors.ErrorUnregisteredTurnCallback()
            }
            let run = true

            while (run) {
                this._activePlayerSnapshot = iter.next().value
                this.turns.increment()
                current = this.turns.size[0]
                const ctx: Context & WithActivePlayer = deepFreeze({
                    players,
                    turn: { current, total },
                    activePlayer: this._activePlayerSnapshot
                })
                for (const cb of cbs) {
                    const res = await cb(ctx)
                    if (res === true || this.turns.done) {
                        run = false
                        break
                    }
                }
            }
        }

        {
            const cbs = this._callbacks[Event.End]
            if (cbs.length > 0) {
                const ctx: Context & WithActivePlayer = deepFreeze({
                    players,
                    turn: { current, total },
                    activePlayer: this._activePlayerSnapshot
                })
                for (const cb of cbs) {
                    await cb(ctx)
                }
            }
        }

        return null
    }

    public onAddPlayer(cb: EventCallbackAddPlayer): this {
        this._callbacks[Event.AddPlayer].push(cb)
        return this
    }

    public onTurn(cb: EventCallbackTurn): this {
        this._callbacks[Event.Turn].push(cb)
        return this
    }

    public onReady(cb: EventCallbackReady): this {
        this._callbacks[Event.Ready].push(cb)
        return this
    }

    public onStart(cb: EventCallbackStart): this {
        this._callbacks[Event.Start].push(cb)
        return this
    }

    public onEnd(cb: EventCallbackEnd): this {
        this._callbacks[Event.End].push(cb)
        return this
    }
}

type TurnBasedStrategyEngineOptions = {
    playersAmount: number
    maxTurns: number
}
export function createTurnBasedStrategyEngine(opts: TurnBasedStrategyEngineOptions): TBSEngine {
    return new TBSEngine(opts.playersAmount, opts.maxTurns)
}