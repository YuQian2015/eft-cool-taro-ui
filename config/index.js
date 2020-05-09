const config = {
  projectName: 'eft-taro-page',
  date: '2019-7-17',
  designWidth: 750,
  deviceRatio: {
    640: 2.34 / 2,
    750: 1,
    828: 1.81 / 2
  },
  sourceRoot: 'src',
  outputRoot: 'dist',
  // babel、csso、uglify 等配置从 plugins 配置中移出来
  babel: {
    sourceMap: true,
    presets: [['env', { modules: false }]],
    plugins: [
      'transform-decorators-legacy',
      'transform-class-properties',
      'transform-object-rest-spread'
    ]
  },
  // 小程序配置从 weapp 改为 mini，可以删掉很多小配置
  mini: {
    webpackChain (chain, webpack) {},
    cssLoaderOption: {},
    postcss: {
      pxtransform: {
        enable: true,
        config: {}
      },
      url: {
        enable: true,
        config: {
          limit: 10240 // 设定转换尺寸上限
        }
      }
    }
  },
  // 可以删掉很多小配置
  h5: {
    publicPath: '/',
    staticDirectory: 'static',
    webpackChain (chain, webpack) {},
    postcss: {
      autoprefixer: {
        enable: true,
        config: {
          browsers: [
            'last 3 versions',
            'Android >= 4.1',
            'ios >= 8'
          ]
        }
      }
    }
  }
}

if (process.env.TARO_BUILD_TYPE === 'ui') {
  Object.assign(config.h5, {
    enableSourceMap: false,
    enableExtract: false,
    enableDll: false
  })
  config.h5.webpackChain = chain => {
    chain.plugins.delete('htmlWebpackPlugin')
    chain.plugins.delete('addAssetHtmlWebpackPlugin')
    chain.merge({
      output: {
        path: path.join(process.cwd(), 'dist', 'h5'),
        filename: 'index.js',
        libraryTarget: 'umd',
        library: 'eft-cool-taro-ui'
      },
      externals: {
        nervjs: 'commonjs2 nervjs',
        classnames: 'commonjs2 classnames',
        '@tarojs/components': 'commonjs2 @tarojs/components',
        '@tarojs/taro-h5': 'commonjs2 @tarojs/taro-h5',
        'weui': 'commonjs2 weui'
      }
    })
  }
}

module.exports = function (merge) {
  if (process.env.NODE_ENV === 'development') {
    return merge({}, config, require('./dev'))
  }
  return merge({}, config, require('./prod'))
}
