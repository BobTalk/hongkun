<!-- 回款 -->
<template>
  <div id='payment'>
    <div class="budget">
        <div class="budget-title">
            <p class="title">预算版</p>
            <div class="budget-status">
                <!-- <span class='operation' @click="save"><em class="el-icon-tickets"></em>保存</span> -->
                <span class="version_width" style="color: rgb(76, 170, 244);font-size:12px;">当前版本:</span>
                <span class="btn">
                    <el-select class="version_width" v-model="currentSelectVersion" placeholder="请选择" @change="changVersion">
                        <el-option
                        v-for="item in versions"
                        :key="item.id"
                        :label="item.name"
                        :value="item.name">
                        </el-option>
                    </el-select>
                </span>
                <!-- <span  style="margin-left: 10px;font-size:12px;">状态:{{currentVersionState}}</span> -->
            </div>

        </div>
        <div class="budget-tb">
            <el-table :data="budgetData" border style="width: 100%" align="center">
                <el-table-column
                    v-for="(title,index) in budgetTitle"
                    :key="index"
                    :fixed="index===0"
                    class=""
                    :label="title.name"
                    :prop="title.field"
                    min-width="100"
                >
                </el-table-column>
            </el-table>
      </div>
    </div>
    <div class="implement-tb">
        <div class="implement-title">
            <p class="title">动态实施版</p>
            <div class="budget-status">
                <span v-if="isShowEdit && commonPathRoleAuthority.indexOf('btn_edit') > -1" class='operation' @click="edit"><em class="el-icon-edit-outline"></em>编辑</span>
                <span v-if="isShowSave && commonPathRoleAuthority.indexOf('btn_edit') > -1" class='operation' @click="save"><em class="el-icon-tickets"></em>保存</span>
                <span v-if="isShowApproval && commonPathRoleAuthority.indexOf('btn_approval') > -1" class='operation' @click="startApproval"><em class="el-icon-share"></em>发起审批</span>
                <span v-if="currentVersionState =='审批中'"  style="margin-left: 10px;font-size:12px;">状态:{{currentVersionState}}</span>
            </div>

        </div>
        <div class="dynamic-tb">
            <el-table :data="tabData"  border style="white-space:nowrap;width: 100%" align="center">
              <div v-for="(title,index) in dynamicTitle" :key="index">
                <div v-if="title.field == 'productName'">
                  <el-table-column fixed="left" :prop="title.field" :label="title.name" width="100" >
                  </el-table-column>
                </div>
                <div v-else>
                    <el-table-column :label="title.name" :prop="title.field" width="100">
                      <template slot-scope="scope">
                        <div v-if="title.edit == '+r'">
                          <span class="spanStyles">{{scope.row[title.field] | setFormatNumber}}</span>
                        </div>
                        <div v-else>
                          <el-input v-if="title.field !='totalIncome_1'" class="month-pay" :disabled="tbshow || (title.edit == '+w'? false: true)"  size="small"
                                    @focus="focusClick($event,scope.row,title.field)"  @blur="blurClick($event,scope.row,title.field,title.min,title.max)" v-model="scope.row[title.field]"></el-input>
                          <!--<span :class="tbshow?'spanStyle':''" v-else @click="clicknum(title.field)">{{setFormatNumber(scope.row[title.field]?scope.row[title.field].toString():'')}}</span>-->
                        </div>
                      </template>
                    </el-table-column>
                </div>
              </div>
            </el-table>
        </div>
    </div>
  </div>
</template>

<script>
import './payment.less'
import {message, fetchUtils} from '../../utils';
export default {
//   name:{Payment},
  data() {
     return {
        versions:[],//版本列表
        ID:'',//分期ID
        isDisabled:false,
        iscontrols:false,
        isEdit:true,
        tbshow:true,//点击编辑后，tbshow = false
        isShowApproval:false,
        isShowSave:false,
        currentSelectVersion:'',//当前选中版本name，默认显示最高版本
        currentSelectVersionId:'',//当前选中版本的id,第一次时为后台返回，当有预算版本时取最高版
        currentVersionState:'无',  //当前版本状态
        budgetTitle:[],//预算版表头
        budgetData:[],//预算版数据
        dynamicId:'',//动态实施版id
        dynamicName:'',
        currentYear:'',//返回的年份
        versionStatus:'',//动态实施版状态码
        isShowEdit:false,//是否显示动态实施版的编辑按钮
        dynamicTitle:[],//动态版表头
        dynamicData: [
            {
                "productName": "",
                "versionId": "",
                "stageId": "",
                "yearD": "",
                "payMent": '',
                "totalIncome_1": '',
                "month_1": '',
                "month_2": '',
                "month_3": "",
                "month_4": '',
                "month_5": '',
                "month_6": '',
                "month_7": '',
                "month_8": '',
                "month_9": '',
                "month_10": '',
                "month_11": '',
                "month_12": ''
                // "month_now": ''
            }
        ],//动态版数据
       isShow: '',

    }
  },
  mounted() {
    this.$nextTick(function() {
        this.checkStage()
        // this.getInitversions()
        // this.syncScroll()
    })
  },
  created() {
  },
  computed: {
    tabData: function () {
        let self = this
        let tabData = this.dynamicData
        tabData.forEach(function(item) {
//            item.month_1
//            计算总和
            item.totalIncome_1 =
            parseInt(isNaN(parseFloat(self.replaceStr(item.month_1)).toFixed(0))?'':parseFloat(self.replaceStr(item.month_1)).toFixed(0))+
            parseInt(isNaN(parseFloat(self.replaceStr(item.month_2)).toFixed(0))?'':parseFloat(self.replaceStr(item.month_2)).toFixed(0))+
            parseInt(isNaN(parseFloat(self.replaceStr(item.month_3)).toFixed(0))?'':parseFloat(self.replaceStr(item.month_3)).toFixed(0))+
            parseInt(isNaN(parseFloat(self.replaceStr(item.month_4)).toFixed(0))?'':parseFloat(self.replaceStr(item.month_4)).toFixed(0))+
            parseInt(isNaN(parseFloat(self.replaceStr(item.month_5)).toFixed(0))?'':parseFloat(self.replaceStr(item.month_5)).toFixed(0))+
            parseInt(isNaN(parseFloat(self.replaceStr(item.month_6)).toFixed(0))?'':parseFloat(self.replaceStr(item.month_6)).toFixed(0))+
            parseInt(isNaN(parseFloat(self.replaceStr(item.month_7)).toFixed(0))?'':parseFloat(self.replaceStr(item.month_7)).toFixed(0))+
            parseInt(isNaN(parseFloat(self.replaceStr(item.month_8)).toFixed(0))?'':parseFloat(self.replaceStr(item.month_8)).toFixed(0))+
            parseInt(isNaN(parseFloat(self.replaceStr(item.month_9)).toFixed(0))?'':parseFloat(self.replaceStr(item.month_9)).toFixed(0))+
            parseInt(isNaN(parseFloat(self.replaceStr(item.month_10)).toFixed(0))?'':parseFloat(self.replaceStr(item.month_10)).toFixed(0))+
            parseInt(isNaN(parseFloat(self.replaceStr(item.month_11)).toFixed(0))?'':parseFloat(self.replaceStr(item.month_11)).toFixed(0))+
            parseInt(isNaN(parseFloat(self.replaceStr(item.month_12)).toFixed(0))?'':parseFloat(self.replaceStr(item.month_12)).toFixed(0)) || 0

            item.month_1 = self.replaceNum(self.checkM(item.month_1))
            item.month_2 = self.replaceNum(self.checkM(item.month_2))
            item.month_3 = self.replaceNum(self.checkM(item.month_3))
            item.month_4 = self.replaceNum(self.checkM(item.month_4))
            item.month_5 = self.replaceNum(self.checkM(item.month_5))
            item.month_6 = self.replaceNum(self.checkM(item.month_6))
            item.month_7 = self.replaceNum(self.checkM(item.month_7))
            item.month_8 = self.replaceNum(self.checkM(item.month_8))
            item.month_9 = self.replaceNum(self.checkM(item.month_9))
            item.month_10 = self.replaceNum(self.checkM(item.month_10))
            item.month_11= self.replaceNum(self.checkM(item.month_11))
            item.month_12= self.replaceNum(self.checkM(item.month_12))
        })
        return tabData
    },
    commonPathRoleAuthority(){
        return this.$store.state.common.commonPathRoleAuthority
    }
  },
  watch: {
    // dynamicData
  },
  methods: {
      checkM(arg){
        let num = ''
        let reg = /^[0-9,.]+$/
        if(reg.test(arg)){
          num = arg
        }
       return num
      },
      focusClick(evt,item,arr){
          let event =  evt || window.event;
          event.target.value = this.replaceStr(event.target.value)
          item[arr] = this.replaceStr(item[arr])
      },
      blurClick(evt,item,arr,min,max){
         
        let event =  evt || window.event;
        //   console.info(Number(event.target.value))
        
        if(event.target.value.indexOf(",")){
          event.target.value = this.replaceStr(event.target.value)
        }
       if(isNaN(parseFloat(event.target.value).toFixed(0))) {
         this.$message({
           message: '请输入数字',
           type: 'warning'
         });
         event.target.value = 0
         item[arr] = 0
        //  return false
       }
        if( Number(event.target.value) < min || Number(event.target.value) > max){
            console.info(Number(event.target.value))
        this.$message({
            message: "输入数值必须大于或等于"+min,
            type: 'warning'
          });
          obj[arr] = 0
          return false
        }
        event.target.value = this.replaceNum(event.target.value)
        item[arr] = this.replaceNum(item[arr].toString())
      },
      replaceNum (reg){
        var re=/\d{1,3}(?=(\d{3})+$)/g;
        return reg.toString().replace(/^(\d+)((\.\d+)?)$/,function(s,s1,s2){return s1.replace(re,"$&,")+s2;});
      },
      replaceStr(str){
          if(str == null){
            str = ''
          }
            return  Number(str.toString().replace(/\,/g, "")).toFixed(0)
      },
      syncScroll(){
        let tbs_1 = document.querySelectorAll('.budget-tb .el-table__body-wrapper')
        let tbs_2 = document.querySelectorAll('.implement-tb .el-table__body')
        let budget = document.querySelector('.budget')
        let implement = document.querySelector('.implement-tb')
        let scale = (tbs_1[0].offsetWidth-budget.offsetWidth) / (tbs_2[0].offsetWidth-implement.offsetWidth)
        let currentTab = 0
        // console.info(scale)
        tbs_1[0].addEventListener('scroll', ()=>{
            // alert(333)
            if (currentTab !== 1) return
            tbs_2[0].scrollLeft = tbs_1[0].scrollLeft * scale
        })
        tbs_2[0].addEventListener('scroll', ()=>{
            if (currentTab !== 2) return
            tbs_1[0].scrollLeft = r.scrollLeft / scale
        })
        tbs_1[0].addEventListener('mouseover', ()=>{
            // alert(111)
            // 1 表示表示当前鼠标位于 .left元素范围内
            currentTab = 1
        })
        tbs_2[0].addEventListener('mouseover', ()=>{
            // alert(222)
            // 2 表示表示当前鼠标位于 .right元素范围内
            currentTab = 2
        })

      },

      //   初始校验是否有审核通过的分期和价格
      checkStage(){
          const {nodeId, mode} = this.$route.query;
          this.ID = nodeId
         fetchUtils.post('/Income/ICheckIncomeControl',{
            stageId:this.ID
         }).then(res => {
           if(res.errorcode && res.errorcode === 200) {
                // alert(111)
                this.getInitversions()
                this.isShowSave = true
            }
         }).catch(err => {
            this.$message.error(err)
         })
      },
      //   初始化版本列表
      getInitversions(){
          const {nodeId, mode} = this.$route.query;
          this.ID = nodeId
          fetchUtils.post('/Income/IGetVersionList',{
            stageId:this.ID
          }).then(res => {
              if(res.rows.versionList && res.rows.versionList.length >0){
                this.versions = res.rows.versionList
                this.currentSelectVersion = res.rows.versionList[0].name
                this.currentSelectVersionId = this.versions[0].id//默认显示最高版本的id
              } else {
                this.versions = []
                this.currentSelectVersionId = res.rows.versionSingle.id//首次无版本id时从后台获取
              }
                this.dynamicId = res.rows.versionSingle.id
                this.currentVersionState = res.rows.versionSingle.name
                this.versionStatus = res.rows.versionSingle.status
                if(res.rows.versionSingle.isShowEdit === "1"){
                    this.isShowSave = this.isShowEdit = true
                }else {
                    this.isShowSave = this.isShowEdit = false
                }
                this.getBudget()
                this.getDynamic()
          }).catch(err => {
            //   console.info(err)
            this.$message.error(err)
          })
      },
      // 预算版数据
      getBudget() {
        fetchUtils.post('/Income/IGetIncomeList',
        {
            versionId:this.currentSelectVersionId,
            stageId:this.ID
        })
        .then(res=>{
            this.budgetTitle = res.rows.titleInfo
            // this.budgetData = res.rows.incomeDataList
            let temp_budget = res.rows.incomeDataList
            let re=/\d{1,3}(?=(\d{3})+$)/g;
            function format(s,s1,s2){return s1.replace(re,"$&,")+s2;}
            let test = /^(\d+)((\.\d+)?)$/
            temp_budget.forEach(function(item){
                item.payMent = item.payMent ? item.payMent.replace(test, format):''
                item.totalIncome_1 = item.totalIncome_1 ? item.totalIncome_1.replace(test, format):''
                item.month_1 = item.month_1 ? item.month_1.replace(test, format):''
                item.month_2 = item.month_2 ? item.month_2.replace(test, format):''
                item.month_3 = item.month_3 ? item.month_3.replace(test, format):''
                item.month_4 = item.month_4 ? item.month_4.replace(test, format):''
                item.month_5 = item.month_5 ? item.month_5.replace(test, format):''
                item.month_6 = item.month_6 ? item.month_6.replace(test, format):''
                item.month_7 = item.month_7 ? item.month_7.replace(test, format):''
                item.month_8 = item.month_8 ? item.month_8.replace(test, format):''
                item.month_9 = item.month_9 ? item.month_9.replace(test, format):''
                item.month_10 = item.month_10 ? item.month_10.replace(test, format):''
                item.month_11 = item.month_11 ? item.month_11.replace(test, format):''
                item.month_12 = item.month_12 ? item.month_12.replace(test, format):''

            })
        //   console.info(temp_budget)
            this.budgetData = temp_budget
            // this.syncScroll()
        })
        .catch(err =>{
            this.$message.error(err)
            // console.log(err)
        })
      },
      //得到动态调整版数据
      getDynamic() {
        fetchUtils.post('/Income/IGetIncomeEditList',
        {
            versionId:this.dynamicId,
            stageId:this.ID
        })
        .then(res=>{
            this.dynamicTitle = res.rows.titleInfo
            if(res.rows.incomeDataList && res.rows.incomeDataList.length >0 ){
                this.dynamicData = res.rows.incomeDataList
                this.dynamicData.productName = res.rows.incomeDataList[0].productName
            }
            this.syncScroll()
        })
        .catch(err =>{
            this.$message.error(err)
            // console.log(err)
        })
      },
      //更改预算版的版本显示
      changVersion(){
        let self = this
         self.versions.forEach(function(item){
              if (item.name == self.currentSelectVersion) {
                self.currentSelectVersionId = item.id
              }
            })
        self.getBudget()
      },
      changeNumber (obj,arr,min,max) {
        //   console.info(JSON.parse('{"type": "number(2)","max": "999999999","min": "140"}'))
        this.isShow = ''
        event.stopPropagation();
        if(event.target.value == '' || isNaN(Number(event.target.value))){
          this.$message({
            message: '请输入数字',
            type: 'warning'
          });
          obj[arr] = 0
        }
        if( Number(event.target.value) < min || Number(event.target.value) > max){
            // alert()
            console.info(Number(event.target.value))
        this.$message({
            message: "输入数值必须大于或等于"+min,
            type: 'warning'
          });
          obj[arr] = 0
          return false
        }
        // obj[arr] = parseInt(event.target.value)
        obj[arr] = Number(event.target.value).toFixed(0)
      },
      focusnum(arr){
        //   alert(111)
        if(this.tbshow == true){
            return false
        }
        // alert(222)
        this.isShow = arr
        event.stopPropagation();
      },
      clicknum(arr){
          alert()
        if(this.tbshow == true){
            return false
        }
        this.focusnum(arr)
      },
      edit() {
        this.tbshow = false
        this.currentVersionState = '编制中'
      },
      save() {
        let saveList = []
        saveList.push({filedId:"totalIncome_1",value:this.dynamicData[0].totalIncome_1})
        saveList.push({filedId:"month_1",value:this.dynamicData[0].month_1})
        saveList.push({filedId:"month_2",value:this.dynamicData[0].month_2})
        saveList.push({filedId:"month_3",value:this.dynamicData[0].month_3})
        saveList.push({filedId:"month_4",value:this.dynamicData[0].month_4})
        saveList.push({filedId:"month_5",value:this.dynamicData[0].month_5})
        saveList.push({filedId:"month_6",value:this.dynamicData[0].month_6})
        saveList.push({filedId:"month_7",value:this.dynamicData[0].month_7})
        saveList.push({filedId:"month_8",value:this.dynamicData[0].month_8})
        saveList.push({filedId:"month_9",value:this.dynamicData[0].month_9})
        saveList.push({filedId:"month_10",value:this.dynamicData[0].month_10})
        saveList.push({filedId:"month_11",value:this.dynamicData[0].month_11})
        saveList.push({filedId:"month_12",value:this.dynamicData[0].month_12})
        saveList.push({filedId:"payMent",value:this.dynamicData[0].payMent})
        let paramsData = {
            versionId:this.currentSelectVersionId,
            stageId:this.ID,
            saveList:saveList
        }
        let self = this
        fetchUtils.post('/Income/ISaveIncomeInfo',{
            paramsData:JSON.stringify(paramsData)
        })
        .then(res=>{
            if(res.errorcode === 200){
                self.tbshow = true
                self.isShowApproval = true
                self.dynamicId = res.rows.ID
                self.$message.success("保存成功");
            }else{
                self.$message.error(res.message);
            }

        })
        .catch(err=>{
            self.$message.error(err);
        })
      },
      // 发起审批，复用
      startApproval(){
        let _data = {
          entiId: 10109,
          dataKey: this.dynamicId
        }
        this.$store.dispatch("commonStartApproval", _data)
          .then(res => {
            message.success("提交审批成功");
            this.isShowEdit = this.isShowApproval = this.isShowSave = false
            this.getInitversions();
          }).catch(err => {
          message.error(err);
        })
      },
  },
  filters:{
    setFormatNumber (arg) {
      var re=/\d{1,3}(?=(\d{3})+$)/g;
      var num=arg.toString().replace(/^(\d+)((\.\d+)?)$/,function(s,s1,s2){return s1.replace(re,"$&,")+s2;});
      return num
    },
  }
}
</script>


<style scoped>
#payment{
    margin-top:60px;
}
.budget-title{
    width: 100%;
    height: 36px;
    line-height: 34px;
    font-size: 15px !important;
    border-bottom: 2px solid #F4F6F9;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
}
.title{
    /* width: 45px; */
    /* height: 25px; */
    display:inline-block;
    font-size: 15px !important;
    border-bottom: 2px solid rgb(68, 120, 232);
    font-weight: bold;
}
.implement-title>.title{
    height: 25px;
}
.budget-status{
    display: inline-block;
    float: right;
}
</style>
