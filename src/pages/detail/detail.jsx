import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'

import { EButton, EPage, ENavbar } from '../../components'
import { pageAnimation } from '../../utils/index'

import './detail.scss'

@pageAnimation
export default class Index extends Component {

  state = {
    left: true
  }

  componentWillMount() {
    console.log('length:' + Taro.getCurrentPages().length);
    console.log(this.goInDir);
  }

  componentDidMount() {
    console.log('mount');
  }

  config = {
    navigationBarTitleText: '详情'
  }

  render() {
    const header = <ENavbar>详情</ENavbar>
    const footer = <View style={{ height: '300px' }}>
      <EButton>Footer</EButton>
    </View>
    const refresherConfig = {
      disabled: true
    }
    return (
      <EPage
        renderHeader={<View className='header-container'>{header}</View>}
        renderFooter={<View className='footer-container'>{footer}</View>}
        refresherConfig={refresherConfig}
      >
      </EPage>
    )
  }
}
