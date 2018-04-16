<template>
  <div>
    <div class="indentity-title clear">
      <p class="fl" style="font-size: 14px;font-weight: bold">分期身份信息</p>
      <span class="fr" style="padding-right: 10px;">
       <!-- <span  style="cursor: pointer"><i class="el-icon-tickets"></i>保存</span>-->
       <el-button @click="fenqi" size="mini">分期</el-button>
        <el-button @click="saveInfo" size="mini">保存</el-button>
        <!-- <span><i class="el-icon-share"></i>发起审批</span>-->
        <el-button @click="seeList" size="mini"
                   :style="this.flage==true? 'display:inline-block': 'display:none'">编辑</el-button>
        <el-button @click="seeList" size="mini"
                   :style="this.flage==false? 'display:inline-block': 'display:none'">查看</el-button>
        <!--<span @click="seeList" style="cursor: pointer;padding: 0 5px">查看</span>-->
      </span>
    </div>
    <div class="clear">
      <div class="fl" style="width: calc(100% - 440px)">
        <!--分期身份信息-->
        <div class="identity">
          <StageIdentityInfo/>
        </div>
        <!--土地列表-->
        <div class="ground">
          <GroundfList/>
        </div>
        <!--规划指标-->
        <div class="program">
          <ProgramQuoto/>
        </div>
      </div>
      <div class="fr" style="width: 420px;overflow-x: hidden">
        <div class="clear">
          <div class="map-title">
            <el-row>
              <el-col :span="12">
                <div class="grid-content bg-purple">
                  <a href="javascript:;" class="el-icon-upload">上传分期图</a>
                </div>
              </el-col>
              <el-col :span="12">
                <div class="grid-content bg-purple-light">
                  <span>版本</span>
                  <el-select v-model="value" placeholder="请选择" size="small" class="version_width">
                    <el-option
                      v-for="item in options"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                  <span style="margin-left: 10px;">状态:待审中</span>
                </div>
              </el-col>
            </el-row>
          </div>
        </div>
        <div style="width: 100%;height:420px;border: 1px solid #f3f3f3;box-sizing:border-box;">
          <img :src="imgSrc" alt="" style="width: 100%;height: 100%;">
        </div>
        <!--<iframe src="" width="100%" height="100%;"></iframe>-->
      </div>
    </div>
    <div class="target">
      <StageTarget/>
    </div>
    <!--运营指标-->
    <div :style="this.flage==true? 'display:block': 'display:none'" id="operateBox">
      <p class="indentity-title">项目运营指标</p>
      <el-table :data="stageGetOperateData.data" border style="width: 100%" empty-text="暂无数据">
        <el-table-column v-for="title in stageGetOperateData.rowTitle" :prop="title.field" :key="title.field"
                         :label="title.name"
                         width="100">
        </el-table-column>
      </el-table>
    </div>
    <!--面积指标-->
    <div :style="this.flage==true? 'display:block': 'display:none'" id="areaQuotaBox">
      <p class="indentity-title">面积指标</p>
      <el-table :data="stageProjectAreaQuotaData.gridData" stripe border style="width: 100%" align="center">
        <div v-for="title in stageProjectAreaQuotaData.titleInfo" :key="title.name" class="tabTitle">
          <div v-if="title.name == '面积指标'">
            <el-table-column fixed="left" :prop="title.field" :label="title.name" width="150">
            </el-table-column>
          </div>
          <div v-else>
            <el-table-column v-if="!title.children" :prop="title.field" :label="title.name"
                             width="150"></el-table-column>
            <el-table-column :label="title.name" v-else>
              <el-table-column :prop="subTitle.field" :label="subTitle.name" :width="subTitle.width"
                               v-for="subTitle in title.children" :key="subTitle.name" width="200">

                <el-table-column :prop="thrTitle.field" :key="thrTitle.name" :label="thrTitle.name"
                                 v-for="thrTitle in subTitle.children"
                                 width="100">
                </el-table-column>
              </el-table-column>
            </el-table-column>
          </div>
        </div>
      </el-table>
    </div>
  </div>
</template>

<script>
  import {mapState, mapGetters, mapActions} from 'vuex';
  import {message} from '../../utils';
  import StageIdentityInfo from "./stage-identity-info.vue";
  import GroundList from "./ground-list.vue";
  import ProgramQuoto from "./program-quota.vue";
  import StageTarget from "./stage-target.vue";
  import Program from "./program.vue";

  export default {
    name: "Stage",
    data: function () {
      const {mode, nodeId} = this.$route.query;
      return {
        msg: "分期管理",
        showData: !!mode && mode.toLowerCase().trim() === "stage",//是否显示项目数据
        stageId: nodeId || "",//当前的项目id
        flage: !true,
        options: [
          {value: "01", label: "v_1"},
          {value: "02", label: "v_2"}
        ],
        value: "01",
        imgSrc: require("../../public/images/map.png")
      };
    },
    components: {
      StageIdentityInfo,
      GroundList,
      ProgramQuoto,
      StageTarget,
      Program,

    },
    //创建完成
    created: function () {
      this.initData();
      this.getProjectAreaQuota();
      this.getOperateData();
    },
    computed: {
      ... mapGetters([
        'stageProjectAreaQuotaData',
        "stageStageIdentityInfoData",
        "stageVLandListInfoData",
        "stageBtBuildUnitLisInfoData",
        "stageInvestmentCompanney",
        "stageProjectCompanney",
        "stageTargetContentData",
        "stageGetOperateData"
      ]),
    },
    methods: {
      fenqi () {
        this.$router.push('/stage/fenqi')
      },
      ...mapActions(['showList', 'stageInitData', "addStage", 'getProjectAreaQuota', "stageOperateData", "getOperateData"]),
      initData(){
        this.stageInitData({
          stageId: this.stageId
        })
      },
      saveInfo(){
        this.stageTargetContentData.forEach(function (item) {
          delete item.MANAGEMENTOBJECTIVES
        })
        this.addStage({
          stageInfo: {
            companyName: "no",
            vStageIdentityInfo: JSON.stringify(this.stageStageIdentityInfoData),
            landInfo: JSON.stringify(this.stageVLandListInfoData),
            buildUnit: JSON.stringify([this.stageBtBuildUnitLisInfoData]),
            projectTartData: JSON.stringify(this.stageTargetContentData),
            projectId: "649AEFA2B3DA9908E0506A27152A4416",
            projectVersionId: "3",
            stageVersionId: this.value
          },
        })
      },
      seeList(){
        this.flage = !this.flage
        this.showList(this.flage)
      }
    },
    watch: {
      "$route": function () {
        const {mode, nodeId} = this.$route.query;
        this.showData = !!mode && mode.toLowerCase().trim() === "stage";
        this.stageId = nodeId || "";
        this.initData();
      }
    }
  }
</script>

<style lang="less" rel="stylesheet/less" scoped>
  .indentity-title {
    width: 100%;
    height: 30px;
    line-height: 30px;
    background-color: #4CAAF4;
    color: #fff;
    text-align: left;
    padding-left: 20px;
    font-weight: 400;
    margin: 10px 0;
    box-sizing: border-box;
  }

  .identity, .ground, .program, .target {
    height: inherit;
    display: flex;
    margin-top: 10px;
  }

  .el-select {
    width: 35%;
  }

  .el-button {
    background: rgba(0, 0, 0, 0);
    color: #fff;
    border: none;
  }

  .map-title {
    text-align: left;
    font-size: 12px;
    margin-bottom: 10px;;
    .el-row {
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
</style>
