<template>
  <div class="application-container">
    <h2 v-if="isDelete"  class="del_container">当前版本已被删除</h2>
    <div v-else>
      <project-info :projectInfoData="projectInfoData"/>
      <div class="projectbox">
          <ProjectQuota :projectQuotaData="projectQuotaData" :projectVersionId='projectVersionId' :approvalApplication="approvalApplication"></ProjectQuota>
      </div>
      <project-land :projectLand="projectLand"></project-land>
      <project-target :projectTargetTitle="projectTargetTitle"
                      :projectTargetData="projectTargetData"></project-target>
      <project-operate :projectRhythm="projectRhythm"></project-operate>
      <project-area :ProjectAreaQuotaData="ProjectAreaQuotaData"></project-area>
    </div>
  </div>
</template>

<script>
import { message, fetchUtils } from "../../utils";
import ProjectInfo from "../project/project-info";
import ProjectTarget from "../project/project-target";
import ProjectQuota from "../project/project-quota";
import ProjectOperate from "../project/project-operate";
import ProjectArea from "../project/project-area";
import ProjectLand from "../project/project-land";
import ProjectVersion from "../project/project-version";
export default {
  name: "Project",
  data: function() {
    return {
      projectVersionId: '', //$route.query.dataKey
      approvalApplication: true,
      projectTargetTitle: [], //project-target表头
      projectTargetData: [], //project-target内容
      projectVersionData: [],
      projectInfoData: {}, //项目信息数据
      projectQuotaData: {}, //规划指标初始数据
      ProjectAreaQuotaData: {
        gridData: [],
        titleInfo: []
      },
      projectRhythm: {
        data: [],
        rowTitle: []
      },
      projectLand: {
        landInfo: [],
        stageName: ""
      }, //土地列表数据
      isDelete: false
    };
  },
  components: {
    ProjectInfo,
    ProjectTarget,
    ProjectQuota,
    ProjectOperate,
    ProjectArea,
    ProjectVersion,
    ProjectLand
  },
  computed: {
    projectShow() {
      return this.$store.state.project.show;
    }
  },
  methods: {
    initData() {
      const projectVersionId = this.projectVersionId;
      const allPromise = [
        fetchUtils
          .post("/Project/GetProjectIdentityInfo", {
            projectVersionId
          })
          .then(res => res.rows),
        fetchUtils
          .post("/Project/IGetProjectPlanning", {
            projectVersionId
          })
          .then(res => res.rows),
        fetchUtils
          .post("/Project/IGetManagementObjectivesTitle", {
            projectVersionId
          })
          .then(res => res.rows),
        fetchUtils
          .post("/Project/IGetProjectTart", {
            projectVersionId
          })
          .then(res => res.rows),
        fetchUtils
          .post("/Project/IGetProjectAreaQuota", {
            projectVersionId
          })
          .then(res => res.rows),
        fetchUtils
          .post("/Project/IGetOperationalRhythm", {
            projectVersionId
          })
          .then(res => res.rows),
        fetchUtils
          .post("/Project/IGetLandInfo", {
            projectVersionId
          })
          .then(res => res.rows)
      ];

      fetchUtils
        .all(allPromise)
        .then(
          ([
            projectInfoData,
            projectQuotaData,
            projectTargetTitle,
            projectTargetData,
            ProjectAreaQuotaData,
            projectRhythm,
            projectLand
          ]) => {
            this.projectInfoData = projectInfoData;
            this.projectQuotaData = projectQuotaData;
            this.projectQuotaData.TOTALPARKSPACE = this.addTotalParkSpace(
              projectQuotaData.UPPARKSPACE,
              projectQuotaData.UNDERPARKSPACE
            );
            this.projectQuotaData.LANDGRANT = this.thousandTh(
              projectQuotaData.LANDGRANT
            );
            this.projectTargetTitle = projectTargetTitle;
            this.projectTargetData = this.transformTragetData(
              projectTargetData
            );
            this.projectRhythm = projectRhythm;
            this.projectLand = projectLand;
            if (ProjectAreaQuotaData.gridData.length === 0) {
              return this.ProjectAreaQuotaData = ProjectAreaQuotaData;
            }
            const tableData = ProjectAreaQuotaData.gridData;
            const tableTitle = ProjectAreaQuotaData.titleInfo;
            let titleArr = [];
            tableTitle.forEach(item => {
              if (item.children == null) {
                titleArr.push(item.field);
              } else {
                item.children.forEach(list => {
                  titleArr.push(list.field);
                });
              }
            });
            const _newData = [];
            tableData.forEach( list => {
              let obj = {};
              titleArr.forEach( (item, key) => {
                if( key === 0 ){
                  obj[item] = list["productName"];
                }else{
                  obj[item] = list["val"][key-1];
                }
              })
              _newData.push(obj);
            })
            //处理areaqutodata数据格式
            this.ProjectAreaQuotaData.titleInfo = tableTitle;
            this.ProjectAreaQuotaData.gridData = _newData;
          }
        ).catch(error => {
          console.log(error);
          //message.error(error);
        });
    },
    thousandTh(data) {
      //千分符转换
      if (data == null) return null;
      return String(data).replace(/(\d{1,3})(?=(\d{3})+$)/g, function($1) {
        return ($1 = $1 + ",");
      });
    },
    addTotalParkSpace(num1, num2) {
      //总车位计算
      if (num1 == null && num2 == null) return null;
      return (
        (num1 == null && +num2) || (num2 == null && +num1) || +num1 + +num2
      );
    },
    transformTragetData(data) {
      //装换目标数据
      return data.map((item, index) => {
        return this.sendTarget(item, index);
      });
    },
    sendTarget(data, index) {
      const toFixedType = [0, 1, 2, 7, 8]; //取一位小数
      const parseIntType = [6]; //取整数
      const thousandType = [3, 4]; //取整数
      const _that = this;
      if (toFixedType.indexOf(index) > -1) {
        return fonInData("toFixed", data);
      } else if (parseIntType.indexOf(index) > -1) {
        return fonInData("parseInt", data);
      } else if (thousandType.indexOf(index) > -1) {
        return fonInData("thousandType", data);
      } else {
        return data;
      }
      function fonInData(type, data) {
        const config = {
          toFixed: function(data) {
            return (Number(data) && Number(data).toFixed(1)) || 0; //亿元保留1位小数
          },
          parseInt: function(data) {
            return (data && parseInt(data)) || 0; //保留整数
          },
          thousandType: function(data) {
            data = (data && parseInt(data)) || 0; //保留整数
            if (!data) return 0;
            return _that.thousandTh(data);
          }
        };
        for (var key in data) {
          if (key !== "MANAGEMENTOBJECTIVES" && key !== "key") {
            data[key] = config[type](data[key]);
          }
        }
        return data;
      }
    },
    isDeleteVersion(){
      //先判断此版本有没有被删除
      fetchUtils.post("/Common/IGetVersionInfoByID", {
        id: this.projectVersionId
      }).then( res => {
        if( res.rows ){
          this.initData();
        }else{
          this.isDelete = true;
        }
      })
    }
  },
  created() {
    this.projectVersionId = this.$route.query.dataKey;
    this.isDeleteVersion();
  },
};
</script>

<style rel="stylesheet/css" scoped>
.del_container {
  font-size: 16px;
  text-align: center;
  color: #333;
  font-weight: normal;
  margin-top: 40px;
}
</style>
