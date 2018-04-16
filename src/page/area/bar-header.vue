<!-- 成本和支付 -->
<template>
  <div id="costbox" style="margin-top:60px;">
    <div></div>
    <!--版本状态-->
    <h2>
      <span class="title">{{msg}}</span>
      <div>
        <div class='current-status'>
          <span v-if="isShowUpdate"  class="operation" @click="createVersionClick"><i class="el-icon-plus"></i>生成新版本</span>
          <span v-if="isShowSave" class='operation' @click="save"><em class="el-icon-tickets"></em>保存</span>
          <span v-if="isShowApproval" class='operation' @click="startApproval"><em class="el-icon-share"></em>发起审批</span>
          <span v-if="isShowDel" class='operation' @click="delCost"><em class="el-icon-delete"></em>删除</span>
          <label class="version norm">当前版本:</label>
          <el-select v-model="costVersionCode" placeholder="请选择" class="input_style" @change="costChangeVersion" id="select_input" style="width: 120px;margin-right: 10px;">
            <el-option
              style="height: 30px"
              v-for="item in costversion"
              :key="item.costVersionId"
              :label="item.versionCode"
              :value="item.versionCode">
            </el-option>
          </el-select>
          <label class='norm'>状态:</label>
          <span class="norm">{{costStausName}}</span>
        </div>
      </div>
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
        style="width: 98%;white-space:nowrap;text-align:left;border:solid 1px #ebeef5;">
        <el-table-column
          prop="dicname"
          label="科目"
          align="left"
        >
        </el-table-column>
        <el-table-column
          prop="startEdition"
          label="启动会版"
        >
          <template slot-scope="scope">
            <el-input-number :disabled="isEdit" class="month-pay"  size="mini" :min="0" :max="999999999" :controls="iscontrols"
                             v-model="scope.row.startEdition" ></el-input-number>
          </template>
        </el-table-column>
        <el-table-column
          prop="lastBudgetary"

          label="最新预算版">
          <template slot-scope="scope">
            <el-input-number :disabled="isEdit" class="month-pay"  size="mini" :min="0" :max="999999999" :controls="iscontrols"
                             v-model="scope.row.lastBudgetary"></el-input-number>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!--年度支付计划-->
    <div class='yearpay' >
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
            prop="dicName"
            label=""
            width="120">
          </el-table-column>
          <el-table-column
            prop="totalPrice"
            label="总额"
            width="100">
            <template slot-scope="scope">
              <el-input-number :disabled="isDisabled" v-model="scope.row.totalPrice" class="month-pay" size="mini" :min="0" :max="999999999" :controls="iscontrols"></el-input-number>
            </template>
          </el-table-column>
          <el-table-column
            v-for = "(item ,index) in yearTitle"
            :key = "index"
            :prop="item.field"
            :label="item.name"
            width="100">
            <template slot-scope="scope">
              <el-input-number :disabled="isEdit" v-model="scope.row[item.field]" class="month-pay" size="mini" :min="0" :max="999999999" :controls="iscontrols"></el-input-number>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>

<script>
  import './cost.less'
  import CostVersion from './cost-version'
  import CostDynamic from './cost-dynamic'
  import {message, fetchUtils} from '../../utils';
  import {mapState, mapGetters, mapActions} from 'vuex';
  import ElInputNumber from "../../../node_modules/element-ui/packages/input-number/src/input-number";
  export default {
    name: "Cost",
    data: function () {
      return {
        isDisabled:true,
        msg: "动态成本",
        iscontrols:false,
        isShowApproval:false,
        isShowSave:false,
        isShowUpdate:false,
        isEdit:false,
        isShowDel:false,
        costversion:[],   //成本支付版本
        costVersionId: '',//版本ID编码
        costStausName:'无',//版本状态：编制中/审批通过/...
        costVersionCode: '',//版本号：V1/V2/...
        costVersionStatus:'',
        topVersionId:'',//最高版本Id
        yearTitle: [
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
        dynamic:[],//动态成本
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
        yearplan:
          [
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
      };
    },
    watch: {
      // handler:function(val, oldval){
      //   console.log(this.costversion)
      // }
    },
    mounted() {
      this.$nextTick(()=>{
        this.initData();
      })
    },
    computed: {
      ...mapGetters(['costpayment']),
      tabData:function () {
        let tabData = this.yearplan
        tabData.forEach(function (item){
          item.totalPrice = parseInt(item.jan) +
            parseInt(item.feb) +
            parseInt(item.mar) +
            parseInt(item.apr) +
            parseInt(item.may) +
            parseInt(item.jun) +
            parseInt(item.jul) +
            parseInt(item.aug) +
            parseInt(item.sept) +
            parseInt(item.oct) +
            parseInt(item.nov)+
            parseInt(item.dec) || 0
        })
        return tabData
      }
    },

    methods: {
      initData(){
        const {nodeId, mode} = this.$route.query;
        fetchUtils.get("/Costpayment/GetPayMentVersionList", {stageId: nodeId})
          .then(res => {
            if(res.rows && res.rows.length >0){
              this.costversion=res.rows;
              this.costVersionId = this.costversion[0].versionId;
              this.costStausName = this.costversion[0].statusName;
              this.costVersionCode = this.costversion[0].versionCode;
              this.costVersionStatus = res.rows[0].versionStatus
              this.topVersionId = this.costversion[0].versionId;
            }
            // console.info(this.costVersionId)
            // console.info(this.topVersionId)
            if(this.costVersionStatus == '99'){//审批通过
              this.isShowSave = this.isShowApproval = false
              this.isShowDel = this.isShowUpdate = true
              this.isEdit = true//不可编辑
            }else if(this.costVersionStatus == '0' || this.costversion.length<1 || this.costVersionStatus == '-1') {//编制中,无状态,驳回
              this.isShowSave = this.isShowDel = true
              // this.isShowUpdate = this.isShowApproval = false
              this.isEdit = false//可编辑
            }else if(this.costVersionStatus == '1'){//审批中
              this.isShowSave = this.isShowDel = false
              this.isShowUpdate = this.isShowApproval = false
              this.isEdit = true//不可编辑
            }
            // 获取数据
            fetchUtils.get('/Costpayment/GetAnnualCostPay',{versionId:this.costVersionId})
              .then(res =>{
                this.dynamic = res.rows.vBtCostDynamics;
                if((res.rows.vBtExtra.length >0) ){
                  this.Other = res.rows.vBtExtra;
                }
                if((res.rows.vbtAannualPlan.length >0) ){
                  this.yearplan = res.rows.vbtAannualPlan;
                }


              })
              .catch(err=>{
                this.$message.error(err);
              })
          }).catch(error => {
          console.log(error)
        })

      },
      changcostversion(){
        let self = this
        let costVersion = this.costVersionId;
        self.costversion.forEach(function(item){
          if (item.versionCode == costVersion) {
            costVersion = item.versionId
            self.costStausName = item.statusName
            self.costVersionStatus = item.versionStatus
          }
        })
        // console.info(costVersion)
        // console.info(this.topVersionId)
        if(self.costVersionStatus == '99'){//审批通过
          self.isShowSave = self.isShowApproval = false
          self.isShowDel  = true
          self.isEdit = true//不可编辑
          if(self.topVersionId !== costVersion){
            self.isShowUpdate = false
          }else{self.isShowUpdate = true}
        }else if(self.costVersionStatus == '0' || this.costVersionStatus == '' || this.costVersionStatus == '-1') {//编制中
          self.isShowSave = self.isShowDel = true
          self.isShowUpdate = self.isShowApproval = false
          self.isEdit = false //可编辑
        }else if(self.costVersionStatus == '1'){//审批中
          self.isShowSave = self.isShowDel = false
          self.isShowUpdate = self.isShowApproval = false
          self.isEdit = true//不可编辑
        }
        // console.info(costVersion)
        this.costVersionId = costVersion
        // console.info(this.costVersionId)
        fetchUtils.get('/Costpayment/GetAnnualCostPay',{versionId:costVersion})
          .then(res =>{
            this.dynamic = res.rows.vBtCostDynamics;
            this.Other = res.rows.vBtExtra;
            this.yearplan = res.rows.vbtAannualPlan;
          })
          .catch(err=>{
            this.$message.error(err);
          })
      },
      costChangeVersion(val){
        this.costVersionId = val;
        this.changcostversion();
      },
      save(){
        this.saveInfo();
      },
      saveInfo(){
        const {nodeId, mode} = this.$route.query;
        let AnnualCost = {
          vBtExtra:this.Other,
          vbtAannualPlan: this.yearplan,
          versionId: this.costVersionId,
          stageId:nodeId
        }
        fetchUtils.post('/Costpayment/SaveOrEditAnnualCost',{
          annualInfo:JSON.stringify(AnnualCost)
        })
          .then( res => {
            this.$message.success("保存成功");
            this.isShowSave = false
            this.isShowApproval = true
            this.initData()
          })
          .catch( err => {
            this.$message.error(err);
          })
      },
      delCost() {

      },
      // 发起审批，复用
      startApproval(){
        let _data = {
          entiId: 10106,
          dataKey: this.costVersionId
        }
        this.$store.dispatch("commonStartApproval", _data)
          .then(res => {
            message.success("提交审批成功");
            this.isShowApproval = false
            this.isEdit = true//发起审批后，所有输入框不可编辑
            this.initData();
          }).catch(err => {
          message.error(err);
        })
      },
      // 生成新版本
      createVersionClick() {
        const {nodeId, mode} = this.$route.query;
        let AnnualCost = {
          vBtExtra:this.Other,
          vbtAannualPlan: this.yearplan,
          versionId: this.costVersionId,
          stageId:nodeId
        }
        fetchUtils.post('/Costpayment/UpgradeAnnualInfo',{
          annualInfo:JSON.stringify(AnnualCost)
        })
          .then( res => {
            this.$message.success("版本生成成功");
            this.isShowUpdate = false
            this.isEdit = true//升版后，状态编制中，所有输入框可编辑
            this.isShowSave = true
            this.initData()
            // console.info(this.costversion)
          })
          .catch( err => {
            this.$message.error(err);
          })
      }
    },
    watch: {

    },
    components: {
      ElInputNumber,
      CostVersion,
      CostDynamic
      // CostOther
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
      width:60px;
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
  .yearpay{
    // display: none;
  }
</style>
