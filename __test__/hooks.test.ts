import { expect, test } from "vitest"
import { createTurnBasedStrategyEngine } from "../src"
import { PlayerHuman } from "../src/player"

test.concurrent("onAddPlayer", () => {
    const engine = createTurnBasedStrategyEngine({
        playersAmount: 1,
        maxTurns: Infinity
    })
    let called = false
    engine.onAddPlayer(() => { called = true })

    engine.players.add(new PlayerHuman("foo"))

    expect(called).toBeTruthy()
})

test.concurrent("onReady", async () => {
    const engine = createTurnBasedStrategyEngine({
        playersAmount: 1,
        maxTurns: Infinity
    })
    let called = false
    engine.onReady(() => { called = true })

    engine.players.add(new PlayerHuman("foo"))

    expect(called).toBeTruthy()
})

test.concurrent("onStart", async () => {
    const engine = createTurnBasedStrategyEngine({
        playersAmount: 1,
        maxTurns: Infinity
    })
    let called = false
    engine.onStart(() => { called = true })

    engine.players.add(new PlayerHuman("foo"))
    await engine.start()

    expect(called).toBeTruthy()
})

test.concurrent("onEnd", async () => {
    const engine = createTurnBasedStrategyEngine({
        playersAmount: 1,
        maxTurns: Infinity
    })
    let called = false
    engine.onEnd(() => { called = true })
    engine.onTurn(() => true)

    engine.players.add(new PlayerHuman("foo"))
    await engine.start()

    expect(called).toBeTruthy()
})