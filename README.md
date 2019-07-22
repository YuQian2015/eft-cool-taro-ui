EXE大前端团队Taro页面布局组件，更多内容不断补充中~

## 简介

基于 [Taro](https://taro.aotu.io/) 框架开发，为了简化页面布局将页面分为header、content、footer三个部分，可以自由配置是否需要header/footer，content会根据header和footer调节高度。

## 使用

首先，使用以下命令安装：

```powershell
# yarn
$ yarn add eft-cool-taro-ui

# 或者，npm
$ npm i eft-cool-taro-ui --save
```

最后在页面中引入：

```jsx
import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { EButton, EPage } from 'eft-cool-taro-ui'

import './index.scss'

export default class Index extends Component {

  config = {
    navigationBarTitleText: '首页'
  }

  componentWillMount() { }

  componentDidMount() { }

  componentWillUnmount() { }

  componentDidShow() { }

  componentDidHide() { }

  showRefresher = () => {
    Taro.eventCenter.trigger('ERefreshStart')
  }

  hideRefresher = () => {
    Taro.eventCenter.trigger('ERefreshEnd')
  }

  refresh = () => {
    Taro.showToast({
      title: '刷新',
      icon: 'none'
    })
  }

  loadMore = () => {
    Taro.showToast({
      title: '加载更多',
      icon: 'none'
    })
  }

  render() {
    const header = <View>
      <EButton size='normal' inline circle outline onClick={this.showRefresher} size='small'>显示刷新</EButton>
      <EButton size='normal' inline circle outline onClick={this.hideRefresher} size='small'>隐藏刷新</EButton>
    </View>
    const footer = <View>
      <EButton>footer</EButton>
    </View>
    return (
      <EPage
        renderHeader={header}
        renderFooter={footer}
        onRefresh={this.refresh}
        onLoadMore={this.loadMore}
      >
          <View>content</View>
      </EPage>
    )
  }
}
```

**props**

| props        | propTypes | 描述               |
| ------------ | --------- | ------------------ |
| className    | string    | 自定义样式名       |
| renderHeader | element   | 顶部元素           |
| renderFooter | element   | 底部元素           |
| onRefresh    | func      | 下拉刷新回调函数   |
| onLoadMore   | func      | 滚动到底部加载更多 |
| hasMore      | bool      | 是否能够加载更多   |

`EPage` 支持通过事件来显示和隐藏刷新动画，使得我们能够在产生网络请求的同时显示刷新：

```jsx
Taro.eventCenter.trigger('ERefreshStart') // 显示刷新
Taro.eventCenter.trigger('ERefreshEnd') // 隐藏刷新
```

可以在请求拦截器里面对刷新动画进行处理。