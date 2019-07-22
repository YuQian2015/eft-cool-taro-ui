import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import PropTypes from 'prop-types'

import './EActivityIndicator.scss'

export default class EActivityIndicator extends Component {
  constructor() {
    super(...arguments)
  }

  render() {
    const { inline, size, color } = this.props
    return (
      <View className={inline ? 'EActivityIndicator inline' : 'EActivityIndicator'} style={{
        'font-size': `${size || 10}px`,
        'border-top': `0.2em solid ${color}55`,
        'border-right': `0.2em solid ${color}55`,
        'border-bottom': `0.2em solid ${color}55`,
        'border-left': `0.2em solid ${color}`
      }}>加载中...</View>
    )
  }
}


EActivityIndicator.propTypes = {
  size: PropTypes.number,
  inline: PropTypes.bool,
  color: PropTypes.string
};