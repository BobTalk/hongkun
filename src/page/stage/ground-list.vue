<template>
  <div style="width: 100%" v-if="stageVLandListInfoData.length>0">
    <div class="ground-box">
      <span>土地列表</span>
      <span class="fr" id="groundButton">
        <i class="el-icon-plus" @click="addGround"></i>
        <i class="el-icon-delete" @click="removeGround"></i>
        <!-- <WrapperButton type="icon" size="mini" icon="el-icon-plus" @click="addGround"/>
         <WrapperButton type="icon" size="mini" icon="el-icon-delete" @click="removeGround"/>-->
      </span>
    </div>
    <div ref="child">
      <div v-for="(item,index) in stageVLandListInfoData" :key="index">
        <GroundTemp :groundId="index" :item="item" @listenDataChange="listenData"/>
      </div>
    </div>
  </div>
</template>

<script>
  import {InforGather, WrapperButton} from "../../components"
  import GroundTemp from "./ground-temp.vue"
  import {mapState, mapGetters, mapActions} from 'vuex';
  export default{
    data(){
      return {
        /*土地获取日期*/
        getGroundTime: "",
        /*土地证起始日期*/
        getStartTime: "",
        /*规划用途*/
        groundLimit: [],
        /*土地年限*/
        groundTime: [],
        groundListData: {},
        groundTempIndex: 0,
        groundData: {},
        groundTempDate: {},
      }
    },
    computed: {
      ... mapGetters(["stageVLandListInfoData"]),
    },
    methods: {
      addGround(){
        this.groundTempIndex += 1;
        this.groundData[this.groundTempIndex] = {},
          /*暂时 需要修改成mapAction*/
          this.$store.state.stage.stageInfo.vLandList.push({})
      },
      removeGround(){
        /*暂时 需要修改成mapAction*/
        this.$store.state.stage.stageInfo.vLandList.pop({})
      },
      /*子组件传回来的参数*/
      listenData(data){
        this.groundTempDate = data;
      },
    },
    components: {
      WrapperButton,
      GroundTemp
    }
  }
</script>
<style lang="less" rel="stylesheet/less" scoped>
  .ground-box {
    line-height: 30px;
    vertical-align: middle;
    text-align: left;
    font-size: 14px;
    font-weight: bold;
    background: #4CAAF4;
    color: #fff;
    padding-left: 20px;
  }

  .el-icon-plus, .el-icon-delete {
    cursor: pointer;
    font-weight: bold;
    padding: 0 5px;
  }

  #groundButton {
    font-size: 16px;
    margin-right: 20px;
  }
</style>
