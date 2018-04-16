<template>
  <div class="collagen">
    <div class="projectcont">
      <h1 class="projecttop">
        <project-version
          @changeVersion="childChangeVersion"
          :projectVersionData="projectVersionData"
          :projectVersionId="projectVersionId"
          :projectStausName="projectStausName">
        </project-version>
      </h1>

      <h2>
        <span class="title">项目身份信息</span>
        <span>
            <span @click="saveNewProject" v-if="!projectShow && commonPathRoleAuthority.indexOf('btn_edit') > -1"><i class="el-icon-tickets"></i>{{ versionStatus === '99' ? '升版' : '保存'}}</span>
            <span @click="startApproval" v-if="versionStatus !='99' && versionStatus !='1' && commonPathRoleAuthority.indexOf('btn_approval') > -1"><i class="el-icon-share"></i>发起审批</span>
        </span>
      </h2>
      <project-info :projectInfoData="projectInfoData"/>
      <div class="projectbox">
        <ProjectQuota
          :projectQuotaData="projectQuotaData"
          :projectVersionId='projectVersionId'>
        </ProjectQuota>
      </div>
      <project-land
        :projectLand="projectLand"
        v-if="projectShow">
      </project-land>
      <project-target
        :projectTargetTitle="projectTargetTitle"
        :projectTargetData.sync="projectTargetData">
      </project-target>
      <project-operate
        :projectRhythm="projectRhythm"
        v-if="projectShow">
      </project-operate>
      <project-area
        :ProjectAreaQuotaData="ProjectAreaQuotaData"
        v-if="projectShow">
      </project-area>
    </div>
  </div>
</template>

<script>
  import {message, fetchUtils} from '../../utils';
  import ProjectInfo from './project-info'
  import ProjectTarget from './project-target'
  import ProjectQuota from './project-quota'
  import ProjectOperate from './project-operate'
  import ProjectArea from './project-area'
  import ProjectLand from './project-land'
  import ProjectVersion from './project-version'
  import iframeUrl from "../../config/app-config"
  import './project.less'
  export default {
    name: "Project",
    data: function () {
      return {
        projectId: "",//当前的项目id
        projectVersionId: '',
        projectTargetTitle: [],   //project-target表头
        projectTargetData: [],     //project-target内容
        projectVersionData: [],
        projectInfoData: {},         //项目信息数据
        projectQuotaData: {},       //规划指标初始数据
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
          stageName: ''
        },        //土地列表数据
        projectStausName: "",
        versionStatus: ""
      };
    },
    components: {
      ProjectInfo,
      ProjectTarget,
      ProjectQuota,
      ProjectOperate,
      ProjectArea,
      ProjectVersion,
      ProjectLand,
    },
    created() {
      this.initData();
    },
    computed: {
      commonPathRoleAuthority(){
        return this.$store.state.common.commonPathRoleAuthority;
      },
      projectShow() {
        return this.$store.state.project.show;
      },
    },
    methods: {
      startApproval(){
        if ( this.versionStatus == "99") {
          return message.error("审批通过不能再次审批！");
        };
        let isEmpty = true;
        const filterArr = [1,2,5,6,8];
        const _targetdata = this.projectTargetData.filter( (item, index) => {
          return filterArr.indexOf(index) > -1;
        });
        for( let i=0, len=_targetdata.length; i<len; i++){
          for(const keys in _targetdata[i]){
            if( keys !== 'key' && keys !== 'MANAGEMENTOBJECTIVES' && keys !== 'VOTINGMEETING' ){
              if( _targetdata[i][keys] === "" || _targetdata[i][keys] === null || _targetdata[i][keys] === undefined){
                isEmpty = false;
                break;
              }
            }
          };
          if( !isEmpty ) break;
        }
        if ( !isEmpty ) return message.error("请先将信息填写完整再发起审批！"); //未填写全部信息：
        //const len = this.projectVersionData.length;
        //审批操作发起之前 先保存
        this.saveNewProject(true)
          .then( res => {
            const _data = {
              //entiId: len>=1 && this.projectVersionData[len-1]["versionStatus"] == "99" && "10102" || "10101",
              entiId: '10102',
              dataKey: this.projectVersionId
            }
            return this.$store.dispatch("commonStartApproval", _data)
          }).then(res => {
            message.success("提交审批成功");
            this.initData();
          }).catch(err => {
            message.error(err);
          })
      },
      initData() {
        this.projectId = this.$route.query.nodeId;
        if (!this.projectId) return;   //项目id缺失 发生警告
        fetchUtils.get("/Project/IGetProjectVersionList", {projectId: this.projectId})
          .then(res => {
            this.projectVersionData = res.rows;
            this.projectVersionId = this.projectVersionData[0].versionId;
            this.projectStausName = this.projectVersionData[0].statusName;
            this.versionStatus = this.projectVersionData[0].versionStatus;
            this.setSessionProjectVersionId();
            this.changeVersion();
          }).catch(error => {
            message.error(error);
          })
      },
      setSessionProjectVersionId(){
        sessionStorage.setItem("projectVersionId", this.projectVersionId);
        sessionStorage.setItem("globalEditState", this.versionStatus);
        sessionStorage.setItem('globalEditVersionId', this.projectVersionId);
      },
      childChangeVersion(val) {
        this.projectVersionId = val;
        const _res = this.projectVersionData.filter(item => {
          return item.versionId === val;
        })
        if(_res[0].versionStatus >1){
          this.$store.dispatch("projectshow", true);
        }
        this.projectStausName = _res[0]["statusName"];
        this.versionStatus = _res[0]["versionStatus"];
        this.setSessionProjectVersionId();
        this.changeVersion();
      },
      changeVersion() {
        sessionStorage.setItem("projectVersionData",JSON.stringify(this.projectVersionData));
        const projectVersionId = this.projectVersionId;
        const allPromise = [
          fetchUtils.post('/Project/GetProjectIdentityInfo', {
            projectVersionId
          }).then(res => res.rows),
          fetchUtils.post('/Project/IGetProjectPlanning', {
            projectVersionId
          }).then(res => res.rows),
          fetchUtils.post('/Project/IGetManagementObjectivesTitle', {
            projectVersionId
          }).then(res => res.rows),
          fetchUtils.post('/Project/IGetProjectTart', {
            projectVersionId
          }).then(res => res.rows),
          fetchUtils.post('/Project/IGetProjectAreaQuota', {
            projectVersionId
          }).then(res => res.rows),
          fetchUtils.post('/Project/IGetOperationalRhythm', {
            projectVersionId
          }).then(res => res.rows),
          fetchUtils.post('/Project/IGetLandInfo', {
            projectVersionId
          }).then(res => res.rows),
        ];
        fetchUtils.all(allPromise)
          .then(([projectInfoData, projectQuotaData, projectTargetTitle, projectTargetData, ProjectAreaQuotaData, projectRhythm,projectLand]) => {
            this.projectInfoData = projectInfoData;
            this.projectQuotaData = projectQuotaData;
            this.projectQuotaData.TOTALPARKSPACE = this.addTotalParkSpace(projectQuotaData.UPPARKSPACE, projectQuotaData.UNDERPARKSPACE);
            this.projectQuotaData.LANDGRANT = this.thousandTh(projectQuotaData.LANDGRANT);
            this.projectTargetTitle = projectTargetTitle;
            this.projectTargetData = this.transformTragetData(projectTargetData);
            this.projectRhythm = projectRhythm;
            this.projectLand = projectLand;
            if (ProjectAreaQuotaData.gridData.length === 0) {
              return this.ProjectAreaQuotaData.gridData = [];
            }
            ;
            const tableData = ProjectAreaQuotaData.gridData;
            const tableTitle = ProjectAreaQuotaData.titleInfo;
            let titleArr = [];
            tableTitle.forEach(item => {
              if (item.children == null) {
                titleArr.push(item.field);
              } else {
                item.children.forEach(list => {
                  titleArr.push(list.field);
                })
              }
            })
            const _newData = [];
            tableData.forEach(list => {
              let obj = {};
              titleArr.forEach((item, key) => {
                if (key === 0) {
                  obj[item] = list["productName"];
                } else {
                  obj[item] = list["val"][key - 1];
                }
              })
              _newData.push(obj);
            })
            //处理areaqutodata数据格式
            this.ProjectAreaQuotaData.titleInfo = tableTitle;
            this.ProjectAreaQuotaData.gridData = _newData;
          }).catch(error => {
            console.log(error);
            //message.error(error);
          })
      },
      thousandTh(data){
        //千分符转换
        if (data == null) return null;
        return String(data).replace(/(\d{1,3})(?=(\d{3})+$)/g, function ($1) {
          return $1 = $1 + ','
        });
      },
      addTotalParkSpace(num1, num2){
        //总车位计算
        if (num1 == null && num2 == null) return null;
        return num1 == null && +num2 || num2 == null && +num1 || (+num1) + (+num2);
      },
      transformTragetData(data){
        //装换目标数据
        return data.map((item, index) => {
          return this.sendTarget(item, index);
        })
      },
      transformDate(dateStr){
        if( !dateStr ) return '0';
        dateStr = dateStr.replace(/-/g, '/') + '/01';
        let tmp = Date.parse( new Date(dateStr) ) + "";
        return tmp.substring(0, 10);
      },
      sendTarget(data, index){
        const toFixedType = [0, 1, 2, 7, 8]; //取一位小数
        const parseIntType = [6]; //取整数
        const thousandType = [3, 4]; //取整数
        const _that = this;
        if (toFixedType.indexOf(index) > -1) {
          return fonInData("toFixed", data);
        } else if (parseIntType.indexOf(index) > -1) {
          return fonInData("parseInt", data);
        } else if (thousandType.indexOf(index) > -1) {
          return fonInData('thousandType', data);
        } else {
          return data;
        }
        function fonInData(type, data) {
          const config = {
            "toFixed": function (data) {
              return Number(data) && Number(data).toFixed(1) || '0' //亿元保留1位小数
            },
            "parseInt": function (data) {
              return data && parseInt(data) || '0'//保留整数
            },
            "thousandType": function (data) {
              data = data && parseInt(data) || '0'//保留整数
              if (!data) return '0';
              return _that.thousandTh(data);
            }
          }
          for (var key in data) {
            if (key !== "MANAGEMENTOBJECTIVES" && key !== "key") {
              data[key] = config[type](data[key]);
            }
          }
          return data;
        }
      },
      saveNewProject(unShowMessage) {
        const useKey = [1, 2, 5, 6, 8];
        const _data = this.projectTargetData.filter((item, key) => {
          return useKey.indexOf(key) > -1;
        })

        let newData = [];
        _data.forEach((item, index) => {
          var obj = {};
          for (var key in item) {
            if (key !== "MANAGEMENTOBJECTIVES") {
              obj[key] = item[key];
            }
          }
          if (index === 2) {
            for (var datekey in obj) {
              if (datekey !== 'key') {
                obj[datekey] = this.transformDate(obj[datekey]);
              }
            }
          }
          newData.push(obj);
        })
        const companyId = sessionStorage.getItem('parentid');
        const projectVersionId = this.projectVersionId;
        const projectName = this.projectInfoData.projectName;
        const projectLocation = this.projectInfoData.projectLocation;
        const projectTartData = JSON.stringify(newData);
        const data = {
          companyId,
          projectVersionId,
          projectName,
          projectLocation,
          projectTartData
        };
        return fetchUtils.post('/Project/ISaveProject', data)
          .then(res => {
            if( unShowMessage !== true ){
              //showMessage 存在的时候 表示是发起审批之前的保存 不需要提示
              const type = this.versionStatus == '99' ? '升版' : '编辑'
              message.success(type + "项目成功！");
            }
            this.$store.dispatch("projectshow", true);
            if (this.versionStatus == "99") {
              //审批通过的项目相当于升版 版本信息会有变动 重新拉取所有数据一遍
              return this.initData();
            }
            this.changeVersion(); //非升版 不需要重新获取版本信息
          }).catch(error => {
            message.error(error);
          })
      },
    },
    watch: {
      '$route': function () {
        if( this.$route.query.mode === 'project' ){
          this.initData();
        }
      },
    },
  }
</script>

<style lang="less" rel="stylesheet/less" scoped>
  .content {
    width: calc(100% - 240px);
    height: 100%;
    background-color: #FFF;
  }

  h1 {
    font-weight: 300;
    font-size: 12px;
    width: 100%;
    line-height: 40px;
  }

  h2 {
    width: 98%;
    height: 30px;
    background: inherit;
    border-bottom: 2px solid #F9F9F9;
    margin-top: 5px;
    text-align: left;
    line-height: 30px;
    display: flex;
    justify-content: space-between;
    font-size: 15px;
    padding-right: 10px;
    .title {
      border-bottom: 2px solid dodgerblue;
      width: 100px;
      display: block;
      text-align: center;
    }
    span {
      /*margin-right: 30px;*/
      span {
        position: relative;
        right: 0px;
        bottom: 3px;
        padding: 4px 8px;
        font-weight: 300;
        cursor: pointer;
        background: #4caaf4;
        color: #fff;
        border-radius: 3px;
        font-size: 13px;
        margin: 0px 5px 0 0;
      }
    }
  }

  .shrink {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: #fff;
    border: 1px solid #4caaf4;
    text-align: center;
    line-height: 20px;
    color: #4caaf4;
  }

  .projectbox {
    display: flex;
    .projectright {
      width: 50%;
    }
  }

  .projecttitle {
    text-align: left;
    font-size: 14px;
    font-weight: 300;
    padding: 5px 0;
  }

  .projectcont {
    /*height: 100%;*/
    // overflow-y: scroll;
    /*overflow-x: hidden;*/
    margin-bottom: 200px;
  }

  .collagen-title {
    text-align: center;
    margin: 20px;
    font-weight: normal;
    font-size: 20px;
  }
</style>
