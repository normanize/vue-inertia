import { createApp, h } from 'vue'
import { InertiaProgress } from '@inertiajs/progress'
import { createInertiaApp } from '@inertiajs/inertia-vue3'

import { ZiggyVue, Ziggy } from "ziggy";

InertiaProgress.init()

createInertiaApp({
  resolve: name => import(`./Pages/${name}`),
  title: title => title || 'Vue Inertia',
  setup({ el, App, props, plugin }) {
    createApp({ render: () => h(App, props) })
      .use(plugin)
      .use(ZiggyVue, Ziggy)
      .mount(el)
  },
})