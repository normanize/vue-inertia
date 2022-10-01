const path = require("path");
const mix = require("laravel-mix");
const webpackConfig = require("./webpack.config");
const webpackNodeExternals = require("webpack-node-externals");
const tailwindcss = require("tailwindcss");
const svgVue = require("laravel-mix-svg-vue");

mix.options({ manifest: false })
    .js("resources/js/ssr.js", "public/js")
    .vue({ version: 3, options: { optimizeSSR: true } })
    .svgVue()
    .webpackConfig({
        ...webpackConfig,
        target: "node",
        externals: [webpackNodeExternals()],
    })
    .sass("resources/sass/app.scss", "public/css")
    .options({
        postCss: [tailwindcss("./tailwind.config.js")],
    });

mix.alias({
    ziggy: path.resolve("vendor/tightenco/ziggy/dist/vue"),
});

mix.disableSuccessNotifications();
