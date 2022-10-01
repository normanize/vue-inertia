import { createApp, h } from "vue";
import { InertiaProgress } from "@inertiajs/progress";
import { createInertiaApp } from "@inertiajs/inertia-vue3";

import { ZiggyVue, Ziggy } from "ziggy";
import SvgVue from "svg-vue3";

import { defineRule } from "vee-validate";

InertiaProgress.init();

createInertiaApp({
    resolve: (name) => import(`./Pages/${name}`),
    title: (title) => title || "Vue Inertia",
    setup({ el, App, props, plugin }) {
        createApp({ render: () => h(App, props) })
            .use(plugin)
            .use(ZiggyVue, Ziggy)
            .use(SvgVue)
            .use(defineRule)
            .mount(el);
    },
});
