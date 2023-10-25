const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    allowedHosts: "all"
  }
})
// https://cli.vuejs.org/guide/webpack.html#simple-configuration
