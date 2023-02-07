import { expect, test, describe } from "vitest"
import { createTurnBasedStrategyEngine, Nullable } from "../src"
import ErrorTurnBasedStrategyEngine, { ErrorInsufficientPlayers, ErrorMaxPlayer } from "../src/error"
import { PlayerHuman } from "../src/player"

describe("players", () => {
    test.concurrent("return error if try to add more players than allowed", () => {
        const engine = createTurnBasedStrategyEngine({
            playersAmount: 1,
            maxTurns: Infinity
        })
        let err: Nullable<ErrorTurnBasedStrategyEngine>

        err = engine.players.add(new PlayerHuman("foo"))
        expect(err).toBeNull()

        err = engine.players.add(new PlayerHuman("bar"))
        expect(err).toBeInstanceOf(ErrorMaxPlayer)
    })

    test.concurrent("return the proportion of registered players over expected players", () => {
        const engine = createTurnBasedStrategyEngine({
            playersAmount: 3,
            maxTurns: Infinity
        })

        engine.players.add(new PlayerHuman("foo"))
        engine.players.add(new PlayerHuman("bar"))

        expect(engine.players.size).toEqual([2, 3])
    })
})

describe("turns", () => {
    test.concurrent("end the game if no more turns", async () => {
        const engine = createTurnBasedStrategyEngine({
            playersAmount: 1,
            maxTurns: 3
        })
        engine.players.add(new PlayerHuman("foo"))
        let onTurnCalled = 0
        let endTurn: number = -1
        engine.onTurn(_ => { onTurnCalled++ })
        engine.onEnd(ctx => { endTurn = ctx.turn.current })
        await engine.start()

        expect(endTurn).toBe(onTurnCalled)
    })
})

describe("start", () => {
    test.concurrent("return error if start is called before all the players have been registered", async () => {
        const engine = createTurnBasedStrategyEngine({
            playersAmount: 3,
            maxTurns: Infinity
        })
        let err: Nullable<ErrorTurnBasedStrategyEngine>

        engine.players.add(new PlayerHuman("foo"))
        engine.players.add(new PlayerHuman("bar"))

        err = await engine.start()
        expect(err).toBeInstanceOf(ErrorInsufficientPlayers)
    })
})