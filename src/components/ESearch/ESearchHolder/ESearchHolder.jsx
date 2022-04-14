import Taro from '@tarojs/taro'
import { View, Text } from '@tarojs/components'

const ESearchHolder = () => (
  <View onClick={this.props.onClick} className='ESearchHolder'>
    <View className='search'>
      <Text className='eft exe-search-o'></Text>
      <View>{this.props.placeholder || '搜索'}</View>
    </View>
  </View>
)

export default ESearchHolder
