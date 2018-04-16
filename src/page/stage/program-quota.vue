<template>
  <div id="programBox" v-if="stageStageIdentityInfoData != null">
    <p class="program-title">规划指标</p>
    <div class="stageVLeft">
      <table class="stageVTable" border="1" cellspacing="1">
        <tbody>
        <tr>
          <td class="stageViewTitle">
            <el-input :disabled="true" value="项目用地面积(㎡)"></el-input>
          </td>
          <td class="stageViewCon">
            <el-input v-model="stageStageIdentityInfoData.projectArea" @change="programEvent"
                      :disabled="showList" placeholder="请输入内容"></el-input>
          </td>
          <td class="stageViewTitle">
            <el-input :disabled="true" value="建筑面积(㎡)"></el-input>
          </td>
          <td class="stageViewCon">
            <el-input v-model="stageStageIdentityInfoData.buildArea" @change="programEvent"
                      :disabled="showList" placeholder="请输入内容"></el-input>
          </td>
        </tr>
        <tr>
          <td class="stageViewTitle">
            <el-input :disabled="true" value="土地出让金"></el-input>
          </td>
          <td class="stageViewCon">
            <el-input v-model="stageStageIdentityInfoData.landGrant" @change="programEvent"
                      :disabled="showList" placeholder="请输入内容"></el-input>
          </td>
          <td class="stageViewTitle">
            <el-input :disabled="true" value="容积率"></el-input>
          </td>
          <td class="stageViewCon">
            <el-input v-model="stageStageIdentityInfoData.plotratio" @change="programEvent"
                      :disabled="showList" placeholder="请输入内容"></el-input>
          </td>
        </tr>
        <tr>
          <td class="stageViewTitle">
            <el-input :disabled="true" value="绿地率"></el-input>
          </td>
          <td class="stageViewCon">
            <el-input v-model="stageStageIdentityInfoData.greenRate" @change="programEvent"
                      :disabled="showList" placeholder="请输入内容"></el-input>
          </td>
          <td class="stageViewTitle">
            <el-input :disabled="true" value="建筑密度"></el-input>
          </td>
          <td class="stageViewCon">
            <el-input v-model="stageStageIdentityInfoData.buildDensity" @change="programEvent"
                      :disabled="showList" placeholder="请输入内容"></el-input>
          </td>
        </tr>
        <tr>
          <td class="stageViewTitle">
            <el-input :disabled="true" value="住户总数"></el-input>
          </td>
          <td class="stageViewCon">
            <el-input v-model="stageStageIdentityInfoData.houseNum" :disabled="showList" placeholder="请输入内容"></el-input>
          </td>
          <td class="stageViewTitle">
            <el-input :disabled="true" value="建筑限高(m)"></el-input>
          </td>
          <td class="stageViewCon">
            <el-input v-model="stageStageIdentityInfoData.buildLimit" @change="programEvent"
                      :disabled="showList" placeholder="请输入内容"></el-input>
          </td>
        </tr>
        <tr>
          <td class="stageViewTitle">
            <el-input :disabled="true" value="人防面积(㎡)"></el-input>
          </td>
          <td class="stageViewCon">
            <el-input v-model="stageStageIdentityInfoData.defenceArea" @change="programEvent"
                      :disabled="showList" placeholder="请输入内容"></el-input>
          </td>
          <td class="stageViewTitle">
            <el-input :disabled="true" value="公共设施配套面积"></el-input>
          </td>
          <td class="stageViewCon">
            <el-input v-model="stageStageIdentityInfoData.publiceArea" @change="programEvent"
                      :disabled="showList" placeholder="请输入内容"></el-input>
          </td>
        </tr>
        <tr>
          <td class="stageViewTitle">
            <el-input :disabled="true" value="停车位配比"></el-input>
          </td>
          <td class="stageViewCon">
            <el-input v-model="stageStageIdentityInfoData.parkRatio" @change="programEvent"
                      :disabled="showList" placeholder="请输入内容"></el-input>
          </td>
          <td class="stageViewTitle">
            <el-input :disabled="true" value="车位数(个)"></el-input>
          </td>
          <td class="stageViewCon">
            <el-input type="text" v-model="carSum" :disabled="showList" :readonly="true" placeholder="请输入内容"></el-input>
          </td>
        </tr>
        <tr>
          <td class="stageViewTitle">
            <el-input :disabled="true" value="地上车位(个)"></el-input>
          </td>
          <td class="stageViewCon">
            <el-input v-model="stageStageIdentityInfoData.upParkSpace" @change="programEvent"
                      :disabled="showList" placeholder="请输入内容"></el-input>
          </td>
          <td class="stageViewTitle">
            <el-input :disabled="true" value="地下车位(个)"></el-input>
          </td>
          <td class="stageViewCon">
            <el-input v-model="stageStageIdentityInfoData.underParkSpace" @change="programEvent"
                      :disabled="showList" placeholder="请输入内容"></el-input>
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
      return {
        carSum: ""
      }
    },
    mounted(){
    },
    updated(){
      if(this.stageStageIdentityInfoData != null){
        let carUp = this.stageStageIdentityInfoData.upParkSpace;
        let carDown = this.stageStageIdentityInfoData.underParkSpace;
        this.carSum = Number(carUp) + Number(carDown);
      }

    },
    computed: {
      ...mapGetters(["stageStageIdentityInfoData", "showList"]),
    },
    methods: {
      programEvent(){
//        console.info(JSON.stringify(this.stageStageIdentityInfoData, null, 2))
      }
    },
    components: {}
  }
</script>
<style lang="less" rel="stylesheet/less" scoped>
  .program-title {
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
