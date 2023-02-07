import { Nullable } from "./utils/types"
import { ErrorMaxPlayer } from "./error"
import TBSEventEmitter, { TBSEvent, TBSEventData } from "./eventEmitter"
import Player, { PlayerSnapshot } from "./player"
import { deepFreeze } from "./utils/immutable"

type OnAddCb = (data: TBSEventData) => void
type OnReadyCb = () => void

interface PlayersOptions {
    amount: number
    onAdd: OnAddCb
    onReady: OnReadyCb
}

export default class Players extends TBSEventEmitter {
    private readonly _amount: number
    private readonly _list: Player[] = []
    constructor(opts: PlayersOptions) {
        super()
        this._amount = opts.amount
        this.on(TBSEvent.AddPlayer, opts.onAdd)
        this.on(TBSEvent.Ready, opts.onReady)
    }

    public add(player: Player): Nullable<ErrorMaxPlayer> {
        if (this._list.length < this._amount) {
            this._list.push(player)
            this.structuredEmit(TBSEvent.AddPlayer, { payload: { player } })
            if (this.ready) this.structuredEmit(TBSEvent.Ready)
            return null
        }
        return new ErrorMaxPlayer(player, this._amount)
    }

    get list(): readonly PlayerSnapshot[] {
        return deepFreeze([...this._list.map((item, index) => item.snapshot(index))])
    }

    get size(): [registered: number, total: number] {
        return [this.list.length, this._amount]
    }

    get ready(): boolean {
        const [current, expected] = this.size
        return current === expected
    }
}