import TBSEngineEventEmitter from "./eventEmitter"

type TurnsOptions = {
    amount: number
}

export default class Turns extends TBSEngineEventEmitter {
    private _amount: number
    private _current: number = 1
    constructor(opts: TurnsOptions) {
        super()
        this._amount = opts.amount
    }

    get size(): [current: number, total: number] {
        return [this._current, this._amount]
    }

    get done(): boolean {
        return this._current === this._amount
    }

    public increment(): void {
        this._current++
    }
}