import Taro, { Component } from '@tarojs/taro'
import { View, Text, ScrollView } from '@tarojs/components'
import PropTypes from 'prop-types'
import EOrgDept from './EOrgDept'
import EButton from '../EButton/EButton'
import ESearchHolder from '../ESearch/ESearchHolder/ESearchHolder'
import ESearch from '../ESearch/ESearch'
import http from '../../utils/http'
import { throttle } from '../../utils/index'

class EOrg extends Component {

  state = {
    selectedUserIds: {},
    selectedUsers: [],
    showSelected: false,
    hasResult: false,

    keyword: '',
    noMoreSearchData: false,
    hasMoreSearchData: false,
    searchPage: 0,
    searchDataList: [],
    noResult: false
  }

  static options = {
    addGlobalClass: true
  }

  componentDidMount() {
    this.fetchOrgData()
    const { selectedUserIds } = this.props
    if (selectedUserIds && selectedUserIds.length > 0) {
      this.recoverSelectedUsers(selectedUserIds)
    }
  }

  transformResData = (res) => {
    if (res && res.data && res.data.length) {
      return res.data
    } else {
      return []
    }
  }

  transformSearchResData = (keyword, res) => {
    if (res && res.data && res.data) {
      if (res.data.key === keyword && res.data.empty_result === false) {
        return res.data.result[0].items
      }
      return []
    } else {
      return []
    }
  }

  fetchOrgData = () => {
    const { orgUrl } = this.props
    http.get({
      url: orgUrl
    }).then(res => {
      const data = this.transformResData(res)
      this.setState({
        data,
        hasResult: true
      })
    })
  }

  /**
   * 使用传入的用户ID获取本地缓存的用户信息
   *
   * @param {*} userIds
   * @memberof EOrg
   */
  recoverSelectedUsers = userIds => {
    const selectedUserIds = {}
    let selectedUsers = []
    userIds.forEach(id => {
      const user = Taro.getStorageSync('__EOrg_user_' + id)
      if (user) {
        selectedUsers.push(user)
        selectedUserIds[id] = true
      }
    })
    this.setState({
      selectedUserIds,
      selectedUsers
    })
  }

  handleSelectChange = data => {
    let { selectedUserIds, selectedUsers } = this.state
    const { multiple } = this.props
    if (data && data.id) {
      if (selectedUserIds[data.id] && multiple) {
        this.unSelectItem(data)
        return
      }
      if (multiple) {
        selectedUserIds[data.id] = true
        selectedUsers.push(data)
      } else {
        selectedUserIds = { [data.id]: true }
        selectedUsers = [data]
      }
      this.setState({
        selectedUserIds, selectedUsers
      })
    }
  }

  closeSelectedList = () => {
    this.closeSelectedListWithAnimation()
  }

  showSelectedList = () => {
    this.setState({
      showSelected: true
    })
  }

  removeListWithAnimation = (item, index) => {
    this.setState({
      removingIndex: index
    })
    setTimeout(() => {
      this.unSelectItem(item)
      this.setState({
        removingIndex: undefined
      })
    }, 300);
  }

  closeSelectedListWithAnimation = () => {
    this.setState({
      showCloseAnimation: true
    })
    setTimeout(() => {
      this.setState({
        showCloseAnimation: undefined,
        showSelected: false
      })
    }, 300);
  }

  unSelectItem = selectedData => {
    const { selectedUserIds, selectedUsers } = this.state
    selectedUserIds[selectedData.id] = false
    const index = selectedUsers.findIndex(item => item.id === selectedData.id)
    selectedUsers.splice(index, 1)
    this.setState({ selectedUsers, selectedUserIds })
  }

  conform = () => {
    const { checkable, onSelect } = this.props
    if (checkable && onSelect) {
      this.keepCurrentSelectedUsersInfo(this.state.selectedUsers)
      onSelect(this.state.selectedUsers)
    }
  }

  // 每次点击确定，保存当前选中的人员，方便以后传递人员信息之后获取详情
  keepCurrentSelectedUsersInfo = (users = []) => {
    let arr = []; // Array to hold the keys
    // Iterate over localStorage and insert the keys that meet the condition into arr
    for (let i = 0; i < localStorage.length; i++) {
      if (localStorage.key(i).substring(0, 7) == '__EOrg_') {
        arr.push(localStorage.key(i))
      }
    }
    // Iterate over arr and remove the items by key
    for (let i = 0; i < arr.length; i++) {
      localStorage.removeItem(arr[i]);
    }
    users.forEach(user => {
      Taro.setStorageSync('__EOrg_user_' + user.id, user)
    })
  }


  toSearch = () => {
    this.setState({
      searchingMode: true
    })
  }

  clearSearch = () => {
    this.setState({
      keyword: '',
      noMoreSearchData: false,
      hasMoreSearchData: false,
      searchPage: 0,
      searchDataList: [],
      noResult: false
    })
  }

  cancelSearch = () => {
    this.clearSearch()
    this.setState({
      searchingMode: false,
    })
  }

  searchTextChange = (e) => {
    this.setState({
      keyword: e.detail.value
    })
    throttle({ method: () => this.doSearch(e.detail.value), delay: 300 })
  }

  doSearch = (keyword) => {
    const { searchUrl } = this.props
    http.get({
      url: `${searchUrl}?key=${keyword}&page_size=20&limit_type=org&__v=3.1`
    }).then(res => {
      const searchDataList = this.transformSearchResData(keyword, res)
      this.setState({
        searchDataList
      })
    })
  }

  blur = () => {
    this.searchRef && this.searchRef.blur()
  }

  handleScroll = () => {
    throttle({ method: this.blur, delay: 300, ahead: true })
  }

  render() {
    const { data, selectedUserIds, selectedUsers, showSelected, removingIndex, showCloseAnimation, hasResult,
      searchingMode, keyword, searchDataList } = this.state
    const { orgUrl, checkable, renderCounter, multiple, conformText, title } = this.props
    return <View className='EOrg'>
      <View className='header-bar'>
        {
          searchingMode && <ESearch
            onChange={this.searchTextChange}
            onCancel={this.cancelSearch}
            onClear={this.clearSearch}
            ref={search => this.searchRef = search}
            value={keyword}
            placeholder={'输入需要搜索的内容'}
            cancelText={'取消'}
          />
        }
      </View>
      {!searchingMode && <ESearchHolder placeholder={'local.TEXT_SEARCH_TEXT'} onClick={this.toSearch} />}
      {!searchingMode && <View className='title'>{title || '组织结构'}</View>}
      {
        !searchingMode && data && data.length > 0 && data.map(item => <EOrgDept selectedUserIds={selectedUserIds} checkable={checkable} onSelectChange={this.handleSelectChange} key={item.id} http={http} orgUrl={orgUrl} data={item} />)
      }
      {
        searchingMode && searchDataList && searchDataList.length > 0 && searchDataList.map(item => <EOrgDept selectedUserIds={selectedUserIds} checkable={checkable} onSelectChange={this.handleSelectChange} key={item.id} http={http} orgUrl={orgUrl} data={item} />)
      }
      {
        showSelected && multiple && <View className={showCloseAnimation ? 'selector-panel close' : 'selector-panel'} isOpened={showSelected && selectedUsers.length > 0}>
          <View className='selected-header'>
            <Text className='eft exe-unfold' onClick={this.closeSelectedList}></Text>
            {
              <View className='selected-title'>{renderCounter ? renderCounter(selectedUsers) : '已选择' + selectedUsers.length + '人'}</View>
            }
            <View className='multi-conform-button' onClick={this.closeSelectedList}>{conformText || '确定'}</View>
          </View>
          <ScrollView scrollY className='selected-list'>
            {
              selectedUsers.map((item, index) => <View key={item.id} className={removingIndex === index ? 'selected-item remove' : 'selected-item'}>
                <View className='selected-name'>{item.name}</View>
                <Text onClick={() => this.removeListWithAnimation(item, index)} className='eft exe-fail'></Text>
              </View>)
            }
          </ScrollView>
        </View>
      }
      {
        hasResult && !showSelected && selectedUsers.length > 0 && multiple && <View className='select-counter'>
          <View className='counter' onClick={this.showSelectedList}><Text className='eft exe-packup'></Text>{renderCounter ? renderCounter(selectedUsers) : '已选择' + selectedUsers.length + '人'}</View>
          <View className='multi-conform-button' onClick={this.conform}>{conformText || '确定'}</View>
        </View>
      }
      {
        hasResult && !showSelected && selectedUsers.length > 0 && !multiple &&
        <View className='conform-button'>
          <EButton circle onClick={this.conform}>{conformText || '确定'}</EButton>
        </View>
      }
    </View>
  }
}

export default EOrg
EOrg.propTypes = {
  title: PropTypes.string, // 标题文字
  orgUrl: PropTypes.string, // 调用的组织架构接口
  checkable: PropTypes.bool, // 是否可选择
  multiple: PropTypes.bool, // 是否支持多选
  onSelect: PropTypes.func, // 确认选中用户时的回调
  selectedUserIds: PropTypes.array, // 已经选中的用户ID数组

  conformText: PropTypes.string, // 确认文字
  renderCounter: PropTypes.func, // 多选时展示的选择统计，入参是selectedUserIds，是当前已选择的人数，需要return JSX
}