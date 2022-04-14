import Taro from '@tarojs/taro'
import md5 from 'md5'

// 处理响应错误
const handleError = (res) => {
  const code = res.statusCode
  switch (code) {
    case 401:
      Taro.showToast({ title: '登录已失效', icon: 'none' })
      break;
    case 406:
      Taro.showToast({ title: '登录已失效', icon: 'none' })
      break;
    default:
      Taro.showToast({ title: res.msg || res.data.msg, icon: 'none' })
  }
}

const setSignHeaders = () => {
  const user = {
    "userId":"YQ123",
    "tenantId":"dev",
  }
  const { userId } = user
  const nonce = Math.random().toString().slice(2, 10);
  const timeStamp = new Date().getTime();
  const signValue = [userId, timeStamp, nonce].join('&');
  const md5SignValue = md5(signValue);
  // if(md5SignValue && md5SignValue.length > 6) {
  const md5SignValueLen = md5SignValue.length;
  const md5SignArr = md5SignValue.split('');
  const firstPart = md5SignArr.slice(0, 6).reverse();
  const lastPart = md5SignArr.slice(md5SignValueLen - 8, md5SignValueLen).reverse();
  const midPart = lastPart.concat(firstPart).join('');
  const signature = md5(md5(midPart)).toUpperCase();
  return { timeStamp, nonce, signature }
}

// 添加拦截器
// CryptoJS,cryptoService
const interceptor = (chain) => {
  // 请求信息
  const requestParams = chain.requestParams
  let { url } = requestParams
  // console.log(`http ${method || 'GET'} --> ${url} data: `, data)
  // 使用chain.proceed调用下一个拦截器或发起请求
  const token = 'GZR7uH9u7BZ%2bA2ddzMFadA2muMsnP77McMAvxZkdZRc%3d'
  const user = {
    "userId":"YQ123",
    "tenantId":"dev",
  }
  
  // const { tenantId, userId } = user
  // if (tenantId && userId) {
  //   var joiner = url.indexOf('?') !== -1 ? '&' : '?';
  //   var versionStr = '';
  //   // if(version && htmlVersion) {
  //   //     versionStr = version + ':' + htmlVersion;
  //   // }
  //   requestParams.url = url + joiner + '__u='
  //     + encodeURIComponent(aesEncrypt(tenantId + ':' + userId))
  //     + '__e=' + encodeURIComponent(aesEncrypt(versionStr))
  // }
  if (token) {
    requestParams.header.token = token
  }
  // 加签
  requestParams.header = {
    ...requestParams.header, ...setSignHeaders()
  }

  // let cryptoService = new CryptoService
  // console.log(666)
  // console.log(cryptoService.getKeyAndUuid())
  // //请求接口加密
  // console.log(data)
  //  try{
  //     var cryptoService = new CryptoService
  //     var key = cryptoService.getKeyAndUuid();
  //     var reqUuid = key.reqUuid;
  //     var encryptKey = key.encryptKey;
  //     var aesKey = key.aesKey;
  //     requestParams.header['req-key'] = encryptKey;
  //     requestParams.header['req-uuid'] = reqUuid;
  //     requestParams.header['encryption'] = "true";
  //     if(data){
  //         var encryptData = cryptoService.encryptForReq(aesKey, data);
  //         data = { requestBody: encryptData }
  //     }
  //   }catch(error){
  //       console.log(error);
  //   }


  return chain.proceed(requestParams)
    .then(res => {
      // 响应信息
      // console.log(`http <-- ${url} result:`, res)
      // console.log(res)
      // console.log(666)
      // if(res && res.statusCode === 200){
      //   try {
      //     var cryptoService = new CryptoService
      //     res.data = cryptoService.decryptForResponse(res.data)
      //   } catch (error) {
      //     console.log(error)
      //   }
      // }

      return res
    })
}

Taro.addInterceptor(interceptor)

export default {
  request(options, method = 'GET', refresh) {
    if (!options.hideLoading) {
      Taro.showLoading()
    }
    return new Promise((resolve, reject) => {
      Taro.request({
        ...options,
        method,
        header: {
          //   'content-type': 'application/x-www-form-urlencoded',
          'content-type': 'application/json',
          ...options.header
        },
        cache: 'force-cache',
        useStore: true
      })
        .then((res) => {
          Taro.hideLoading()
          if (res.statusCode != 200) {
            handleError(res)
            reject(res.data)
            return
          }
          if (res.data.success === false) {
            Taro.showToast({ title: res.msg || res.data.msg, icon: 'none' })
          }
          resolve(res.data)
        })
        .catch(error => {
          Taro.hideLoading()
          if (error.status == 401 || error.status == 406) {
            handleError({
              statusCode: error.status,
              data: {
                msg: '登录已失效'
              }
            })
            return
          }
          Taro.showToast({ title: '出错了', icon: 'none' })
          reject(error)
        })
    })
  },
  get(options, refresh) { return this.request({ ...options }, 'GET', refresh) },
  post(options) { return this.request({ ...options, data: JSON.stringify(options.data) }, 'POST') },
  delete(options) { return this.request({ ...options }, 'DELETE') }
}
