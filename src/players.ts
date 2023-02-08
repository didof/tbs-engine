import { Nullable } from "./utils/types"
import { ErrorMaxPlayer } from "./error"
import EventEmitter, { Event, EventData } from "./eventEmitter"
import Player, { PlayerSnapshot } from "./player"
import { deepFreeze } from "./utils/immutable"

type OnAddCb = (data: EventData<{ player: Player }>) => void
type OnReadyCb = () => void

type PlayersOptions = {
    amount: number
    onAdd: OnAddCb
    onReady: OnReadyCb
}

export default class Players extends EventEmitter {
    private readonly _amount: number
    private readonly _list: Player[] = []
    constructor(opts: PlayersOptions) {
        super()
        this._amount = opts.amount
        this.on(Event.AddPlayer, opts.onAdd)
        this.on(Event.Ready, opts.onReady)
    }

    public add(player: Player): Nullable<ErrorMaxPlayer> {
        if (this._list.length < this._amount) {
            this._list.push(player)
            this.structuredEmit<{ player: Player }>(Event.AddPlayer, { payload: { player } })
            if (this.ready) this.structuredEmit(Event.Ready)
            return null
        }
        return new ErrorMaxPlayer(player, this._amount)
    }

    get list(): readonly PlayerSnapshot[] {
        return deepFreeze([...this._list.map((item, index) => item.snapshot)])
    }

    get size(): [current: number, total: number] {
        return [this.list.length, this._amount]
    }

    get ready(): boolean {
        const [current, expected] = this.size
        return current === expected
    }

    public get(index: number): PlayerSnapshot {
        return this._list[index]!.snapshot
    }

    public *rotate(): Generator<Player, Player, never> {
        let i = 0
        while (true) {
            yield this._list[i++]!
            if (i === this._list.length) i = 0
        }
    }
}