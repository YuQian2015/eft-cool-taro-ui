EXE大前端团队的Taro页面布局组件，支持在H5和小程序中使用，更多组件内容不断更新中~

## 简介

基于 [Taro](https://taro.aotu.io/) 框架 v1.3.9 开发，为了简化页面布局，解决列表页面经常使用到的下拉刷新、加载更多、顶部和底部区域固定、内容区域自适应高度等问题。将页面分为 header、content、footer三个部分，可以自由设置是否需要 header 和 footer，content 会根据 header 和 footer 调节高度占满屏幕。

## 使用

首先，使用以下命令安装：

```powershell
# yarn
$ yarn add eft-cool-taro-ui

# npm
$ npm i eft-cool-taro-ui --save
```

在页面中引入：

```jsx
import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { EPage } from 'eft-cool-taro-ui'

import './index.scss'

export default class Index extends Component {

  config = {
    navigationBarTitleText: '首页'
  }

  constructor() {
    super()
    this.state = {
      noMore: false,
      hasMore: true
    }
  }

  componentWillMount() { }

  componentDidMount() {
    Taro.eventCenter.trigger('ERefreshStart')
    setTimeout(() => {
      Taro.eventCenter.trigger('ERefreshEnd')
      this.setState({
        hasMore: true
      })
    }, 1000)
  }

  componentWillUnmount() { }

  componentDidShow() { }

  componentDidHide() { }

  refresh = () => {
    Taro.showToast({
      title: '刷新',
      icon: 'none'
    })
  }

  loadMore = () => {
    setTimeout(() => {
      this.setState({
        hasMore: false,
        noMore: true
      })
    }, 500)
  }

  render() {
    const { noMore, hasMore } = this.state
    const header = <View className='header-container'> EFT Taro </View>
    const footer = <View className='footer-container'>Footer</View>
    const refresherConfig = {
      recoverTime: 300,
      refreshTime: 1000
    }
    return (
      <EPage
        renderHeader={header}
        renderFooter={footer}
        onRefresh={this.refresh}
        onLoadMore={this.loadMore}
        noMore={noMore}
        hasMore={hasMore}
        refresherConfig={refresherConfig}
      >
        <View className='main-container'>
          <View> Content </View>
        </View>
      </EPage>
    )
  }
}

```

### props

| props             | propTypes | 描述                         | 默认值                    |
| ----------------- | --------- | ---------------------------- | ------------------------- |
| className         | string    | 自定义样式名                 | -                         |
| renderHeader      | element   | 顶部元素                     | -                         |
| renderFooter      | element   | 底部元素                     | -                         |
| onRefresh         | func      | 下拉刷新回调函数             | -                         |
| onLoadMore        | func      | 滚动到底部加载更多           | -                         |
| onScroll          | func      | 滚动事件                     | -                         |
| hasMore           | bool      | 是否能够加载更多             | -                         |
| noMore            | bool      | 显示没有更多                 | -                         |
| renderHasMore     | element   | 自定义加载更多               | '加载中'                  |
| renderNoMore      | element   | 自定义没有更多               | '没有更多了'              |
| refresherConfig   | object    | 设置加载动画效果             | 详见 refresherConfig 描述 |
| loadMoreThreshold | number    | 滚动底部多少距离开始加载更多 | 100                       |

###  refresherConfig

| 属性        | 类型   | 默认值                             | 描述                                           |
| ----------- | ------ | ---------------------------------- | ---------------------------------------------- |
| recoverTime | number | 300                                | 回弹动画的时间 ms                              |
| refreshTime | number | 500                                | 刷新动画至少显示的时间 ms （用来展示刷新动画） |
| threshold   | number | 70                                 | 刷新的阈值（低于这个值的时候不执行刷新）       |
| maxHeight   | number | 200                                | 可拉动的最大高度                               |
| height      | number | 60                                 | 刷新动画播放时占的高度                         |
| showText    | bool   | true                               | 显示文字                                       |
| refreshText | array  | ['下拉刷新', '释放刷新', '加载中'] | 刷新文字                                       |

###  自动显示刷新

`EPage` 支持通过事件来显示和隐藏刷新动画，使得我们能够在网络请求 的同时（如：拦截器）显示刷新：

```jsx
Taro.eventCenter.trigger('ERefreshStart') // 显示刷新
Taro.eventCenter.trigger('ERefreshEnd') // 隐藏刷新
```
