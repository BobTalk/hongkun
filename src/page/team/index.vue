<template>
  <div id="team">
    <div class="title">
      <div class="team-title">项目团队维护</div>
      <div class="save_btn" v-if="save_show">
        <el-button class='save-btn' size="mini" @click="save"><i class="el-icon-document"></i>保存</el-button>
      </div>
    </div>
    <div class="header">
      <el-row>
        <el-col :span="6"><div class="grid-content">
          所属公司
        </div>
        </el-col>
        <el-col :span="6"><div class="grid-content">
          <span>{{teamBaseInfo.BaseInfo.Company}}</span>
        </div>
        </el-col>
        <el-col :span="6"><div class="grid-content">
          所属城市
        </div>
        </el-col>
        <el-col :span="6" class="borderRight"><div class="grid-content">
          <span>{{teamBaseInfo.BaseInfo.CityName}}</span>
        </div>
        </el-col>
      </el-row>
      <el-row class="borderTop">
        <el-col :span="6"><div class="grid-content">
          项目名称
        </div>
        </el-col>
        <el-col :span="6"><div class="grid-content">
          <span>{{teamBaseInfo.BaseInfo.ProjectName}}</span>
        </div>
        </el-col>
        <el-col :span="6"><div class="grid-content">
          分期名称
        </div>
        </el-col>
        <el-col :span="6" class="borderRight"><div class="grid-content">
          <span>{{teamBaseInfo.BaseInfo.StageName}}</span>
        </div>
        </el-col>
      </el-row>
    </div>
    <div class="content">
      <el-form label-width="140px" class="demo-ruleForm" id="form">
        <el-form-item :required="Boolean(item.Req)" :label="item.jobName" v-for="(item,index) in teamBaseInfo.projectTeamJobList" :key="index">
          <el-input v-model="item.UserNames" :value="item.jobId" :readonly="true" suffix-icon="el-icon-edit-outline" @click.native="setting(item)"></el-input>
        </el-form-item>
      </el-form>
    </div>
    <div id="dialog">
      <el-dialog title="选择人员" :visible.sync="dialogVisible" width="50%" :before-close="handleClose" :close-on-click-modal="isClose">
        <div class="select">
          <div class="left">

            <div class="blank">
               <el-input placeholder="输入关键字过滤" v-model="filterText">
               </el-input>
            </div>
            <el-tree class="filter-tree" node-key="id" :data="orgUsers" :props="defaultProps" :filter-node-method="filterNode" ref="tree" @node-click="nodeClick">
            </el-tree>
          </div>
          <div class="right">
            <div class="">
              <el-button class="del-btn" size="mini" @click="deleteUser">移除</el-button>
            </div>
            <ul>
              <li v-for="(persion,index) in persions" :key="index" @click="show(persion)">
                <span v-text="persion.UserNames" ></span>
              </li>
            </ul>
          </div>
        </div>
        <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="confirm">确 定</el-button>
      </span>
      </el-dialog>
    </div>
  </div>
</template>
<script>
  import {mapState, mapGetters, mapActions} from 'vuex';
  import ElButton from "../../../node_modules/element-ui/packages/button/src/button";
  import {message, fetchUtils} from '../../utils';
  import './team.less'
  export default {
    components: {ElButton},
    name: "Team",
    data: function () {
      return {
        jobId: '',
        isClose: false, // 禁止点击事件关闭弹窗
        dialogVisible: false, // 弹窗初始化状态
        persions:[],
        inputId:'',
        save_show: true,
        filterText: '',
        defaultProps: {
          children: 'Children',
          label: 'name'
        },
        data: [
        ],
      };
    },
    created: function () {
       this.checkStageid()
      //  this.getOrgUsers()  
    },
    computed: {
      ...mapGetters(['teamBaseInfo','orgUsers']),

    },
    methods: {
      ...mapActions(['getTeamBaseInfo','getOrgUsers','settingCurrentUser','saveTeamBaseInfo','initTree','clearInfo']),
      // 文本框点击事件
      setting (item) {
        this.inputId = this.jobId = item.jobId ;
        let self = this
        if(item.UserNames){
          let names = item.UserNames.split(',')
          let ids = item.UserIds.split(',')
          names.forEach(function (sub,index) {
            self.persions.push({jobId:item.jobId,UserNames:sub,UserIds:ids[index]})
          })
        }
        this.dialogVisible = true
      },
      // 关闭弹框 初始化相关状态
      handleClose () {
        this.persions = []
        this.dialogVisible = false
      },
      // 确认 相关操作
      confirm () {
        if(this.persions.length>0) {
          this.settingCurrentUser({data:this.persions,isDel:false})
        }
        this.persions = []
        this.dialogVisible = false
      },
      // 移除操作
      deleteUser () {
        this.persions = []
        this.settingCurrentUser({data:this.jobId,isDel:true})
      },
      filterNode(value, data) {
        if (!value) return true;
        return data.name.indexOf(value) !== -1;
      },
      // 节点的选中事件
      nodeClick (data,node,dom) {
        // alert()
          let self = this
          if(node.isLeaf && data.datatype == 2){
            if(JSON.stringify(self.persions).indexOf(JSON.stringify({jobId:self.inputId,UserNames:data.name,UserIds:data.pid})) ==-1){
              self.persions.push({jobId:self.inputId,UserNames:data.name,UserIds:data.pid})
            }
          }
      },
      save () {
        this.saveTeamBaseInfo({vm:this})
      },
      checkStageid() {
         this.getOrgUsers()           
         let stageid = sessionStorage.getItem('aaaaa')
        //  alert(stageid)
         if (!stageid || stageid == ''){
            // this.save_show = false
            this.$message({
              message: '请选择分期!',
              type: 'warning'
            });
         } else {
            // this.save_show = true
            this.getTeamBaseInfo() // 获取初始化数据
         }
      },
      show(persion){
        // alert()
      //   console.info(this.persions)
      //   console.info(persion)
      }
    },
    watch: {
      filterText(val) {
        this.$refs.tree.filter(val);
      }
    },
    destroyed: function() {           
    //  console.log('销毁后')
     sessionStorage.setItem('aaaaa','')
     this.$store.dispatch("clearInfo",'')
    //  console.info(sessionStorage.getItem('aaaaa'))
    }   
  }
</script>

<style scoped>
#team .header {
  margin-top: 20px;
  margin-right: 10px;
  color: #666;
  font-size: 12px;
  font-weight: 700;
}
#team .header .el-row {
  height: 36px;
  line-height: 36px;
  border: 1px solid #666;
}
#team .header .el-col:nth-child(2n+1) {
  text-align: center;
}
#team .header .el-col:nth-child(2n) {
  padding-left: 10px;
}
#team .header .borderTop {
  border-top: none;
}
#team .header .el-col {
  border-right: 1px solid #666;
}
#team .header .borderRight {
  border-right: none;
}
#team .content {
  margin-top: 20px;
  width: 100%;
}
#form .el-form-item {
  float: left;
  width: 50%;
}
#dialog .select {
  display: inline-block;
  width: 100%;
  box-sizing: border-box;
  height: 300px;

}
#dialog .left {
  /* border: 1px solid #000; */
  display: block;
  float: left;
  width: 45%;
  height: 100%;
  padding:10px;
}
#dialog .right {
  /* border: 1px solid #000; */
  float: right;
  display: block;
  width: 45%;
  height:  100%;

}

.left>.el-tree{
  border:solid 1px #ddd;
  height: 85%;
  overflow:auto
}
.right{
  padding:10px;
}
.right>ul{
  border:solid 1px #ddd;
  height: 85%;
  overflow:auto
}
.blank{
  height: 27px;
  padding-bottom: 5px;
}
.right>div{
  padding-bottom: 5px;
}
.el-dialog__body {
  padding: 0 20px 20px 20px ;
}
.save_btn{
  width: 10%;
  float: right;
}
.el-button{
  border:none;
  font-size:14px;
}
.el-button:hover {
  color: #409EFF;
  border-color: transparent;
  background-color: #fff;
}
.title{
  height:30px;
  padding-top: 20px;
  font-size: 16px;
  border-bottom: solid 1px #F4F6F9;;
}
.team-title{
  float: left;
  font-size: 16px;
  border-bottom: 2px solid rgb(68, 120, 232);
  padding-bottom: 5px;
}
.el-row{
  font-size:13px;
}
#form>.font>.el-form-item__label{
  font-size:13px !important;
}
</style>
