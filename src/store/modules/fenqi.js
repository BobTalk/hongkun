import {fetchUtils, message} from '../../utils';
const types = {
  /*分期总图*/
  GET_INVER_DATA: 'GET_INVER_DATA',
  GET_PROJECT_DATA: 'GET_PROJECT_DATA',
  SET_STAGE_IMAGE_STATUS: 'SET_STAGE_IMAGE_STATUS',
  STAGE_VERSION: 'STAGE_VERSION', // 分期版本
  HEIGHT_VERSION: 'HEIGHT_VERSION', // 最高版本
  STAFGE_IDENTITY_INFO: 'STAFGE_IDENTITY_INFO', //身份信息
  LAND_PROPERTY: 'LAND_PROPERTY', // 土地性质
  LAND_PLAN_USE: 'LAND_PLAN_USE', // 规划用途
  PLAN_GROUP_TASK: 'PLAN_GROUP_TASK', // 项目运营目标
  STAGE_AREA_QUOTA: 'STAGE_AREA_QUOTA', // 面积指标
  MTITLE: 'MTITLE', // 项目经营目标
  STAGE_PROJECT_TART: 'STAGE_PROJECT_TART', // 项目经营数据
  SET_MODE_ID: 'SET_MODE_ID', // 开发方式
  ADD_INFO: 'ADD_INFO', // 增加公司名称
  DEL_INFO: 'DEL_INFO', // 删除公司名称
  ADD_LAND: 'ADD_LAND', // 增加地块
  DEL_LAND: 'DEL_LAND', // 删除地块
  SET_STAGE_EDIT: 'SET_STAGE_EDIT', // 设置可编辑
  ADD_STAGE: 'ADD_STAGE', // 新增分期
  SET_SAVE: 'SET_SAVE', // 分期保存
  DEL_STAGE: 'DEL_STAGE',//删除分期
  MESSAGE_BOX: 'MESSAGE_BOX',//信息盒子
  SET_STAGE_EDITFLAG: 'SET_STAGE_EDITFLAG',
  SET_V_LAND_LIST: 'SET_V_LAND_LIST',
  CHANGE_LAND_PROPERTYS: 'CHANGE_LAND_PROPERTYS',
  BACK_STAGEINFO: 'BACK_STAGEINFO', //接口返回数据
  STAGE_CURRENT_VERSION: 'STAGE_CURRENT_VERSION', // 分期当前版本
  CANLE_DIALOG: 'CANLE_DIALOG', /* 取消公司添加*/
  CANLE_PROJECT_DIALOG: 'CANLE_PROJECT_DIALOG', /* 取消公司添加*/
  SUBMIT_DIALOG: 'SUBMIT_DIALOG',
  SUBMIT_PROJECT_DIALOG: 'SUBMIT_PROJECT_DIALOG',
  STAGE_VALUE_TARGET: 'STAGE_VALUE_TARGET',
  LOAD_TREE: 'LOAD_TREE',
}
const state = {
  /*分期总图*/
  loadTree: false,
  InverstMiddle: [], /*投资公司中间数据*/
  ProjectMiddle: [], /*项目公司中间数据*/
  stageCurrentVersion: '',
  stageImageStatus: "",
  backStageInfo: {},
  stageVersion: [], // 分期版本
  heightVersion: '', // 最高版本
  stageIdentityInfo: {
    vStageIdentityInfo: {
      stageName: '',
      stageCode: '',
      stageCreateDate: '',
      principal: '',
      developmentId: '',
      developmentModel: '',
      companyProportion: '',
      projectCompanyName: '',
      upParkSpace: "",
      underParkSpace: "",
      totle: ""
    },
    BtBuildUnitList: [],
    vLandList: [
      {
        ID: "",
        STAGEID: "",
        STAGEVERSIONID: "",
        GAINDATE: "",
        LANDCERTIFICATE: "",
        LANDPROPERTYID: "",
        LANDPROPERTY: "",
        LANDPLANUSEID: [],
        LANDPLANUSE: [],
        LANDUSERYEAR: [],
        ISDEL: 0,
      }
    ],
    ProjectBuildUnit: [],
    InverstBuildUnit: []
  }, //身份信息
  landPropertys: [], // 土地性质
  landPlanUses: [], // 规划用途
  planGroupTask: [], // 项目运营目标
  stageAreaQuota: [], // 面积指标
  mTitle: [], // 项目经营目标
  stageProjectTart: [], // 项目经营数据
  stageEdit: true, // 分期编辑
  isShowVersionSelect: true, // 是否显示 分期版本 下拉框
  messageFalg: false,
  versionId: "",
  stageVersionStatus: "",
  stageVersionStatusCode: ""
}
const actions = {
  setLoadTree({commit},{loadTree}){
    commit(types.LOAD_TREE,loadTree)
  },
  getInverData({commit}){
    commit(types.GET_INVER_DATA)
  },
  getProjectData({commit}){
    commit(types.GET_PROJECT_DATA)
  },
  canleInverstDialog({commit}){
    commit(types.CANLE_DIALOG)
  },
  canleProjectDialog({commit}){
    commit(types.CANLE_PROJECT_DIALOG)
  },
  submitDialog({commit}){
    commit(types.SUBMIT_DIALOG)
  },
  submitProjectDialog({commit}){
    commit(types.SUBMIT_PROJECT_DIALOG)
  },
  stageSetImageStatus({commit}, {status}){
    commit(types.SET_STAGE_IMAGE_STATUS, !!status)
  },
  setNoEdit({commit}, showFlag) {
    commit(types.SET_STAGE_EDITFLAG, showFlag)
  },
  getStageVersion ({commit}, {nodeId}) { // 分期版本
    return fetchUtils.post('/stage/GetStageVersionList', {stageId: nodeId});
    /*
     * .then(res => res.rows)
     .then(data => {
     commit(types.STAGE_VERSION, changeStageVersionData(data));
     if (data.length > 0) {
     commit(types.STAGE_CURRENT_VERSION, data[0].versionId);
     }
     })
     *
     * */
  },
  stageSetVersion ({commit}, version) { // 设置当前的版本
    commit(types.STAGE_CURRENT_VERSION, version);
  },
  setMode ({commit}, id) { // 同步开发方式的状态数据
    commit(types.SET_MODE_ID, id);
  },
  //身份信息
  getStageIdentityInfo ({commit}, {stageVersionId, nodeId}) {
    fetchUtils.post('/stage/GetStageIdentityInfo', {
      stageId: nodeId,
      stageVersionId: stageVersionId
    }).then(res => res.rows)
      .then(data => {
        commit(types.STAFGE_IDENTITY_INFO, changeStageIdentityInfoData(data));
      })
  },
  // 土地性质
  getLandPropertys ({commit}) {
    fetchUtils.post('/stage/GetLandDictionaryByParentId').then(res => res.rows)
      .then(data => {
        commit(types.LAND_PROPERTY, changeLandPropertysData(data));
      })
  },
  // 规划用途
  getLandPlanUses ({commit}) {
    fetchUtils.post('/stage/GetPlanUseByParentId').then(res => res.rows)
      .then(data => {
        commit(types.LAND_PLAN_USE, changeLandPlanUsesData(data));
      })
  },
  // 项目运营目标
  getPlanGroupTask ({commit}, {stageId}) {
    fetchUtils.post('/stage/GetPlanGroupTask', {stageId: stageId}).then(res => res.rows)
      .then(data => {
        commit(types.PLAN_GROUP_TASK, changePlanGroupTaskData(data));
      })
  },
  //  面积指标
  getStageAreaQuota ({commit}, {stageVersionId}) {
    commit(types.STAGE_AREA_QUOTA, []);
    fetchUtils.post('/stage/GetStageAreaQuota', {stageVersionId: stageVersionId}).then(res => res.rows)
      .then(data => {
        commit(types.STAGE_AREA_QUOTA, changeStageAreaQuotaData(data));
      })
  },
  // 项目经营目标
  getMTitle ({commit}, {stageVersionId, nodeId}) {
    fetchUtils.post('/stage/IGetManagementObjectivesTitle', {stageId: nodeId}).then(res => res.rows)
      .then(data => {
        commit(types.MTITLE, changeMTitleData(data));
      })
  },
  // 项目经营数据
  getStageProjectTart ({commit}, {stageVersionId, nodeId}) {
    fetchUtils.post('/stage/GetStageProjectTart', {
      stageVersionId: stageVersionId,
      stageId: nodeId
    }).then(res => res.rows)
      .then(data => {
        commit(types.STAGE_PROJECT_TART, changeStageProjectTartData(data));
      })
  },
  // 增加公司名称
  addInfo ({commit}, {COMPANNYTYPE, ID, COMPANNYNAME}) {
    commit(types.ADD_INFO, {COMPANNYTYPE, ID, COMPANNYNAME});
  },
  // 删除公司名称
  delInfo ({commit}, {COMPANNYTYPE, ID}) {
    commit(types.DEL_INFO, {COMPANNYTYPE, ID});
  },
  // 增加地块
  addLand ({commit}) {
    commit(types.ADD_LAND);
  },
  // 删除地块
  delLand ({commit}) {
    commit(types.DEL_LAND);
  },
  // 设置可编辑
  setStageEdit ({commit}, flag) {
    //flag
    commit(types.SET_STAGE_EDIT, flag);
  },
  // 消息盒子
  messageBox({commit}) {
    commit(types.MESSAGE_BOX);
  },
  // 新增分期
  addStages ({commit}) {
    commit(types.SET_STAGE_EDIT, false);
    commit(types.ADD_STAGE);
  },
  // 分期保存
  setSave ({commit}, stageAddType) {
    if (state.stageProjectTart.length >= 0) {
      state.stageProjectTart.forEach(function (item, index) {
          delete item.MANAGEMENTOBJECTIVES
          if (index == 5) {
            if (item.LAUNCHMEETING) {
              item.LAUNCHMEETING = (Date.parse(new Date(item.LAUNCHMEETING.replace(/-/g, '/') + "/01")).toString()).substr(0, 10);
            } else {
              item.LAUNCHMEETING = null
            }
            if (item.VOTINGMEETING) {
              item.VOTINGMEETING = (Date.parse(new Date(item.VOTINGMEETING.replace(/-/g, '/') + "/01")).toString()).substr(0, 10);
            } else {
              item.VOTINGMEETING = null
            }
            if (item.FIRSTYEARQUOTA) {
              item.FIRSTYEARQUOTA = (Date.parse(new Date(item.FIRSTYEARQUOTA.replace(/-/g, '/') + "/01")).toString()).substr(0, 10);
            } else {
              item.FIRSTYEARQUOTA = null
            }
            if (item.SECONDYEARQUOTA) {
              item.SECONDYEARQUOTA = (Date.parse(new Date(item.SECONDYEARQUOTA.replace(/-/g, '/') + "/01")).toString()).substr(0, 10);
            } else {
              item.SECONDYEARQUOTA = null
            }
            if (item.THIRDYEARQUOTA) {
              item.THIRDYEARQUOTA = (Date.parse(new Date(item.THIRDYEARQUOTA.replace(/-/g, '/') + "/01")).toString()).substr(0, 10);
            } else {
              item.THIRDYEARQUOTA = null
            }
            if (item.OVERALLPOSTEVALUATION) {
              item.OVERALLPOSTEVALUATION = (Date.parse(new Date(item.OVERALLPOSTEVALUATION.replace(/-/g, '/') + "/01")).toString()).substr(0, 10)
            } else {
              item.OVERALLPOSTEVALUATION = null
            }
          }
        }
      )
    }
    if (state.stageVersion.length <= 0) {
      state.versionId = null;
    } else {
      state.versionId = state.stageCurrentVersion
    }
    if (state.stageIdentityInfo.vLandList) {
      if (state.stageIdentityInfo.vLandList.length < 1) {
        return false
      }
      state.stageIdentityInfo.vLandList.forEach(function (item) {
        let myarray = [];
        if (item.LANDPLANUSEID) {
          if (item.LANDPLANUSEID.length > 0) {
            item.LANDPLANUSEID.forEach(items => {
              for (var i = 0; i < state.landPlanUses.length; i++) {
                if (state.landPlanUses[i].ID === items) {
                  myarray.push(state.landPlanUses[i]);
                }
              }
            });
          }
          let _arr = myarray.map(items => {
            return items.DICNAME;
          })
          let _year = myarray.map(items => {
            return items.DICVALUE;
          })
          if (_arr.length > 0) {
            item.LANDPLANUSE = _arr.join(',');
          } else {
            item.LANDPLANUSE = _arr.toString();
          }
          if (_year.length > 0) {
            item.LANDUSERYEAR = _year.join(',');
          } else {
            item.LANDUSERYEAR = _year.toString();
          }
          if (item.LANDPLANUSEID.length > 0) {
            item.LANDPLANUSEID = item.LANDPLANUSEID.join(',');
          } else {
            item.LANDPLANUSEID = item.LANDPLANUSEID.toString();
          }
        } else {
          item.LANDPLANUSEID = ""
        }
      })
    }
    /*用途*/
    if (state.landPropertys.length >= 0) {
      state.landPropertys.forEach(function (item) {
        if (state.stageIdentityInfo.vLandList != undefined) {
          state.stageIdentityInfo.vLandList.forEach(function (itemL, index) {
            if (itemL.LANDPROPERTYID == item.ID) {
              itemL.LANDPROPERTY = item.ID;
            }
          })
        }
      })
    }
    let StageInfo = {

      companyName: sessionStorage.getItem("companyName"),
      stageIdentityInfo: state.stageIdentityInfo.vStageIdentityInfo,
      InverstBuildUnit: state.stageIdentityInfo.InverstBuildUnit,
      ProjectBuildUnit: state.stageIdentityInfo.ProjectBuildUnit,
      landInfo: state.stageIdentityInfo.vLandList,
      buildUnit: state.stageIdentityInfo.BtBuildUnitList,
      projectTartData: state.stageProjectTart,
      projectId: sessionStorage.getItem("projectId"),
      projectVersionId: sessionStorage.getItem("projectVersionId"),
      stageVersionId: state.versionId
    }
    //左侧树渲染立即渲染
    if( stageAddType === true ){
      return  fetchUtils.post('/stage/SaveOrEditStageInfo', {StageInfo: JSON.stringify(StageInfo)});
    }
    fetchUtils.post('/stage/SaveOrEditStageInfo', {StageInfo: JSON.stringify(StageInfo)})
      .then(res => {
        let data = res.rows
        data["message"] = res.message;
        /*成功返回的数据*/
        commit(types.BACK_STAGEINFO, changeNodeData(data))
        /*消息提示*/
        commit(types.MESSAGE_BOX);
      }).catch(error => {
      message.error(error);
    })
  },
  /*删除分期 */
  stageDel({commit}, nodeId){
    return fetchUtils.post('/stage/DeleteStage', {StageVersionId: state.stageCurrentVersion, stageId: nodeId})
  },
  StagevalueFormatEvent({commit}, val){
    commit(types.STAGE_VALUE_TARGET, val);
  }
}
const mutations = {
  [types.LOAD_TREE](state,loadTree){
   state.loadTree = loadTree
  },
  [types.GET_INVER_DATA](state){
    state.InverstMiddle = [];
    var newInverstBuildUnit = state.stageIdentityInfo.InverstBuildUnit.map(item=> {
      if (item.COMPANNYNAME != null) {
        item.COMPANNYNAMEMiddle = item.COMPANNYNAME
        return item;
      }
    })
    const filterDate = newInverstBuildUnit.filter(item=> {
      return item != undefined
    });

    if (filterDate.length <= 0) {
      state.InverstMiddle = [
        {"ID": "", "COMPANNYTYPE": "INVESTMENTCOMPANY", "COMPANNYNAMEMiddle": ""}
      ]
    } else {
      state.InverstMiddle = filterDate;
    }

  },
  [types.GET_PROJECT_DATA](state){
    state.ProjectMiddle = [];
    var newProjectBuildUnit = state.stageIdentityInfo.ProjectBuildUnit.map(item=> {
      if (item.COMPANNYNAME != null) {
        item.COMPANNYNAMEMiddle = item.COMPANNYNAME
        return item;
      }
    })
    const filterDate = newProjectBuildUnit.filter(item=> {
      return item != undefined
    });
    if (filterDate.length <= 0) {
      state.ProjectMiddle = [
        {"ID": "", "COMPANNYTYPE": "PROJECTMENTCOMPANY", "COMPANNYNAMEMiddle": ""}
      ]
    } else {
      state.ProjectMiddle = filterDate;
    }
  },
  [types.CANLE_DIALOG](state){
    state.InverstMiddle = [],
      state.stageIdentityInfo.InverstBuildUnit.forEach(item=> {
        if (item.COMPANNYNAME != null) {
          state.InverstMiddle.push(item)
        }
      })
  },
  [types.CANLE_PROJECT_DIALOG](state){
    state.ProjectMiddle = [],
      state.stageIdentityInfo.ProjectBuildUnit.forEach(item=> {
        if (item.COMPANNYNAME != null) {
          state.ProjectMiddle.push(item)
        }
      })
  },
  [types.SUBMIT_DIALOG](state){
    state.InverstMiddle.forEach(item=> {
      item.COMPANNYNAME = item.COMPANNYNAMEMiddle
      delete  item.COMPANNYNAMEMiddle;
    })
    state.stageIdentityInfo.InverstBuildUnit = state.InverstMiddle;
  },
  [types.SUBMIT_PROJECT_DIALOG](state){
    state.ProjectMiddle.forEach(item=> {
      item.COMPANNYNAME = item.COMPANNYNAMEMiddle
      delete  item.COMPANNYNAMEMiddle;
    })
    state.stageIdentityInfo.ProjectBuildUnit = state.ProjectMiddle;
  },
  [types.STAGE_CURRENT_VERSION](state, stageCurrentVersion){
    state.stageCurrentVersion = stageCurrentVersion
    const _res = state.stageVersion.filter(item => {
      return item.versionId === stageCurrentVersion;
    });
    const versionConfig = {
      "0": "编制中",
      "99": "审批通过",
      "1": "审批中",
      "-1": "驳回",
    };
    state.stageVersionStatus = versionConfig[_res[0]['versionStatus']];
    state.stageVersionStatusCode = _res[0]['versionStatus'];
    sessionStorage.setItem('globalEditState', _res[0].versionStatus);
    sessionStorage.setItem('globalEditVersionId', stageCurrentVersion);
    sessionStorage.setItem('stageVersionStatus', state.stageVersionStatus);
  },
  [types.BACK_STAGEINFO](state, data){
    state.backStageInfo = data
  },
  /*分期总图*/
  [types.SET_STAGE_IMAGE_STATUS](state, stageFlag){
    state.stageImageStatus = stageFlag
  },
  [types.SET_STAGE_EDITFLAG](state, falge){
    state.stageEdit = falge
  },
  // 分期版本
  [types.STAGE_VERSION](state, versionData){
    state.stageVersion = versionData
    sessionStorage.setItem('stageVersionList', JSON.stringify(versionData))
  },
  // 最高版本
  [types.HEIGHT_VERSION](state, heightVersion){
    state.heightVersion = heightVersion
  },
  // 同步开发方式状态
  [types.SET_MODE_ID](state, id){
    state.stageIdentityInfo.vStageIdentityInfo.developmentId = id
  },
  //身份信息
  [types.STAFGE_IDENTITY_INFO](state, stageIdentityInfo){
    state.stageIdentityInfo = stageIdentityInfo
  },
  //土地性质
  [types.LAND_PROPERTY](state, landPropertys){
    state.landPropertys = landPropertys
  },
  //规划用途
  [types.LAND_PLAN_USE](state, landPlanUses){
    state.landPlanUses = landPlanUses
  },
  // 项目运营目标
  [types.PLAN_GROUP_TASK](state, planGroupTask){
    state.planGroupTask = planGroupTask
  },
  // 面积指标
  [types.STAGE_AREA_QUOTA](state, stageAreaQuota){
    state.stageAreaQuota = stageAreaQuota
  },
  // 项目经营目标
  [types.MTITLE](state, mTitle){
    state.mTitle = mTitle
  },
  [types.STAGE_PROJECT_TART](state, stageProjectTart){
    state.stageProjectTart = stageProjectTart
  },
  // 新增公司名称
  [types.ADD_INFO](state, {COMPANNYTYPE, ID, COMPANNYNAME}){
    if (COMPANNYTYPE == "INVESTMENTCOMPANY") {
      state.InverstMiddle.push({
        COMPANNYTYPE: COMPANNYTYPE,
        ID: ID,
        COMPANNYNAMEMiddle: COMPANNYNAME
      })
    } else {
      state.ProjectMiddle.push({
        COMPANNYTYPE: COMPANNYTYPE,
        ID: ID,
        COMPANNYNAMEMiddle: COMPANNYNAME
      })
    }
  },
  // 删除公司名称
  [types.DEL_INFO](state, {COMPANNYTYPE, ID, DELNUM}){
    if (COMPANNYTYPE == "INVESTMENTCOMPANY") {
      state.InverstMiddle.pop()
    } else {
      //console.log(JSON.stringify(state.stageIdentityInfo.ProjectBuildUnit));
      state.ProjectMiddle.pop()
    }
  },
  [types.ADD_LAND](state){ // 新增地块
    let land = {
      GAINDATE: "", //土地获取日期
      LANDCERTIFICATE: "", // 土地证起始日期
      LANDPROPERTYID: "",
      LANDPROPERTY: "", //  土地性质
      LANDPLANUSEID: [], // 规划用途 / 土地使用年限
      LANDUSERYEAR: "",
    }
    if (state.stageIdentityInfo.vLandList) {
      state.stageIdentityInfo.vLandList.push(land)
    }
  },
  // 删除地块
  [types.DEL_LAND](state){
    state.stageIdentityInfo.vLandList.pop();
  },
  // 设置可编辑
  [types.SET_STAGE_EDIT](state, falge){
    state.stageEdit = falge
  },
  // 分期新增
  [types.ADD_STAGE](state){
    state.stageEdit = false,
      state.isShowVersionSelect = false,
      state.stageCurrentVersion = ""
    state.stageIdentityInfo = {
      vStageIdentityInfo: {
        stageName: '',
        stageCode: '',
        stageCreateDate: '',
        principal: '',
        principalId: '',
        developmentId: '',
        developmentModel: '',
        companyProportion: '',
        projectCompanyName: '',
        upParkSpace: "",
        underParkSpace: "",
        totle: ""
      },
      BtBuildUnitList: [],
      vLandList: [
        {
          ID: "",
          STAGEID: "",
          STAGEVERSIONID: "",
          GAINDATE: "",
          LANDCERTIFICATE: "",
          LANDPROPERTYID: "",
          LANDPROPERTY: "",
          LANDPLANUSEID: [],
          LANDPLANUSE: [],
          LANDUSERYEAR: [],
          ISDEL: 0,
          /*stageName: "",*/
          /* LANDUSERYEAR: ""*/
        }
      ],
      ProjectBuildUnit: [],
      InverstBuildUnit: []
    }, //身份信息
      state.landPropertys = [],// 土地性质
      state.landPlanUses = [], // 规划用途
      state.planGroupTask = [], // 项目运营目标
      state.stageAreaQuota = [], // 面积指标
      state.mTitle = [], // 项目经营目标
      state.stageProjectTart = [], // 项目经营数据
      state.stageVersionStatus = " "
  },
  // 分期保存
  [types.SET_SAVE](state){
    state.stageEdit = true
  },
  [types.CHANGE_LAND_PROPERTY_ID](state, val){
    state.stageIdentityInfo.vLandList = val;
  },
  [types.CHANGE_LAND_PROPERTYS](state, data){
    state.stageIdentityInfo.vLandList[data[index]].landProperty = data.val;
  },
  [types.MESSAGE_BOX](state){
    state.messageFalg = new Date();
  },
  [types.STAGE_VALUE_TARGET](state, val){
    //state.stageProjectTart.VOTINGMEETING = 0
    // console.log(JSON.stringify(state.stageProjectTart));
    if (state.stageProjectTart) {
      state.stageProjectTart.forEach(item=> {
        item.VOTINGMEETING = 0
      })
    }
  }
}
const getters = {
  InverstMiddle: state=>state.InverstMiddle,
  ProjectMiddle: state=>state.ProjectMiddle,
  stageImageStatus: state=>state.stageImageStatus,
  BackData: state=>state.backStageInfo,
  ProjectBuildUnit: state=>state.stageIdentityInfo.ProjectBuildUnit,
  InverstBuildUnit: state=>state.stageIdentityInfo.InverstBuildUnit,
  stageVersion: state=>state.stageVersion,  // 分期版本
  heightVersion: state=>state.heightVersion, // 最高版本
  stageIdentityInfo: state=>state.stageIdentityInfo, //身份信息
  landPropertys: state=>state.landPropertys, //土地性质
  landPlanUses: state=>state.landPlanUses, //规划用途
  planGroupTask: state=>state.planGroupTask, // 项目运营目标
  stageAreaQuota: state=>state.stageAreaQuota, // 面积指标
  mTitle: state=>state.mTitle, // 项目经营目标
  stageProjectTart: state=>state.stageProjectTart, // 项目经营数据
  stageEdit: state=>state.stageEdit, // 设置可编辑
  GetMessage: state=>state.messageFalg, // 弹窗
  isShowVersionSelect: state=>state.isShowVersionSelect, // 是否显示分期版本下拉
  stageCurrentVersion: state=>state.stageCurrentVersion, // 分期当前版本
  stageVersionStatus: state=>state.stageVersionStatus, //分期中文状态
  stageVersionStatusCode: state=>state.stageVersionStatusCode, //分期中文撞状态
  loadTree: state=>state.loadTree,
}
// 分期获取版本的执行函数
const changeStageVersionData = (data) => {
  return data
}
// 分期 身份信息 执行函数
const changeStageIdentityInfoData = (data) => {
  if (data.ProjectBuildUnit == null) {
    data.ProjectBuildUnit = [
      {COMPANNYTYPE: "PROJECTMENTCOMPANY", ID: "", COMPANNYNAME: null},
    ];
    state.ProjectMiddle = [
      {COMPANNYTYPE: "PROJECTMENTCOMPANY", ID: "", COMPANNYNAMEMiddle: null},
    ];
  } else {
    state.ProjectMiddle = [];
    var newProjectBuildUnit = data.ProjectBuildUnit.map((item, index)=> {
      if (item.COMPANNYNAME != null) {
        item.COMPANNYNAMEMiddle = item.COMPANNYNAME
        return item
      }
    })
    const filterDate = newProjectBuildUnit.filter(item=> {
      return item != undefined
    });
    if (filterDate.length <= 0) {
      state.ProjectMiddle = [
        {"ID": "", "COMPANNYNAME": "", "COMPANNYTYPE": "PROJECTMENTCOMPANY", "COMPANNYNAMEMiddle": "sssss"}
      ]
    } else {
      state.ProjectMiddle = filterDate;
    }
  }
  if (data.InverstBuildUnit == null) {
    data.InverstBuildUnit = [
      {COMPANNYTYPE: "INVESTMENTCOMPANY", ID: "", COMPANNYNAME: null},
    ];
    state.InverstMiddle = [
      {COMPANNYTYPE: "INVESTMENTCOMPANY", ID: "", COMPANNYNAMEMiddle: null},
    ];
  } else {
    state.InverstMiddle = [];
    var newInverstBuildUnit = data.InverstBuildUnit.map(item=> {
      if (item.COMPANNYNAME != null) {
        item.COMPANNYNAMEMiddle = item.COMPANNYNAME
        return item;
      }
    })
    const filterDate = newInverstBuildUnit.filter(item=> {
      return item != undefined
    });
    if (filterDate.length <= 0) {
      state.InverstMiddle = [
        {"ID": "", "COMPANNYNAME": "", "COMPANNYTYPE": "INVESTMENTCOMPANY", "COMPANNYNAMEMiddle": ""}
      ]
    } else {
      state.InverstMiddle = filterDate;
    }
  }
  if (data.vLandList == null) {
    data.vLandList = [{
      ID: "",
      STAGEID: "",
      STAGEVERSIONID: "",
      GAINDATE: "",
      LANDCERTIFICATE: "",
      LANDPROPERTYID: "",
      LANDPROPERTY: "",
      LANDPLANUSEID: [],
      LANDPLANUSE: [],
      LANDUSERYEAR: "",
      ISDEL: 0,
    }]
  } else {
    data.vLandList.forEach(function (item) {
      if (item.LANDPLANUSEID == null) {
        item.LANDPLANUSEID = [];
      }
      if (item.LANDPLANUSEID != null && typeof item.LANDPLANUSEID == "string") {
        item.LANDPLANUSEID = item.LANDPLANUSEID.split(',')
      }
      if (item.LANDPLANUSE == null) {
        item.LANDPLANUSE = [];
      }
      if (item.LANDPLANUSE != null && typeof item.LANDPLANUSE == "string") {
        item.LANDPLANUSE = item.LANDPLANUSE.split(',')
      }
    })
  }
  if (data.BtBuildUnitList == null) {
    data.BtBuildUnitList = state.stageIdentityInfo.BtBuildUnitList;
  }
  //车位总数
  /*  data.vStageIdentityInfo.totle = data.vStageIdentityInfo.upParkSpace + data.vStageIdentityInfo.underParkSpace;*/
  if (data.vStageIdentityInfo == null) {
    data.vStageIdentityInfo = {
      stageName: '',
      stageCode: '',
      stageCreateDate: '',
      principal: '',
      principalId: '',
      developmentId: '',
      developmentModel: '',
      companyProportion: '',
      projectCompanyName: '',
      upParkSpace: "",
      underParkSpace: "",
      totle: ""
    }
  } else {
    data.vStageIdentityInfo.landGrant =thousandTh(Math.round(data.vStageIdentityInfo.landGrant))
  }
  return data
}
// 土地性质 执行函数
const changeLandPropertysData = (data) => {
  return data
}
// 规划用途 执行函数 COMMERCIALLAND
const changeLandPlanUsesData = (data) => {
  return data
}
// 项目运营目标 执行函数
const changePlanGroupTaskData = (data) => {
  // console.info(JSON.stringify(data,null,2))
  return data
}
// 面积指标
const changeStageAreaQuotaData = (data) => {
  const tableData = data.gridData;
  const tableTitle = data.titleInfo;
  let titleArr = [];
  tableTitle.forEach(item => {
    if (item.children == null) {
      titleArr.push(item.field);
    } else {
      item.children.forEach(list => {
        if (list.children == null) {
          titleArr.push(list.field);
        } else {
          list.children.forEach(title => {
            titleArr.push(title.field);
          })
        }
      })
    }
  });
  const _newData = [];
  tableData.forEach(list => {
    let obj = {};
    titleArr.forEach((item, key) => {
      if (key === 0) {
        obj[item] = list["productName"];
      } else {
        obj[item] = list["val"][key - 1];
      }
    })
    _newData.push(obj);
  })
  //处理areaqutodata数据格式
  let arrObj = {
    titleInfo: tableTitle,
    gridData: _newData
  }
  return arrObj;
}
// 项目经营目标
const changeMTitleData = (data) => {
  return data
}
// 项目经营数据
const changeStageProjectTartData = (data) => {
  if (data.length <= 0) {
    return data = [
      {
        "key": "TOTALVALUE",
        "MANAGEMENTOBJECTIVES": "销售总货值（亿元）",
        "VOTINGMEETING": "0",
        "LAUNCHMEETING": "0",
        "FIRSTYEARQUOTA": "0",
        "SECONDYEARQUOTA": "0",
        "THIRDYEARQUOTA": "0",
        "OVERALLPOSTEVALUATION": "0"
      },
      {
        "key": "MARGINRATE",
        "MANAGEMENTOBJECTIVES": "毛利率（%）",
        "VOTINGMEETING": "0",
        "LAUNCHMEETING": "0",
        "FIRSTYEARQUOTA": "0",
        "SECONDYEARQUOTA": "0",
        "THIRDYEARQUOTA": "0",
        "OVERALLPOSTEVALUATION": "0"
      },
      {
        "key": "NETMARGINRATE",
        "MANAGEMENTOBJECTIVES": "净利率（%）",
        "VOTINGMEETING": "0",
        "LAUNCHMEETING": "0",
        "FIRSTYEARQUOTA": "0",
        "SECONDYEARQUOTA": "0",
        "THIRDYEARQUOTA": "0",
        "OVERALLPOSTEVALUATION": "0"
      },
      {
        "key": "NETPROFIT",
        "MANAGEMENTOBJECTIVES": "净利润（万元）",
        "VOTINGMEETING": "0",
        "LAUNCHMEETING": "0",
        "FIRSTYEARQUOTA": "0",
        "SECONDYEARQUOTA": "0",
        "THIRDYEARQUOTA": "0",
        "OVERALLPOSTEVALUATION": "0"
      },
      {
        "key": "HKNETPROFIT",
        "MANAGEMENTOBJECTIVES": "归属鸿坤利润（万元）",
        "VOTINGMEETING": "0",
        "LAUNCHMEETING": "0",
        "FIRSTYEARQUOTA": "0",
        "SECONDYEARQUOTA": "0",
        "THIRDYEARQUOTA": "0",
        "OVERALLPOSTEVALUATION": "0"
      },
      {
        "key": "TIMECYCLETIME",
        "MANAGEMENTOBJECTIVES": "经营性现金流回正时间",
        "VOTINGMEETING": "",
        "LAUNCHMEETING": "",
        "FIRSTYEARQUOTA": "",
        "SECONDYEARQUOTA": "",
        "THIRDYEARQUOTA": "",
        "OVERALLPOSTEVALUATION": ""
      },
      {
        "key": "TIMECYCLE",
        "MANAGEMENTOBJECTIVES": "经营性现金流回正周期（月）",
        "VOTINGMEETING": "0",
        "LAUNCHMEETING": "0",
        "FIRSTYEARQUOTA": "0",
        "SECONDYEARQUOTA": "0",
        "THIRDYEARQUOTA": "0",
        "OVERALLPOSTEVALUATION": "0"
      },
      {
        "key": "TARGETCOST",
        "MANAGEMENTOBJECTIVES": "目标成本（亿元）",
        "VOTINGMEETING": "0",
        "LAUNCHMEETING": "0",
        "FIRSTYEARQUOTA": "0",
        "SECONDYEARQUOTA": "0",
        "THIRDYEARQUOTA": "0",
        "OVERALLPOSTEVALUATION": "0"
      },
      {
        "key": "OPREATEIRR",
        "MANAGEMENTOBJECTIVES": "经营IRR（%）",
        "VOTINGMEETING": "0",
        "LAUNCHMEETING": "0",
        "FIRSTYEARQUOTA": "0",
        "SECONDYEARQUOTA": "0",
        "THIRDYEARQUOTA": "0",
        "OVERALLPOSTEVALUATION": "0"
      }
    ]
  }
  return data.map((item, index) => {
    return sendTarget(item, index);
  })
}
function sendTarget(data, index) {

  const toFixedType = [0, 1, 2, 7, 8]; //取一位小数
  const parseIntType = [6]; //取整数
  const thousandType = [3, 4]; //取整数
  const _that = this;
  if (toFixedType.indexOf(index) > -1) {
    return fonInData("toFixed", data);
  } else if (parseIntType.indexOf(index) > -1) {
    return fonInData("parseInt", data);
  } else if (thousandType.indexOf(index) > -1) {
    return fonInData('thousandType', data);
  } else {
    return data;
  }
  function fonInData(type, data) {
    const config = {
      "toFixed": function (data) {
        return Number(data) && Number(data).toFixed(1) || 0 //亿元保留1位小数

      },
      "parseInt": function (data) {
        return Math.round(data) && parseInt(Math.round(data)) || 0//保留整数
      },
      thousandType: function (data) {
        data = Math.round(data) && parseInt(Math.round(data)) || 0//保留整数
        if (!data) return 0;
        return thousandTh(data);
      }
    }
    for (var key in data) {
      if (key !== "MANAGEMENTOBJECTIVES" && key !== "key") {
        data[key] = config[type](data[key]);
      }
    }
    return data;
  }
}
//千分符转换
function thousandTh(data) {
  if (data == null) return null;
  return String(data).replace(/(\d{1,3})(?=(\d{3})+$)/g, function ($1) {
    return $1 = $1 + ','
  });
}
const changeNodeData = (data) => {
  sessionStorage.setItem('currentShowNode_Id', data.stageVersionId)
  return data
}
export default {
  state,
  actions,
  getters,
  mutations
}
