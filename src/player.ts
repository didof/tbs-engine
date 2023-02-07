type PlayerId = number

export interface PlayerSnapshot {
    name: string
    id: PlayerId
    index: number
}

export default abstract class Player {
    private _id: PlayerId // TODO use crypto
    constructor(private _name: string, id?: PlayerId) {
        this._id = id || Math.random()
    }

    get name(): string {
        return this._name
    }

    snapshot(index: number): PlayerSnapshot {
        return {
            name: this._name,
            id: this._id,
            index
        }
    }
}

// TODO Implement AI in future versions
// export class PlayerAI extends Player { }

export class PlayerHuman extends Player {
    constructor(name: string) {
        super(name)
    }
}