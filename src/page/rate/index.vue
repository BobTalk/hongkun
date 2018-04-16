<!-- 回款 -->
<template>
  <div id='rate'>
    <div class="company">
        <div class="company-title">
            <p class="title">集团动态利润率</p>
            <div class="company-status">
                <span class='operation' @click="save"><em class="el-icon-tickets"></em>保存</span>
            </div>

        </div>
        <div class="company-tb">
            <el-table :data="companyData" border style="width: 100%" align="center">
                <el-table-column
                    class=""
                    label="集团"
                    prop="QUARTER"
                    min-width="100">
                    <template slot-scope="scope">
                        <span style="margin-left: 10px" v-if='scope.row.QUARTER===1'>一季度</span>
                        <span style="margin-left: 10px" v-if='scope.row.QUARTER===2'>二季度</span>
                        <span style="margin-left: 10px" v-if='scope.row.QUARTER===3'>三季度</span>
                        <span style="margin-left: 10px" v-if='scope.row.QUARTER===4'>四季度</span>
                    </template>
                </el-table-column>
                <el-table-column
                    class=""
                    label="毛利率"
                    prop="MARGINRATE"
                    min-width="100">
                    <template slot-scope="scope">
                        <!-- <el-input v-if="latestRow.QUARTER === scope.row.QUARTER" size="mini"  :disabled="!editBydate || scope.row.ISEDIT === 0?true:false" 
                            v-model="scope.row.MARGINRATE" @blur="changeNumber(scope.row,'MARGINRATE')"></el-input>
                        <el-input v-else  size="mini" 
                            v-model="scope.row.MARGINRATE" :disabled="scope.row.ISEDIT === 0?true:false" @blur="changeNumber(scope.row,'MARGINRATE')"></el-input> -->
                        <!-- <el-input v-if="latestRow.QUARTER === scope.row.QUARTER" size="mini"  :disabled="scope.row.ISEDIT === 0?true:false" 
                            v-model="scope.row.MARGINRATE" @blur="changeNumber(scope.row,'MARGINRATE')"></el-input> -->
                        <el-input  size="mini" 
                            v-model="scope.row.MARGINRATE"  @blur="changeNumber(scope.row,'MARGINRATE')"></el-input>
                    </template>
                </el-table-column>
                <el-table-column
                    class=""
                    label="净利率"
                    prop="NETMARGINRATE"
                    min-width="100">
                    <template slot-scope="scope">
                        <!-- <el-input v-if="latestRow.QUARTER === scope.row.QUARTER" size="mini"  :disabled="!editBydate || scope.row.ISEDIT === 0?true:false"
                            v-model="scope.row.NETMARGINRATE" @blur="changeNumber(scope.row,'NETMARGINRATE')"></el-input>
                        <el-input v-else size="mini"  
                        v-model="scope.row.NETMARGINRATE" :disabled="scope.row.ISEDIT === 0?true:false" @blur="changeNumber(scope.row,'NETMARGINRATE')"></el-input> -->
                        <!-- <el-input v-if="latestRow.QUARTER === scope.row.QUARTER" size="mini"  :disabled="scope.row.ISEDIT === 0?true:false"
                            v-model="scope.row.NETMARGINRATE" @blur="changeNumber(scope.row,'NETMARGINRATE')"></el-input> -->
                        <el-input size="mini"  
                        v-model="scope.row.NETMARGINRATE" @blur="changeNumber(scope.row,'NETMARGINRATE')"></el-input>
                    </template>
                </el-table-column>
            </el-table>
      </div>
    </div>
    <div class="city">
        <div class="city-title">
            <p class="title">城市公司上季度利润率</p>
            <div class="city-status">
            </div>

        </div>
        <div class="city-tb">
            <el-table :data="cityData" border style="width: 100%" align="center">
              <el-table-column
                    class=""
                    label="城市公司"
                    prop="QUARTER"
                    min-width="100">
                    <template slot-scope="scope">
                        <span style="margin-left: 10px" >{{scope.row.GROUPNAME}}</span>
                    </template>
                </el-table-column>
                <el-table-column
                    class=""
                    label="毛利率"
                    prop="MARGINRATE"
                    min-width="100">
                    <template slot-scope="scope">
                        <!-- <el-input v-if="editBydate" size="mini"  :disabled="false" 
                            v-model="scope.row.MARGINRATE" @blur="changeNumber(scope.row,'MARGINRATE')" ></el-input>
                        <el-input v-else  size="mini" :disabled="(scope.row.ISEDIT === 0?true:false)"
                            v-model="scope.row.MARGINRATE" @blur="changeNumber(scope.row,'MARGINRATE')" ></el-input> -->
                            <el-input  size="mini" 
                            v-model="scope.row.MARGINRATE" @blur="changeNumber(scope.row,'MARGINRATE')" ></el-input>
                    </template>
                </el-table-column>
                <el-table-column
                    class=""
                    label="净利率"
                    prop="NETMARGINRATE"
                    min-width="100">
                    <template slot-scope="scope">
                        <!-- <el-input v-if="editBydate" size="mini"  :disabled="false"
                            v-model="scope.row.NETMARGINRATE" @blur="changeNumber(scope.row,'NETMARGINRATE')"></el-input>
                        <el-input v-else size="mini"  :disabled=" (scope.row.ISEDIT === 0?true:false)"
                        v-model="scope.row.NETMARGINRATE" @blur="changeNumber(scope.row,'NETMARGINRATE')"></el-input> -->
                        <el-input size="mini"  
                        v-model="scope.row.NETMARGINRATE" @blur="changeNumber(scope.row,'NETMARGINRATE')"></el-input>
                    </template>
                </el-table-column>
            </el-table>
        </div>
    </div>
    <!-- <div class="right" v-if="commonPathRoleAuthority.indexOf('btn_edit') > -1">
        <div class="city-title ">
            <p class="title">设置利润率编辑权限</p>
            <div class="city-status">
                <span class='operation' @click="edit"><em class="el-icon-tickets"></em>编辑</span>
                <span class='operation' @click="saveRight"><em class="el-icon-tickets"></em>保存</span>
            </div>
        </div>
        <div class="control">
            <div class="item" style="display:inline-block;margin-right:20px;">是否允许编辑集团动态利润率：</div>
            <div class="item">
                <div class="item">
                    <span>一季度：</span>
                    <template>
                        <el-radio :disabled =isEdit v-model="radio1" label="1">是</el-radio>
                        <el-radio :disabled =isEdit v-model="radio1" label="2">否</el-radio>
                    </template>   
                </div>
                <div class="item">
                    <span>二季度：</span>
                    <template>
                        <el-radio :disabled =isEdit v-model="radio2" label="3">是</el-radio>
                        <el-radio :disabled =isEdit v-model="radio2" label="4">否</el-radio>
                    </template>   
                </div>
                <div class="item">
                    <span>三季度：</span>
                    <template>
                        <el-radio :disabled =isEdit v-model="radio3" label="5">是</el-radio>
                        <el-radio :disabled =isEdit v-model="radio3" label="6">否</el-radio>
                    </template>   
                </div>
                <div class="item">
                    <span>四季度：</span>
                    <template>
                        <el-radio :disabled =isEdit v-model="radio4" label="7">是</el-radio>
                        <el-radio :disabled =isEdit v-model="radio4" label="8">否</el-radio>
                    </template>   
                </div>
                
            </div>
            <div class="item" style="display:inline-block;margin-right:20px;">是否允许编辑城市公司动态利润率：</div>
            <div class="item">
                <span>城市公司：</span>
                <template>
                    <el-radio :disabled =isEdit v-model="radio5" label="9">是</el-radio>
                    <el-radio :disabled =isEdit v-model="radio5" label="10">否</el-radio>
                </template>   
            </div>
            
        </div>
    </div> -->
  </div>
</template>

<script>
import {mapState, mapGetters, mapActions} from 'vuex';
import './rate.less'
import {message, fetchUtils} from '../../utils';
export default {
  data() {
     return {
        editBydate:false,//根据当前时间判断是否在10-15号中的一天
        latestRow:{},
        companyData: [],
        cityData:[],
        isEdit:true,
        // year:'',
        // quarter:'',
        // radio1:"1",
        // radio2:"3",
        // radio3:"5",
        // radio4:"7",
        // radio5:"9"
    }
  },
  mounted() {
    this.$nextTick(function() {
        this.getInitRate()
        this.getInitCity()
        // this.orEdit()
        let user_info = localStorage.getItem('userInfo')
        // console.info(user_info)
    })
  },
  computed: {
    ...mapGetters(['commonPathRoleAuthority']),
  },
  methods: {
        //   根据系统时间判断是否可编辑，10-15号可编辑上一季度
    //   orEdit(){
    //     let dt = new Date()
    //     let curr_day = dt.getDate()
    //     // let curr_day = 9
    //     if (curr_day <16 && curr_day >9){
    //         this.editBydate = true//可编辑,disabled为false
    //     } else {
    //         this.editBydate = false
    //     }
    //     // console.info(this.editBydate)
    //   },
    //   初始化版本列表
      getInitRate(){
          let self = this
          fetchUtils.post('/Bnterestate/GetGroupMargin')
          .then(res => {
            //   console.info(res.rows)
            if(res.rows && res.rows.length>0){
                self.companyData = res.rows
                let len = res.rows.length
                self.latestRow = res.rows[len-1]
                self.year = res.rows[0].YEAR
            }
            // console.info(self.latestRow)
          }).catch(err => {
              self.$message.error(res.message);
            //   console.info(err)
          })
      },
      getInitCity() {
        fetchUtils.post('/Bnterestate/GetCompanyMargin')
          .then(res => {
            // console.info(res)
            if(res.rows && res.rows.length >0){
                this.cityData = res.rows
            }
          }).catch(err => {
            //   console.info(err)
            this.$message.error(res.message);
          })
      },
      changeNumber (obj,arr) {
        this.isShow = ''
        event.stopPropagation();
        if(event.target.value == '' || isNaN(Number(event.target.value))){
          this.$message({
            message: '请输入数字',
            type: 'warning'
          });
          obj[arr] = 0
          return false
        }
        obj[arr] = Number(event.target.value).toFixed(1)
      },
      save() {
        let savelist = this.companyData.concat(this.cityData)
        let self = this
        fetchUtils.post('/Bnterestate/SaveBnterestate',{
            bnterestateInfo:JSON.stringify(savelist)
        })
        .then(res=>{
            self.$message.success("保存成功");
        })
        .catch(err=>{
            this.$message.error(err);
        })
      },
    //   saveRight(){
    //     if(this.radio1 === "1"){
           
    //     }
    //     fetchUtils.post('/Bnterestate/OpenSwitch',{
    //         datatype:0,
    //         year:this.YEAR,
    //         quarter:1
    //     })
    //     .then(res=>{
    //         this.$message.success("设置成功");
    //         this.getInitRate()
    //         this.getInitCity()
    //     })
    //     .catch(err=>{
    //         this.$message.error(err);
    //     })
    //   },
    //   edit() {
    //     this.isEdit = false
    //   }
  }
}
</script>


<style scoped>
.company-title{
    width: 100%;
    height: 36px;
    line-height: 34px;
    font-size: 15px !important;
    border-bottom: 2px solid #F4F6F9;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
}
.title{
    display:inline-block;
    font-size: 15px !important;
    border-bottom: 2px solid rgb(68, 120, 232);
    font-weight: bold;
}
.city-title>.title{
    height: 25px;
}
.company-status{
    display: inline-block;
    float: right;
}
</style>
