import { createSSRApp, h } from 'vue'
import { renderToString } from '@vue/server-renderer'
import { createInertiaApp } from '@inertiajs/inertia-vue3'
import createServer from '@inertiajs/server'

import { ZiggyVue, Ziggy } from "ziggy";

createServer((page) => createInertiaApp({
  page,
  render: renderToString,
  resolve: name => import(`./Pages/${name}`),
  title: title => title || 'Vue Inertia',
  setup({ app, props, plugin }) {
    return createSSRApp({
      render: () => h(app, props),
    }).use(plugin)
      .use(ZiggyVue, Ziggy)
      .mount(el)
  },
}))