<template>
  <div>
    <Title :title="title"></Title>
    <div class="projectVLeft" id="targetbox" v-if="stageProjectTart.length!==0">
      <table class="projectVTable" border="1" cellspacing="1">
        <tbody>
        <tr>
          <td class="projectViewTitle" v-for="(item, key) in mTitle" :key="key+'title'">
            {{item.name}}
          </td>
        </tr>
        <tr v-for="(targetinfo,index) in stageProjectTart" :key="index+'data'">
          <td class="projectViewTitle" style="white-space:nowrap;text-align:left;padding-left:5px">{{targetinfo.MANAGEMENTOBJECTIVES}}
          </td>
          <td class="projectViewCon viewcon">
            <div v-if="index == 5">
              <el-date-picker
                :value="targetinfo.VOTINGMEETING"
                type="month"
                disabled
                value-format="yyyy-MM"
                placeholder="选择月">
              </el-date-picker>
            </div>
            <div v-else>
              <el-input
                :value="targetinfo.VOTINGMEETING"
                disabled>
                <i slot="suffix">{{index | suffixFilter}}</i>
              </el-input>
            </div>

          </td>
          <td class="projectViewCon viewcon">
            <div v-if="index == 5">
              <el-date-picker
                :value="targetinfo.FIRSTYEARQUOTA"
                type="month"
                disabled
                value-format="yyyy-MM"
                placeholder="选择月">
              </el-date-picker>
            </div>
            <div v-else>
              <el-input
                :value="targetinfo.FIRSTYEARQUOTA"
                disabled>
                <i slot="suffix">{{index | suffixFilter}}</i>
              </el-input>
            </div>

          </td>
          <td class="projectViewCon viewcon">
            <div v-if="index == 5">
              <el-date-picker
                :value="targetinfo.LAUNCHMEETING"
                type="month"
                disabled
                value-format="yyyy-MM"
                placeholder="选择月">
              </el-date-picker>
            </div>
            <div v-else>
              <el-input
                :value="targetinfo.LAUNCHMEETING"
                disabled>
                <i slot="suffix">{{index | suffixFilter}}</i>
              </el-input>
            </div>

          </td>
          <td class="projectViewCon viewcon">
            <div v-if="index == 5">
              <el-date-picker
                :value="targetinfo.SECONDYEARQUOTA"
                type="month"
                disabled
                value-format="yyyy-MM"
                placeholder="选择月">
              </el-date-picker>
            </div>
            <div v-else>
              <el-input
                :value="targetinfo.SECONDYEARQUOTA"
                disabled>
                <i slot="suffix">{{index | suffixFilter}}</i>
              </el-input>
            </div>

          </td>
          <td class="projectViewCon viewcon">
            <div v-if="index == 5">
              <el-date-picker
                :value="targetinfo.THIRDYEARQUOTA"
                type="month"
                disabled
                value-format="yyyy-MM"
                placeholder="选择月">
              </el-date-picker>
            </div>
            <div v-else>
              <el-input
                :value="targetinfo.THIRDYEARQUOTA"
                disabled>
                <i slot="suffix">{{index | suffixFilter}}</i>
              </el-input>
            </div>

          </td>
          <td class="projectViewCon viewcon">
            <div v-if="index == 5">
              <el-date-picker
                :value="targetinfo.OVERALLPOSTEVALUATION"
                type="month"
                disabled
                value-format="yyyy-MM"
                placeholder="选择月">
              </el-date-picker>
            </div>
            <div v-else>
              <el-input
                :value="targetinfo.OVERALLPOSTEVALUATION"
                disabled>
                <i slot="suffix">{{index | suffixFilter}}</i>
              </el-input>
            </div>
          </td>
        </tr>
        </tbody>
      </table>
    </div>
    <div v-else class="nodata">
      暂无数据
    </div>
  </div>
</template>

<script>
  import Title from '../title.vue'
  export default {
    name: 'project-target',
    data() {
      return {
        title: '项目经营目标',
      }
    },
    props:['mTitle','stageProjectTart'],
    filters: {
      suffixFilter(val){
        const suffixConfig = {
          '1': '%',
          '2': '%',
          '8': '%'
        }
        return suffixConfig[val];
      }
    },
    components: {
      Title
    }
  }
</script>

<style lang="less" rel="stylesheet/less" scoped>
  h2{
    width: 98%;
    height: 30px;
    background: inherit;
    border-bottom:2px solid #F9F9F9;
    margin-top: 10px;
    text-align: left;
    line-height: 30px;
    display: flex;
    justify-content: space-between;
    font-size:15px;
    .title{
      border-bottom:2px solid dodgerblue;
      width:100px;
      display:block;
      text-align: center;
    }
  }
  .shrink{
    width:25px;
    height: 25px;
    border-radius:50%;
    border: 1px solid #4caaf4;
    text-align: center;
    line-height:25px;
    color:#4caaf4;
    margin-right:40px;
  }
  .projectVTable {
    width:95%;
    margin-top:20px;
    border:none;
    .projectViewTitle, .projectViewCon{
      height: 30px;
      color: #676768;
      border-color: #f4f6f9;
      text-align: center;
      div{
      }
    }
    .projectViewTitle {
      background: #fbfdff;
    }
  }
  .viewcon>div{
    padding:3px;
    width:96%!important;
    height:100%!IMPORTANT;
    /*div{*/
      /*height:95%!IMPORTANT;*/
    /*}*/
  }
  i {
    font-style: normal;
    /*padding-left: 4px;*/
    line-height: 24px;
  }
  .nodata{
    text-align: center;
  }
</style>
