import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'

import { EButton, EPage, ENavbar } from '../../components'

import './detail.scss'

export default class Index extends Component {

  config = {
    navigationBarTitleText: '详情'
  }

  render() {
    const header = <ENavbar>详情</ENavbar>
    const footer = <View style={{ height: 300 }}>
      <EButton>Footer</EButton>
    </View>
    const refresherConfig = {
      disabled: true
    }
    return (
      <View>
        <EPage
          renderHeader={<View className='header-container'>{header}</View>}
          renderFooter={<View className='footer-container'>{footer}</View>}
          refresherConfig={refresherConfig}
        >
        </EPage>
      </View>
    )
  }
}
