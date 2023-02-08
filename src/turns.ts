type TurnsOptions = {
    amount: number
}

// TODO event emit on roundComplete (all have player the same amount of times)

export default class Turns {
    private _amount: number
    private _current: number = 0
    constructor(opts: TurnsOptions) {
        this._amount = opts.amount
    }

    get size(): [current: number, total: number] {
        return [this._current, this._amount]
    }

    get done(): boolean {
        return this._current === this._amount
    }

    public increment(): number {
        return this._current++
    }
}