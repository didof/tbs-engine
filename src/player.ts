import { deepFreeze } from "./utils/immutable"

type PlayerId = number

export interface PlayerSnapshot {
    name: string
    id: PlayerId
}

export default abstract class Player {
    private _id: PlayerId // TODO use crypto
    constructor(private _name: string, id?: PlayerId) {
        this._id = id || Math.random()
    }

    get id(): PlayerId {
        return this._id
    }

    get name(): string {
        return this._name
    }

    get snapshot(): PlayerSnapshot {
        return deepFreeze({
            name: this._name,
            id: this._id
        })
    }
}

// TODO Implement AI in future versions
// export class PlayerAI extends Player { }

export class PlayerHuman extends Player {
    constructor(name: string) {
        super(name)
    }
}