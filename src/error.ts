import { TBSEngineEvent } from "./eventEmitter"
import Player from "./player"

export default class ErrorTBSEngine extends Error {
    constructor(message: string) {
        super(`[tbs-engine] ${message}`)

        // TODO Object.setPrototypeOf?
    }
}

export class ErrorInsufficientPlayers extends ErrorTBSEngine {
    constructor(current: number, amount: number) {
        super(`Currently registered players (${current}) is less than the expected amount (${amount}).`)
    }
}

export class ErrorMaxPlayer extends ErrorTBSEngine {
    constructor(player: Player, amount: number) {
        super(`max players reached (${amount}). Cannot add "${player.name}".`)
    }
}

export class ErrorUnregisteredNewTurnCallback extends ErrorTBSEngine {
    constructor() {
        super(`Register at least one callback for the new turn event (TBSEngineEvent.NewTurn, ${TBSEngineEvent.NewTurn})`)
    }
}