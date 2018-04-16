<!-- 考核版本 -->
<template>
    <div id='assessment'>
        <div class="assess-title">
            <p class="title">考核版本设置</p>
            <span id='operation' @click="save"><em class="el-icon-tickets"></em>保存</span>
        </div>
        <div class='filter-wrapper'>
            <div class="tip">城市公司：</div>
            <div class="filter-select">
                <el-select v-model="currentCompany" placeholder="请选择">
                    <el-option
                    v-for="item in companies"
                    :key="item.val"
                    :label="item.label"
                    :value="item.label">
                    </el-option>
                </el-select>
            </div>
            <div class="tip">项目：</div>
            <div class="filter-text">
                <el-input v-model="project" placeholder="请输入内容"></el-input>
            </div>
            <div class="filter-btn">
                <span class='operation1' @click="getProject">查询</span>
            </div>
        </div>
        <div class='result'>
            <el-table
            :data="tabData"
            border
            height="110px"
            style="width: 100%;white-space:nowrap;text-align:center;border:solid 1px #ebeef5;">
                <el-table-column
                v-for = "(item ,STAGEID) in projectTitle"
                :key = "STAGEID"
                :prop="item.field"
                :label="item.name">
                    <template slot-scope="scope">
                        <div v-if="((item.field =='STAGENAME')||(item.field =='PROJECTNAME')||(item.field =='COMPANYNAME'))">
                            <!-- <el-input :disabled="((item.field =='STAGENAME')||(item.field =='PROJECTNAME')||(item.field =='COMPANYNAME'))" v-model="scope.row[item.field]" class="" size="mini" :min="0" :max="999999999" ></el-input> -->
                            <span>{{scope.row[item.field]}}</span>
                        </div>
                        <div v-else>
                            <div class="block">
                                <el-date-picker
                                    v-model="scope.row[item.field]"
                                    type="month"
                                    placeholder="选择月"
                                    @change=setting(scope.row)>
                                </el-date-picker>
                            </div>
                            <!-- <el-input :disabled="((item.field =='STAGENAME')||(item.field =='PROJECTNAME')||(item.field =='COMPANYNAME'))" v-model="scope.row[item.field]" class="" size="mini" :min="0" :max="999999999" ></el-input>                             -->
                        </div>
                    </template>
                </el-table-column>
        </el-table>
        </div>
    </div>
</template>

<script>
import {mapState, mapGetters, mapActions} from 'vuex';
import {fetchUtils} from '../../utils';
import './assessment.less'

export default {
    name:'Assessment',
    data () {
        return {
            companies:[],
            tabData:[],
            dateNum:[],
            currentCompany:'',//当前选择的公司名称
            currentCompanyId:'',//当前选择的公司ID
            project:'',//当前输入的项目名
            value4:'',
            passData:[],
            projectInfo:[],
            projectTitle:[
                {
                "field": "COMPANYNAME",
                "name": "城市公司",
                "STAGEID":'',
                },
                {
                "field": "PROJECTNAME",
                "name": "项目",
                "STAGEID":''
                },
                {
                "field": "STAGENAME",
                "name": "分期",
                "STAGEID":''
                },
                {
                "field": "SUPPLY",
                "name": "供货",
                "STAGEID":''
                },
                {
                "field": "SIGNACONTRACT",
                "name": "签约",
                "STAGEID":''
                },
                {
                "field": "INCOME",
                "name": "回款",
                "STAGEID":''
                }
            ]
        }
    },
   created() {
        this.getCompany()
        this.getProject()
    },
    methods: {
        getCompany() {
            fetchUtils.get('/custom/GetAllCompany')
            .then(res =>{
                if(res.rows && res.rows.length>0){
                    this.companies = res.rows
                }
            })
            .catch(err=>{
                this.$message.error(err);
            })
        },
        getProject() {
            let self = this
            let companyAll = self.companies
            if(self.currentCompany !== ''){
                companyAll.forEach(function(item){
                    if(item.label === self.currentCompany){
                        self.currentCompanyId = item.val
                    }
                })
            }
            fetchUtils.post('/custom/GetCustomTagList',{
                companyId:this.currentCompanyId,
                projectName :this.project
            })
            .then(res=>{
                // console.info(res)
                if(res.rows && res.rows.length > 0){
                    self.tabData = res.rows
                }else{
                    self.tabData =[]
                }
            })
            .catch(err=>{
                this.$message.error(err)
            })
        },
        setting(item){
            // console.info(item.STAGEID)
            // console.info(item)
            function checkTime(i){
                if (i<=9){
                    i="0" + i;
                }
                return i;
            }
            let supply_1=''
            let signacontract_1=''
            let income_1=''
            if(item.INCOME && item.INCOME !== '' && (Object.prototype.toString.call(item.INCOME).slice(8, -1) === 'Date')){
                income_1 = item.INCOME.getFullYear()+'-'+checkTime(item.INCOME.getMonth()+1)
            } else if(item.INCOME && item.INCOME !== '' && (Object.prototype.toString.call(item.INCOME).slice(8, -1) === 'String')){
                income_1 = item.INCOME
            }

            if(item.SIGNACONTRACT && item.SIGNACONTRACT !=='' && (Object.prototype.toString.call(item.SIGNACONTRACT).slice(8, -1) === 'Date')){
                signacontract_1 = item.SIGNACONTRACT.getFullYear()+'-'+checkTime(item.SIGNACONTRACT.getMonth()+1)
            } else if(item.SIGNACONTRACT && item.SIGNACONTRACT !== '' && (Object.prototype.toString.call(item.SIGNACONTRACT).slice(8, -1) === 'String')){
                signacontract_1 = item.SIGNACONTRACT
            }

            if(item.SUPPLY && item.SUPPLY !== '' && (Object.prototype.toString.call(item.SUPPLY).slice(8, -1) === 'Date')){
                supply_1 = item.SUPPLY.getFullYear()+'-'+checkTime(item.SUPPLY.getMonth()+1)
            } else if(item.SUPPLY && item.SUPPLY !== '' && (Object.prototype.toString.call(item.SUPPLY).slice(8, -1) === 'String')){
                supply_1 = item.SUPPLY
            }
            // console.info(supply_1)
            // console.info(signacontract_1)
            // console.info(income_1)
            let self = this
            if(self.projectInfo.length > 0){
                let ids = []
                self.projectInfo.forEach(function(asd){
                    ids.push(asd.BUSINESSID)
                })
                if(ids.indexOf(item.STAGEID) > -1){
                    let num = ids.indexOf(item.STAGEID)
                    // alert(num)
                    self.projectInfo[num].SUPPLY = supply_1
                    self.projectInfo[num].SIGNACONTRACT = signacontract_1
                    self.projectInfo[num].INCOME = income_1
                }else{
                    self.projectInfo.push({BUSINESSID:item.STAGEID,SUPPLY:supply_1,SIGNACONTRACT:signacontract_1,INCOME:income_1})
                }
            }else{
                self.projectInfo.push({BUSINESSID:item.STAGEID,SUPPLY:supply_1,SIGNACONTRACT:signacontract_1,INCOME:income_1})
            }
            // this.projectInfo.push({BUSINESSID:item.STAGEID,SUPPLY:supply_1,SIGNACONTRACT:signacontract_1,INCOME:income_1})
            // let ids_ = []
            // console.info(self.projectInfo)
            // self.projectInfo.forEach(function(asd){
            //     ids_.push(asd.BUSINESSID)
            // })
            // console.info(ids_)
            // console.info(self.projectInfo)
        },
        save() {
            fetchUtils.post('/custom/SaveCustomTag',{
                customInfo:JSON.stringify(this.projectInfo)
            })
            .then(res=>{
                this.$message.success("数据保存成功");
            })
            .catch(err=>{
                this.$message.error(err);
            })
        }
    }
}
</script>

<style scoped>

</style>

