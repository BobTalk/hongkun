/**
 * Created by cuimengkai on 2018/3/4.
 * /Price/IDeletePrice?priceVersionId=价格版本ID
 */
import {fetchUtils, message} from '../../utils';
const types = {
  PRICE_VERSION_LIST_BY_BUSINESSLD: 'PRICE_VERSION_LIST_BY_BUSINESSLD', // 获取价格版本列表
  PRICE_CREATE_VERSION: 'PRICE_CREATE_VERSION', // 创建价格版本
  PRICE_CURRENT_VERSION_STATE: 'PRICE_CURRENT_VERSION_STATE', // 当前版本
  PRICE_SET_STAGE_DATA: 'PRICE_SET_STAGE_DATA', // 面包屑 阶段数据
  PRICE_LIST_DATA: 'PRICE_LIST_DATA', // 价格管理列表数据
  PRICE_SAVE: 'PRICE_SAVE', // 保存操作
  PRICE_VERSIONLIST: 'PRICE_VERSIONLIST',
  INIT_STATE: 'INIT_STATE',// 初始化版本状态
  UPGRADE: 'UPGRADE', // 升级版本
  PRICE_DELECT_VERSION: 'PRICE_DELECT_VERSION', // 删除操作
  PRICE_CURRENT_STEP: 'PRICE_CURRENT_STEP', // 当前显示的阶段
  PRICE_SEND_REQ: 'PRICE_SEND_REQ',
  PRICE_HIGHT_CURRENT_VERSION: 'PRICE_HIGHT_CURRENT_VERSION',
};

const state = {
  priceCurrentStep: 1,
  isSB: false,
  price_VersionListByBusinessldData: [], // 获取面积版本列表
  price_CurrentVersionState: '', // 当前版本的状态
  price_CurrentVersionText: '未编制', // 当前版本的状态描述
  price_StageData: [], // 面包屑 阶段数据
  price_ListData: {
    data: []
  }, // 价格管理列表数据
  price_save: [],
  price_createVersion: [], // 创建价格版本
  price_VersionList:[],//IGetPriceVersionList接口返回的rows
  upgrade: '',// 升级操作
  price_deleteData: '', // 删除操作
  price_SendReq: true,
  price_HightCurrentVersion: '',
};
const actions = {
  price_SetCurrentMenu({commit},{stageId,step}){
    fetchUtils.post('/Price/IGetPriceVersionList',
      {stageId: stageId,step:step})
      .then(res => res.rows)
      .then(data => {
        if(data && data.length<1){
          commit(types.PRICE_SEND_REQ, false)
          commit(types.PRICE_CURRENT_STEP, step)
        }
      })
  },
  // 删除操作
  price_deleteVersion ({commit},{versionId,vm}) {
    fetchUtils.post('/Price/IDeletePrice',
      {priceVersionId: versionId})
      .then(data => {
        if(data.errorcode == 200){
          vm.$message({
            message: '删除成功',
            type: 'success'
          });
        }else{
          vm.$message({
            message: data.message,
            type: 'error'
          });
        }
      })
  },
  // 升级操作
  setUpgrade ({commit},{versionId,vm}) {
    fetchUtils.post('/Price/IUpgradePriceVerion',
      {versionId: versionId})
      .then(data => {
        if(data.errorcode == 200){
          vm.$message({
            message: '升版成功',
            type: 'success'
          });
        }
      }).catch(function (res){
        vm.$message({
          message: res,
          type: 'error'
        });
    })
  },
  // 初始化版本状态
  initState ({commit}) {
    commit(types.INIT_STATE);
    commit(types.PRICE_HIGHT_CURRENT_VERSION,'');
  },
  // 获取价格版本列表
  price_GetVersionListByBusinessldData ({commit},{stageId,step}) {
    fetchUtils.post('/Price/IGetPriceVersionList',
      {stageId: stageId,step:step})
        .then(res => res.rows)
        .then(data => {
          if(data && data.length<1){
            commit(types.PRICE_CURRENT_STEP, step)
            commit(types.PRICE_VERSION_LIST_BY_BUSINESSLD, []);
          }else{
            commit(types.PRICE_VERSION_LIST_BY_BUSINESSLD, priceVersionListByBusinessldData(data));
          }
        })
  },
  // 创建价格版本
  price_CreateVersion ({commit},{stageId,step,vm}) {
    fetchUtils.post('/Price/ICreatePriceVersion',
    {stageId:stageId,step: step})
      .then(res => {
        if(res.errorcode == 200){
          vm.$message({
            message: '版本创建成功',
            type: 'success'
          });
        }
         return res.rows
      })
      .then(data => {
        commit(types.PRICE_CREATE_VERSION, priceCreateVersionData(data));
      }).catch(res=>{
      vm.$message({
        message: res,
        type: 'error'
      });
    })
  },
  // 当前版本
  price_SetVersion ({commit}, version) {
    commit(types.PRICE_CURRENT_VERSION_STATE, version);
    if(state.price_VersionListByBusinessldData && state.price_VersionListByBusinessldData.length>0) {
      if(state.price_VersionListByBusinessldData[0].statusName == '审批通过'){
        commit(types.PRICE_HIGHT_CURRENT_VERSION,state.price_VersionListByBusinessldData[0].versionId);
      }
      state.price_VersionListByBusinessldData.forEach(function(item) {
        if(version === item.versionId) {
          state.price_CurrentVersionText = item.statusName?item.statusName: '未编制'
        }
      })
    }else {
      state.price_CurrentVersionText = '未编制'
      commit(types.PRICE_HIGHT_CURRENT_VERSION,'');
    }
  },
  // 面包屑 阶段数据 ae5bbeaa-7c87-e02d-d641-af8876219e92 Stage Area
  price_GetStageData ({commit},{stepType,stageID}) {
    fetchUtils.post('/Common/IGetStep',
    {stepType: stepType,stageID:stageID}
     ).then(res => res)
      .then(data => {
        commit(types.PRICE_SET_STAGE_DATA, priceChangeStageData(data));
      })
  },
  // 价格管理列表数据
  price_GetPrice ({commit},{priceVersionId}) {
    commit(types.PRICE_CURRENT_STEP,1);
    fetchUtils.post('/Price/IGetPriceList',
      {priceVersionId:priceVersionId})
      .then(res => res.rows)
      .then(data => {
        if(data.step == 6){
          data.step=5
        }
        commit(types.PRICE_CURRENT_STEP, data.step ? data.step : 1);
        commit(types.PRICE_LIST_DATA, price_ChangePriceListData(data));
      })
  },
  // 价格保存
  price_SavePrice ({commit},{step,versionId,vm}) {
    let data = step == 'Vote' ? state.price_ListData.rowVoteData : state.price_ListData.rowUnVoteData;
    let arr = []
    data.forEach(function (item) {
      arr.push({versionId:versionId,BUILDID: item.BUILDID,producttypeId:item.PRODUCTTYPEID,quotaId:'AVERAGEPRICE',averagePrice:item.AVERAGEPRICE? item.AVERAGEPRICE : 0,totalSaleArea:item.TOTALRENTALSALEAREA? item.TOTALRENTALSALEAREA:0})
    })
    if(arr.length>0) {
      fetchUtils.post('/Price/ISavePriceData',
        {saveData: JSON.stringify(arr)})
        .then(data => {
          if(data.errorcode == 200) {
            vm.$message({
              message: '保存成功',
              type: 'success'
            });
          }
        }).catch(function (res){
        vm.$message({
          message: res,
          type: 'error'
        });
      })
    }
  },

}

const mutations = {

  [types.PRICE_HIGHT_CURRENT_VERSION](state,price_HightCurrentVersion){
  state.price_HightCurrentVersion = price_HightCurrentVersion
  },
  [types.PRICE_SEND_REQ](state,price_SendReq){
    state.price_SendReq = price_SendReq
  },
  [types.PRICE_CURRENT_STEP](state,priceCurrentStep){ // 初始化操作
    if(priceCurrentStep == 3){
      priceCurrentStep = 2
    }
  state.priceCurrentStep   = priceCurrentStep
  },
  [types.INIT_STATE](state){ // 初始化操作
    state.price_CurrentVersionText   = '未编制'
    state.price_CurrentVersionState = ''
  },
  [types.PRICE_VERSION_LIST_BY_BUSINESSLD](state, price_VersionListByBusinessldData){  //面积版本数据
    state.price_VersionListByBusinessldData = price_VersionListByBusinessldData;
    if (state.price_VersionListByBusinessldData && state.price_VersionListByBusinessldData.length > 0) {
      state.price_CurrentVersionState = state.price_VersionListByBusinessldData[0].versionId
      state.price_CurrentVersionText = state.price_VersionListByBusinessldData[0].statusName
      state.isSB = state.price_CurrentVersionText == '审批通过'?true: false
    }
  },
  [types.PRICE_CURRENT_VERSION_STATE](state, price_CurrentVersionState){ // 当前版本
    state.price_CurrentVersionState = price_CurrentVersionState
  },

  [types.PRICE_SET_STAGE_DATA](state, price_StageData){  // 面包屑 阶段数据
    state.price_StageData = price_StageData;
  },
  [types.PRICE_LIST_DATA](state, price_ListData){  // 价格管理列表数据
  state.price_ListData = price_ListData;
},
  [types.PRICE_CREATE_VERSION](state, price_createVersion){  // 价格管理列表数据
    state.price_createVersion = price_createVersion;
  },


}

const getters = {
  price_VersionListByBusinessldData: state=>state.price_VersionListByBusinessldData, // 价格版本数据
  price_CurrentVersionState: state=>state.price_CurrentVersionState, // 当前版本
  price_CurrentVersionText: state=>state.price_CurrentVersionText,// 当前版本描述
  price_StageData: state => state.price_StageData,// 面包屑 阶段数据
  price_ListData: state => state.price_ListData,  // 价格管理列表数据
  price_createVersion: state => state.price_createVersion,  // 创建价格版本
  isSB: state => state.isSB,
  price_CurrentStep: state=>state.priceCurrentStep,
  price_SendReq: state=>state.price_SendReq,
  price_HightCurrentVersion: state=>state.price_HightCurrentVersion,
};
const priceVersionListByBusinessldData = (data) => {
  // console.info('价格版本数据')
  // console.info(JSON.stringify(data,null,2))
  return data
}

const priceChangeStageData = (data) => {
  // console.info('面包屑 阶段数据')
  // console.info(JSON.stringify(data,null,2))
  data.forEach(function (item) {
    item.className ='active ' + item.className
    item.apply =  ' '
  })
  // data[0].active = 'apply'
  return data
}

const price_ChangePriceListData = (data) => {
  // console.info('价格列表数据')
  // console.info(JSON.stringify(data,null,2))
  return data
}
const priceCreateVersionData = (data) => {
  // console.info('价格版本创建成功')
  // console.info(JSON.stringify(data,null,2))
  // console.info(data)
  return data
}

const price_ChangePriceSaveData = (data) => {
  // console.info('价格保存成功')
  // console.info(JSON.stringify(data,null,2))
  return data
}

export default {
  state,
  actions,
  getters,
  mutations
}
