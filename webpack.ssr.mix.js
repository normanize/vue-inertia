const path = require('path')
const mix = require('laravel-mix')
const webpackConfig = require('./webpack.config')
const webpackNodeExternals = require('webpack-node-externals')

mix
    .options({ manifest: false })
    .js('resources/js/ssr.js', 'public/js')
    .vue({ version: 3, options: { optimizeSSR: true } })
    .webpackConfig({
        ...webpackConfig,
        target: 'node',
        externals: [webpackNodeExternals()],
    })

mix.alias({
    ziggy: path.resolve('vendor/tightenco/ziggy/dist/vue'),
});