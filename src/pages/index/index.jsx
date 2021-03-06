import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'

import { EButton, EPage, EModal, ENavbar } from '../../components'

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

  goBack = () => {
    return true
  }

  goDetailPage = () => {
    Taro.navigateTo({
      url: '/pages/detail/detail'
    })

  }
  render() {
    const { noMore, hasMore, refreshStatus, open, scrollTop } = this.state
    const header = <ENavbar leftText='Back' rightText='More' onClickRightText={this.openModel} onClickLeft={this.goBack} >首页</ENavbar>
    const footer = <EButton outline circle onClick={this.refreshLater}>1秒后显示刷新</EButton>
    const refresherConfig = {
      recoverTime: 300,
      refreshTime: 1000
    }
    return (
      <View>
        <EModal openModel={open} position='right' onHide={this.hideModal}>
          <View>Details</View>
        </EModal>
        <EPage
          renderHeader={<View className='header-container'>{header}</View>}
          renderFooter={<View className='footer-container'>{footer}</View>}
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
            <EButton onClick={this.goDetailPage}>To Details</EButton>
            <View style={{ height: '300px' }}>Contents</View>
            <View style={{ height: '300px' }}>Contents</View>
            <EButton onClick={this.openModel}>显示modal</EButton>
            <EButton onClick={this.toTop}>回到顶部</EButton>
          </View>
        </EPage>
      </View>
    )
  }
}
