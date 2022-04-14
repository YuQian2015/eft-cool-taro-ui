import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'

import { EButton, EPage, ENavbar } from '../../components'
import { pageAnimation } from '../../utils/index'

import './detail.scss'

@pageAnimation
export default class Detail extends Component {

  state = {
    left: true
  }

  componentWillMount() {
    console.log(this.goInDir);
  }

  componentDidMount() {
    console.log('mount');
  }

  beforeRouteLeave(from, to, next) {
    next(true)
  }

  config = {
    navigationBarTitleText: '详情'
  }

  render() {
    const header = <ENavbar>详情</ENavbar>
    const footer = <EButton>Footer</EButton>
    const refresherConfig = {
      disabled: true
    }
    return (
      <EPage
        renderHeader={<View className='header-container'>{header}</View>}
        renderFooter={<View className='footer-container'>{footer}</View>}
        refresherConfig={refresherConfig}
      >
        <View>
          <View>12313</View>
          <View>12313</View>
          <View>12313</View>
          <View>12313</View>
          <View>12313</View>
          <View>12313</View>
          <View>12313</View>
          <View>12313</View>
          <View>12313</View>
          <View>12313</View>
          <View>12313</View>
          <View>12313</View>
          <View>12313</View>
          <View>12313</View>
          <View>12313</View>
          <View>12313</View>
          <View>12313</View>
          <View>12313</View>
          <View>12313</View>
          <View>12313</View>
          <View>12313</View>
          <View>12313</View>
          <View>12313</View>
          <View>12313</View>
          <View>12313</View>
          <View>12313</View>
          <View>12313</View>
          <View>12313</View>
          <View>12313</View>
          <View>12313</View>
          <View>12313</View>
          <View>12313</View>
          <View>12313</View>
          <View>12313</View>
          <View>12313</View>
          <View>12313</View>
          <View>12313</View>
          <View>12313</View>
          <View>12313</View>
          <View>12313</View>
          <View>12313</View>
          <View>12313</View>
        </View>
      </EPage>
    )
  }
}
