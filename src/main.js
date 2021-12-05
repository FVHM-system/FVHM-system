import { createApp } from 'vue';
import ElementPlus from 'element-plus';
import App from './App.vue';
import { router } from './router';
import { store } from './stores';
import 'element-plus/lib/theme-chalk/index.css';
import 'dayjs/locale/zh-cn' //中文
import locale from 'element-plus/lib/locale/lang/zh-cn' //中文


const app = createApp(App);
app.use(ElementPlus);
app.use(router);
app.use(store);
app.use(locale)
app.mount('#app');
