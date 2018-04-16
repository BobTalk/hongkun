<template>
  <div>
    <Title :title="title"></Title>
    <div class="projectcon">
        <table class="projectVTable" border="1" cellspacing="1">
          <tbody>
          <tr>
            <td class="projectViewTitle" >分期名称</td>
            <td class="projectViewCon viewcon">
              <el-input
                :value="stageIdentityInfo.vStageIdentityInfo.stageName"
                disabled>
              </el-input>
            </td>
            <td class="projectViewTitle">分期编号</td>
            <td class="projectViewCon viewcon">
              <el-input
                :value="stageIdentityInfo.vStageIdentityInfo.stageCode"
                disabled>
              </el-input>
            </td>
          </tr>
          <tr>
            <td class="projectViewTitle">分期建立日期</td>
            <td class="projectViewCon viewcon">
              <el-input
                :value="stageIdentityInfo.vStageIdentityInfo.stageCreateDate"
                disabled>
              </el-input>
            </td>
            <td class="projectViewTitle">分期项目负责人</td>
            <td class="projectViewCon viewcon">
              <el-input
                :value="stageIdentityInfo.vStageIdentityInfo.principal"
                disabled>
              </el-input>
            </td>
          </tr>
          <tr>
            <td class="projectViewTitle">开发方式</td>
            <td class="projectViewCon viewcon">
              <el-input
                v-model="stageIdentityInfo.vStageIdentityInfo.developmentModel"
                disabled>
              </el-input>
            </td>
            <td class="projectViewTitle">公司权益比例（%）</td>
            <td class="projectViewCon viewcon">
              <el-input
                :value="stageIdentityInfo.vStageIdentityInfo.companyProportion"
                disabled>
                <b slot="suffix" class="hundred">%</b>
              </el-input>
            </td>
          </tr>
          <tr>
            <td class="projectViewTitle">投资公司名称</td>
            <td class="projectViewCon viewcon">
              <el-input
                v-model="stageIdentityInfo.investCompanyName"
                disabled>
              </el-input>
            </td>
            <td class="projectViewTitle">施工总承包单位</td>
            <td class="projectViewCon viewcon">
              <el-input
                :value="stageIdentityInfo.projectBuildUnit"
                disabled>
              </el-input>
            </td>
          </tr>
          <tr>
            <td class="projectViewTitle">项目公司名称</td>
            <td class="projectViewCon viewcon">
              <el-input
                :value="stageIdentityInfo.vStageIdentityInfo.projectCompanyName"
                disabled>
              </el-input>
            </td>
          </tr>
          </tbody>
        </table>
    </div>
  </div>
</template>

<script>
import Title from '../title.vue'
export default {
  data(){
    return {
      title: '分期信息'
    }
  },
  props:['stageIdentityInfo'],
  components: {
    Title
  }
}
</script>
<style lang="less" rel="stylesheet/less" scoped>
  .projectVTable {
    width:95%;
    margin-top:20px;
    border:none;
    .projectViewTitle, .projectViewCon{
      height:30px;
      color: #676768;
      border-color: #f4f6f9;
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
    width:98%!important;
    height:100%!IMPORTANT;
  }
  .right .el-input__inner{
    text-align: right;
  }
  .hundred{
    line-height: 30px;
  }
</style>
