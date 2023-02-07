import { expect, test, describe, Nullable } from "vitest"
import { createTurnBasedStrategyEngine } from "../src"
import ErrorTurnBasedStrategyEngine, { ErrorInsufficientPlayers, ErrorMaxPlayer } from "../src/error"
import { PlayerHuman } from "../src/player"

describe("players", () => {
    test.concurrent("return error if try to add more players than allowed", () => {
        const engine = createTurnBasedStrategyEngine({
            playersAmount: 1
        })
        let err: Nullable<ErrorTurnBasedStrategyEngine>

        const foo = new PlayerHuman("foo")
        err = engine.players.add(foo)
        expect(err).toBeNull()

        const bar = new PlayerHuman("bar")
        err = engine.players.add(bar)
        expect(err).toBeInstanceOf(ErrorMaxPlayer)
    })

    test.concurrent("return the proportion of registered players over expected players", () => {
        const engine = createTurnBasedStrategyEngine({
            playersAmount: 3
        })

        const foo = new PlayerHuman("foo")
        const bar = new PlayerHuman("bar")
        engine.players.add(foo)
        engine.players.add(bar)

        expect(engine.players.size).toEqual([2, 3])
    })

    test.concurrent("return error if start is called before all the players have been registered", () => {
        const engine = createTurnBasedStrategyEngine({
            playersAmount: 3
        })
        let err: Nullable<ErrorTurnBasedStrategyEngine>

        const foo = new PlayerHuman("foo")
        const bar = new PlayerHuman("bar")
        engine.players.add(foo)
        engine.players.add(bar)

        err = engine.start()
        expect(err).toBeInstanceOf(ErrorInsufficientPlayers)
    })
})