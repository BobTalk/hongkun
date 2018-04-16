<template>
  <div class="sign-upversion">
    <h2 v-if="isDelete" class="del_container">当前版本已被删除</h2>
    <div v-else>
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
            :saveState="saveState"
            :titleInfo="titleInfo">
          </sign-table>
        </div> 
      </div>
      <div class="active-container">
        <h2>
          <span class="title">{{title2}}</span>
        </h2>
        <div class="sign-container">
          <sign-table 
            ref="activeChild"
            :saveState="saveState"
            :initData="activeData"
            :titleInfo="titleInfo"
            :editState="editState">
          </sign-table>  
        </div> 
      </div>
    </div>
  </div>
</template>

<script>
  import SignTable from '../sign/sign-table'
  import { message, fetchUtils } from '@/utils'
  export default {
    name: "Sign",
    data: function () {
      return {
        title1: "预算版",
        title2: "动态实施版",
        saveState: false,
        stageId: "",    //当前版本对应的分期ID
        titleInfo: [],
        activeData: { data: [], level: ''},
        preData: { data: [], level: ''},
        preVersionId: '',   //预算版当前的版本id
        versionId: '',      //当前动态实施版本的id
        versionData: [],    //当前预算版的所有版本
        editState: false,
        isDelete: false
      };
    },
    methods: {
      changeVersion(id){
        this.preVersionId = id;
        this.getPreData();
      },
      getInitData(){
        //获得基本信息
        fetchUtils.post('/Supply/IGetStageId', {supplyVersionid: this.versionId})
          .then( res => {
            return res.rows && res.rows.stageId;
          }).then( stageId => {
            this.stageId = stageId;
            return fetchUtils.post('/SignAcontract/IGetSignAContractBaseInfo', {stageId})
          }).then( res => {
            this.versionId = res.rows.dynamicVersionId;
            this.versionData = res.rows.budgetVersions;
            this.titleInfo = res.rows.titles;
            if( res.rows.budgetVersions && res.rows.budgetVersions.length !== 0){
               this.versionData = res.rows.budgetVersions;
               this.preVersionId = res.rows.budgetVersions[0]['versionId'];
            }
            return fetchUtils.post('/SignAcontract/IGetSignAContractData', {stageId: this.stageId, signAContractVersionId: this.versionId});
          }).then( res => {
            this.activeData = res.rows;
          }).then( res => {
            if(this.versionData.length !== 0){
              this.getPreData();
            }
          }).catch( err => {
            message.error(err);
          });
      },
      getPreData(){
        const stageId = this.stageId;
        const signAContractVersionId = this.preVersionId;
        fetchUtils.post('/SignAcontract/IGetSignAContractData', {stageId, signAContractVersionId})
          .then( res => {
            this.preData = res.rows;
          });
      },
      isDeleteVersion(){
        //先判断此版本有没有被删除
        fetchUtils.post("/Common/IGetVersionInfoByID", {
          id: this.versionId
        }).then( res => {
          if( res.rows ){
            this.getInitData();
          }else{
            this.isDelete = true;
          }
        })
      }
    },
    components: {
      SignTable
    },
    created(){
      this.versionId = this.$route.query.dataKey;
      this.isDeleteVersion();
    }
  }
</script>

<style lang="less" rel="stylesheet/less" >
  .sign-upversion {
    height: 100%;
    margin-top: 20px;
  }
  .sign-upversion .del_container {
    font-size: 16px;
    text-align: center;
    color: #333;
    font-weight: normal;
    margin-top: 40px;
  }
  .sign-upversion .active-container h2 {
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
  .sign-upversion .input_style {
    input {
      border-radius: 5px;
      font-size: 12px;
      padding: 4px 0;
      padding-left: 4px;
    }
  }
  .sign-upversion .active-container .version {
    font-size: 12px;
    color: #409EFF;
  }
  .sign-upversion .active-container .sign-container {
    width: 98%;
    margin-top:10px;
  }
  .sign-upversion .active-container {
    margin-top: 20px;
  }
  .sign-upversion .active-container .dialog-title {
    width: 1000px;
  }
  .sign-upversion .active-container .span-title {
    display: inline-block;
    padding: 0 6px;
  }
  .sign-upversion .select-container {
    margin-bottom: 30px;
    & > label {
      margin-left: 20px;
    }
    & > label:first-child {
      margin-left: 0;
    }
  }
  .sign-upversion .dialog-container th .cell, .sign-upversion .active-container th .cell {
    color: #2c3e50 !important;
    line-height: 30px !important;
    font-size: 14px !important;
    font-weight: normal !important;
    white-space: normal;
    text-overflow: visible;
  }
  .sign-upversion .dialog-container td .cell {
    line-height: 24px !important;
  }
  .sign-upversion .dialog-container th {
    background: #f5f7fa
  }
  .sign-upversion .el-table  .no_expand td  {
    border-bottom: none !important;
  }
</style>
