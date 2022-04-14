import Taro, { PureComponent } from '@tarojs/taro'
import { View, Text, Image } from '@tarojs/components'

class EOrgUser extends PureComponent {
  state = {}

  handleClick = () => {
    const { data, descriptionHolder, checkable, onSelectChange } = this.props
    if (checkable && onSelectChange) {
      onSelectChange(data)
    }
  }

  render() {
    const { data, descriptionHolder, checkable, active } = this.props
    console.log(1)
    return (
      <View className='EOrgUser'>
        <View className='user-avatar'>
          <Image className='user-picture' src={data.picture || 'https://res.exexm.com/src/assets/images/common/headPortrait.png?imageView2/2/w/100/h/100/format/webp'} />
        </View>
        <View className='user-info' onClick={this.handleClick}>
          <View className='user-name'>{data.name}</View>
          <View className='description'>{data.post_name || descriptionHolder}</View>
        </View>
        {checkable && <View className='selector' onClick={this.handleClick}>
          <Text className={`selector-icon eft ${active ? 'active exe-success' : 'exe-radio-o'}`}></Text>
        </View>}
      </View>
    )
  }
}

export default EOrgUser