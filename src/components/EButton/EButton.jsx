import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import PropTypes from 'prop-types'
import EActivityIndicator from '../EActivityIndicator/EActivityIndicator'

import './EButton.scss'

export default class EButton extends Component {
  constructor() {
    super(...arguments)
  }

  onClick = e => {
    const { onClick, disabled, loading } = this.props
    if (disabled || loading) {
      return
    }
    onClick && onClick(e)
  }

  render() {
    const { children, disabled, loading, circle, size, inline, outline } = this.props
    let buttonClass = 'EButton'
    if (outline) {
      buttonClass += ' outline'
    }
    if (disabled) {
      buttonClass += ' disabled'
    }
    if (circle) {
      buttonClass += ' circle'
    }
    if (size) {
      buttonClass += ` ${size}`
    } else {
      buttonClass += ` normal`
    }
    if (inline) {
      buttonClass += ` inline`
    }
    return (
      <View className={buttonClass} onClick={this.onClick}>
        {loading ? <EActivityIndicator inline size={10} /> : ''}
        {children}
      </View>
    )
  }
}

// size: {string} 'large'、'normal'、'small'、'mini'


EButton.propTypes = {
  onClick: PropTypes.func,
  loading: PropTypes.bool,
  disabled: PropTypes.bool
}
