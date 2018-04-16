import {fetchUtils} from '../../utils';
const types = {
  SET_STAGE_DATA: 'SET_STAGE_DATA', // 面包屑 阶段数据
  VERSION_LIST_BY_BUSINESSLD: 'VERSION_LIST_BY_BUSINESSLD', // 获取面积版本列表
  CURRENT_VERSION: 'CURRENT_VERSION', // 当前版本
  SET_PROPOSAL_DATA: 'SET_PROPOSAL_DATA', // 规划方案数据
  SAVE_AREA_PLAN_INFO_DATA: 'SAVE_AREA_PLAN_INFO_DATA', // 保存规划方案数据
  SET_BUILDING_DATA:'SET_BUILDING_DATA', // 产品构成按楼栋/业态数据
  SELECT_DATA: 'SELECT_DATA', // 业态 楼栋维护 各个下拉框 数据
  AREA_EDIT_BUILD_SELECT_LIST_DATA:'AREA_EDIT_BUILD_SELECT_LIST_DATA',// 楼栋业态面积维护 批量选择楼栋数据
  AREA_EDIT_BUILD_LIST_DATA:'AREA_EDIT_BUILD_LIST_DATA', // 单栋 指标数据
  AREA_EDIT_PRODUT_TYPE_LIST_DATA:'AREA_EDIT_PRODUT_TYPE_LIST_DATA', // 单栋 业态指标
  SEARCH_LIST_DATA: 'SEARCH_LIST_DATA',
  GET_AREA_EDIT_DATA: 'GET_AREA_EDIT_DATA',
  CREATE_VERSION: 'CREATE_VERSION',
  TYPE: 'TYPE',
  CREATE_FORMAT: 'CREATE_FORMAT', // 创建业态
  DELETE_VERSION: 'DELETE_VERSION', // 删除当前版本
  DELETE_CREATE_FORMAT: 'DELETE_CREATE_FORMAT', // 删除未提交的业态数据
  SAVE_PRODUCT_TYPE: 'SAVE_PRODUCT_TYPE', // 提交创建的业态数据
  AREA_LIST_INFO: 'AREA_LIST_INFO', // 拿地板 列表数据
  SAVE_AREA_EDIT_DATA: 'SAVE_AREA_EDIT_DATA', // 保存拿地板业态修改的数据
  SAVE_EDIT_BUILD: 'SAVE_EDIT_BUILD', // 保存非拿地板 业态数据
  AREA_DATA_INFO: 'AREA_DATA_INFO',
  SET_VERSION_TEXT: 'SET_VERSION_TEXT',
  AREA_HIGHT_CURRENT_VERSION: 'AREA_HIGHT_CURRENT_VERSION',
};

const state = {
  area_HightCurrentVersion: '',
  saveEditBuild: [],
  type: [],
  stageData: [], // 面包屑 阶段数据
  versionListByBusinessldData: [], // 获取面积版本列表
  currentVersion: '', // 当前版本
  currentVersionText: '未编制',
  proposalData: [], // 规划方案数据
  planInfoData: [], // 保存规划方案数据
  buildingData: [], // 产品构成按楼栋数据
  selectData: {
    selectOptions:[
      {selectOption:[]},
      {selectOption:[]},
      {selectOption:[]}
      ],
    serchList:[
      {typelist:[]},
      {typelist:[]},
      {typelist:[]},],
    GroupAndBatch:[
       {CHILDREN:[{ID:'',BATCHNAME:''}]}
      ]
  },
  // 业态 楼栋维护 各个下拉框 数据
  editBuildSelectListData: [], // 楼栋业态面积维护 批量选择楼栋数据
  editBuildListData: [], // 单栋 指标数据
  editProdutTypeListData: [], // 单栋 业态指标
  searchListData: [], //业态楼栋维护数据
  areaEditData: [], // 拿地板 业态数据
  createVersion: [],
  createFormat: [] , // 创建业态
  deleteVersion: [], // 删除版本
  saveProductType: [],// 保存创建的业态
  areaListInfo: [], // 拿地板列表数据
  saveAreaEditData: [] , // 保存拿地板业态修改的数据
  areaDateInfo: []
};
const actions = {
  setVersionText ({commit}) {
    commit(types.SET_VERSION_TEXT);
  },
  saveEditBuild({commit},{buildIds,singleProductType,levelId,productTypeData}) {
    fetchUtils.post('/AreaInfo/ISaveEditBuild',
      {paramsData:JSON.stringify({buildIds:buildIds,singleProductType:singleProductType,levelId:levelId,productTypeData:productTypeData})}).then(res => res.rows).then(data => {
      commit(types.SAVE_EDIT_BUILD, changeSaveEditBuildData(data));
    })
  },
  saveAreaEditData ({commit},{paramsData,vm}) {// 保存拿地板业态修改的数据
    fetchUtils.post('/AreaInfo/ISaveAreaEditData',
      {paramsData:JSON.stringify(paramsData)}).then(res => res.rows).then(data => {
      vm.$message({
        message: '数据修改成功!',
        type: 'success'
      });
      commit(types.SAVE_AREA_EDIT_DATA, changeSaveEditData(data));
    }).catch(function (e) {
      vm.$message({
        message: '数据修改失败!',
        type: 'error'
      });
    })
  },
  getAreaListInfo ({commit},{step,projectLevel,versionId,productTypeId,descType}) {
    fetchUtils.post('/AreaInfo/IGetAreaListInfo',
    {step:step,projectLevel: projectLevel,versionId:versionId,descType:descType
    }).then(res => res.rows).then(data => {
      commit(types.AREA_LIST_INFO, changeAreaListData(data));
      commit(types.AREA_DATA_INFO,data.areadataInfo);
    })
  },
  // 创建一个版本
  createVersions ({commit},{step,dataKey,projectLevel,vm}) {
    fetchUtils.post('/AreaInfo/CreateAreaVersion',
      {paramsData:JSON.stringify({step: step,psVersionId: dataKey,projectLevel:projectLevel})}).then(res => {
      vm.$message({
        message: '版本创建成功!',
        type: 'success'
      });
       return res
      })
      .then(data => {
        commit(types.CREATE_VERSION, changeCreateVersionData(data));
      }).catch(function (e) {
      vm.$message({
        message: e,
        type: 'error'
      });
    })
  },
  //  删除当前版本
  deleteVersion ({commit},{paramsdata,step,versionId,projectLevel,vm}) {
    fetchUtils.post('/AreaInfo/DeleteAreaVersion',
    {paramsdata:JSON.stringify({PsVersionId:paramsdata,Step:step,VersionId:versionId,ProjectLevel:projectLevel})}).then(res => res)
    .then(data => {
      vm.$message({
        message: '版本删除成功!',
        type: 'success'
      });
      commit(types.DELETE_VERSION, changeDeleteVersionData(data));
    }).catch(function (e) {
      vm.$message({
        message: '版本删除失败!',
        type: 'error'
      });
    })
  },
  // 面包屑 阶段数据 ae5bbeaa-7c87-e02d-d641-af8876219e92 Stage Area
  getStageData ({commit},{stepType,stageID}) {
    const stageData = fetchUtils.post('/Common/IGetStep',
      {stepType: stepType,stageID: stageID});
    stageData
      .then(res => res)
      .then(data => {
        commit(types.SET_STAGE_DATA, changeStageData(data));
      })
  },
  // 获取面积版本列表 ae5bbeaa-7c87-e02d-d641-af8876219e92 Rules Stage Area
  getVersionListByBusinessldData ({commit},{dataKey,step,projectLevel,dataType}) {
    const VersionListByBusinessldData = fetchUtils.post('/Common/IGetVersionListByDataKey',
      {dataKey: dataKey,
        step:step,
        projectLevel:projectLevel,
        dataType: dataType});
    VersionListByBusinessldData
      .then(res => {
        return res.rows
      })
      .then(data => {
        commit(types.VERSION_LIST_BY_BUSINESSLD, changeVersionListByBusinessldData(data));
      })
  },
  // 当前版本
  setVersion ({commit}, version) {
    commit(types.CURRENT_VERSION, version);
    if(state.versionListByBusinessldData && state.versionListByBusinessldData.length>0) {
      if(state.versionListByBusinessldData[0].versionStatus == '审批通过'){
        commit(types.AREA_HIGHT_CURRENT_VERSION, state.versionListByBusinessldData[0].versionId);
      }
      state.versionListByBusinessldData.forEach(function(item) {
        if(version === item.versionId) {
          state.currentVersionText = item.versionStatus
        }
      })
    }else {
      state.currentVersionText = '未编制'
      commit(types.AREA_HIGHT_CURRENT_VERSION, '');
    }
  },
  // 规划方案指标数据 Rules 643712331B60A710E0506A27152A53B0 Area
  getProposal ({commit},{step,versionId,dataType}) {
    fetchUtils.post('/AreaInfo/IGetAreaPlanInfo',
      {step:step,versionId:versionId,dataType:dataType})
      .then(data => {
        commit(types.SET_PROPOSAL_DATA, changeProposalData(data.rows));
      })
  },
  // 产品构成--按楼栋 Rules Stage 643712331B60A710E0506A27152A53B0 Building/ProductType (按楼栋/按业态)
  getBuilding ({commit},{step,projectLevel,versionId,descType}) {
    const buildingData = fetchUtils.post('/AreaInfo/IGetAreaListInfo',
      {step:step,projectLevel:projectLevel,versionId:versionId,descType:descType});
    buildingData
      .then(res => res.rows)
      .then(data => {
        commit(types.SET_BUILDING_DATA, changeBuildingData(data));
      })
  },
  getType ({commit},{step,projectLevel,versionId,descType}) {
     fetchUtils.post('/AreaInfo/IGetAreaListInfo',
      {step:step,projectLevel:projectLevel,versionId:versionId,descType:descType}).then(res => res.rows)
      .then(data => {
        commit(types.TYPE, changeTypeData(data));
      })
  },
  // 业态 楼栋维护 各个下拉框 数据 Stage ae5bbeaa-7c87-e02d-d641-af8876219e92 Rules
  getSelectData ({commit},{projectLevel,ProjectStageId,step,vm}) {
    const selectData = fetchUtils.post('/AreaInfo/IGetSerchInfo',
      {projectLevel:projectLevel,ProjectStageId:ProjectStageId,step:step}
    );
    selectData
      .then(res => res.rows)
      .then(data => {

        commit(types.SELECT_DATA, changeSelectData(data));
      }).catch(function (e) {

    })
  },
  // 保存规划方案数据
  savePlanData ({commit},{step,versionId,detaileData,vm}) {
    const planInfoData = fetchUtils.post('/AreaInfo/ISaveAreaPlanInfo',
      {step:step,versionId:versionId,detaileData:detaileData}
    );
    planInfoData
      .then(res => res.rows)
      .then(data => {
        vm.$message({
          message: '数据保存成功!',
          type: 'success'
        });
        commit(types.SAVE_AREA_PLAN_INFO_DATA, changePlanInfoData(data));
      })
  },
  // 楼栋业态面积维护 批量选择楼栋数据 643712331B60A710E0506A27152A53B0 '' f356499a-c315-4dc0-83a4-2ef8200d9cc3 Building
  getAreaEditBuildSelectList ({commit},{versionId,productTypeId,buildId,descType}) {
    const editBuildSelectListData = fetchUtils.get('/AreaInfo/IGetAreaEditBuildSelectList',{
      versionId:versionId,productTypeId:productTypeId,buildId:buildId,descType:descType
  });
    editBuildSelectListData
      .then(res => res.rows)
      .then(data => {
        commit(types.AREA_EDIT_BUILD_SELECT_LIST_DATA, changeEditBuildSelectListData(data));
      })
  },
  // 单栋 指标数据 643712331B60A710E0506A27152A53B0 '' f356499a-c315-4dc0-83a4-2ef8200d9cc3 Building 1
  getAreaEditBuildList ({commit},{versionId,productTypeId,buildId,descType,levelId}) {
    const editBuildListData = fetchUtils.post('/AreaInfo/IGetAreaEditBuildList',{
      versionId:versionId,productTypeId:productTypeId,buildId:buildId,descType:descType,levelId:levelId
    });
    editBuildListData
      .then(res => res.rows)
      .then(data => {
        commit(types.AREA_EDIT_BUILD_LIST_DATA, changeEditBuildListData(data));
      })
  },
  // 单栋 业态指标 643712331B60A710E0506A27152A53B0 '' f356499a-c315-4dc0-83a4-2ef8200d9cc3 Building 0 0 0
  getAreaEditProdutTypeList ({commit},{versionId,productTypeId,buildId,descType,isDecoration,isHaveProperty,storeyHeight}) {
    const editProdutTypeListData = fetchUtils.post('/AreaInfo/IGetAreaEditProdutTypeList',{
      versionId:versionId,productTypeId:productTypeId,buildId:buildId,descType:descType,isDecoration:isDecoration,isHaveProperty:isHaveProperty,
      storeyHeight:storeyHeight
      });
    editProdutTypeListData
      .then(res => res.rows)
      .then(data => {
        commit(types.AREA_EDIT_PRODUT_TYPE_LIST_DATA, changeEditProdutTypeListData(data));
      })
  },
  // 业态 楼栋维护数据
  getSearchListData ({commit},{step,projectLevel,versionId}) {
    commit(types.SEARCH_LIST_DATA, []);
    const searchListData = fetchUtils.post('/areaInfo/IGetSearchData',{
      step:step,projectLevel:projectLevel,versionId:versionId
      });
    searchListData
      .then(res => res.rows)
      .then(data => {
        commit(types.SEARCH_LIST_DATA, changeSearchListData(data));
      })
  },
  getAreaEditData ({commit},{step,projectLevel,versionId,productTypeId}) {
     fetchUtils.post('/areaInfo/IGetAreaEditData',{
      step:step,projectLevel: projectLevel,versionId:versionId,productTypeId:productTypeId
    }).then(res => res.rows)
      .then(data => {
        commit(types.GET_AREA_EDIT_DATA, changeAreaEditData(data));
      })
  },
  // 创建业态
  getCreateFormat ({commit},{buildingNo,conditionData,productTypeList}) {
    commit(types.SEARCH_LIST_DATA, []);
    fetchUtils.post('/areainfo/ICreateProductType',
    {paramsData:JSON.stringify({buildingNo: buildingNo,conditionData:conditionData,productTypeList:productTypeList})}).then(res => res)
      .then(res =>res.rows).then(data =>{
        // commit(types.CREATE_FORMAT, changeCreateFormatData(data));
        commit(types.SEARCH_LIST_DATA, changeCreateFormatData(data));
      })
  },
  // 删除业态数据操作
  deleteCreateFormat ({commit},arr) {
    commit(types.SEARCH_LIST_DATA,arr)
  },
  // 提交创建的业态数据
  saveProductType ({commit},{step,projectLevel,versionId,dataKey,formData,vm}) {
    fetchUtils.post('/areainfo/ISaveProductType',
    {paramsData:JSON.stringify( {step:step,projectLevel:projectLevel,versionId:versionId,dataKey:dataKey,formData:formData})}).then(res => res)
      .then(res =>res.rows).then(data =>{
      vm.$message({
        message: '业态创建成功!',
        type: 'success'
      });
        commit(types.SAVE_PRODUCT_TYPE, changeProductTypeData(data));
      }).catch(function (e) {
      vm.$message({
        message: '业态创建失败!',
        type: 'error'
      });
    })
  },
}

const mutations = {

  [types.AREA_HIGHT_CURRENT_VERSION](state,area_HightCurrentVersion){
  state.area_HightCurrentVersion = area_HightCurrentVersion;
  },
  [types.SET_VERSION_TEXT](state){
  state.currentVersionText = '未编制';
  },
  [types.AREA_DATA_INFO](state, areaDataInfo){  // 非拿地板业态保存数据
  state.areaDataInfo = areaDataInfo;
  },
 [types.SAVE_EDIT_BUILD](state, saveEditBuild){  // 非拿地板业态保存数据
  state.saveEditBuild = saveEditBuild;
  },
  [types.SAVE_AREA_EDIT_DATA](state, saveAreaEditData){  // 拿地板业态保存数据
  state.saveAreaEditData = saveAreaEditData;
  },
  [types.AREA_LIST_INFO](state, areaListInfo){  // 拿地板列表数据
    state.areaListInfo = areaListInfo;
  },
  [types.SAVE_PRODUCT_TYPE](state, saveProductType){  // 提交创建的业态
    state.saveProductType = saveProductType;
  },
  [types.SET_STAGE_DATA](state, stageData){  // 面包屑 阶段数据
    state.stageData = stageData;
  },
  [types.VERSION_LIST_BY_BUSINESSLD](state, versionListByBusinessldData){  //面积版本数据
    state.versionListByBusinessldData = versionListByBusinessldData;
    if (state.versionListByBusinessldData && state.versionListByBusinessldData.length > 0) {
      state.currentVersion = state.versionListByBusinessldData[0].versionId
      state.currentVersionText = state.versionListByBusinessldData[0].versionStatus
    }else {
      state.currentVersion = ''
      state.currentVersionText = '未编制'
    }
  },
  [types.CURRENT_VERSION](state, currentVersion){ // 当前版本
    state.currentVersion = currentVersion
  },
  [types.SET_PROPOSAL_DATA](state, proposalData){ // 规划方案数据
    state.proposalData = proposalData;
  },
  [types.SET_BUILDING_DATA](state, buildingData){ // 产品构成按楼栋数据
    state.buildingData = buildingData;
  },
  [types.TYPE](state, typedate){ // 产品构成按业态
    state.type = typedate;
  },
  [types.SELECT_DATA](state, selectData){ // 业态 楼栋维护 各个下拉框 数据
    state.selectData = selectData;
  },
  [types.SAVE_AREA_PLAN_INFO_DATA](state, planInfoData){ //  保存规划方案数据
    state.planInfoData = planInfoData;
  },
  [types.AREA_EDIT_BUILD_SELECT_LIST_DATA](state, editBuildSelectListData){  // 楼栋业态面积维护 批量选择楼栋数据
    state.editBuildSelectListData = editBuildSelectListData;
  },
  [types.AREA_EDIT_BUILD_LIST_DATA](state, editBuildListData){ // 单栋 指标数据
    state.editBuildListData = editBuildListData;
  },
  [types.AREA_EDIT_PRODUT_TYPE_LIST_DATA](state, editProdutTypeListData){  // 单栋 业态指标
    state.editProdutTypeListData = editProdutTypeListData;
  },
  [types.SEARCH_LIST_DATA](state, searchListData){
    state.searchListData = searchListData;
  },
  [types.GET_AREA_EDIT_DATA](state, areaEditData){
    state.areaEditData = areaEditData;
  },
  [types.CREATE_VERSION](state, createVersion){
    state.createVersion = createVersion;
  },
  [types.DELETE_VERSION](state, deleteVersion){
    state.deleteVersion = deleteVersion;
  },
  [types.CREATE_FORMAT](state, createFormat){
    state.createFormat = createFormat;
  },
  [types.DELETE_CREATE_FORMAT](state, arr){
    state.createFormat = arr;
  },

}

const getters = {
  areaDataInfo: state => state.areaDataInfo,
  stageData: state => state.stageData,// 面包屑 阶段数据
  versionListByBusinessldData: state=>state.versionListByBusinessldData, // 面积版本数据
  currentVersion: state=>state.currentVersion, // 当前版本
  currentVersionText: state=>state.currentVersionText,
  proposalInfoData: state => state.proposalData, // 规划方案数据
  buildingInfoData: state => state.buildingData, // 产品构成按楼栋数据
  type: state=>state.type,
  selectData: state => state.selectData, // 业态 楼栋维护 各个下拉框 数据
  planInfoData: state=>state.planInfoData,//  保存规划方案数据
  editBuildSelectListData: state => state.editBuildSelectListData, // 楼栋业态面积维护 批量选择楼栋数据
  editBuildListData: state => state.editBuildListData, // 单栋 指标数据
  editProdutTypeListData: state => state.editProdutTypeListData,  // 单栋 业态指标
  searchList_Data: state => state.searchListData,
  areaEditData: state => state.areaEditData,
  createVersion:state => state.createVersion,
  deleteVersion: state=>state.deleteVersion,
  createFormat: state=>state.createFormat,
  areaListInfo: state=>state.areaListInfo,
  saveAreaEditData: state=>state.saveAreaEditData,
  area_HightCurrentVersion: state=>state.area_HightCurrentVersion,
};

const changeStageData = (data) => {
  // data[0].className = 'apply ' + data[0].className

  data.forEach(function (item) {
    item.active = ' '
    item.className ='active ' + item.className
  })
  data[0].active = 'apply'
  // console.info('面包屑 阶段数据')
  // console.info(JSON.stringify(data,null,2))
  return data
}
const changeVersionListByBusinessldData = (data) => {
  // console.info('面积版本数据')
  // console.info(JSON.stringify(data,null,2))
  return data
}

const changeProposalData = (data) => {
  // console.info('规划方案数据')
  // console.info(JSON.stringify(data,null,2))
  return data
}
const changeBuildingData = (data) => {

  const titleInfo = data.titleInfo;
  const tableData = data.areadataInfo;
  if( tableData.length === 0 ) return data;
  //取出表头数据
  let tableTitleField = [];
  titleInfo.forEach( item => {
    if( item.field !== ''){
      tableTitleField.push(item.field);
    }else{
      const _field = item.children.map( list => {
        return list['field'];
      });
      tableTitleField = tableTitleField.concat(_field);
    }
  });
  //取出对应的表体里面数据
  let areadataInfo = tableData.map( () => {
    return {};
  });
  tableTitleField.forEach( id => {
    tableData.forEach( (dataList, index) => {
      for( let key in dataList ){
        if( id === key){
          areadataInfo[index][id] = dataList[id];
        }
      }
    });
  });
  let dataa = {
    titleInfo:titleInfo,
    areadataInfo:areadataInfo
  }
  // console.info('产品构成-按楼栋')
  // console.info(JSON.stringify(data,null,2))
  return data;
}
const changeTypeData = (data) => {
  // console.info('产品构成/业态')
  // console.info(JSON.stringify(data,null,2))
  const titleInfo = data.titleInfo;
  const tableData = data.areadataInfo;
  if( tableData.length === 0 ) return data;
  //取出表头数据
  let tableTitleField = [];
  titleInfo.forEach( item => {
    if( item.field !== ''){
      tableTitleField.push(item.field);
    }else{
      const _field = item.children.map( list => {
        return list['field'];
      });
      tableTitleField = tableTitleField.concat(_field);
    }
  });
  //取出对应的表体里面数据
  let areadataInfo = tableData.map( () => {
    return {};
  });
  tableTitleField.forEach( id => {
    tableData.forEach( (dataList, index) => {
      for( let key in dataList ){
        if( id === key){
          areadataInfo[index][id] = dataList[id];
        }
      }
    });
  });
  let dataa = {
    titleInfo:titleInfo,
    areadataInfo:areadataInfo
  }
  return dataa;
}

const changeSelectData = (data) => {
  // console.info(' 业态 楼栋维护 各个下拉框 数据')
  // console.info(JSON.stringify(data,null,2))
  return data
}
const changePlanInfoData = (data) => {
  // console.info(' 保存规划方案数据 数据')
  // console.info(JSON.stringify(data,null,2))
  if(!data.GroupAndBatch){
    data.GroupAndBatch = [
      {CHILDREN:[{ID:'',BATCHNAME:''}]}
    ]
  }
  return data
}

const changeEditBuildSelectListData = (data) => {
  // console.info('业态楼栋维护中 选择楼栋的选择数据')
  // console.info(JSON.stringify(data,null,2))
  return data
}
const changeEditBuildListData = (data) => {
  // console.info('业态楼栋维护中 单栋指标数据')
  // console.info(JSON.stringify(data,null,2))
  return data
}
const changeEditProdutTypeListData = (data) => {
  // console.info('业态楼栋维护中 单栋业态指标数据')
  // console.info(JSON.stringify(data,null,2))
  return data
}
const changeSearchListData = (data) => {
  let arr = state.selectData.GroupAndBatch
  data.forEach(function (item,index) {
    arr.forEach(function (sub,ind) {
      if(item.groupId == sub.ID){
        item.groupName = sub.GROUPNAME
        item.SortNumber = ind+1
        sub.CHILDREN.forEach(function (subItem){
          if(item.batchId == subItem.ID){
            item.batchName = subItem.BATCHNAME
          }
        })
      }
    })
  })
  // console.info('业态楼栋指标数据')
  // console.info(JSON.stringify(data,null,2))
  return data
}
const changeAreaEditData = (data) => {
  // console.info('拿地板业态数据编辑')
  // console.info(JSON.stringify(data,null,2))
  return data
}
const changeCreateVersionData = (data) => {
  // console.info('版本创建成功')
  // console.info(data)
  state.currentVersion =data.rows.VersionCode
  return data
}
const changeDeleteVersionData = (data) => {
  // console.info('版本删除成功')
  // console.info(JSON.stringify(data,null,2))
  state.currentVersion =data.rows.VersionCode
  return data
}
// 创建业态
const changeCreateFormatData = (data) => {
  let arr = state.selectData.GroupAndBatch
  data.forEach(function (item,index) {
    arr.forEach(function (sub,ind) {
      if(item.groupId == sub.ID){
        item.groupName = sub.GROUPNAME
        item.SortNumber = ind+1
        sub.CHILDREN.forEach(function (subItem){
          if(item.batchId == subItem.ID){
            item.batchName = subItem.BATCHNAME
          }
        })
      }
    })
  })
  // console.info("业态创建")
  // console.info(JSON.stringify(data,null,2))
  return data
}
//
const changeProductTypeData = (data) => {
  // console.info('业态创建成功')
  // console.info(JSON.stringify(data,null,2))
  return data
}
// 拿地板 业态列表数据
const changeAreaListData = (data) => {
  // console.info('拿地板列表数据')
  // console.info(JSON.stringify(data,null,2))
  return data
}
// 拿地板 业态列表数据
const changeSaveEditData = (data) => {
  // console.info('拿地板业态数据保存')
  // console.info(JSON.stringify(data,null,2))
  return data
}
const changeSaveEditBuildData = (data) => {
  // console.info('非拿地板业态数据保存')
  // console.info(JSON.stringify(data,null,2))
  return data
}

export default {
  state,
  actions,
  getters,
  mutations
}
