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

  render() {
    const header = 'EFT Cool Taro UI'
    const footer = <EButton onClick={this.showColors}>color</EButton>
    return (
      <EPage header={header} footer={footer}>
        <Text>按钮</Text>
        <EButton size='large'>large</EButton>
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
      </EPage>
    )
  }
}
