import { createSSRApp, h } from "vue";
import { renderToString } from "@vue/server-renderer";
import { createInertiaApp } from "@inertiajs/inertia-vue3";
import createServer from "@inertiajs/server";

import { ZiggyVue, Ziggy } from "ziggy";
import SvgVue from "svg-vue3";

import { defineRule } from "vee-validate";

createServer((page) =>
    createInertiaApp({
        page,
        render: renderToString,
        resolve: (name) => import(`./Pages/${name}`),
        title: (title) => title || "Vue Inertia",
        setup({ app, props, plugin }) {
            return createSSRApp({
                render: () => h(app, props),
            })
                .use(plugin)
                .use(ZiggyVue, Ziggy)
                .use(SvgVue)
                .use(defineRule)
                .mount(el);
        },
    })
);
