import './assets/main.css'
import { createApp } from 'vue'
import { createPinina} from 'pinia'
import App from './App.vue'
import router from './router'


const app = createApp(App)

app.use(createPinina())
app.use(router)

app.mount('#app')
const pinia = createPinina()


createApp(App).mount('#app')
