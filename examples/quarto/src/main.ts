import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from "./router"
import { createPinia } from "pinia"
import { useClient } from "./store"

const pinia = createPinia()
createApp(App).use(router).use(pinia).mount('#app')

const client = useClient()
await client.init()