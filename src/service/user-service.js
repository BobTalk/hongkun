import {fetchUtils} from '../utils';

const getUserInfo = () => {
  return fetchUtils.get('/Account/ILogin', {id: "12345678"})
};

const login = () => {
  return fetchUtils.post('/Account/ILogin', {UserName: "12345678", UserPwd: "888888888"})
};

export {
  getUserInfo,
  login,
}
