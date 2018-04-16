<template>
  <div>
    <Title :title="title"></Title>
    <div class="projectbox" v-if="stageIdentityInfo.vStageIdentityInfo">
      <div class="projectleft" id="quotabox">
        <table class="projectVTable" border="1" cellspacing="1">
          <tbody>
          <tr>
            <td class="projectViewTitle">项目用地面积(m²)</td>
            <td class="projectViewCon viewcon">
              <el-input
                :value="stageIdentityInfo.vStageIdentityInfo.projectArea"
                disabled>
              </el-input>
            </td>
            <td class="projectViewTitle">建筑面积(m²)</td>
            <td class="projectViewCon viewcon">
              <el-input
                :value="stageIdentityInfo.vStageIdentityInfo.buildArea"
                disabled>
              </el-input>
            </td>
          </tr>
          <tr>
            <td class="projectViewTitle">土地出让金(万元)</td>
            <td class="projectViewCon viewcon">
              <el-input
                :value="stageIdentityInfo.vStageIdentityInfo.landGrant"
                disabled>
              </el-input>
            </td>
            <td class="projectViewTitle">容积率</td>
            <td class="projectViewCon viewcon">
              <el-input
                :value="stageIdentityInfo.vStageIdentityInfo.plotratio"
                disabled>
              </el-input>
            </td>
          </tr>
          <tr>
            <td class="projectViewTitle">绿地率(%)</td>
            <td class="projectViewCon viewcon">
              <el-input
                :value="stageIdentityInfo.vStageIdentityInfo.greenRate"
                disabled>
                <b slot="suffix" class="hundred">%</b>
              </el-input>
            </td>
            <td class="projectViewTitle">建筑密度</td>
            <td class="projectViewCon viewcon">
              <el-input
                :value="stageIdentityInfo.vStageIdentityInfo.buildDensity"
                disabled>
              </el-input>
            </td>
          </tr>
          <tr>
            <td class="projectViewTitle">住户总数(户)</td>
            <td class="projectViewCon viewcon">
              <el-input
                :value="stageIdentityInfo.vStageIdentityInfo.houseNum"
                disabled>
              </el-input>
            </td>
            <td class="projectViewTitle">建筑限高(m)</td>
            <td class="projectViewCon viewcon">
              <el-input
                :value="stageIdentityInfo.vStageIdentityInfo.buildLimit"
                disabled>
              </el-input>
            </td>
          </tr>
          <tr>
            <td class="projectViewTitle">人防面积(m²)</td>
            <td class="projectViewCon viewcon">
              <el-input
                :value="stageIdentityInfo.vStageIdentityInfo.defenceArea"
                disabled>
              </el-input>
            </td>
            <td class="projectViewTitle">公共设施配套面积(m²)</td>
            <td class="projectViewCon viewcon">
              <el-input
                :value="stageIdentityInfo.vStageIdentityInfo.publiceArea"
                disabled>
              </el-input>
            </td>
          </tr>
          <tr>
            <td class="projectViewTitle">停车位配比</td>
            <td class="projectViewCon viewcon">
              <el-input
                :value="stageIdentityInfo.vStageIdentityInfo.parkRatio"
                disabled>
              </el-input>
            </td>
            <td class="projectViewTitle">车位数(个)</td>
            <td class="projectViewCon viewcon">
              <el-input
                :value="totalPark"
                disabled>
              </el-input>
            </td>
          </tr>
          <tr>
            <td class="projectViewTitle">地上车位(个)</td>
            <td class="projectViewCon viewcon">
              <el-input
                :value="stageIdentityInfo.vStageIdentityInfo.upParkSpace"
                disabled>
              </el-input>
            </td>
            <td class="projectViewTitle">地下车位(个)</td>
            <td class="projectViewCon viewcon">
              <el-input
                :value="stageIdentityInfo.vStageIdentityInfo.underParkSpace"
                disabled>
              </el-input>
            </td>
          </tr>
          </tbody>
        </table>
      </div>
      <!-- <div class="projectright" element-loading-background="rgba(0, 0, 0, 0.8)">
        <Images :iframeUrl="commonStageIframeUrl"></Images>
      </div> -->
      <div class="projectright" v-loading="commonIframeLoading" element-loading-background="#fff">
        <Images 
          v-if="commonIframeHasPicture"        
          :iframeUrl="commonStageIframeUrl">
        </Images>
        <div v-else class="img_container">
          <img :src="commonStageIframeUrl" alt="">
        </div>
      </div>      
    </div>
  </div>
</template>

<script>
  import {message} from '@/utils';
  import {mapGetters} from 'vuex';
  import iframeUrl from "@/config/app-config"
  import Images from './images.vue'
  import Title from '../title.vue'
    export default {
      name: "project-quota",
      data(){
          return {
            title:'土地规划指标',
            totalParkPlace: "",
            iframeUrl: "",
            noPic: require("@/public/images/nopic.gif")
          }
      },
      computed: mapGetters([
        'commonStageIframeUrl',
        'commonIframeLoading',
        'commonIframeHasPicture'
      ]),
      components:{
        Title,
        Images
      },
      props: ['stageIdentityInfo', 'stageVersionId', 'totalPark'],
      created(){
        this.$store.commit('SET_IFRAME_URL', {typeinfo: 2, versionId: this.stageVersionId});
      }
    }
</script>

<style lang="less" rel="stylesheet/less" scoped>
  h2{
    width: 100%;
    height: 30px;
    background: inherit;
    border-bottom:2px solid #F9F9F9;
    margin-top: 15px;
    text-align: left;
    line-height: 30px;
    display: flex;
    justify-content: space-between;
    font-size:15px;
    span{
      margin:0px 30px 0 0;
    }
    .general{
      display: inline-block;
      width:80px;
      height:25px;
      line-height: 25px;
      text-align: center;
      border:1px solid #4caaf4;
      cursor: pointer;
      color:#4caaf4;
      border-radius:3px;
      font-size:13px;
      font-weight: 300;
      margin-right:40px;
    }
    .title{
      border-bottom:2px solid #4CAAF4;
      width:100px;
      display:block;
      text-align: center;
    }
  }
  .hundred{
    line-height: 30px;
  }
  .shrink{
    width:25px;
    height: 25px;
    border-radius:50%;
    border: 1px solid #4caaf4;
    text-align: center;
    line-height:25px;
    color:#4caaf4;
  }
  .projectbox {
    div{
      width:98%;
    }
    display: flex;
    .projectleft{
      width:50%;
    }
    .projectright {
      min-height: 370px;
      margin-left:20px;
      width: 50%;
    }
  }
  .projectVTable {
    width:100%;
    margin-top:20px;
    border:none;
    .projectViewTitle, .projectViewCon{
      height: 30px;
      color: #676768;
      border-color: #f4f6f9;
      text-align:left;
    }
    .projectViewTitle {
      padding-left:4px;
      background: #fbfdff;
      width:27%;
    }
  }
  .viewcon>div{
    padding:3px;
    width:96%!important;
    height:100%!IMPORTANT;
  }
  .img_container {
    margin-top: 20px;
    margin-right: 10px;
    border: 1px solid #c0c4cc;
    height: 350px;
    &>img {
      display: block;
      width: 230px;
      margin: 70px auto 0;
    }    
  }
</style>
