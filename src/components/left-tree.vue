<template>
  <div class="clear collagen" id="left_tree">

    <div id="treeId">
    <transition name="fade">
      <div class="el-tree icon collagen" v-show="showFlagTree">
        <div class="fr" style="margin-right: 10px;" id="leftTreeButton">
          <!--type 控制按钮颜色-->
          <WrapperButton
            v-if=" ( $route.name == 'company' || $route.name == 'project' ) && commonPathRoleAuthority.indexOf('btn_add') > -1"
            type="icon" size="mini" icon="el-icon-plus" @click="newadd" :title="mode =='company'?'创建项目':'创建分期'"/>
          <WrapperButton
            v-if=" ( $route.name =='project' || $route.name == 'stageInfo' ) && commonPathRoleAuthority.indexOf('btn_edit') > -1 "
            type="icon" size="mini" icon="el-icon-edit" @click="edit" :title="mode =='stage'?'编辑分期':'编辑项目'"/>
          <WrapperButton
            v-if=" ( $route.name =='project' || $route.name == 'stageInfo' ) && commonPathRoleAuthority.indexOf('btn_delete') > -1"
            type="icon" size="mini" icon="el-icon-delete" @click="del" :title="mode =='stage'?'删除分期':'删除项目'"/>
        </div>
      </div>
    </transition>
    <el-tree
      ref="tree"
      highlight-current
      v-loading="commonTreeLoading"
      empty-text=""
      element-loading-background="rgba(0, 0, 0, 0.2)"
      :data="commonTreeData"
      node-key="id"
      :class="showFlagTree? 'active' : ''"
      :default-expanded-keys="currentExpandedKeys"
      @node-click="handleNodeClick"
    />
    </div>
  </div>
</template>

<script>
  import {message} from '../utils';
  import WrapperButton from './wrapper-button.jsx';
  import {mapState, mapGetters, mapActions} from 'vuex';
  import "./left-tree.less";
import project from '../store/modules/project';
  export default {
    name: 'LeftTree',
    data() {
      return {
        showFlag: true,
        showFlagTree: false,
        currentExpandedKeys: [],
        mode: "",
        modeId: "",
        delId: "",
        companyId: "",
        projectId: ""
      }
    },
    components: {
      WrapperButton
    },
    computed: {
      ...mapGetters([
        'commonTreeData',
        'commonExpandedKeys',
        'commonTreeLoading',
        'commondel',
        'commonCurrentAddStatus',
        'stageVersion',
        'commonPathRoleAuthority'
      ]),
    },
    methods: {
      ...mapActions([
        'commonGetTreeData',
        'projectshow',
        'stageDel',
        'projectDel',
        'setStageEdit',
        'addStages',
        'getMTitle',
        'getStageProjectTart',
        'initActiveIndex',
        'getOrgUsers',
        'getTeamBaseInfo',
        'setMeun',
        'setLoadTree',
      ]),
      initData() {
        this.commonGetTreeData()
          .then(() => {
            this.handleRouteChange();
          })
          .catch(error => {
            message.error("获取左侧树失败");
          })
      },
      handleNodeClick(nodeData, node, data) {
        this.setLoadTree({loadTree:false})
        this.setMeun({isShow: true})
        this.$store.dispatch("setStageEdit", true);
        this.initActiveIndex({index: '1_1'})
        this.$store.dispatch("projectshow", true);
        sessionStorage.setItem('projectId', nodeData.orgId);
        sessionStorage.setItem('parentid', nodeData.parentid);
        sessionStorage.setItem('nodeId', nodeData.id);
        this.mode = nodeData.mode;
        this.modeId = nodeData.id;
        const {mode, id} = nodeData;
        if(this.$route.path == '/stage/team'){
          this.showFlagTree = false
          sessionStorage.setItem('aaaaa', nodeData.id)
          // this.getOrgUsers()
          this.getTeamBaseInfo()
        }else if(this.$route.path == '/stage/assessment'){
          sessionStorage.setItem('aaaaa', nodeData.id)
        }else if(this.$route.path == '/stage/rate'){
          sessionStorage.setItem('aaaaa', nodeData.id)
        }else {
          switch (mode) {
            case "group":
              this.showFlagTree = false
              this.$router.push({
                path: '/group'
              });
              break;
            case "company":
              this.showFlagTree = true
              sessionStorage.setItem('aaaaa', nodeData.id)
              sessionStorage.setItem("companyName", nodeData.label);
              this.$router.push({
                path: '/company',
                query: {mode, companyName: nodeData.label, nodeId: nodeData.id}
              });
              break;
            case "project":
              this.showFlagTree = true
              sessionStorage.setItem('aaaaa', nodeData.id)
              sessionStorage.setItem("projectId", nodeData.id);
              this.delId = nodeData.id;
              this.setCompanyId(nodeData.id);
              this.$router.push({
                path: '/project',
                query: {mode: mode, nodeId: id}
              });
              break;
            case "stage":
              this.showFlagTree = true
              sessionStorage.setItem('aaaaa', nodeData.id);
              sessionStorage.setItem('nodeId', nodeData.id);
              this.delId = nodeData.id;
              this.setCompanyId(nodeData.parentid);
              this.$router.push({
                path: "/stage",
                query: {mode: mode, nodeId: id}
              });
              break;
            default:

          }
        }
      },
      setCompanyId(projectId){
        //获取公司id方法
        const data = this.commonTreeData[0]['children']; //公司列表
        let companyId = '';
        const len = data.length;
        for( let i=0; i<len; i++){
          const childData = data[i]['children'] //项目列表
          if( childData && childData.length !== 0 ){
            for( let j=0, length=childData.length; j<length; j++){
              if( childData[j]['id'] === projectId ){
                companyId = data[i]['id'];
                break;
              }
            }
          };
          if( companyId !== '' ) break;
        }
        this.companyId = companyId;
      },
      getProjectId(stageId){
        //获取项目id方法
        const data = this.commonTreeData[0]['children']; //公司列表
        let projectId = '';
        const len = data.length;
        for( let i=0; i<len; i++){
          const childData = data[i]['children'] //项目列表
          if( childData && childData.length !== 0 ){
            for( let j=0, length=childData.length; j<length; j++){
              const subChildData = childData[j]['children'];
              for( let y=0, subLength=subChildData.length; y<subLength; y++ ){
                if( subChildData[y]['id'] === stageId ){
                  projectId = childData[j]['id'];
                  break;
                }
              }
              if( projectId !== '' ) break;
            }
          };
          if( projectId !== '' ) break;
        }
        return projectId;
      },
      //处理路由变化
      handleRouteChange() {
        const {nodeId, mode} = this.$route.query;
        if (nodeId) {
          this.currentExpandedKeys = [nodeId];
          this.$refs.tree.setCurrentKey(nodeId);
          this.setDelId(nodeId);
          if (this.commonCurrentAddStatus.isAdd) {
            const f = () => {
              var timer = setTimeout(()=> {
                clearTimeout(timer);
                timer = null;
                if (this.commonCurrentAddStatus.isEnd) {
                  this.$refs.tree.setCurrentKey(nodeId);
                  this.setDelId(nodeId);
                  const status = [
                    {type: 'isEnd', value: false},
                    {type: 'isAdd', value: false}
                  ]
                  this.$store.dispatch('commonSetCurrentStatus', status);
                } else {
                  f();
                }
              }, 30)
            };
            f();
          }
          return;
        }
        this.currentExpandedKeys = this.commonExpandedKeys;
      },
      setDelId(id){
        this.delId = id;
        const path = this.$route.path;
        const modeConfig = {
          '/project': 'project',
          '/stage/info': 'stage',
          '/company': 'company',
          '/group': 'group'
        };
        this.mode = modeConfig[path];
        if( path === '/stage/info'){
          sessionStorage.setItem('aaaaa', id);
          sessionStorage.setItem('nodeId', id);
        }else if( path === '/project' ){
          sessionStorage.setItem("projectId", id);
        }
      },
      newadd(){
        if (this.mode === 'stage') {
          return message.error('分期下无法在添加项目！');
        }
        if (this.mode == 'project') {
          this.setLoadTree({loadTree:true})
          this.setMeun({isShow:false})
          this.getMTitle({stageVersionId: ""})
          this.getStageProjectTart({stageVersionId: ""})
          this.$store.dispatch("addStages");
          this.$router.push({
            path: '/stage/info',
            query: {mode: 'stage', nodeId: ""}
          });
        }
        if (this.mode === "company" && this.modeId) {
          this.$store.dispatch('projectshow', false); // 项目可编辑
          this.$router.push({
            path: '/projectAdd',
            query: {mode: 'project', companyId: this.modeId}
          });
        }
      },
      edit(){
        this.setLoadTree({loadTree:false})
        //判断是否是审批中
        const globalEditState = sessionStorage.getItem("globalEditState");
        if (globalEditState == "1") {
          return message.error("审批中无法进行编辑！");
        };
        if(this.mode == "project") {
          const projectVersionData = JSON.parse(sessionStorage.getItem("projectVersionData"));
          const errMsg = this.isUnEditAble(projectVersionData, globalEditState);
          if( !errMsg ){
            //可以编辑
            this.$store.dispatch("projectshow", false);
          }else{
            message.error(errMsg);
          }
        };
        if (this.mode == 'stage') {
          const stageVersionList = JSON.parse(sessionStorage.getItem('stageVersionList'));
          const errMsg = this.isUnEditAble(stageVersionList, globalEditState);
          if( !errMsg ){
            //可以编辑
            this.$store.dispatch("setStageEdit", false);
          }else{
            message.error(errMsg);
          }
        };
      },
      del(){
        const status = sessionStorage.getItem("globalEditState");
        if (status != "0" && status != "-1") {
          const statusConfig = {
            "1": "审批中",
            "99": "审批通过"
          }
          return message.error(`${statusConfig[status]}无法进行删除操作！`);
        }
        if (this.delId === "") {
          return message.error('丢失ID无法删除');
        }
        if (this.mode == "stage") {
          //删除分期
          this.$confirm(`您确定要删除当前分期吗？`, '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then( () => {
            return this.stageDel(this.delId);
          }).then( res => {
            const stageVersionList = JSON.parse(sessionStorage.getItem('stageVersionList'));
            if( stageVersionList.length > 1 ){
              this.mode = 'stage';
              this.$router.push({path: "/stage/info", query: {mode: "stage", nodeId: this.delId, timer: new Date().getTime()}});
            }else{
              const _parentId = this.getProjectId(this.delId);
              this.mode = 'project';
              this.$router.push({path: "/project", query: {mode: "project", nodeId: _parentId}});
            }
            message.success('删除成功！');
            this.delId = "";
            return this.commonGetTreeData();
          }).then(res => {
            this.handleRouteChange();
          }).catch( err => {
            if( err != 'cancel' ){
              message.error(err);
            }
          })
        } else if (this.mode == 'project') {
          //删除项目
          this.$confirm(`您确定要删除当前项目吗？`, '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then( () => {
            return this.projectDel(this.delId);
          }).then(res => {
            const projectVersionData = JSON.parse(sessionStorage.getItem("projectVersionData"));
            if( projectVersionData.length > 1 ){
              this.mode = 'project';
              this.$router.push({path: "/project", query: {mode: "project", nodeId: this.delId, timer: new Date().getTime()}});
            }else{
              const _treeData = this.commonTreeData[0].children.filter(item => {
                return item.orgId === this.companyId;
              });
              const _projectId = _treeData[0]["children"][0]['id'] || ""; // 取公司第一个项目id
              if (_projectId) {
                this.mode = 'project';
                this.$router.push({path: "project", query: {mode: "project", nodeId: _projectId}})
              } else {
                //获取到公司 定位至公司
                this.mode = 'company';
                this.$router.push({
                  path: "company",
                  query: {mode: "company", companyName: _treeData[0]['label'], nodeId: _treeData[0]['id']}
                })
              }
            }
            message.success('删除成功！');
            this.delId = "";
            return this.commonGetTreeData();
          }).then( res => {
            this.handleRouteChange();
          }).catch(err => {
            if( err != 'cancel' ){
              message.error(err);
            }
          })
        }
      },
      isUnEditAble(defaultData, globalEditState){
        if (globalEditState == '99') {
          // 版本列表中存在 编制中 或 驳回 或审批中 当前 版本不可编辑
          let isTypeOne = false;
          let outStatus = "";
          const statusConfig = {
            "-1": "驳回",
            "0": "编制中",
            "1": "审批中"
          }
          for (let i = 0, len = defaultData.length; i < len; i++) {
            let status = defaultData[i]['versionStatus'];
            if (status == '-1' || status == '0' || status == '1') {
              isTypeOne = true;
              outStatus = status;
              break;
            }
          };
          if (isTypeOne) {
            return `请先切换至版本列表中${statusConfig[outStatus]}的版本再进行操作！`;
          } else {
            //所有版本列表 都是审批通过的 判断当前版本的index 是不是第一个
            const globalEditVersionId = sessionStorage.getItem('globalEditVersionId');
            const _end = defaultData.some( (item, index) => {
              return item['versionId'] == globalEditVersionId && index == 0;
            });
            return !_end && '请先切换至最高版本再进行操作' || !_end;
          }
        } else {
          return false; //表示可以编辑
        }
      },
    },
    created() {
      this.initData();
    },
    watch: {
      '$route': 'handleRouteChange'
    },
  }
</script>
<style lang="less" rel="stylesheet/less" scoped>
  .el-tree {
    position: relative;
    top: 0;
    left: 0;
    transition: left 0.5s;
    width: 240px;
    height: 100%;
    border-bottom: 2px solid #ebeff2;
    color: #66635b;
    background-image: url(../public/images/tree.png);
    background-size: 90%;
    overflow: auto;
    &.icon {
      position: relative;
      height: 30px;
      padding: 20px 0 0 0;
      z-index: 99;
    }
  }
  .el-tree.active {
    height: calc(100% - 50px);
  }
  .el-row {
    display: inline;
  }

  .el-tree-node__content {
    height: 30px !important;
  }
  #treeId {
    height: 90%;
  }
</style>
