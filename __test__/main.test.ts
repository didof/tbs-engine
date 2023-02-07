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

        err = engine.players.add(new PlayerHuman("foo"))
        expect(err).toBeNull()

        err = engine.players.add(new PlayerHuman("bar"))
        expect(err).toBeInstanceOf(ErrorMaxPlayer)
    })

    test.concurrent("return the proportion of registered players over expected players", () => {
        const engine = createTurnBasedStrategyEngine({
            playersAmount: 3
        })

        engine.players.add(new PlayerHuman("foo"))
        engine.players.add(new PlayerHuman("bar"))

        expect(engine.players.size).toEqual([2, 3])
    })
})

describe("start", () => {
    test.concurrent("return error if start is called before all the players have been registered", async () => {
        const engine = createTurnBasedStrategyEngine({
            playersAmount: 3
        })
        let err: Nullable<ErrorTurnBasedStrategyEngine>

        engine.players.add(new PlayerHuman("foo"))
        engine.players.add(new PlayerHuman("bar"))

        err = await engine.start()
        expect(err).toBeInstanceOf(ErrorInsufficientPlayers)
    })
})

describe("hooks", () => {
    test.concurrent("onAddPlayer", () => {
        const engine = createTurnBasedStrategyEngine({
            playersAmount: 1
        })
        let called = false
        engine.onAddPlayer(() => { called = true })

        engine.players.add(new PlayerHuman("foo"))

        expect(called).toBeTruthy()
    })

    test.concurrent("onReady", async () => {
        const engine = createTurnBasedStrategyEngine({
            playersAmount: 1
        })
        let called = false
        engine.onReady(() => { called = true })

        engine.players.add(new PlayerHuman("foo"))

        expect(called).toBeTruthy()
    })

    test.concurrent("onStart", async () => {
        const engine = createTurnBasedStrategyEngine({
            playersAmount: 1
        })
        let called = false
        engine.onStart(() => { called = true })

        engine.players.add(new PlayerHuman("foo"))
        await engine.start()

        expect(called).toBeTruthy()
    })

    test.concurrent("onEnd", async () => {
        const engine = createTurnBasedStrategyEngine({
            playersAmount: 1
        })
        let called = false
        engine.onEnd(() => { called = true })
        engine.onTurn(() => false)

        engine.players.add(new PlayerHuman("foo"))
        await engine.start()

        expect(called).toBeTruthy()
    })
})