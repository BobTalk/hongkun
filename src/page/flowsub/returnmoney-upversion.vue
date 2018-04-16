<template>
  <div class="return-money">
    <h2 v-if="isDelete" class="del_container">当前版本已被删除</h2>
    <div v-else>
      <div class="data-container">
        <h2>
          <span class="title">{{title1}}</span>
          <div class="button-container" v-if="versionData.length !== 0">
            <span style="margin-left: 5px;">
              <label class="version">当前版本:</label>
              <el-select :value="preVersionId" placeholder="请选择" class="input_style version_width" @change="changeVersion" id="select_input" style="width: 120px;height: 27px!important;">
                <el-option
                  style="height: 30px"
                  v-for="item in versionData"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
            </span>
          </div>
        </h2>
        <div class="table-container">
          <el-table :data="preData.incomeDataList" max-height="300" stripe border style="width: 100%" align="center">
            <el-table-column
              v-for="(title,index) in preData.titleInfo"
              :fixed="index===0"
              :key="'re1'+index"
              :label="title.name"
              :prop="title.field"
              width="150"
              >
            </el-table-column>
          </el-table>      
        </div>
      </div>
      <div class="data-container">
        <Title :title="title2"></Title>
        <div class="table-container">
          <el-table :data="activeData.incomeDataList" max-height="300" stripe border style="width: 100%" align="center">
            <el-table-column
              v-for="(title,index) in activeData.titleInfo"
              :fixed="index===0"
              :key="'re2'+index"
              :label="title.name"
              :prop="title.field"
              width="150"
              >
            </el-table-column>
          </el-table> 
        </div>
      </div>  
    </div> 
  </div>
</template>

<script>
import Title from './public-component/title'
import { fetchUtils } from '@/utils' 
export default {
  data(){
    return {
      title1: '预算版',
      title2: '动态实施版本',
      preData: [],
      activeData: [],
      versionData: [],
      preVersionId: '',
      activeVersionId: '',
      stageId: '',
      isDelete: false
    }
  },
  methods: {
    initData(){
      const versionId = this.activeVersionId;
      fetchUtils.post('/Income/IGetIncomeEditList', {versionId})
        .then( res => {
          this.activeData = Object.assign({}, res.rows);
          this.stageId = res.rows['incomeDataList'][0]['stageId'];
        }).then( res => {
          return fetchUtils.post('/Income/IGetVersionList', {stageId: this.stageId});
        }).then( res => {
          //获取版本列表
          this.versionData = res.rows.versionList;
          this.preVersionId = res.rows.versionList[0]['id'];
          this.getPreVersionData();
        }).catch( err => {
          console.log(err);
        })
    },
    isDeleteVersion(){
      //先判断此版本有没有被删除
      fetchUtils.post("/Common/IGetVersionInfoByID", {
        id: this.activeVersionId
      }).then( res => {
        if( res.rows ){
          this.initData();
        }else{
          this.isDelete = true;
        }
      })
    },
    changeVersion(id){
      this.preVersionId = id
      this.getPreVersionData();
    },
    getPreVersionData(){
      fetchUtils.post('/Income/IGetIncomeList', {versionId: this.preVersionId, stageId: this.stageId})
        .then( res => {
          this.preData = res.rows;
        })
    }    
  },
  components: {
    Title
  },
  created(){
    this.activeVersionId = this.$route.query.dataKey;
    this.isDeleteVersion();
  }
}
</script>

<style rel="stylesheet/less" lang="less">
  .return-money .table-container{ 
    padding-top: 20px;
  }
  .return-money .del_container {
    font-size: 16px;
    text-align: center;
    color: #333;
    font-weight: normal;
    margin-top: 40px;
}
.return-money .data-container h2 {
  height: 30px;
  background: inherit;
  border-bottom: 2px solid #f9f9f9;
  text-align: left;
  line-height: 30px;
  display: flex;
  justify-content: space-between;
  font-size: 15px;
  font-weight: normal;
  .title {
    border-bottom: 2px solid dodgerblue;
    display: block;
    text-align: center;
  }
}
.return-money .button-container label {
  color: #409EFF;
  font-size: 12px;
}
.return-money .el-input input {
  border-radius: 5px;
}
</style>

