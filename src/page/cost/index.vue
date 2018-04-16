<!-- 成本和支付 -->
<template>
  <div id="costbox" style="margin-top:60px;">
    <div></div>
    <!--版本状态-->
    <h2>
      <span class="title">{{msg}}</span>
      <div>
          <div class='current-status'>
            <span v-if="isShowUpdate && commonPathRoleAuthority.indexOf('btn_edit') > -1"  class="operation" @click="createVersionClick"><i class="el-icon-plus"></i>生成新版本</span>
            <span v-if="isShowSave && commonPathRoleAuthority.indexOf('btn_edit') > -1" class='operation' @click="save"><em class="el-icon-tickets"></em>保存</span>
            <span v-if="isShowDel && commonPathRoleAuthority.indexOf('btn_delete') > -1" class='operation' @click="open"><em class="el-icon-delete"></em>删除</span>
            <span v-if="isShowApproval && commonPathRoleAuthority.indexOf('btn_approval') > -1" class='operation' @click="startApproval"><em class="el-icon-share"></em>发起审批</span>
            <label class="version norm">当前版本:</label>
            <el-select v-model="costVersionCode" placeholder="请选择" class="input_style version_width" @change="costChangeVersion" id="select_input" style="width: 120px;margin-right: 10px;">
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
          >
        </el-table-column>
        <el-table-column
          prop="startEdition"
          label="启动会版"
          >
          <template slot-scope="scope">
            <el-input :disabled="isEdit" class="month-pay"  size="mini"
    v-model="scope.row.startEdition" @focus="initNum(scope.row,'startEdition')" @blur="checkNum(scope.row)"></el-input>
          <!-- <el-input :disabled="isEdit" class="month-pay"  size="mini"
          v-model="scope.row.startEdition" @change="totalPriceEvent(scope.row,'startEdition')"></el-input> -->
          </template>
        </el-table-column>
        <el-table-column
          prop="lastBudgetary"

          label="最新预算版">
          <template slot-scope="scope">
            <el-input :disabled="isEdit" class="month-pay"  size="mini"
    v-model="scope.row.lastBudgetary" @focus="initNum(scope.row,'lastBudgetary')" @blur="checkNum1(scope.row)"></el-input>
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
            <el-input size="mini" :controls="iscontrols" :disabled="true"  class="month-pay"
                v-model="scope.row.totalPrice" @blur="totalPriceEvent(scope.row,totalPrice)"></el-input>
          </template>
        </el-table-column>
        <el-table-column
          v-for = "(item ,index) in yearTitle"
          :key = "index"
          :prop="item.field"
          :label="item.name"
          width="100">
          <template slot-scope="scope">
            <el-input size="mini" :controls="iscontrols" :disabled="isEdit"  class="month-pay"
               v-model="scope.row[item.field]" @focus="initNum(scope.row,item.field)" @blur="checkNum2(scope.row,item.field)"></el-input>
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
  // import ElInputNumber from "../../../node_modules/element-ui/packages/input-number/src/input-number";
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
        costStausName:'未编制',//版本状态：编制中/审批通过/...
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
    },
    created() {
      // this.initData();
    },
    mounted() {
      this.$nextTick(()=>{
        this.checkPrice();
      })
    },
    computed: {
      ...mapGetters(['costpayment']),
      tabData:function () {
          let tabData = this.yearplan,self = this
          let re=/\d{1,3}(?=(\d{3})+$)/g;
            tabData.forEach(function(item){
               item.totalPrice =
                      Number(item.jan.indexOf(',') != -1 ?item.jan.split(',').join(''): item.jan) +
                      Number(item.feb.indexOf(',') != -1 ?item.feb.split(',').join(''):item.feb) +
                      Number(item.mar.indexOf(',') != -1 ?item.mar.split(',').join(''):item.mar) +
                      Number(item.apr.indexOf(',') != -1 ?item.apr.split(',').join(''):item.apr)+
                      Number(item.may.indexOf(',') != -1 ?item.may.split(',').join(''):item.may) +
                      Number(item.jun.indexOf(',') != -1 ?item.jun.split(',').join(''):item.jun)+
                      Number(item.jul.indexOf(',') != -1 ?item.jul.split(',').join(''):item.jul) +
                      Number(item.aug.indexOf(',') != -1 ?item.aug.split(',').join(''):item.aug)+
                      Number(item.sept.indexOf(',') != -1 ?item.sept.split(',').join(''):item.sept) +
                      Number(item.oct.indexOf(',') != -1 ?item.oct.split(',').join(''):item.oct) +
                      Number(item.nov.indexOf(',') != -1 ?item.nov.split(',').join(''):item.nov) +
                      Number(item.dec.indexOf(',') != -1 ?item.dec.split(',').join(''):item.dec)
                      item.totalPrice = item.totalPrice.toString().replace(/^(\d+)((\.\d+)?)$/,function(s,s1,s2){return s1.replace(re,"$&,")+s2;});
            })
        return tabData
      },
      commonPathRoleAuthority(){
        return this.$store.state.common.commonPathRoleAuthority
      }
    },

    methods: {
      changeNumber(obj,arr){
        if(event.target.value == '' || isNaN(Number(event.target.value))){
          this.$message({
            message: '请输入数字',
            type: 'warning'
          });
          obj[arr] = 0
          return false
        }
        obj[arr] = parseInt(event.target.value)
      },
      //   初始校验是否有审核通过的分期和价格
      checkPrice(){
          const {nodeId, mode} = this.$route.query;
         fetchUtils.post('/Costpayment/GetStageCheckInfo',{
            stageId:nodeId
         }).then(res => {
           if(res.errorcode && res.errorcode === 200) {
                // alert(111)
                this.initData();
            }
         }).catch(err => {
           this.Other = []

            this.$message.error(err)

         })
      },
      initData(){
          let self = this
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
            } else {
              this.costversion = []
              this.costVersionId = '';
              this.costStausName = '未编制';
              this.costVersionCode = '';
              this.costVersionStatus = ''
              this.topVersionId = '';
            }
            if(this.costVersionStatus == '99'){//审批通过
              this.isShowDel =this.isShowSave = this.isShowApproval = false
              this.isShowUpdate = true
              this.isEdit = true//不可编辑
            }else if(this.costVersionStatus == '0' || this.costversion.length<1 || this.costVersionStatus == '-1') {//编制中,驳回
              this.isShowSave = this.isShowDel = true
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
                  let other_temp = res.rows.vBtExtra;

                  other_temp.forEach(function(item){
                    let re=/\d{1,3}(?=(\d{3})+$)/g;
                    item.startEdition = item.startEdition? item.startEdition.toFixed(0).toString().replace(/^(\d+)((\.\d+)?)$/,function(s,s1,s2){return s1.replace(re,"$&,")+s2;}):'';
                    item.lastBudgetary = item.lastBudgetary? item.lastBudgetary.toFixed(0).toString().replace(/^(\d+)((\.\d+)?)$/,function(s,s1,s2){return s1.replace(re,"$&,")+s2;}):'';
                  })
                  this.Other = other_temp;
                } else {
                  this.Other = [
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
                  ]
                }
                if((res.rows.vbtAannualPlan.length >0) ){
                  // this.yearplan = res.rows.vbtAannualPlan;
                  // console.info(res.rows.vbtAannualPlan)
                  let year_temp = res.rows.vbtAannualPlan
                  let re=/\d{1,3}(?=(\d{3})+$)/g;
                  function format(s,s1,s2){return s1.replace(re,"$&,")+s2;}
                  let test = /^(\d+)((\.\d+)?)$/
                  year_temp.forEach(function(item){
                    item.jan =item.jan? item.jan.toFixed(0).toString().replace(test, format): ''
                    item.feb =item.feb? item.feb.toFixed(0).toString().replace(test, format):''
                    item.mar =item.mar? item.mar.toFixed(0).toString().replace(test, format):''
                    item.apr =item.apr? item.apr.toFixed(0).toString().replace(test, format):''
                    item.may =item.may? item.may.toFixed(0).toString().replace(test, format):''
                    item.jun =item.jun? item.jun.toFixed(0).toString().replace(test, format):''
                    item.jul =item.jul? item.jul.toFixed(0).toString().replace(test, format):''
                    item.aug =item.aug? item.aug.toFixed(0).toString().replace(test, format):''
                    item.sept =item.sept? item.sept.toFixed(0).toString().replace(test, format):''
                    item.oct =item.oct? item.oct.toFixed(0).toString().replace(test, format):''
                    item.nov =item.nov? item.nov.toFixed(0).toString().replace(test, format):''
                    item.dec =item.dec? item.dec.toFixed(0).toString().replace(test, format):''
                    item.totalPrice =item.totalPrice? item.totalPrice.toFixed(0).toString().replace(test, format):''
                  })
                  self.yearplan = year_temp
                }else {
                  this.yearplan = [
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
                              ]
                }

              })
              .catch(err=>{
                this.$message.error(err);
              })
            }).catch(error => {
              this.$message.error(error);
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
          if(self.costVersionStatus == '99'){//审批通过
            self.isShowSave = self.isShowApproval = false
            self.isShowDel  = false
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
          this.costVersionId = costVersion
          fetchUtils.get('/Costpayment/GetAnnualCostPay',{versionId:costVersion})
            .then(res =>{
              this.dynamic = res.rows.vBtCostDynamics;
              //格式化数据
              let other_temp = res.rows.vBtExtra;
              other_temp.forEach(function(item){
                let start = item.startEdition.toFixed(0).toString()
                let last = item.lastBudgetary.toFixed(0).toString()
                let re=/\d{1,3}(?=(\d{3})+$)/g;
                item.startEdition = start.replace(/^(\d+)((\.\d+)?)$/,function(s,s1,s2){return s1.replace(re,"$&,")+s2;});
                item.lastBudgetary = last.replace(/^(\d+)((\.\d+)?)$/,function(s,s1,s2){return s1.replace(re,"$&,")+s2;});
              })
              this.Other = other_temp;
              // 格式化数据
              let year_temp = res.rows.vbtAannualPlan
                  let re=/\d{1,3}(?=(\d{3})+$)/g;
                  function format(s,s1,s2){return s1.replace(re,"$&,")+s2;}
                  let test = /^(\d+)((\.\d+)?)$/
                  year_temp.forEach(function(item){
                    item.jan = item.jan.toFixed(0).toString().replace(test, format)
                    item.feb = item.feb.toFixed(0).toString().replace(test, format)
                    item.mar = item.mar.toFixed(0).toString().replace(test, format)
                    item.apr = item.apr.toFixed(0).toString().replace(test, format)
                    item.may = item.may.toFixed(0).toString().replace(test, format)
                    item.jun = item.jun.toFixed(0).toString().replace(test, format)
                    item.jul = item.jul.toFixed(0).toString().replace(test, format)
                    item.aug = item.aug.toFixed(0).toString().replace(test, format)
                    item.sept = item.sept.toFixed(0).toString().replace(test, format)
                    item.oct = item.oct.toFixed(0).toString().replace(test, format)
                    item.nov = item.nov.toFixed(0).toString().replace(test, format)
                    item.dec = item.dec.toFixed(0).toString().replace(test, format)
                    item.totalPrice = item.totalPrice.toFixed(0).toString().replace(test, format)
                  })
                  this.yearplan = year_temp

            })
            .catch(err=>{
              this.$message.error(err);
            })
      },
      costChangeVersion(val){
        this.costVersionId = val;
        this.changcostversion();
      },
      setFormatNumber (arg) {
        var re=/\d{1,3}(?=(\d{3})+$)/g;
        var num=arg.replace(/^(\d+)((\.\d+)?)$/,function(s,s1,s2){return s1.replace(re,"$&,")+s2;});
        return num
      },
      initNum(value, arg){
        value[arg] = value[arg].toString().split(",").join("")
      },
      checkNum(value) {
        let reg = /[^\d\.]/g;
        console.info(value.startEdition)
        this.$nextTick(()=>{
          if (value && new RegExp(reg).test(value.startEdition)) {//非数字
            this.$message({
                message: '请输入正确的数字',
                type: 'warning'
            })
            value.startEdition = ''
            return;
          } else {
            let num_1 = Number(value.startEdition).toFixed(0).toString()
            let re=/\d{1,3}(?=(\d{3})+$)/g;
            let num=num_1.replace(/^(\d+)((\.\d+)?)$/,function(s,s1,s2){return s1.replace(re,"$&,")+s2;});
            return value.startEdition=num
          }
        })
      },
      checkNum1(value) {
        let reg = /[^\d\.]/g;
        this.$nextTick(()=>{
          if (value && new RegExp(reg).test(value.lastBudgetary)) {//非数字
            this.$message({
                message: '请输入正确的数字',
                type: 'warning'
            })
            value.lastBudgetary = ''
            return;
          } else {
            let num_1 = Number(value.lastBudgetary).toFixed(0).toString()
            let re=/\d{1,3}(?=(\d{3})+$)/g;
            let num=num_1.replace(/^(\d+)((\.\d+)?)$/,function(s,s1,s2){return s1.replace(re,"$&,")+s2;});
            return value.lastBudgetary=num
          }
        })
      },
      checkNum2(value,attribute) {

        let reg = /[^\d\.]/g;
        this.$nextTick(()=>{
          if (value && new RegExp(reg).test(value[attribute])) {//非数字
            this.$message({
                message: '请输入正确的数字',
                type: 'warning'
            })
            value[attribute] = ''
            return;
          } else {
            let num_1 = Number(value[attribute]).toFixed(0).toString()
            let re=/\d{1,3}(?=(\d{3})+$)/g;
            let num=num_1.replace(/^(\d+)((\.\d+)?)$/,function(s,s1,s2){return s1.replace(re,"$&,")+s2;});
            return value[attribute]=num
          }
        })
      },
      totalPriceEvent(targetData, str){
        var regPos = /^\d+(\.\d+)?$/;
        if (!(regPos.test(event.target.value))) {
          targetData[str] = 0;
        }
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
       open() {
        this.$confirm('您确定要删除当前成本吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.delCost()
        })
        .catch((err)=>{
          if(err === 'cancel') return
          message.error( err );
        })
      },
      delCost() {
        fetchUtils.post('/Costpayment/DeleteAnnualInfo',{
          versionId:this.costVersionId
        })
        .then(res=>{
            this.$message.success("删除成功");
            this.initData()
            this.isShowApproval = false
        })
        .catch( err => {
            this.$message.error(err);
          })
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
            })
            .catch( err => {
              this.$message.error(err);
            })
      }
    },
    watch: {

    },
    components: {
      // ElInputNumber,
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
#costbox .operation{
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
  display: none;
}

</style>
