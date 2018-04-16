<template>
  <div style="width: 100%;" v-if="stageTargetContentData.length > 0" id="targetBox">
    <p class="target-title">项目经营目标</p>
    <div class="stageVLeft">
      <table class="stageVTable" border="1" cellspacing="1">
        <tbody>
        <tr>
          <td class="stageViewTitle" v-for="item in stageTargetTitleData">
            <el-input :disabled="true" v-model="item.name"></el-input>
          </td>
        </tr>
        <tr v-for="(targetInfo,index) in stageTargetContentData">
          <td class="stageViewTitle">
            <el-input :disabled="true" v-model="targetInfo.MANAGEMENTOBJECTIVES"></el-input>
          </td>
          <td class="stageViewCon">
            <el-input v-model="targetInfo.VOTINGMEETING" :disabled="showList" @change="targetEvent"></el-input>
          </td>
          <td class="stageViewCon">
            <el-input v-model="targetInfo.FIRSTYEARQUOTA" @change="targetEvent"
                      :disabled="showList ? true:(index == 0)"></el-input>
          </td>
          <td class="stageViewCon">
            <el-input v-model="targetInfo.LAUNCHMEETING" @change="targetEvent"
                      :disabled="showList ? true:(index == 0)"></el-input>
          </td>
          <td class="stageViewCon">
            <el-input v-model="targetInfo.SECONDYEARQUOTA" @change="targetEvent"
                      :disabled="showList ? true:(index == 0)"></el-input>
          </td>
          <td class="stageViewCon">
            <el-input v-model="targetInfo.THIRDYEARQUOTA" @change="targetEvent"
                      :disabled="showList ? true:(index == 0)"></el-input>
          </td>
          <td class="stageViewCon">
            <el-input v-model="targetInfo.OVERALLPOSTEVALUATION" @change="targetEvent"
                      :disabled="showList ? true:(index == 0)"></el-input>
          </td>
        </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
  import {mapState, mapGetters, mapActions} from 'vuex';
  export default{
    data(){
      return {}
    },
    computed: {...mapGetters(["stageTargetTitleData", "stageTargetContentData", "showList"])},
    methods: {
      targetEvent(){
        //console.info(JSON.stringify(this.stageTargetContentData, null, 2))
      }
    },
    components: {}
  }
</script>
<style lang="less" rel="stylesheet/less" scoped>
  #targetBox {
    .el-input.is-disabled .el-input__inner {
      width: auto;
    }
  }
  .target-title {
    line-height: 30px;
    vertical-align: middle;
    text-align: left;
    font-size: 14px;
    font-weight: bold;
    background: #4CAAF4;
    color: #fff;
    padding-left: 20px;
    margin-bottom:10px;
  }
</style>
