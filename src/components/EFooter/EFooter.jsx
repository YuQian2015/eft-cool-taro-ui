import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'

export default class EFooter extends Component {

  static options = {
    addGlobalClass: true
  }

  componentDidMount () {
    this.countHeight()
  }

  componentDidUpdate() {
    this.countHeight()
  }

  countHeight() {
    const query = Taro.createSelectorQuery()
    if (process.env.TARO_ENV === 'h5') {
      query.in(this)
    } else {
      query.in(this.$scope)
    }
    query.select('.EFooter').boundingClientRect(rect => {
      if(rect) {
        Taro.eventCenter.trigger('ESetFooter', rect)
      }
    }).exec()
  }

  render () {
    return (
      <View className='EFooter'>
        {this.props.children}
      </View>
    )
  }
}
