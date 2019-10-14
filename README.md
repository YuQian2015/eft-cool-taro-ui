EXE大前端团队的Taro页面布局组件，支持在H5和小程序中使用，更多组件内容不断更新中~

## 简介

基于 [Taro](https://taro.aotu.io/) 框架 v1.3.9 开发，为了简化页面布局，解决列表页面经常使用到的下拉刷新、加载更多、顶部和底部区域固定、内容区域自适应高度等问题。将页面分为 header、content、footer三个部分，可以自由设置是否需要 header 和 footer，content 会根据 header 和 footer 调节高度占满屏幕。

**组件开发中，可能涉及调整，需要留意最新修改**

## 使用

首先，使用以下命令安装：

```powershell
# yarn
$ yarn add eft-cool-taro-ui

# npm
$ npm i eft-cool-taro-ui --save
```

然后在app.scss引入样式：

```scss
@import '~eft-cool-taro-ui/style/index.scss';
```

最后在页面中使用：

```jsx
import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { EButton, EPage, EModal, ENavbar } from 'eft-cool-taro-ui'

import './index.scss'


export default class Index extends Component {

  config = {
    navigationBarTitleText: '首页'
  }

  constructor() {
    super()
    this.state = {
      noMore: false,
      hasMore: true,
      scrollTop: 0
    }
  }

  componentWillMount() { }

  componentDidMount() {
    Taro.eventCenter.trigger('ERefreshStart')
    // 模拟请求
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
    this.setState({
      refreshStatus: 1
    })
    Taro.showToast({
      title: '刷新',
      icon: 'none'
    })
    // 模拟请求
    setTimeout(() => {
      this.setState({
        refreshStatus: 2
      })
    }, Math.random() * 1000)
  }
  refreshLater = () => {
    setTimeout(() => {
      this.refresh()
    }, 1000)
  }

  loadMore = () => {
    setTimeout(() => {
      this.setState({
        hasMore: false,
        noMore: true
      })
    }, 1000)
  }

  openModel = () => {
    this.setState({
      open: true
    })
  }

  hideModal = () => {
    this.setState({
      open: false
    })
  }

  toTop = () => {
    this.setState({
      scrollTop: 0
    })
  }

  handleScrollEnd = (e) => {
    this.setState({
      scrollTop: e.detail.scrollTop
    })
  }
  render() {
    const { noMore, hasMore, refreshStatus, open, scrollTop } = this.state
    const header = <View className='header-container'>
      <ENavbar leftText='返回' rightText='Model' onClickRightText={this.openModel}>首页</ENavbar>
    </View>
    const footer = <View className='footer-container'>
      <EButton outline circle onClick={this.refreshLater}>1秒后显示刷新</EButton>
    </View>
    const refresherConfig = {
      recoverTime: 300,
      refreshTime: 1000
    }
    return (
      <View>
        <EModal openModel={open} position='right' onHide={this.hideModal}>
          <View>model</View>
        </EModal>
        <EPage
          renderHeader={header}
          renderFooter={footer}
          onRefresh={this.refresh}
          onLoadMore={this.loadMore}
          noMore={noMore}
          hasMore={hasMore}
          hasMoreText='loading'
          refresherConfig={refresherConfig}
          refreshStatus={refreshStatus}
          scrollTop={scrollTop}
          onScrollEnd={this.handleScrollEnd}
        >
          <View className='main-container'>
            <View> Content </View>
            <EButton onClick={this.openModel}>显示modal</EButton>
            <EButton onClick={this.toTop}>回到顶部</EButton>
          </View>
        </EPage>
      </View>
    )
  }
}

```

### props

| props             | propTypes | 描述                          | 默认值                    |
| ----------------- | --------- | ----------------------------- | ------------------------- |
| className         | string    | 自定义样式名                  | -                         |
| renderHeader      | element   | 顶部元素                      | -                         |
| renderFooter      | element   | 底部元素                      | -                         |
| onRefresh         | func      | 下拉刷新回调函数              | -                         |
| onLoadMore        | func      | 滚动到底部加载更多            | -                         |
| onScroll          | func      | 滚动事件                      | -                         |
| scrollTop         | number    | 设置竖向滚动条位置            | 0                         |
| onScrollEnd       | func      | 滚动结束触发                  | -                         |
| hasMore           | bool      | 是否能够加载更多              | -                         |
| noMore            | bool      | 显示没有更多                  | -                         |
| hasMoreText       | string    | 自定义加载更多文字            | '加载中'                  |
| noMoreText        | string    | 自定义没有更多文字            | '没有更多了'              |
| refresherConfig   | object    | 设置加载动画效果              | 详见 refresherConfig 描述 |
| refreshStatus     | number    | 刷新动画1：刷新中 2：刷新完成 | -                         |
| loadMoreThreshold | number    | 滚动底部多少距离开始加载更多  | 100                       |

###  refresherConfig

| 属性        | 类型   | 默认值                             | 描述                                                         |
| ----------- | ------ | ---------------------------------- | ------------------------------------------------------------ |
| recoverTime | number | 300                                | 回弹动画的时间 ms                                            |
| refreshTime | number | 500                                | 刷新动画至少显示的时间 ms （用来展示刷新动画， refreshStatus 为 1 时不生效） |
| threshold   | number | 70                                 | 刷新的阈值（低于这个值的时候不执行刷新）                     |
| maxHeight   | number | 200                                | 可拉动的最大高度                                             |
| height      | number | 60                                 | 刷新动画播放时占的高度                                       |
| showText    | bool   | true                               | 显示文字                                                     |
| refreshText | array  | ['下拉刷新', '释放刷新', '加载中'] | 刷新文字                                                     |
| disabled    | bool   | false                              | 禁用刷新                                                     |

`EPage` 支持通过事件来显示和隐藏刷新动画：

```jsx
Taro.eventCenter.trigger('ERefreshStart') // 显示刷新
Taro.eventCenter.trigger('ERefreshEnd') // 隐藏刷新
```

## 组件和props

正在更新完善……

### EModal

滑出一个模态框

| props     | propTypes | 描述                                                      | 默认值   |
| --------- | --------- | --------------------------------------------------------- | -------- |
| openModel | bool      | 是否显示                                                  | false    |
| showMask  | bool      | 是否显示灰色背景                                          | true     |
| position  | string    | 模态框出现的方向： ‘bottom’ \| ‘top’ \| ‘left’ \| ‘right’ | 'bottom' |
| onHide    | func      | 关闭模态框调用                                            | -        |

### ENavbar

导航栏组件

| props            | propTypes | 描述                                                         | 默认值 |
| ---------------- | --------- | ------------------------------------------------------------ | ------ |
| title            | string    | 导航栏标题                                                   | ‘’     |
| leftText         | string    | 左边文字                                                     | ‘’     |
| rightText        | string    | 右边文字                                                     | ''     |
| onClickRightText | func      | 点击右边的文字                                               | -      |
| onClickLeft      | func      | 点击右边的文字和图标，不传或者返回 `true` 时会调用 `Taro.navigateBack()` | -      |

### EActivityIndicator

活动指示器，使用显示加载

| props | propTypes | 描述                | 默认值    |
| ----- | --------- | ------------------- | --------- |
| size  | number    | 大小                | 10        |
| color | string    | 颜色，如：’#01A0FF‘ | ‘#FFFFFF’ |

### EButton

按钮组件

| props    | propTypes | 描述                                    | 默认值   |
| -------- | --------- | --------------------------------------- | -------- |
| size     | string    | 大小 'large'、'normal'、'small'、'mini' | 'normal' |
| circle   | bool      | 是否圆角                                | false    |
| inline   | bool      | 是否inline                              | false    |
| outline  | bool      | 是否是线性类型按钮                      | false    |
| disabled | bool      | 是否禁用                                | false    |
| loading  | bool      | 是否显示加载                            | false    |