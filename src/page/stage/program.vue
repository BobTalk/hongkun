<template>
  <div>
    <div>
      <p class="indentity-title">规划指标</p>
    </div>
    <div class="stageVLeft">
      <ul class="clear">
        <li class="stageViewTitle fl">
          <span>
            <el-input :disabled="true" value="项目用地面积(㎡)"></el-input>
            </span>
          <el-input v-model="stageStageIdentityInfoData.projectArea" @change="programEvent"
                    placeholder="请输入内容"></el-input>
        </li>
        <li class="stageViewTitle fl">
          <span>建筑面积(㎡)</span>
          <el-input v-model="stageStageIdentityInfoData.buildArea" @change="programEvent"
                    :disabled="showList" placeholder="请输入内容"></el-input>
        </li>

        <li class="stageViewTitle fl"><span>土地出让金</span>
          <el-input v-model="stageStageIdentityInfoData.landGrant" @change="programEvent"
                    :disabled="showList" placeholder="请输入内容"></el-input>
        </li>
        <li class="stageViewTitle fl"><span>容积率</span>
          <el-input v-model="stageStageIdentityInfoData.plotratio" @change="programEvent"
                    placeholder="请输入内容"></el-input>
        </li>
        <li class="stageViewTitle fl"><span>绿地率</span>
          <el-input v-model="stageStageIdentityInfoData.greenRate" @change="programEvent"
                    :disabled="showList" placeholder="请输入内容"></el-input>
        </li>
        <li class="stageViewTitle fl"><span>建筑密度</span>
          <el-input v-model="stageStageIdentityInfoData.buildDensity" @change="programEvent"
                    :disabled="showList" placeholder="请输入内容"></el-input>
        </li>
        <li class="stageViewTitle"><span>住户总数</span>
          <el-input v-model="stageStageIdentityInfoData.houseNum" :disabled="showList" placeholder="请输入内容"></el-input>
        </li>
        <li class="stageViewTitle fl"><span>建筑限高(m)</span>
          <el-input v-model="stageStageIdentityInfoData.buildLimit" @change="programEvent"
                    :disabled="showList" placeholder="请输入内容"></el-input>
        </li>
        <li class="stageViewTitle fl"><span>人防面积(㎡)</span>
          <el-input v-model="stageStageIdentityInfoData.defenceArea" @change="programEvent"
                    :disabled="showList" placeholder="请输入内容"></el-input>
        </li>
        <li class="stageViewTitle fl"><span>公共设施配套面积</span>
          <el-input v-model="stageStageIdentityInfoData.publiceArea" @change="programEvent"
                    :disabled="showList" placeholder="请输入内容"></el-input>
        </li>
        <li class="stageViewTitle fl">
          <span>停车位配比</span>
          <el-input v-model="stageStageIdentityInfoData.parkRatio" :disabled="showList" @change="programEvent"
                    placeholder="请输入内容"></el-input>
        </li>
        <li class="stageViewTitle fl">
          <span>车位数(个)</span>
          <el-input type="text" v-model="carSum" :readonly="true" placeholder="请输入内容"></el-input>
        </li>
        <li class="stageViewTitle fl">
          <span>地上车位(个)</span>
          <el-input v-model="stageStageIdentityInfoData.upParkSpace" @change="programEvent"
                    :disabled="showList" placeholder="请输入内容"></el-input>
        </li>
        <li class="stageViewTitle fl">
          <span>地下车位(个)</span>
          <el-input v-model="stageStageIdentityInfoData.underParkSpace" @change="programEvent"
                    :disabled="showList" placeholder="请输入内容"></el-input>
        </li>
      </ul>
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
      let carUp = this.stageStageIdentityInfoData.upParkSpace;
      let carDown = this.stageStageIdentityInfoData.underParkSpace;
      this.carSum = Number(carUp) + Number(carDown);
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
  .indentity-title {
    text-align: left;
    line-height: 30px;
    color: #fff;
    background-color: #4CAAF4;
    .stageViewTitle {

    }
  }

  .el-input {
    float: right;
    width: 50%;
  }
</style>
