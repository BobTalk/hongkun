import {fetchUtils, message} from '../../utils';
const types = {
  TEAM_BASE_INFO: 'BASE_INFO', // 项目维护 基础信息
  ORG_USERS: 'ORG_USERS', // 机构树
  CURRENT_USER: 'CURRENT_USER', // 当前用户
  INIT_TREE: 'INIT_TREE',
  SAVE_FORM: 'SAVE_FORM',
  CLEAR_INFO: 'CLEAR_INFO',
};

const state = {
   teamBaseInfo: { // 项目维护 基础信息
    BaseInfo:{
      Company: '',
      CityName: '',
      ProjectName: '',
      StageName: '',
    }
  },
  orgUsers:[],  // 机构树
  saveForm:[]
};
const actions = {
  getTeamBaseInfo({commit}) {
    fetchUtils.post('/ProjectTeam/IGetBaseInfo',
      {stageid:sessionStorage.getItem('aaaaa')}).then(
        // if(res.)
        res => res.rows
      )
      .then(data => {
      commit(types.TEAM_BASE_INFO, changeTeamBaseInfoData(data));
    })
  },
  getOrgUsers({commit}) {
    fetchUtils.get('/ProjectTeam/IGetOrganizationalUsers'
      ).then(res => res.rows)
      .then(data => {
        commit(types.ORG_USERS, changeOrgUsersData(data));
      })
  },
  settingCurrentUser({commit},{data,isDel}) {
    commit(types.CURRENT_USER, {data,isDel});
  },
  saveTeamBaseInfo({commit},{vm}) {
    fetchUtils.post('/ProjectTeam/IToSave',{
      baseinfo:JSON.stringify(state.teamBaseInfo.BaseInfo),
      data:JSON.stringify(state.teamBaseInfo.projectTeamJobList)
    }).then(res => res.rows)
      .then(data => {
        vm.$message({
          message: '人员信息保存成功!',
          type: 'success'
        });
        commit(types.SAVE_FORM, changeSaveData(data));
      }).catch(function(e){
        vm.$message({
          message: '人员信息保存失败!',
          type: 'error'
        });
      })
    // fetchUtils.post('/ProjectTeam/IToSave',
    //   {baseinfo:JSON.stringify(state.teamBaseInfo.BaseInfo),data:JSON.stringify(state.teamBaseInfo.projectTeamJobList)})
    //   .then(data => {
    //   commit(types.TEAM_BASE_INFO);
    // })
  },
  initTree({commit}) {
    commit(types.INIT_TREE);
  },
  clearInfo({commit}){
    commit(types.CLEAR_INFO);
  }
}

const mutations = {

  [types.SAVE_FORM](state,saveForm){  // 项目维护 基础信息
    state.saveForm = saveForm;
  },
  [types.INIT_TREE](state){  // 项目维护 基础信息
    state.orgUsers = [];
  },
  [types.TEAM_BASE_INFO](state, teamBaseInfo){  // 项目维护 基础信息
    state.teamBaseInfo = teamBaseInfo;
  },
  [types.ORG_USERS](state, orgUsers){  // 机构树
    state.orgUsers = orgUsers;
  },
  [types.CLEAR_INFO](state){
    // state.teamBaseInfo =  { // 项目维护 基础信息
    //   BaseInfo:{
    //     Company: '',
    //     CityName: '',
    //     ProjectName: '',
    //     StageName: '',
    //   }
    // }
    state.teamBaseInfo = {}
  },
  [types.CURRENT_USER](state, {data,isDel}){  // 当前用户
      let names = [],ids = []
      if(isDel) {
        state.teamBaseInfo.projectTeamJobList.forEach(function (job) {
          if(job.jobId == data) {
            job.UserNames = ''
            job.UserIds = ''
          }
        })
        return false
      }
      data.forEach(function(item) {
        names.push(item.UserNames)
        ids.push(item.UserIds)
      })
    state.teamBaseInfo.projectTeamJobList.forEach(function (job) {
      if(data && job.jobId == data[0].jobId) {
        job.UserNames = names.join(',')
        job.UserIds = ids.join(',')
      }
    })
  },

}

const getters = {
  teamBaseInfo: state => state.teamBaseInfo, // 项目维护 基础信息
  orgUsers: state => state.orgUsers, // 机构树

};
// 项目维护 基础信息 数据处理
const changeTeamBaseInfoData = (data) => {
  // console.info(JSON.stringify(data,null,2))
  return data
}
// 机构树
const changeOrgUsersData = (data) => {
  return data
}
const changeSaveData = (data) => {
  return data
}

export default {
  state,
  actions,
  getters,
  mutations
}
