import {appConfig} from '../config';
import message from './message';
import store from '../store/index.js'

const baseUrl = appConfig.domain;
const jhserver = appConfig.jhserver;
const fetchWrapper = async (url = '', data = {}, type = 'GET', method = 'fetch') => {

  //验证token
  const token = localStorage.getItem('token');
  // debugger;
  // alert(token)
  if(location.hash.indexOf("gateway") != -1) {

    return false
  }
  if(location.hash.indexOf("gettopost") != -1) {

    return false
  }
  if (!token && location.hash.indexOf("login") == -1) {

    localStorage.removeItem('token');
    localStorage.removeItem('userInfo');
    message.error("登录状态已过期, 请重新登录!");
    location.hash = "/login";
  }

  type = type.toUpperCase();
  if (url.indexOf("/api") != -1) {
      url = jhserver + url.slice(4)
  }else {
      url = baseUrl + url;
  }
  !data && (data = {});
  //添加token参数和时间戳
  data = {...data, token: token, t: new Date().getTime()};
  //数据拼接字符串
  let paramStr = '';
  Object.keys(data).forEach(key => {
    paramStr += key + '=' + data[key] + '&';
  });
  if (paramStr !== '') {
    paramStr = paramStr.substr(0, paramStr.lastIndexOf('&'));
  }

  if (type == 'GET' && paramStr !== '') {
    url = url + '?' + paramStr
  }

  if (window.fetch && method == 'fetch') {
    let requestConfig = {
      method: type,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8'
      },
      mode: "cors",
      cache: "no-cache"
    };

    //console.log("paramStr", paramStr);
    if (type == 'POST') {
      requestConfig.body = paramStr;
    }

    try {
      const response = await fetch(url, requestConfig);
      const responseJson = await response.json();
      //判断接口返回值的状态码, 不等于200的时候 表示有异常/错误 信息
      if (responseJson.errorcode && responseJson.errorcode == 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('userInfo');
        message.error("登录状态已过期, 请重新登录!");
        location.hash = "/login";
        return Promise.reject("登录状态失效, 请重新登录!")
      }
      if (responseJson.errorcode && responseJson.errorcode == 201) {
        message.error(responseJson.message);
      }else if (responseJson.errorcode && responseJson.errorcode != 200) {
         //判断接口返回值的状态码, 不等于200的时候 表示有异常/错误 信息
        return Promise.reject(responseJson.message || "接口发生错误")
      }

      return responseJson
    } catch (error) {
      if (error.toString().indexOf("SyntaxError: Unexpected token") > -1) {
        return Promise.reject(`接口: ${url} 发生异常!`)
      }
      throw new Error(error)
    }
  } else {
    return new Promise((resolve, reject) => {
      let requestObj;
      if (window.XMLHttpRequest) {
        requestObj = new XMLHttpRequest();
      } else {
        requestObj = new ActiveXObject;
      }

      let sendData = '';
      if (type == 'POST') {
        sendData = paramStr;
      }

      requestObj.open(type, url, true);
      requestObj.setRequestHeader("Content-type", "application/x-www-form-urlencoded; charset=utf-8");
      requestObj.send(sendData);

      requestObj.onreadystatechange = () => {
        if (requestObj.readyState == 4) {
          if (requestObj.status == 200) {
            let obj = requestObj.response
            if (typeof obj !== 'object') {
              obj = JSON.parse(obj);
            }
            resolve(obj)
          } else {
            reject(requestObj)
          }
        }
      }
    })
  }
};

const fetchUtils = (store) => {
  //闭包里的变量, 保存全局的时间戳
  let innerTime = new Date().getTime();

  function innerFetch(url, data, method = "GET") {
    let time = new Date().getTime();
    innerTime = time;
    store.dispatch('SHOW_LOADING');

    return fetchWrapper(url, data, method)
      .then(res => {
        setTimeout(() => {
          if (innerTime === time) {
            store.dispatch('CLOSE_LOADING');
          }
        }, 300);
        return res;
      })
      .catch(error => {
        setTimeout(() => {
          store.dispatch('CLOSE_LOADING');
        }, 300);
        return Promise.reject(error)
      })
  };

  return {
    get(url, data) {
      return innerFetch(url, data);
    },
    post(url, data) {
      return innerFetch(url, data, "POST");
    },
    all(promiseArray) {
      let time = new Date().getTime();
      innerTime = time;
      store.dispatch('SHOW_LOADING');

      return Promise.all(promiseArray)
        .then(res => {
          setTimeout(() => {
            if (innerTime === time) {
              store.dispatch('CLOSE_LOADING');
            }
          }, 300);
          return res;
        })
        .catch(error => {
          setTimeout(() => {
            store.dispatch('CLOSE_LOADING');
          }, 300);
          return Promise.reject(error)
        })
    },
  }
};

export default fetchUtils(store);
