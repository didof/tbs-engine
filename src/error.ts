import { TBSEvent } from "./eventEmitter"
import Player from "./player"

export default class ErrorTBSEngine extends Error {
    constructor(message: string) {
        super(`[tbs-engine] ${message}`)
        Object.setPrototypeOf(this, ErrorTBSEngine.prototype)
        Error.captureStackTrace(this, this.constructor)
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

export class ErrorUnregisteredTurnCallback extends ErrorTBSEngine {
    constructor() {
        super(`Register at least one callback for the new turn event (TBSEngineEvent.Turn, ${TBSEvent.Turn})`)
    }
}