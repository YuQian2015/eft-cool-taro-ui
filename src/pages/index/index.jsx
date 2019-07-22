import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'

import { EContent, EHeader, EFooter, EButton, EPage } from '../../components'

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

  showColors = () => {
    Taro.navigateTo({
      url: '/pages/color/color'
    })
  }

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
      footer
      <EButton onClick={this.showColors}>footer</EButton>
    </View>
    return (
      <EPage
        header={header}
        footer={footer}
        onRefresh={this.refresh}
        onLoadMore={this.loadMore}
      >
        content
      </EPage>
    )
  }
}
