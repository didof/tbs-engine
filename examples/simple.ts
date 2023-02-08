import { Nullable } from "../src/utils/types"
import { createTurnBasedStrategyEngine } from "../src"
import ErrorTurnBasedStrategyEngine from "../src/error"
import { PlayerHuman } from "../src/player"
import { sleep } from "../src/utils/promises"

const engine = createTurnBasedStrategyEngine({
    playersAmount: 2,
    maxTurns: 5
})
let err: Nullable<ErrorTurnBasedStrategyEngine>

engine
    .onAddPlayer((ctx) => {
        console.log(`new player: ${ctx.players.length}.`)
    })
    .onStart((ctx) => {
        console.log(`start: ${ctx.players.map(p => p.name).join(", ")}.`)
    })
    .onTurn(async ctx => {
        console.log(`turn [${ctx.turn.current}/${ctx.turn.total}]: ${ctx.activePlayer!.name}`)
        await sleep()
        return ctx.turn.current === 4
    })
    .onEnd((ctx) => {
        console.log(`end: That was fun! The last one to play was ${ctx.activePlayer!.name}.`)
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