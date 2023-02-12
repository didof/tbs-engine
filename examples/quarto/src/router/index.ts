import { createRouter, createWebHistory, RouteLocationNormalized, RouteRecordRaw, useRouter } from "vue-router"
import Lobby from "../views/Lobby.vue"
import Game from "../views/Game.vue"
import { useGame } from "../store"
import to from "await-to-ts"

const routes: readonly RouteRecordRaw[] = [
    { path: "/", name: "Home", component: Lobby },
    {
        path: "/game/:id", name: "Game", component: Game, async beforeEnter(ctx: RouteLocationNormalized) {
            const game = useGame()
            const [err] = await to(game.assert(ctx.params.id as string))
            if (err) {
                console.error("could not retrive current game", err)
                router.push("/")
                return
            }
            if (!game.hasGame) {
                router.push("/")
                return
            }
        }
    },
    { path: '/:pathMatch(.*)*', name: 'NotFound', component: Lobby },
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})

export default router