import { Nullable } from "./utils/types"
import { ErrorMaxPlayer } from "./error"
import TBSEngineEventEmitter, { TBSEngineEvent, TBSEngineEventData } from "./eventEmitter"
import Player, { PlayerSnapshot } from "./player"

type OnAddCb = (data: TBSEngineEventData) => void

interface PlayersOptions {
    amount: number
    onAdd: OnAddCb
}

export default class Players extends TBSEngineEventEmitter {
    private readonly _amount: number
    private readonly _list: Player[] = []
    constructor(opts: PlayersOptions) {
        super()
        this._amount = opts.amount
        this.on(TBSEngineEvent.AddPlayer, opts.onAdd)
    }

    public add(player: Player): Nullable<ErrorMaxPlayer> {
        if (this._list.length < this._amount) {
            this._list.push(player)
            this.structuredEmit(TBSEngineEvent.AddPlayer, { payload: { player } })
            return null
        }
        return new ErrorMaxPlayer(player, this._amount)
    }

    get list(): readonly PlayerSnapshot[] {
        // TODO deep
        return [...this._list.map((item, index) => item.snapshot(index))]
    }

    get size(): [registered: number, total: number] {
        return [this.list.length, this._amount]
    }

    get ready(): boolean {
        const [current, expected] = this.size
        return current === expected
    }
}