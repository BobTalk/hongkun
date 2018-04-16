<template>
  <div id="costbox">
    <h3 v-if="isDelete"  class="del_container">当前版本已被删除</h3>
    <div v-else>
      <h2>
        <span class="title">动态成本</span>
      </h2>
      <div id="cost">
        <cost-dynamic :dynamic="dynamic"></cost-dynamic>
      </div>
      <!--其他-->
      <h2>
        <span class="title other-title">其他</span>
      </h2>
      <div class="other-cost">
        <el-table
          :data="Other"
          border
          style="width: 98%;white-space:nowrap;border:solid 1px #ebeef5;">
          <el-table-column
            prop="dicname"
            label="科目">
          </el-table-column>
          <el-table-column
            prop="startEdition"
            label="启动会版">
            <template slot-scope="scope">
              <span>{{scope.row.startEdition | thousandFilter}}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="lastBudgetary"
            label="最新预算版">
            <template slot-scope="scope">
              <span>{{scope.row.lastBudgetary | thousandFilter}}</span>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!--年度支付计划-->
      <div class='yearpay' v-if="isShow">
        <h2>
          <span class="title year-title">年度支付计划</span>
        </h2>
        <div class="year-tb">
          <el-table
          :data="tabData"
          border
          height="110px"
          style="width: 98%;white-space:nowrap;text-align:center;border:solid 1px #ebeef5;">
            <el-table-column
              v-for="(item, index) in yearTitle"
              :key="'yearTitle' + index"
              :prop="item['field']"
              :label="item['name']"
              width="120">
                <template slot-scope="scope">
                  <span v-if="scope.column.property != 'dicName'">{{scope.row[scope.column.property] | thousandFilter}}</span>
                  <span v-else>{{scope.row[scope.column.property]}}</span>
                </template>
            </el-table-column>
        </el-table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import CostDynamic from '../cost/cost-dynamic'
  import {message, fetchUtils} from '../../utils';
  export default {
    name: "Cost",
    data: function () {
      return {
        isDisabled:true,
        msg: "动态成本",
        iscontrols:false,
        costVersionStatus:'',
        dynamic:[],//动态成本
        isDelete: false,
        versionId: "",
        tabData: [],
        isShow: false,
        Other:[
          {
            "id": "",
            "startEdition":  '',
            "lastBudgetary": '',
            "categoryid": "PERIODCOST",
            "dicname": "期间费用（万元）"
          },
          {
            "id": "",
            "startEdition":  '',
            "lastBudgetary": '',
            "categoryid": "CAPITALIZEDINTEREST",
            "dicname": "资本化利息（万元）"
          },
          {
            "id": "",
            "startEdition":  '',
            "lastBudgetary":  '',
            "categoryid": "TAKEOVERPREMIUM",
            "dicname": "收购溢价（万元）"
          }
        ],
        yearplan: [
          {
            "id": "",
            "stageId": "",
            "totalPrice": '',
            "dicName": "预算支付（万元）",
            "jan": '',
            "feb": '',
            "mar": '',
            "apr": '',
            "may": '',
            "jun": '',
            "jul": '',
            "aug": '',
            "sept": '',
            "oct": '',
            "nov": '',
            "dec": '',
            'payType':'BUDGETARYPAYMENT'
          },
          {
            "id": "",
            "stageId": "",
            "totalPrice": '',
            "dicName": "实际支付（万元）",
            "jan": '',
            "feb": '',
            "mar": '',
            "apr": '',
            "may": '',
            "jun": '',
            "jul": '',
            "aug": '',
            "sept": '',
            "oct": '',
            "nov": '',
            "dec": '',
            'payType':'ACTUALPAYMENT'
          }
        ],
        yearTitle: [
          { 
            "field": "dicName",
            "name": ""
          },
          {
            "field": "totalPrice",
            "name": "总额"
          },
          {
            "field": "jan",
            "name": "一月",
          },
          {
            "field": "feb",
            "name": "二月",
          },
          {
            "field": "mar",
            "name": "三月",
          },
          {
            "field": "apr",
            "name": "四月",
          },
          {
            "field": "may",
            "name": "五月",
          },
          {
            "field": "jun",
            "name": "六月",
          },
          {
            "field": "jul",
            "name": "七月",
          },
          {
            "field": "aug",
            "name": "八月",
          },
          {
            "field": "sept",
            "name": "九月",
          },
          {
            "field": "oct",
            "name": "十月",
          },
          {
            "field": "nov",
            "name": "十一月",
          },
          {
            "field": "dec",
            "name": "十二月",
          }
        ],
      };
    },
    filters: {
      thousandFilter(val){
        if( !val && val !== 0 ) return '';
        return String(val).replace(/(\d{1,3})(?=(\d{3})+$)/g, function ($1) {
          return $1 = $1 + ','
        });
      }
    },
    created() {
      this.versionId = this.$route.query.dataKey;
      this.isDeleteVersion();
    },
    methods: {
      isDeleteVersion(){
        //先判断此版本有没有被删除
        fetchUtils.post("/Common/IGetVersionInfoByID", {
          id: this.versionId
        }).then( res => {
          if( res.rows ){
            this.initData();
          }else{
            this.isDelete = true;
          }
        })
      },   
      initData(){
        fetchUtils.get('/Costpayment/GetAnnualCostPay',{versionId: this.versionId})
          .then(res =>{
            this.dynamic = res.rows.vBtCostDynamics;
            this.Other = res.rows.vBtExtra;
            this.tabData = res.rows.vbtAannualPlan;
          })
      }
    },
    components: {
      CostDynamic,
    },
  }
</script>

<style lang="less" rel="stylesheet/less" scoped>
  h2{
    width: 100%;
    height: 34px;
    background: inherit;
    border-bottom:2px solid #F9F9F9;
    margin-top: 5px;
    text-align: left;
    line-height: 30px;
    display: flex;
    justify-content: space-between;
    font-size:15px;
    padding-right:10px;
    .title{
      border-bottom:2px solid dodgerblue;
      display:block;
      text-align: center;
    }
    span{
      margin-right: 30px;
      span{
        position:relative;
        right:0px;
        bottom:3px;
        padding:4px 8px;
        font-weight:300;
        cursor: pointer;
        background:#4caaf4;
        color:#fff;
        border-radius:3px;
        font-size:13px;
        margin:0px 5px 0 0;
      }
    }
  }

  #costbox{
    margin-bottom:200px;
  }
  #cost,.year-tb,.other-cost{
    margin-top: 20px;
    margin-bottom: 5px;
  }
 .year-tb{
   padding-bottom: 10px;
 }
 .month-pay{
   width: 82px;
   height:17px;
       font-size: 12px;
       padding-left: 10px;
       border: 1px solid #dcdfe6;
 }
 .operation{
   cursor: pointer;
   position:relative;
  right:0px;
  // bottom:3px;
  padding:5.5px 8px;
  font-weight:300;
  cursor: pointer;
  background:#4caaf4;
  color:#fff;
  border-radius:3px;
  font-size:12px;
  margin:0px 5px 0 0;
 }
 .norm{
   font-size:12px;
   font-weight: normal !important;
 }
 .other-title{
   width:30px !important;
 }
.year-title{
  width: 90px !important;
}
.version{
  color: rgb(76, 170, 244);
}
.el-input--mini>.el-input__inner{
  border:none !important;
  outline:none;
}
.el-input__inner{
  border:none !important;
}
.el-input input:focus {
  border: none !important;
  outline:none;
}
.del_container {
  font-size: 16px;
  text-align: center;
  color: #333;
  font-weight: normal;
  margin-top: 40px;
}
</style>
