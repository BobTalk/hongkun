<template>
  <div class="sign">
    <div class="active-container">
      <h2>
        <span class="title">{{title1}}</span>
        <div class="button-cpntainer">
          <span style="margin-left: 5px;">
            <label class="version">当前版本:</label>
            <el-select :value="preVersionId" placeholder="请选择"  class="input_style version_width" @change="changeVersion" id="select_input" style="width: 120px;height: 27px!important;">
              <el-option
                style="height: 30px"
                v-for="item in versionData"
                :key="item.versionId"
                :label="item.showName"
                :value="item.versionId">
              </el-option>
            </el-select>
          </span>
        </div>
      </h2>
      <div class="sign-container">
        <sign-table 
          :initData="preData"
          :titleInfo="titleInfo"
          :saveState="saveState">
        </sign-table>
      </div> 
    </div>
    <div class="active-container">
      <h2>
        <span class="title">{{title2}}</span>
        <div class="button-container">
          <el-button size="small" type="primary" @click="changeEditState" v-if="(signStatus == '0' || signStatus == '-1' || signStatus == '99') && level != '2' && commonPathRoleAuthority.indexOf('btn_edit') > -1"><i class="el-icon-edit"></i>编辑</el-button>
          <el-button size="small" type="primary" @click="saveEdit" v-if="level != '2' && signStatus != '1' && commonPathRoleAuthority.indexOf('btn_edit') > -1"><i class="el-icon-tickets"></i>保存</el-button>
          <el-button size="small" type="primary" @click="startApproval" v-if="(signStatus == '0' || signStatus == '-1' || signStatus == '99') && commonPathRoleAuthority.indexOf('btn_approval') > -1 && approvalState"><i class="el-icon-share"></i>发起审批</el-button>
          <span v-if="signStatus==1" class="approval-state">状态：审批中</span>
        </div>
      </h2>
      <div class="sign-container">
        <sign-table 
          ref="activeChild"
          :initData="activeData"
          :titleInfo="titleInfo"
          :editState="editState"
          :saveState="!saveState">
        </sign-table>  
      </div> 
    </div>
  </div>
</template>

<script>
  import SignTable from './sign-table'
  import { message, fetchUtils } from '@/utils'
  export default {
    name: "Sign",
    data: function () {
      return {
        title1: "预算版",
        title2: "动态实施版",
        level: '2',
        stageId: "",    //当前分期ID
        saveState: false, //子组件是否执行保存方法的状态
        titleInfo: [],
        activeData: { data: [], level: ''},
        preData: { data: [], level: ''},
        signStatus: "-10",  //动态实施版状态
        preVersionId: '',   //预算版当前的id
        versionId: '',      //当前动态实施版本的id
        versionData: [],    //当前预算版的所有版本
        editState: false,
        approvalState: false,
        copyPreData: { data: [], level: ''}
      };
    },
    computed: {
      commonPathRoleAuthority(){
          return this.$store.state.common.commonPathRoleAuthority
      }
    },  
    methods: {
      startApproval(){
        //发起审批
        const data = {
          entiId: '10108',
          dataKey: this.versionId
        };
        this.$store.dispatch("commonStartApproval", data)
          .then(res => {
            message.success("提交审批成功");
            this.getInitData(false);
          }).catch(err => {
            message.error(err);
          })        
      },
      updateVersion(){
        fetchUtils.post('/SignAcontract/IUpgradeSignAcontractVersion', {stageId: this.stageId})
          .then( res => {
            message.success('升版操作成功！');
            this.getInitData(false);
          }).catch( err => {
            message.error( err );
          })
      },
      changeVersion(id){
        this.preVersionId = id;
        this.getPreData();
      },
      changeEditState(){
        if( this.editState ) return;
        this.editState = true;
      },
      saveEdit(){
        this.editState = false;
        const saveData = this.$refs.activeChild.saveData();
        const stageVersionId = this.$refs.activeChild.getVersionId();
        const data = {
          stageId: this.stageId,
          signAcontractVersionId: this.versionId,
          stageVersionId,
          saveData: JSON.stringify(saveData)
        }
        fetchUtils.post('/SignAcontract/ISaveSignAcontract', data)
          .then( res => {
            message.success('保存成功');
            this.getInitData(false);
            this.approvalState = true;
          }).catch( err => {
            message.error(err);
          })
      },
      getInitData(reloadPreData){
        //获得基本信息
        const stageId = this.stageId;
        this.activeData = { data: [], level: ''};
        this.titleInfo = [];
        this.preData = { data: [], level: ''};
        fetchUtils.post('/SignAcontract/IGetSignAContractBaseInfo', {stageId})
          .then( res => {
            if( res.errorcode == 201 ){
              this.titleInfo = res.rows.titles;
              return Promise.reject({msg: res.rows.message, isShow: false});
            }
            this.versionId = res.rows.dynamicVersionId;
            this.signStatus = res.rows.dynamicVersionStatus;
            this.titleInfo = res.rows.titles;
            if( res.rows.budgetVersions && res.rows.budgetVersions.length !== 0){
               this.versionData = res.rows.budgetVersions;
               this.preVersionId = res.rows.budgetVersions[0]['versionId'];
            }
            return fetchUtils.post('/SignAcontract/IGetSignAContractData', {stageId, signAContractVersionId: this.versionId});
          }).then( res => {
            this.activeData = res.rows;
            this.level = res.rows.level;
          }).then( res => {
            if(this.versionData.length !== 0){
              if( reloadPreData ){
                this.getPreData();
              }else{
                this.preData = JSON.parse(JSON.stringify(this.copyPreData));
              }
            }
          }).catch( err => {
            if( typeof err === 'object' && !err.isShow ){
              return ;
            }
            message.error(err);
          });
      },
      getPreData(){
        const stageId = this.stageId;
        const signAContractVersionId = this.preVersionId;
        this.preData = { data: [], level: ''};
        fetchUtils.post('/SignAcontract/IGetSignAContractData', {stageId, signAContractVersionId})
          .then( res => {
            this.preData = res.rows;
            this.copyPreData = JSON.parse(JSON.stringify(res.rows));
          }).catch( err => {
            console.log(err);
          })
      },
    },
    components: {
      SignTable
    },
    created(){
      this.stageId = this.$route.query.nodeId;
      this.getInitData(true);
    }
  }
</script>

<style lang="less" rel="stylesheet/less" >
  .sign {
    height: 100%;
    margin-top: 60px;
  }
  .sign .active-container h2 {
    width: 98%;
    height: 30px;
    background: inherit;
    border-bottom: 2px solid #f9f9f9;
    text-align: left;
    line-height: 30px;
    display: flex;
    justify-content: space-between;
    font-size: 15px;
    padding-right: 10px;
    font-weight: normal;
    .title {
      border-bottom: 2px solid dodgerblue;
      display: block;
      text-align: center;
    }
  }
  .sign .input_style {
    input {
      border-radius: 5px;
      font-size: 12px;
      padding: 4px 0;
      padding-left: 4px;
    }
  }
  .sign .active-container .version {
    font-size: 12px;
    color: #409EFF;
  }
  .sign .active-container .sign-container {
    width: 98%;
    margin-top:10px;
  }
  .sign .active-container {
    margin-top: 20px;
  }
  .sign .active-container .dialog-title {
    width: 1000px;
  }
  .sign .active-container .span-title {
    display: inline-block;
    padding: 0 6px;
  }
  .sign .select-container {
    margin-bottom: 30px;
    & > label {
      margin-left: 20px;
    }
    & > label:first-child {
      margin-left: 0;
    }
  }
  .sign .dialog-container th .cell, .sign .active-container th .cell {
    color: #2c3e50 !important;
    line-height: 30px !important;
    font-size: 14px !important;
    font-weight: normal !important;
    white-space: normal;
    text-overflow: visible;
  }
  .sign .dialog-container td .cell {
    line-height: 24px !important;
  }
  .sign .dialog-container th {
    background: #f5f7fa
  }
  .sign .el-table  .no_expand td  {
    border-bottom: none !important;
  }
  .sign .approval-state {
    font-size: 12px;
  }
</style>
