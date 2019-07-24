import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'

import { EButton, EPage } from '../../components'

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
