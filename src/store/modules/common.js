import {fetchUtils, message, fetchXml} from '../../utils';
import iframeUrl from "@/config/app-config";
import commonNoIframeUrl from '@/public/images/nopicsmall.gif'
//mutations类型
const types = {
  SET_TREE_DATA: 'SET_TREE_DATA',      //设置左侧树
  SET_LOADING: 'SET_LOADING',//设置全局loading
  SET_PROJECT_DEL: 'SET_PROJECT_DEL',  //设置删除项目
  SET_TREE_KEYS: 'SET_TREE_KEYS',  //设置左侧树展开节点
  SET_IMAGE_STATUS: 'SET_IMAGE_STATUS',  //设置顶部树代办数据
  SET_WORK_NUMBER: 'SET_WORK_NUMBER',
  SET_CURRENT_ADD_STATUS: 'SET_CURRENT_ADD_STATUS' ,//每次添加項目或者分期設置的狀態
  ACTIVE_INDEX: 'ACTIVE_INDEX',
  SET_IFRAME_URL: 'SET_IFRAME_URL',  //设置iframe链接地址
  SET_PATH_AUTHORITY: 'SET_PATH_AUTHORITY',  //设置路由对应的按钮权限
  SET_MEUN: 'SET_MEUN',
};

const state = {
  isShowMeun: true,
  // 当前面包屑状态
  activeIndex: '1_1',
  // 用户数据信息
  treeData: [],
  // 左侧树数据加载状态
  treeLoading: true,
  //全局loading状态
  globalLoading: false,
  projectdel: [],
  imageStatus: false,//总图显示状态
  iframeUrl: "",
  workNumber: [
    {Key: "MYTODOCOUNT", Value: 0},
    {Key: "MYAPPROVALHISTCOUNT", Value: 0}
  ],
  currentAddStatus: {
    isAdd: false,
    isEnd: false
  },
  commonProjectIframeUrl: '',
  commonStageIframeUrl: '',
  commonIframeLoading: false,
  commonIframeHasPicture: false,
  commonPathRoleAuthority: [] //按钮权限
};

const actions = {
  setMeun({commit},{isShow}){
    commit(types.SET_MEUN,isShow);
  },
  initActiveIndex({commit},{index}){
    commit(types.ACTIVE_INDEX,{index:index});
  },
  commonSetImageStatus({commit}, {status, str}) {
    commit(types.SET_IMAGE_STATUS, {status, str});
  },
  /**
   * 获取左侧组织机构树
   */
  commonGetTreeData({commit}) {
    const treeDataPromise = fetchUtils.post('/Common/IGetOrganizational');
    return treeDataPromise
      .then(res => res.rows)
      .then(data => {
        const treeData = changeTreeData(data);
        commit(types.SET_TREE_DATA, treeData);
      })
  },
  SHOW_LOADING({commit}) {
    commit(types.SET_LOADING, true);
  },
  CLOSE_LOADING({commit}) {
    commit(types.SET_LOADING, false);
  },
  commonSetWorkNumber({commit}){
    const userId = JSON.parse(localStorage.getItem('userInfo'))['userId'];
    fetchUtils.post(`/MyTodo/ImyTodoCount/?userId=${userId}`)
      .then(res => {
        commit(types.SET_WORK_NUMBER, res.rows[0]);
      })
  },
  commonStartApproval({dispatch, commit}, initData){
    const userId = JSON.parse(localStorage.getItem('userInfo'))['userId'];
    initData["userId"] = userId;
    return fetchXml.post("/iWorkflow/Workflow/api/WFServices.asmx/GetSubmitWorkflows", initData)
      .then(res => {
        let data = JSON.parse(res.d.Data)[0]["Flows"];
        const len = data.length;
        let selectedFlows = Array(len);
        data.forEach((item, key) => {
          let obj = {};
          obj.ContextGuid = item.Id;
          obj.ParentContextGuid = item.PId;
          obj.FlowName = item.Text;
          obj.FlowType = item.Type;
          let userLen = item.Users.length;
          let userIDStr = Array(userLen);
          item.Users.forEach((list, index) => {
            userIDStr[index] = list.UId;
          });
          obj.Participants = userIDStr;
          obj.FlowType2 = item.FlowType2;
          obj.RunFlowId = "0";
          selectedFlows[key] = obj;
        });
        const submitData = {
          DataKey: initData.dataKey,
          EntiId: initData.entiId,
          EventUserId: JSON.parse(localStorage.getItem('userInfo'))['userId'],
          Files: [],
          ProcessComment: "发起审批"
        }
        return {selectedFlows, submitData};
      }).then(res => {
        return fetchXml.post("/iWorkflow/Workflow/api/WFServices.asmx/SubmitWorkflow", res);
      }).then(res => {
        if (res.d.Message === '提交成功') {
          dispatch('commonSetWorkNumber');
          return Promise.resolve("success");
        } else {
          return Promise.reject(res.d.Message);
        }
      })
  },
  commonIsFirstApproval(){
    //获取返回项目的versiondata;
    const _parentId = sessionStorage.getItem("parentid");
    return fetchUtils.get("/Project/IGetProjectVersionList", {projectId: _parentId})
  },
  commonSetCurrentStatus({commit}, status){
    //設置當前選中樹的節點
    commit(types.SET_CURRENT_ADD_STATUS, status);
  },
  commonChangeRoleAuthority({commit}, path){
    commit(types.SET_PATH_AUTHORITY, path);
  }
};

const getters = {
  isShowMeun: state=>state.isShowMeun,
  activeIndex: state=>state.activeIndex,
  //总图显示状态
  commonImageStatus: state => state.imageStatus,
  commonIframeUrl: state => state.iframeUrl,
  //左侧树数据加载状态
  commonTreeLoading: state => state.treeLoading,
  commonTreeData: state => state.treeData,
  //默认展开的key
  commonExpandedKeys: state => {
    const [root] = state.treeData;
    if (!root) {
      return [];
    }
    return [root.id];
  },
  commondel: state => state.projectdel,
  /**
   * 全局 Loading
   */
  globalLoading: state => !!state.globalLoading,
  commonWorkNumber: state => state.workNumber,
  commonCurrentAddStatus : state => state.currentAddStatus,
  commonProjectIframeUrl: state => state.commonProjectIframeUrl,
  commonStageIframeUrl: state => state.commonStageIframeUrl,
  commonIframeLoading: state => state.commonIframeLoading,
  commonIframeHasPicture: state => state.commonIframeHasPicture,
  commonPathRoleAuthority: state => state.commonPathRoleAuthority
};

const mutations = {
  [types.SET_MEUN](state,isShow) {
  state.isShowMeun = isShow
  },
  [types.ACTIVE_INDEX](state,arg) {
    state.activeIndex = arg.index
  },
  [types.SET_TREE_DATA](state, treeData) {
    state.treeData = treeData;
    state.treeLoading = false;
  },
  [types.SET_LOADING](state, loadingStatus) {
    state.globalLoading = !!loadingStatus;
  },
  [types.SET_PROJECT_DEL](state, projectdata) {
    state.projectdel = projectdata;
  },
  [types.SET_IMAGE_STATUS](state, {status, str}) {
    state.imageStatus = status;
    state.iframeUrl = str;
  },
  [types.SET_WORK_NUMBER](state, data){
    state.workNumber = data;
  },
  [types.SET_CURRENT_ADD_STATUS](state, status){
    status.forEach( item => {
      state.currentAddStatus[item.type] = item.value;
    });
  },
  [types.SET_IFRAME_URL](state, data){
    //iframe加载
    state.commonIframeLoading = true;
    const { typeinfo, versionId } = data;
    const iframePathConfig = {
      "1": `${iframeUrl.iframeUrl}/Map/Project?project_id=${versionId}&project_map_id=project${versionId}&timer=${new Date().getTime()}`,
      "2": `${iframeUrl.iframeUrl}/Map/Stage?stage_id=${versionId}&stage_map_id=stage${versionId}&timer=${new Date().getTime()}`
    };
    const setNoPic = function(typeinfo){
      state.commonIframeHasPicture = false;
      if(typeinfo == "1" ){
        state.commonProjectIframeUrl = commonNoIframeUrl;
      }else{
        state.commonStageIframeUrl = commonNoIframeUrl;
      };
      state.commonIframeLoading = false;

    }
    const setPic = function(typeinfo){
      state.commonIframeHasPicture = true;
      if(typeinfo == "1" ){
        state.commonProjectIframeUrl = iframePathConfig[typeinfo];
      }else{
        state.commonStageIframeUrl = iframePathConfig[typeinfo];
      };
      state.commonIframeLoading = false;
    }
    fetchUtils.post("/common/IsHaveXMView", {typeinfo, versionId})
      .then( res => {
        if( res.rows == 1 ){
          setPic(typeinfo);
        }else{
          setNoPic(typeinfo);
        }
      });

  },
  [types.SET_PATH_AUTHORITY](state, path){
    const leftMenus = JSON.parse(localStorage.getItem('leftMenus'));
    let _res = leftMenus.filter( item => {
      return Object.keys(item)[0] === path;
    })
    if( path === 'project' ){
      const _btn = 'btn_add';
      //显示项目的时候 左侧树的添加按钮 应该是 添加分期按钮操作的权限
      let _stageRes = leftMenus.filter( item => {
        return Object.keys(item)[0] === 'stage';
      })//获取分期的权限的列表
      if( arrayHasObject(_res[0][path], _btn) && !arrayHasObject(_stageRes[0]['stage'], _btn) ){
        //项目中有btn_add, 分期中没有 删除项目中的添加权限
        _res[0][path] = _res[0][path].filter( item => {
          return item !== _btn;
        })
      }else if( !arrayHasObject(_res[0][path], _btn) && arrayHasObject(_stageRes[0]['stage'], _btn) ){
        //项目中没有btn_add, 分期中有，添加 添加按钮的权限到项目中
        _res[0][path].push(_btn);
      };
    }
    if( path === 'company' ){
      _res = leftMenus.filter( item => {
        return Object.keys(item)[0] === 'project';
      });
      return state.commonPathRoleAuthority = _res[0]['project'];
    }
    state.commonPathRoleAuthority = _res[0][path];
    function arrayHasObject(object, target){
      return object.indexOf(target) > -1;
    }
  }
};

export default {
  state,
  actions,
  getters,
  mutations
}

/**
 * 转换数据
 */
const changeTreeData = (data) => {
  if (!data || !Array.isArray(data)) {
    return [];
  }
  var treeData = data.map(item => {

    let id = item.id;
    //项目或者分期 左侧树绑定 项目Id或分期id
    if (item.level_id == 3 || item.level_id == 4) {
      id = item.orgid;
    }
    return {
      parentid: item.parentid,
      orgId: item.orgid,
      id,
      label: item.text,
      level: item.level_id,
      children: changeTreeData(item.children),
      mode: changeMode(item.level_id),
    }
  });
  return treeData;
};
const changeMode = (leveId) => {
  switch (leveId) {
    case 1:
      return "group";//集团
    case 2:
      return "company";//城市公司 or 片区
    case 3:
      return "project";
    case 4:
      return "stage";
    default:
      return "";
  }
};
