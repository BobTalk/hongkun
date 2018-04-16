import {appConfig} from '../config';
import message from './message';
import store from '../store/index.js'

const baseUrl = appConfig.domain;

const fetchWrapper = async (url = '', data = {}, type = 'post', method = 'fetch') => {
    //验证token
    const token = localStorage.getItem('token');
    if (!token && location.hash.indexOf("login") == -1) {
      localStorage.removeItem('token');
      localStorage.removeItem('userInfo');
      message.error("登录状态已过期, 请重新登录!");
      location.hash = "/login";
    }
  
    type = type.toUpperCase();
    url = baseUrl + url;
    !data && (data = {});
    //添加token参数和时间戳
    data = {...data, token: token, t: new Date().getTime()};
    if (window.fetch && method == 'fetch') {
      let requestConfig = {
        method: type,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
        mode: "cors",
        cache: "no-cache"
      };

      try {
        const response = await fetch(url, requestConfig);
        let responseJson = await response.json();
        //判断接口返回值的状态码, 不等于200的时候 表示有异常/错误 信息
        if (responseJson.errorcode && responseJson.errorcode == 401) {
          localStorage.removeItem('token');
          localStorage.removeItem('userInfo');
          message.error("登录状态已过期, 请重新登录!");
          location.hash = "/login";
          return Promise.reject("登录状态失效, 请重新登录!")
        }
  
        //判断接口返回值的状态码, 不等于200的时候 表示有异常/错误 信息
        if (responseJson.errorcode && responseJson.errorcode != 200) {
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
  
        requestObj.open('POST', url, true);
        requestObj.setRequestHeader("Content-type", "application/json");
        requestObj.send(JSON.stringify(data));
  
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

  const fetchXml = (store) => {
    //闭包里的变量, 保存全局的时间戳
    let innerTime = new Date().getTime();
  
    function innerFetch(url, data, method = "POST") {
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
  
  export default fetchXml(store);