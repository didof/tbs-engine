import { Nullable } from "../src/utils/types"
import { createTurnBasedStrategyEngine } from "../src"
import ErrorTurnBasedStrategyEngine from "../src/error"
import { TBSEngineEvent as E } from "../src/eventEmitter"
import { PlayerHuman } from "../src/player"

const engine = createTurnBasedStrategyEngine({
    playersAmount: 2
})
let err: Nullable<ErrorTurnBasedStrategyEngine>

let i = 0

engine
    .on(E.AddPlayer, async ({ players }) => {
        // Update UI...
        return true
    })
    .on(E.NewTurn, async (ctx) => {
        // Inject the game logic and wait for user interaction
        await new Promise(resolve => setTimeout(resolve, 1000))
        console.log(ctx)
        i++
        if (i === 3) return false
        return true
    })
    .on(E.End, async () => {
        console.log("Exiting...")
        return true
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

(async () => {
    const err = await engine.start()
    if (err) {
        console.error(err)
        process.exit(1)
    }
})()