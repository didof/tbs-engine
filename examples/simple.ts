import { Nullable } from "../src/utils/types"
import { createTurnBasedStrategyEngine } from "../src"
import ErrorTurnBasedStrategyEngine from "../src/error"
import { PlayerHuman } from "../src/player"
import { sleep } from "../src/utils/promises"

const engine = createTurnBasedStrategyEngine({
    playersAmount: 2
})
let err: Nullable<ErrorTurnBasedStrategyEngine>

let i = 0

engine
    .onAddPlayer((ctx) => {
        console.log("new player")
    })
    .onStart(() => {
        console.log("Starting...")
    })
    .onTurn(async ctx => {
        await sleep()
        console.log("turn")
        i++
        if (i === 3) return false
        return true
    })
    .onEnd(() => {
        console.log("Exiting...")
    })
    .onReady(async () => {
        const err = await engine.start()
        if (err) {
            console.error(err)
            process.exit(1)
        }
    })

const foo = new PlayerHuman("foo")
if (err = engine.players.add(foo)) {
    console.error(err)
    process.exit(1)
}

const bar = new PlayerHuman("bar")
if (err = engine.players.add(bar)) {
    console.error(err)
    process.exit(1)
}