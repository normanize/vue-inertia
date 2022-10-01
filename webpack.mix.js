const mix = require("laravel-mix");
const path = require("path");
const webpackConfig = require("./webpack.config");
const tailwindcss = require("tailwindcss");
const svgVue = require("laravel-mix-svg-vue");

/*
 |--------------------------------------------------------------------------
 | Mix Asset Management
 |--------------------------------------------------------------------------
 |
 | Mix provides a clean, fluent API for defining some Webpack build steps
 | for your Laravel applications. By default, we are compiling the CSS
 | file for the application as well as bundling up all the JS files.
 |
 */

mix.js("resources/js/app.js", "public/js")
    .vue()
    .svgVue()
    .webpackConfig(webpackConfig)
    .sass("resources/sass/app.scss", "public/css")
    .options({
        postCss: [tailwindcss("./tailwind.config.js")],
    });

mix.alias({
    ziggy: path.resolve("vendor/tightenco/ziggy/dist/vue"),
});

mix.disableSuccessNotifications();
