<template>
  <div>
    <div class="projectcon">
        <table class="projectVTable" border="1" cellspacing="1">
          <tbody>
          <tr>
            <td class="projectViewTitle" ><span class="required">*</span>项目名称</td>
            <td class="projectViewCon viewcon">
              <el-input
                v-if="projectInfoData.isedit==0"
                v-model="projectInfoData.projectName"
                id="el-input__inner"
                :disabled="true" :props="this.flage">
              </el-input>
              <el-input
                v-else
                v-model="projectInfoData.projectName"
                id="el-input__inner"
                :disabled="projectShow" :props="this.flage">
              </el-input>
            </td>
            <td class="projectViewTitle">开发方式</td>
            <td class="projectViewCon viewcon">
              <el-input
                :title=projectInfoData.developmentModel
                v-model="projectInfoData.developmentModel"
                :disabled="flage">
              </el-input>
            </td>
          </tr>
          <tr>
            <td class="projectViewTitle">项目编号</td>
            <td class="projectViewCon viewcon">
              <el-input
                v-model="projectInfoData.projectCode"
                :disabled="flage">
              </el-input>
            </td>
            <td class="projectViewTitle">投资公司名称</td>
            <td class="projectViewCon viewcon">
              <el-input
                :title="projectInfoData.investmentCompany"
                v-model="projectInfoData.investmentCompany"
                :disabled="flage">
              </el-input>
            </td>
          </tr>
          <tr>
            <td class="projectViewTitle">项目创建日期</td>
            <td class="projectViewCon viewcon right">
              <el-input
                v-model="projectInfoData.projectCreateDate"
                :disabled="flage">
              </el-input>
            </td>
            <td class="projectViewTitle">项目公司名称</td>
            <td class="projectViewCon viewcon">
              <el-input
                :title="projectInfoData.projectCompany"
                v-model="projectInfoData.projectCompany"
                :disabled="flage">
              </el-input>
            </td>
          </tr>
          <tr>
            <td class="projectViewTitle"><span class="required">*</span>项目位置</td>
            <td class="projectViewCon viewcon">
              <el-input
                v-if="projectInfoData.isedit==0"
                v-model="projectInfoData.projectLocation"
                :disabled="true">
              </el-input>
              <el-input
                v-else
                v-model="projectInfoData.projectLocation"
                :disabled="projectShow">
              </el-input>
            </td>
            <td class="projectViewTitle">公司权益比例(%)</td>
            <td class="projectViewCon viewcon right">
              <el-input
                :title="projectInfoData.companyProportion"
                v-model="projectInfoData.companyProportion"
                :disabled="flage">
              </el-input>
            </td>
          </tr>
          </tbody>
        </table>
    </div>
  </div>
</template>

<script>
  import {mapState, mapGetters, mapActions} from 'vuex';

  export default {
    data(){
      return {
        "target":"项目身份信息",
         flage:true
      }
    },
    mounted() {
    },
    computed: {
      ...mapGetters([
        'projectShow'
      ])
    },
    props:['projectInfoData'],
  }
</script>

<style lang="less" rel="stylesheet/less" scoped>
  table {
    border: 1px solid #ebeef5;
    thead tr th, tbody tr td {
       border: 1px solid #ebeef5;
    }
  }
  .projectVTable {
    width:100%;
    margin-top:20px;
    border:none;
    .projectViewTitle, .projectViewCon{
      height:30px;
      color: #676768;
      //border-color: #ebeef5 !important;
      text-align: left;
    }
    .projectViewTitle {
      background: #fbfdff;
      width:15%;
      padding-left:5px;
    }
  }
  .viewcon>div{
    padding:3px;
    width:98% !important;
    height:100% !important;
  }
  .right .el-input__inner{
    text-align: right;
  }
</style>
