import { expect, test } from "vitest"
import { createTurnBasedStrategyEngine } from "../src"
import { PlayerHuman } from "../src/player"

test("should contain a readonly list of players", () => {
    const engine = createTurnBasedStrategyEngine({
        playersAmount: 1,
        maxTurns: Infinity
    })
    engine.onTurn((ctx) => {
        const initialLength = ctx.players.length;
        (ctx.players as any).push()
        expect(ctx.players.length).toBe(initialLength)
    })
    engine.players.add(new PlayerHuman("foo"))
})


test("should contain the current turn and total turns", () => {
    const engine = createTurnBasedStrategyEngine({
        playersAmount: 1,
        maxTurns: 42
    })
    engine.onTurn((ctx) => {
        expect(ctx.turn.current).toBe(1)
        expect(ctx.turn.total).toBe(42)
    })
    engine.players.add(new PlayerHuman("foo"))
})