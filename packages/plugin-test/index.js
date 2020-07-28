module.exports = ({ webpackConfig }) => {
  webpackConfig
    .module
    .rule('yypkg')
    .test(/\.*(js|jsx)$/)
    .include
    .add(/yypkg/)
    .end()
    .use('babel-loader').loader('babel-loader')
    .options({
      presets: [
        ['@babel/preset-env', {
          modules: 'cjs',
          targets: { browsers: ['android >= 4'] }
        }]
      ],
      plugins: [['@babel/plugin-transform-runtime', { corejs: 2 }]]
    })
    .end()
}
