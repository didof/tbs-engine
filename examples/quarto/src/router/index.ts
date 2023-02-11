import { createRouter, createWebHistory, RouteLocationNormalized, RouteRecordRaw } from "vue-router"
import Lobby from "../views/Lobby.vue"
import Game from "../views/Game.vue"
import { useAvailableRoomsStore } from "../store"
import to from "await-to-ts"


const routes: readonly RouteRecordRaw[] = [
    { path: "/", name: "Home", component: Lobby },
    {
        path: "/game/:id", name: "Game", component: Game, async beforeEnter(ctx: RouteLocationNormalized) {
            const useAvailableRooms = useAvailableRoomsStore()
            const [err, res] = await to(useAvailableRooms.get(ctx.params.id as string))
            if (err) {
                router.replace("/")
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