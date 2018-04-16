<template>
  <div>
    <h2 v-if="isDelete"  class="del_container">当前版本已被删除</h2>
    <div v-else>
      <Info :stageIdentityInfo="stageIdentityInfo"></Info>
      <land-target :stageVersionId="stageVersionId" :stageIdentityInfo="stageIdentityInfo" :totalPark="totalPark"></land-target>
      <land-list :stageIdentityInfo="stageIdentityInfo"></land-list>
      <app-target :mTitle="mTitle" :stageProjectTart="stageProjectTart"></app-target>
      <app-operate :planGroupTask="planGroupTask"></app-operate>
      <app-area v-if="stageAreaQuota.gridData.length > 1" :stageAreaQuota="stageAreaQuota"></app-area>
    </div>
  </div>
</template>

<script>
import Info from './public-component/instalment/info.vue';  //分期
import LandTarget from './public-component/instalment/landtarget.vue';  //土地规划指标
import LandList from './public-component/instalment/landlist.vue';  //土地规划指标
import AppTarget from './public-component/instalment/apptarget.vue';  //分期经营目标
import AppOperate from './public-component/instalment/appoperate.vue';  //分期经营目标
import AppArea from './public-component/instalment/apparea.vue';  //分期经营目标
import {message, fetchUtils} from '../../utils';
export default {
  data(){
    return {
      stageVersionId: "", //"4abe1ffd-dae2-4682-b1bf-07a6e884be64",
      stageIdentityInfo: {
        vStageIdentityInfo: {},
        vLandList: [],
        InverstBuildUnit: [],
        ProjectBuildUnit: []
      },
      mTitle: [],
      stageProjectTart: [],
      planGroupTask: {
        data: [],
        rowTitle: []
      },
      stageAreaQuota: {
        gridData: [],
        titleInfo: []
      },
      totalPark: null,
      isDelete: false
    }
  },
  components: {
    Info,
    LandTarget,
    LandList,
    AppTarget,
    AppOperate,
    AppArea
  },
  methods: {
    getInitData(){
      const stageVersionId = this.stageVersionId;
      const stageId = "";
      const allPromise = [
          fetchUtils.post('/stage/GetStageIdentityInfo', {
            stageVersionId,
            stageId
          }).then(res => res.rows),       
          fetchUtils.post('/stage/IGetManagementObjectivesTitle', {
            stageId,
            stageVersionId
          }).then( res => res.rows), //分期经营目标表头
          fetchUtils.post('/stage/GetStageProjectTart', {
            stageVersionId,
            stageId
          }).then( res => res.rows),  //分期经营表体
          fetchUtils.post('/stage/GetPlanGroupTask', {
            stageVersionId,
            stageId
          }).then( res => res.rows),  //分期运营节奏
          fetchUtils.post('/stage/GetStageAreaQuota', {
            stageVersionId
          }).then( res => res.rows)  //分期面积
      ];      
      fetchUtils.all(allPromise)
        .then(([stageIdentityInfo, mTitle, stageProjectTart, planGroupTask, stageAreaQuota]) => {
          const vStageIdentityInfo = stageIdentityInfo.vStageIdentityInfo;
          if( vStageIdentityInfo ){
            //设置总停车位
            this.totalPark = this.addTotalParkSpace(vStageIdentityInfo.upParkSpace, vStageIdentityInfo.underParkSpace);
            this.stageIdentityInfo.vStageIdentityInfo.landGrant = this.thousandTh(vStageIdentityInfo.landGrant);
            //设置投资公司名称 info
            const InvestCompanyList = stageIdentityInfo.InverstBuildUnit || [];
            const _InvestCompanyList = InvestCompanyList.map( item => {
              return item.COMPANNYNAME || '';
            })
            this.stageIdentityInfo.investCompanyName = _InvestCompanyList.join(',');
            //设置施工总承包单位
            const ProjectBuildUnit = stageIdentityInfo.ProjectBuildUnit || [];
            const _ProjectBuildUnit = ProjectBuildUnit.map( item => {
              return item.COMPANNYNAME || '';
            })
            this.stageIdentityInfo.projectBuildUnit = _ProjectBuildUnit.join(',');
            this.stageIdentityInfo.vStageIdentityInfo = vStageIdentityInfo;
          };
          if( stageIdentityInfo.vLandList ) {
            this.stageIdentityInfo.vLandList = stageIdentityInfo.vLandList;
          }
          this.stageProjectTart = this.transformTragetData(stageProjectTart);
          this.planGroupTask = planGroupTask;
          if( stageAreaQuota.gridData.length === 0 ){
            return this.stageAreaQuota = stageAreaQuota;
          };
          this.stageAreaQuota = this.transformStageArea(stageAreaQuota);
      }).catch(error => {
        console.log(error);
        //message.error(error);
      })      
    },
    transformStageArea(data){
      const tableData = data.gridData;
      const tableTitle = data.titleInfo;
      let titleArr = [];
      tableTitle.forEach( item => {
        if( item.children == null){
          titleArr.push(item.field);
        }else{
          item.children.forEach( list => {
            if( list.children == null ){
              titleArr.push(list.field);
            }else{
              list.children.forEach( title => {
                titleArr.push(title.field);
              })
            }
          })
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
      return {
        titleInfo: tableTitle,
        gridData: _newData
      };
    },
    thousandTh(data){
      //千分符转换
      if( data == null ) return null;
      return String(data).replace(/(\d{1,3})(?=(\d{3})+$)/g,function($1){
                  return $1=$1+','
                });
    },
    addTotalParkSpace(num1, num2){
      //总车位计算
      if( num1 == null && num2 == null ) return null;
      return num1 == null && +num2 || num2 == null && +num1 || (+num1) + (+num2);
    },
    transformTragetData(data){
      //装换目标数据
      return data.map( (item, index) => {
        return this.sendTarget(item, index);
      })
    },
    sendTarget(data, index){
      const toFixedType = [0, 1, 2, 7, 8]; //取一位小数
      const parseIntType = [6]; //取整数
      const thousandType = [3, 4]; //取整数
      const _that = this;
      if( toFixedType.indexOf(index) > -1 ){
          return fonInData("toFixed", data);
      }else if( parseIntType.indexOf(index) > -1 ){
          return fonInData("parseInt", data);
      }else if( thousandType.indexOf(index) > -1 ){
          return fonInData('thousandType', data);
      }else{
        return data;
      }
      function fonInData(type, data){
        const config = {
          "toFixed": function(data){
            return Number(data) && Number(data).toFixed(1) || 0 //亿元保留1位小数
          },
          "parseInt":function(data){
            return data && parseInt(data) || 0//保留整数
          },
          thousandType: function(data){
            data = data && parseInt(data) || 0//保留整数
            if( !data ) return 0;
            return _that.thousandTh(data);
          }
        }
        for( var key in data){
          if( key !== "MANAGEMENTOBJECTIVES" && key !== "key" ){
            data[key] = config[type](data[key]);
          }
        }
        return data;
      }
    },
    isDeleteVersion(){
      //先判断此版本有没有被删除
      fetchUtils.post("/Common/IGetVersionInfoByID", {
        id: this.stageVersionId
      }).then( res => {
        if( res.rows ){
          this.getInitData();
        }else{
          this.isDelete = true;
        }
      })
    }    
  },
  created(){
    this.stageVersionId = this.$route.query.dataKey;
    this.isDeleteVersion();
  }
}
</script>

<style scoped rel="stylesheet/css">
.del_container {
  font-size: 16px;
  text-align: center;
  color: #333;
  font-weight: normal;
  margin-top: 40px;
}
</style>

