import crypto from "crypto"
import Client from "./Client"

// TODO: sync with engine
const totalPlayers = 2

export type SerializedGame = {
    id: string
    name: string
    participants: {
        current: Client[]
        total: number
    }
}

export default class Game {
    public readonly id: string
    public readonly participants: { current: Client[]; total: number }
    constructor(public readonly name: string, readonly ownerClient: Client) {
        this.id = crypto.randomUUID()
        this.participants = {
            current: [ownerClient],
            total: totalPlayers
        }
    }

    static create(name: string, owner: string): [game: Game, owner: Client] {
        const ownerClient = new Client(owner)
        const game = new Game(name, ownerClient)
        return [game, ownerClient]
    }

    serialize(): SerializedGame {
        return {
            id: this.id,
            name: this.name,
            participants: {
                current: this.participants.current,
                total: this.participants.total
            }
        }
    }
}