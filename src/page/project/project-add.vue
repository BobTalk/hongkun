<template>
  <div class="collagen">
    <div class="projectcont">
      <h1 class="projecttitle"></h1>
      <h2>
        <span class="title">项目身份信息</span>
        <span>
            <span @click="saveNewProject"><i class="el-icon-tickets"></i>保存</span>
        </span>
      </h2>
      <project-info :projectInfoData="projectInfoData"/>
      <project-quota :projectQuotaData="projectQuotaData"></project-quota>
      <project-target :projectTargetTitle="projectTargetTitle" :projectTargetData.sync="projectTargetData"></project-target>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex';
import { message, fetchUtils } from '../../utils';
import ProjectInfo from './project-info'
import ProjectTarget from './project-target'
import ProjectQuota from './project-quota'
import ProjectImage from './project-images'
export default {
  data() {
    return {
      projectVersionId: "",     //新增projec版本id为空
      projectTargetTitle: [],   //project-target表头
      projectTargetData: [],     //project-target内容
      projectInfoData: {},
      projectQuotaData: {}
    };
  },
  methods: {
    ...mapActions(['commonGetTreeData']),
    saveNewProject() {
      const  projectName = this.projectInfoData.projectName;
      if( !projectName || (projectName && !projectName.trim()) ){
        return message.error("请填写项目名称在进行保存");
      }
      const useKey = [1,2,5,6,8];
      const _data = this.projectTargetData.filter( (item, key) => {
        return useKey.indexOf(key) > -1;
      })
      let newData = [];
      _data.forEach( (item, index) => {
        var obj = {};
        for( var key in item ){
          if( key !== "MANAGEMENTOBJECTIVES" ){
            obj[key] = item[key];
          }
        }
        if( index === 2 ){
          for( var datekey in obj ){
            if( datekey !== 'key' ){
              obj[datekey] = this.transformDate(obj[datekey]);
            }
          }
        }
        newData.push(obj);
      })
      const companyId = this.$route.query.companyId;
      const projectVersionId = this.projectVersionId;
      const projectLocation = this.projectInfoData.projectLocation;
      const projectTartData = JSON.stringify(newData);
      const data = {
        companyId,
        projectVersionId,
        projectName,
        projectLocation,
        projectTartData
      };
      fetchUtils.post('/Project/ISaveProject', data)
        .then( res => {
          this.$store.dispatch('projectshow', true);
          this.$store.dispatch('commonSetCurrentStatus', [{type: 'isAdd', value: true}]);
          this.commonGetTreeData()
            .then( () => {
              this.$store.dispatch('commonSetCurrentStatus', [{type: 'isEnd', value: true}]);
            });
          message.success("新增项目成功！");
          this.$router.push({path: '/project', query: {mode: 'project', nodeId: res.rows}})
        }).catch( error => {
          message.error(error);
        })
    },
    getInitData(){
      //从后台获得初始化底部数据表格
      const allPromise = [
          fetchUtils.post('/Project/GetProjectIdentityInfo', {projectVersionId: ""}).then(res => res.rows),
          fetchUtils.post('/Project/IGetProjectPlanning', {projectVersionId: ""}).then(res => res.rows),
          fetchUtils.post('/Project/IGetManagementObjectivesTitle', {projectVersionId: ""}).then(res => res.rows),
          fetchUtils.post('/Project/IGetProjectTart', {projectVersionId: this.projectVersionId}).then(res => res.rows)
      ]
      fetchUtils.all(allPromise)
        .then( ([projectInfoData, projectQuota, projectTargetTitle, projectTargetData]) => {
          this.projectInfoData = projectInfoData;
          this.projectQuota = projectQuota;
          this.projectQuota.TOTALPARKSPACE = this.addTotalParkSpace(projectQuota.UPPARKSPACE, projectQuota.UNDERPARKSPACE);
          this.projectTargetTitle = projectTargetTitle;
          this.projectTargetData = projectTargetData;
        })
    },
    transformDate(dateStr){
      if( !dateStr ) return 0;
      dateStr = dateStr.replace(/-/g, '/') + '/01';
      let tmp = Date.parse( new Date(dateStr) ) + "";
      return tmp.substring(0, 10);
    },
    addTotalParkSpace(num1, num2){
      if( num1 == null && num2 == null ) return null;
      return num1 == null && +num2 || num2 == null && +num1 || (+num1) + (+num2);
    },
  },
  components: {
    ProjectInfo,
    ProjectTarget,
    ProjectQuota,
    ProjectImage
  },
  created(){
    this.getInitData();
  }
};
</script>
<style lang="less" rel="stylesheet/less" scoped>

  h2{
    width: 98%;
    height: 30px;
    background: inherit;
    border-bottom:2px solid #F9F9F9;
    margin-top: 5px;
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
    span{
      span{
        padding:2px 8px;
        font-weight:300;
        cursor: pointer;
        background:#4caaf4;
        color:#fff;
        border-radius:3px;
        font-size:13px;
      }
    }
  }
  .projectbox{
    display: flex;
    .projectright{
      width:50%;
    }
  }
  .projecttitle {
    text-align: left;
    font-size: 14px;
    font-weight: 300;
    padding: 5px 0;
  }
  .projectcont {
    margin-bottom: 200px;
  }
</style>
