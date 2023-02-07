import { Nullable } from "../src/utils/types"
import { createTurnBasedStrategyEngine } from "../src"
import ErrorTurnBasedStrategyEngine from "../src/error"
import { PlayerHuman } from "../src/player"
import { sleep } from "../src/utils/promises"

const engine = createTurnBasedStrategyEngine({
    playersAmount: 2,
    maxTurns: Infinity
})
let err: Nullable<ErrorTurnBasedStrategyEngine>

engine
    .onAddPlayer((ctx) => {
        console.log("new player")
    })
    .onStart(() => {
        console.log("Starting...")
    })
    .onTurn(async ctx => {
        console.log("turn")
        await sleep()
        return ctx.turn.current < 3
    })
    .onEnd(() => {
        console.log("Exiting...")
    })
    .onReady(async () => {
        const err = await engine.start()
        if (err) {
            exit(err)
        }
    })

const foo = new PlayerHuman("foo")
if (err = engine.players.add(foo)) {
    exit(err)
}

const bar = new PlayerHuman("bar")
if (err = engine.players.add(bar)) {
    exit(err)
}

function exit(err: Error) {
    console.error(err)
    process.exit(1)
}