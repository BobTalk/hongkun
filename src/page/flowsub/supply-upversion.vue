<template>
  <div class="supply-upversion">
    <h2 v-if="isDelete" class="del_container">当前版本已被删除</h2>
    <div v-else>
      <div class="active-container">
        <h2>
          <span class="title">{{title1}}</span>
          <div class="button-cpntainer">
            <span style="margin-left: 5px;">
              <label class="version">当前版本:</label>
              <el-select :value="preVersionId" placeholder="请选择" class="input_style version_width" @change="changeVersion" id="select_input" style="width: 120px;height: 27px!important;">
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
        <div class="supply-container">
          <supply-table :initData="preData"></supply-table>
        </div> 
      </div>
      <div class="active-container">
        <h2>
          <span class="title">{{title2}}</span>
        </h2>
        <div class="supply-container">
          <supply-table :initData="activeData"></supply-table>  
        </div> 
      </div>
    </div>
  </div>
</template>

<script>
  import SupplyTable from '@/page/supply/supply-table'
  import { message, fetchUtils } from '@/utils'
  export default {
    name: "Supply",
    data: function () {
      return {
        title1: "预算版",
        title2: "动态实施版",
        
        activeData: {
          dataSource: [],
          headerData: []
        },
        preData: {
          dataSource: [],
          headerData: []
        },
        stageId: '',            //当前分期ID
        preVersionId: '',   //预算版当前的id
        versionId: '',      //当前动态实施版本的id
        versionData: [],    //当前预算版的所有版本
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
            // 用供货版本Id获取分期ID
            return res.rows && res.rows.stageId;
          }).then( stageId => {
            //用分期ID获取 基础信息
            this.stageId = stageId;
            return fetchUtils.post('/Supply/IGetSupplyBaseInfo', {stageId})    
          }).then( res => {
            //当预算版本有数据的时候
            if( res.rows.VersionList && res.rows.VersionList.length !== 0 ){
              this.versionData = Object.assign([], res.rows.VersionList);
              this.preVersionId = res.rows.VersionList[0].versionId;
              this.getPreData();
            }
            return fetchUtils.post('/Supply/IGetSupplyTreeDY', {stageId: this.stageId});
          }).then( res => {
            this.activeData = Object.assign({}, res.rows);
          }).catch( err => {
            message.error(err);
          });
      },
      getPreData(){
        const stageId = this.stageId;
        const supplyVersionid = this.preVersionId;
        fetchUtils.post('/Supply/IGetSupplyTreeYS', {stageId, supplyVersionid})
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
      SupplyTable
    },
    created(){
      this.versionId = this.$route.query.dataKey;
      this.isDeleteVersion();
    }
  }
</script>

<style lang="less" rel="stylesheet/less">
  .supply-upversion .del_container {
    font-size: 16px;
    text-align: center;
    color: #333;
    font-weight: normal;
    margin-top: 40px;
  }
 .supply-upversion {
    height: 100%;
    margin-top: 20px;
  }
  .supply-upversion .input_style {
    input {
      border-radius: 5px;
      font-size: 12px;
      padding: 4px 0;
      padding-left: 4px;
    }
  }
  .supply-upversion .el-input__inner {
    font-size: 14px;
  }
  .supply-upversion .active-container h2 {
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
  .supply-upversion .active-container .version {
    font-size: 12px;
    color: #409EFF;
  }
  .supply-upversion .active-container .supply-container {
    width: 98%;
    margin-top:10px;
  }
  .supply-upversion .active-container {
    margin-top: 20px;
  }
  .supply-upversion .active-container .dialog-title {
    width: 1000px;
  }
  .supply-upversion .active-container .span-title {
    display: inline-block;
    padding: 0 6px;
  }
  .supply-upversion .select-container {
    margin-bottom: 30px;
    & > label {
      margin-left: 20px;
    }
    & > label:first-child {
      margin-left: 0;
    }
  }
  .supply-upversion .dialog-container th .cell, .supply-upversion .active-container th .cell {
    color: #2c3e50 !important;
    line-height: 30px !important;
    font-size: 14px !important;
    font-weight: normal !important;
    white-space: normal;
    text-overflow: visible;
  }
  .supply-upversion .dialog-container td .cell {
    line-height: 24px !important;
  }
  .supply-upversion .dialog-container th {
    background: #f5f7fa
  }
  .supply-upversion .el-table  .no_expand td  {
    border-bottom: none !important;
  }
</style>