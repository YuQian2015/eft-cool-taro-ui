EXE大前端团队Taro页面布局组件

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
import { EPage } from 'eft-cool-taro-ui'

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


  render() {
    const header = 'header'
    const footer = <View>footer</View>
    return (
      <EPage header={header} footer={footer}>
        {/*...*/}
      </EPage>
    )
  }
}
```

props

| props     | propTypes | 描述         |
| --------- | --------- | ------------ |
| className | string    | 自定义样式名 |
| header    | element   | 顶部元素     |
| footer    | element   | 底部元素     |



