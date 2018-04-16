import {fetchUtils, message} from '../../utils';

//mutations类型
const types = {
  SET_USER_INFO: 'SETUSERINFO',      //设置用户信息
  SET_USER_TOKEN: 'SET_USER_TOKEN', //设置TOKEN
  GET_USER_DATA: 'GET_USER_DATA',    //获取用户数据信息
};

const state = {
  // 令牌
  token: localStorage.getItem('token') || "",
  // 用户登录信息
  userInfo: JSON.parse(localStorage.getItem('userInfo')) || {},
};

const actions = {
  /**
   * 用户登录
   */
  login({commit}, {name, pwd}) {

    const loginPromise = fetchUtils.post('/Account/ILogin', {UserName: name, UserPwd: pwd});

    return loginPromise
      .then(res => {
        // 获取用户信息和token
        const token = res.token;
        const userInfo = {
          userId: res.rows.UserDto.ID,
          userName: res.rows.UserDto.empName,
        };
        const menusData = res.rows.MenusData.rows;
        localStorage.setItem('userInfo', JSON.stringify(userInfo));
        localStorage.setItem('token', token);
        localStorage.setItem('_menusData', JSON.stringify(menusData));
        localStorage.setItem('topMenus', JSON.stringify(menusData.topMenus));
        localStorage.setItem('leftMenus', JSON.stringify(menusData.leftMenus));
        commit(types.SET_USER_INFO, userInfo);
        commit(types.SET_USER_TOKEN, token);
      });
  },

  /**
   * 退出登录
   */
  logout({commit}) {
    localStorage.removeItem('token');
    localStorage.removeItem('userInfo');
    localStorage.removeItem('topMenus');
    localStorage.removeItem('leftMenus');
    localStorage.removeItem('aaaaa');//消除保存的团队维护，考核版本，利率的分期id
    commit(types.SET_USER_TOKEN, "");
    commit(types.SET_USER_INFO, {});
    console.info(localStorage.getItem('aaaaa'));
  },

  /**
   * 请求用户信息
   */
  getUserInfo({commit}, id) {
    const promise = fetchUtils.post('/Account/IGetUserInfo');
    promise
      .then(userData => {
          const userInfo = {
            userId: userData.ID,
            userName: userData.empName,
          };

          localStorage.setItem('userInfo', JSON.stringify(userInfo));
          commit(types.SET_USER_INFO, userInfo);
        }
      )
      .catch(error => {
        // console.error(error);
        // message.error("获取用户信息失败!")
      })
  },
  sso({commit},{userInfo,token,vm}) {
      window.location.replace("/#/workflow/todo/") //39.106.71.187:8011  127.0.0.1:8080 http://192.168.0.102:8010
      fetchUtils.get('/Account/IGetSSOUserInfo').then(res => {
        var token_ = res.token;
        var userInfo_ = {
          userId: res.rows.UserDto.ID,
          userName: res.rows.UserDto.empName,
        };
        var menusData = res.rows.MenusData.rows;
        localStorage.setItem('userInfo', JSON.stringify(userInfo_));
        localStorage.setItem('token', token_);
        localStorage.setItem('topMenus', JSON.stringify(menusData.topMenus));
        localStorage.setItem('leftMenus', JSON.stringify(menusData.leftMenus));
        commit(types.SET_USER_INFO, userInfo);
        commit(types.SET_USER_TOKEN, token_);
        window.setTimeout(function () {
          document.location.reload();
        },1000)

      })
  },
  // ssoReq({commit},{userInfo,token,vm}) {
  //   fetchUtils.post('/Account/IGetSSOUserInfo',{
  //   }).then(res => {
  //     console.info(res)
  //   }).catch(error =>{
  //     console.info(error)
  //   })
  // }
};

const getters = {
  token: state => state.token,
  userInfo: state => state.userInfo,
};

const mutations = {

  [types.SET_USER_INFO](state, userInfo) {
    state.userInfo = userInfo;
  },

  [types.SET_USER_TOKEN](state, token) {
    state.token = token;
  },

  [types.GET_USER_DATA](state, res) {
    state.userData = res;
  }

};

export default {
  state,
  actions,
  getters,
  mutations
}
