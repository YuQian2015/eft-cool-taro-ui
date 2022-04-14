import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import PropTypes from 'prop-types'

export default class ENavbar extends Component {

  static options = {
    addGlobalClass: true
  }

  handleClickRightText = (e) => {
    const { onClickRightText } = this.props
    onClickRightText && onClickRightText(e)
  }

  goBack = () => {
    const { onClickLeft } = this.props
    if ((onClickLeft && onClickLeft()) || !onClickLeft) {
      Taro.navigateBack()
    }
  }

  render() {
    return (
      <View className='ENavbar'>
        <View className='navbar-left' onClick={this.goBack}>
          <Text className="eft exe-return"></Text>{this.props.leftText}
        </View>
        <View className='navbar-title'>
          {this.props.children}
        </View>
        <View className='navbar-right' onClick={this.handleClickRightText}>
          {this.props.rightText}
        </View>
      </View>
    )
  }
}

ENavbar.propTypes = {
  title: PropTypes.string, // 标题文字
  leftText: PropTypes.string, // 左边文字
  rightText: PropTypes.string, // 右边文字
  onClickRightText: PropTypes.func, // 点击右边文字
  onClickLeft: PropTypes.func, // 点击左边
}