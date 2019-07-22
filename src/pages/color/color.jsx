import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'

import { EPage, EButton } from '../../components'

import './color.scss'

export default class Color extends Component {

  config = {
    navigationBarTitleText: '颜色'
  }

  render() {
    const header = 'EFT Cool Taro UI'
    const footer =  <View>
        <EButton size='normal'>normal</EButton>
        <EButton size='small'>small</EButton>
        <EButton size='mini'>mini</EButton>
        <EButton inline size='large'>inline</EButton>
        <EButton inline size='normal'>inline</EButton>
        <EButton inline size='small'>inline</EButton>
        <EButton inline size='mini'>inline</EButton>
        <EButton outline>secondary</EButton>
        <EButton disabled>disabled</EButton>
        <EButton disabled loading>disabled</EButton>
        <EButton circle>circle</EButton>
        <EButton circle disabled>circle disabled</EButton>
    </View>
    return (
      <EPage header={header} footer={footer}>
          12313
      </EPage>
    )
  }
}
