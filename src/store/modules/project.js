import {fetchUtils, message} from '../../utils';

const types = {
  SET_PROJECTINFO_DATA: 'SET_PROJECTINFO_DATA',      // 获取项目项目身份信息
  SET_PROJECT_QUOTA: 'SET_PROJECTQUOTA',              // 获取项目规划指标
  SET_TARGET_TITLE: 'SET_TARGET_TITLE',               // 获取项目经营目标标题
  SET_PROJECT_TARGET: 'SET_PROJECT_TARGET',           //获取项目经营目标信息
  SET_PROJECT_DATA: 'SET_PROJECT_DATA', //设置项目数据
  SET_PROJECT_AREA:'SET_PROJECT_AREA',   //设置面积指标
  SET_PRESERVATION:'SET_PRESERVATION',    //保存
  SET_PROJECT_SHOW:'SET_PROJECT_SHOW',      //设置编辑查看页
  PROJECT_AREA_QUOTA_DATA: 'PROJECT_AREA_QUOTA_DATA', //面积指标数据
  SET_PROJECT_RHYTHM:'SET_PROJECT_RHYTHM', //设置运营节奏
  SET_PROJECT_EDITION:'SET_PROJECT_EDITION',  // 版本id
  SET_PROJECT_LAND:'SET_PROJECT_LAND',     //设置土地列表

  // 获取版本
  VERSION: 'VERSION',
};
const state = {
  versionId: '',
  loading: false,
  show:true,
  projectId: "", // 项目数据信息
}

const actions = {
  projectshow({commit},projectId) {
    commit(types.SET_PROJECT_SHOW,projectId)
  },
  projectDel({commit}, projectdel) {
    return fetchUtils.post('/Project/IDeleteProject', {
      projectId: projectdel
    })
  }
};

const mutations = {
  [types.SET_PROJECT_DATA](state, projectData) {
    state.projectId = projectData.projectId;
    state.projectVersionData = projectData.projectVersionData;
    state.projectData = projectData.projectData;
    state.projectQuota = projectData.projectQuota;
    state.projectTitle = projectData.projectTitle;
    state.projectTarget = projectData.projectTarget;
    state.projectArea = projectData.projectArea;
    state.projectrhythm = projectData.preserVation;
    state.projectland = projectData.projectland
  },
  [types.SET_PRESERVATION](state, projectData){
    state.preserVation = projectData.preserVation;
  },
  [types.SET_PROJECT_SHOW](state, projectData){
    state.show = projectData;
  },
  [types.PROJECT_AREA_QUOTA_DATA](state, ProjectAreaQuotaData){
    state.ProjectAreaQuotaData = ProjectAreaQuotaData;
  },
  [types.SET_PROJECT_EDITION](state, projectedition){
    sessionStorage.setItem('projectVersionIdS', projectedition),
    state.projectedition = projectedition;
  },
  // 获取版本
  [types.VERSION](state, version){
    state.version = version;
  },
};

const getters = {
  projectInfoData: state => state.projectData,
  projectQuotaData: state => state.projectQuota,
  projectTargetTitle: state => state.projectTitle,
  projectTargetData: state => state.projectTarget,
  projectAreaData:state => state.projectArea,
  projectPreserVation:state =>state.preserVation,
  projectShow:state =>state.show,
  ProjectAreaQuotaData: state=>state.ProjectAreaQuotaData,
  projectRhythm: state => {
   return  state.projectrhythm
  },
  projectEdition: state=>{
  return  state.ProjectEditio
  },
  version: state=>state.version,  // 获取版本
};
const changeProjectAreaQuotaData = (data) => {
  data.gridData.forEach(function (item) {
    item.PRODUCTTYPENAME = item.productName;
    item['6614A4D85C6E46C5E0506A27152A43E6TOTALBUILDINGAREA'] = item.val[0];
  })
  return data
}
// 获取版本
const changeVersionData = (data) => {
// state.versionId = data[0].versionId

  return data
}

// noinspection JSAnnotator
export default {
  state,
  actions,
  getters,
  mutations
}
