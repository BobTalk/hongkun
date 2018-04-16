<template>
  <div class="title" style="margin-top:60px;" id="priceBox">
    <div class="indentity-title clear">
      <span id="tt">价格管理</span>
      <span class="btn" style="margin-left: 10px;">
        <span>状态:</span>
        <span>{{this.price_CurrentVersionText}}</span>
      </span>
      <span class="btn">
        <span style="color: rgb(76, 170, 244); font-weight: normal; margin-right: 5px;"> 当前版本:</span>
        <el-select :value="price_CurrentVersionState" placeholder="请选择" @change="setVersion">
        <el-option
          v-for="item in price_VersionListByBusinessldData"
          :key="item.versionId"
          :label="item.showName"
          :value="item.versionId">
        </el-option>
      </el-select>
      </span>
      <span class="btn price_version" v-if="isSave && commonPathRoleAuthority.indexOf('btn_approval') > -1" @click ="flow">
        <i data-v-1c984fcc=""  class="el-icon-plus"></i>
        发起审批
      </span>
      <span class="btn price_save" @click="del"  v-if="btn[3] && commonPathRoleAuthority.indexOf('btn_delete') > -1">
        <i data-v-1c984fcc="" class="el-icon-delete"></i>
        删除
      </span>
      <span class="btn price_save" @click="save" v-if="btn[1] && (commonPathRoleAuthority.indexOf('btn_edit') > -1 || commonPathRoleAuthority.indexOf('btn_add') > -1 )">
        <i data-v-1c984fcc="" class="el-icon-tickets"></i>
        保存
      </span>
      <span class="btn price_version" @click="createVersionClick" v-if="btn[0] && commonPathRoleAuthority.indexOf('btn_add') > -1">
        <i data-v-1c984fcc="" class="el-icon-plus"></i>
        生成新版本
      </span>
      <span class="btn price_version" @click="pase" v-if="isSB && this.price_HightCurrentVersion == this.price_CurrentVersionState && commonPathRoleAuthority.indexOf('btn_edit') > -1">
        <i data-v-1c984fcc="" class="el-icon-plus"></i>
        升版
      </span>
    </div>
    <div class="highlight-button" style="margin-left: 20px;">
      <ul>
        <li><i class="legend-white"></i>未编制</li>
        <li><i class="legend-blue"></i>编制中</li>
        <li><i class="legend-yellow"></i>审批中</li>
        <li><i class="legend-green"></i>审批通过</li>
      </ul>
    </div>
    <div id="crumbs">
      <ul class="clear">
        <li v-for="(item,index) in price_StageData" :key="index" @click="clickStage(item)">
          <i :class="item.className"></i>
          <a href="#" :class="((price_CurrentStep == item.guid) && (item.guid != '5'))?'apply': ((price_CurrentStep == item.guid) && (item.guid == '5'))?'apply_':' '">{{item.name}}</a>
        </li>
      </ul>
    </div>
    <div class="tabs" id="priceContext">
      <el-table :data="((step == 'Vote')?(VoteData) : (UnVoteData))" stripe border style="width: 100%" align="center"
                height="300" :row-class-name="tableRowClassName">
        <div v-for="title in price_ListData.title" :key="title.name" class="tabTitle">
          <div v-if="title.field != 'GROUPID' &&  title.field != 'BATCHID'">
            <div v-if="title.name == '业态/楼栋' || title.name == '业态'">
              <el-table-column fixed="left" :prop="title.field" :label="title.name" width="280">
              </el-table-column>
            </div>
            <div v-else>
              <div v-if="title.name != 'KEY'">
                <div v-if="title.field == 'AVERAGEPRICE'">
                  <el-table-column :label="title.name" :prop="title.field" width="200">
                    <template slot-scope="scope">
                      <div v-if="scope.row.LEVELS =='1'">{{scope.row[title.field]}}</div>
                      <el-input-number v-else v-model="scope.row[title.field]" type="text" size="small"
                                       :controls="iscontrols"   :disabled="isEdit"   @blur="changeNumber($event,scope.row,title.field)"
                                       ></el-input-number>
                    </template>
                  </el-table-column>
                </div>
                <div v-else>
                  <div v-if="title.field == 'PRICE'">
                    <el-table-column :label="title.name" :prop="title.field" width="200">
                      <template slot-scope="scope">
                        <span class="formatClass">{{setFormatNumber(scope.row[title.field].toString())}}</span>
                      </template>
                    </el-table-column>
                  </div>
                  <div v-else>
                    <el-table-column :label="title.name" :prop="title.field" width="200">
                    </el-table-column>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </el-table>
    </div>
  </div>
</template>
<script>
  import {mapState, mapGetters, mapActions} from 'vuex';
  import "./price.less"
  export default {
    name: "Price",
    data: function () {
      return {
        isSave: false,
        iscontrols: false,
        areaCurrentVersion: sessionStorage.getItem('currentVersion'),
        stepType: 'price',
        stageId: sessionStorage.getItem('aaaaa'),
        stageversionid: '',
        currentStep: '', // 当前面包屑状态
        btn: [true, false,false,false,false],
        isEdit: false,
        step: 'Vote',
        stepId: 1,
        dataType: 'Price',
        projectLevel: 'Stage',
        isSB: false,
      };
    },
    created () {
      let self = this
      // 获取价格分期版本列表
      this.initState()
      this.price_GetStageData({stepType: this.stepType, stageID: this.stageId})
      window.setTimeout(function () {
        self.price_GetVersionListByBusinessldData({stageId: self.stageId, step: self.stepId, vm: self}) // 根据分期版本ID
      },1000)
      window.setTimeout(function (){
        self.price_GetPrice({priceVersionId: self.price_CurrentVersionState});
      },1500)

    },
    computed: {
      ...mapGetters(['price_HightCurrentVersion','price_SendReq','price_CurrentStep', 'price_VersionListByBusinessldData', 'price_CurrentVersionState', 'price_CurrentVersionText', 'price_StageData', 'price_ListData', 'commonPathRoleAuthority']),
      VoteData: function () {
        let voteData = this.price_ListData.rowVoteData
        if (voteData && voteData.length > 0) {
          voteData.forEach(function (item) {
            if(!isNaN(Number(item.AVERAGEPRICE))) {
              item.TOTALRENTALSALEAREA = parseFloat(item.TOTALRENTALSALEAREA).toFixed(0)
              item.PRICE = parseFloat((parseFloat(item.TOTALRENTALSALEAREA) * parseFloat(item.AVERAGEPRICE)) / 10000).toFixed(0)
            }
          })
        } else {
          voteData = []
        }
        return voteData
      },
      UnVoteData: function () {
        let unVoteData = this.price_ListData.rowUnVoteData, obj
        if (unVoteData && unVoteData.length > 0) {
          unVoteData.forEach(function (item) {
              if(!isNaN(Number(item.AVERAGEPRICE))){
                if (item.LEVELS != 1) {
                item.PRICE = parseFloat((parseFloat(item.TOTALRENTALSALEAREA) * parseFloat(item.AVERAGEPRICE)) / 10000).toFixed(0)
                  if (item.viewParentId == obj.KEY) {
                    obj.PRICE += parseFloat(item.PRICE)
                  }
                } else {
                item.AVERAGEPRICE = parseFloat(parseFloat(item.PRICE) * 10000 / parseFloat(item.TOTALRENTALSALEAREA)).toFixed(0)
                  item.AVERAGEPRICE = isNaN(item.AVERAGEPRICE) ? 0 : item.AVERAGEPRICE
                  obj = item
                  obj.PRICE = 0
                }
              }
          })
        } else {
          unVoteData = []
        }
        return unVoteData
      }
    },
    methods: {
      ...mapActions(['price_SetCurrentMenu','price_deleteVersion','setUpgrade', 'initState', 'price_CreateVersion', 'price_GetVersionListByBusinessldData', 'price_SetVersion', 'price_GetStageData', 'price_GetPrice', 'price_SavePrice']),
      setFormatNumber (arg) {
        var re=/\d{1,3}(?=(\d{3})+$)/g;
        var num=arg.replace(/^(\d+)((\.\d+)?)$/,function(s,s1,s2){return s1.replace(re,"$&,")+s2;});
        return num
      },
      setVersion (value) {
        let self = this
        this.price_SetVersion(value);
        this.price_GetStageData({stepType: this.stepType, stageID: this.stageId})
        this.price_GetPrice({priceVersionId: value});
      },
      // 面包屑点击事件
      clickStage (item) {
        this.initState()
        this.step = item.code
        this.stepId = item.guid
        this.isSave = false
        this.price_GetVersionListByBusinessldData({stageId: this.stageId, step: this.stepId, vm: this})
//        this.price_SetCurrentMenu({stageId: this.stageId, step: this.stepId})
      },
      // 创建新版本
      createVersionClick () {
        let self = this
        this.price_CreateVersion({stageId: this.stageId, step: this.stepId, vm: this}) // 面积版本ID
        window.setTimeout(function () {
          self.price_GetVersionListByBusinessldData({stageId: self.stageId, step: self.stepId, vm: self})
        },2000)

      },
      // 发起审批操作
      flow () {
        let size = this.price_VersionListByBusinessldData.length,self  = this
        let _data = {
          entiId: '10104',
          dataKey: this.price_CurrentVersionState
        }
        this.$store.dispatch("commonIsFirstApproval")
          .then(res => {
            if (res.rows.length === 1 && res.rows[0].versionStatus === '0') {
            }
          }).then(res => {
          return this.$store.dispatch("commonStartApproval", _data);
        }).then(res => {
          this.$message.success("提交审批成功");
          this.getStageVersion({nodeId: this.nodeId});
        }).catch(err => {
          this.$message.error(err);
        })
        window.setTimeout(function () {
          self.price_GetStageData({stepType: self.stepType, stageID: self.stageId})
          self.price_GetVersionListByBusinessldData({stageId: self.stageId, step: self.stepId, vm: self})
        },1500)
        this.isSave = false
      },
      // 当前版本保存操作
      save () {
          let self = this
        this.price_SavePrice({step: this.step, versionId: this.price_CurrentVersionState, vm: this})
        window.setTimeout(function (){
          self.price_GetPrice({priceVersionId: self.price_CurrentVersionState});
        },1000)
        this.isSave = true
      },
      // 删除当前版本操作
      del () {
        let self = this
        self.$confirm('您确定要删除当前价格版本吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          self.isSave = false
          self.price_deleteVersion({versionId: self.price_CurrentVersionState,vm: self})
          window.setTimeout(function () {
            self.initState()
            self.price_GetVersionListByBusinessldData({stageId: self.stageId, step: self.stepId, vm: self})

          },1000)
          window.setTimeout(function (){
            self.price_SetCurrentMenu({stageId: self.stageId,step:self.stepId})
          },1500)
        }).catch(() => {

        });
      },
      tableRowClassName ({row, rowIndex}) {
        let class_ = ''
        if( (row.ISMY == 1 && this.step == 'Startup') || (row.ISMY == 1 && this.step == 'Pricebudget')){
          if (row.LEVELS == 1) {
            class_ ='heightClass tableRowClass'
          }else {
            class_ ='heightClass'
          }
        }else {
          if (row.LEVELS == 1) {
            class_ ='tableRowClass'
          }else {
            class_ =' '
          }
        }
        return class_
      },
      // 升版本操作
      pase () {
        let self = this
        this.setUpgrade({versionId: this.price_CurrentVersionState, vm: this})
        window.setTimeout(function () {
          self.price_GetVersionListByBusinessldData({stageId: self.stageId, step: self.stepId, vm: self})
        },1000)
      },
      changeNumber (evt,row,attr) {
          let event = evt || window.event;
          if(isNaN(Number(event.target.value))){
            this.$message({
              message: '请输入数字',
              type: 'warning'
            });
            row.AVERAGEPRICE = 0
            return false
          }
        row.AVERAGEPRICE = Number(event.target.value).toFixed(0)
      },
      comdify  (n){
        var re=/\d{1,3}(?=(\d{3})+$)/g;
        var n1=n.replace(/^(\d+)((\.\d+)?)$/,function(s,s1,s2){return s1.replace(re,"$&,")+s2;});
        return n1;
      }
    },
    watch: {
      // 监听当前版本变化 及时同步状态到state中
      price_CurrentVersionState: function (oldHeightVersion, newHeightVersion) {
        this.setVersion(oldHeightVersion)
      },
      // 监听 状态 动态设置 按钮权限
      price_CurrentVersionText: function (oldBtn,newBtn) {
        switch (oldBtn){
          case '未编制':
            this.isSB = false
            this.isEdit = false
            this.btn = [true, false,false,false]
            break;
          case '编制中':
            this.isSB = false
            this.isEdit = false
            this.btn = [true, true,false,true]
            break;
          case '审批中':
            this.isSB = false
            this.isEdit = true
            this.btn = [false, false,false,false]
            break;
          case '审批通过':
            this.isEdit = true
            this.isSB = true
            this.btn = [false, false,false,false]
            break;
          case '驳回':
            this.isSB = false
            this.isEdit = false
            this.btn = [true, true,false,true]
            break;
          default:
        }
      },
    },
  }
</script>

<style scoped>
  .title span {
    line-height: 27px;
    display: block;
    float: left;
    height: 27px;
    font-size: 12px;
  }

  .top {
    margin-top: 5px;
    height: 50px;
  }

  .top-left {
    margin-top: 10px;
    float: left;
  }

  .top-left li {
    float: left;
    font-size: 12px;
    margin-left: 5px;
  }

  .top-right {
    margin-top: 5px;
    float: right;
  }

  .circle {
    display: inline-block;
    width: 15px;
    height: 15px;
    line-height: 15px;
    font-size: 12px;
    margin-right: 2px;
    border-radius: 50%;
    -moz-border-radius: 50%;
    -webkit-border-radius: 50%;
    border: #ccc solid 1px;
  }

  .top-left span {
    height: 21px;
    line-height: 21px;
  }

  .one {
    background-color: #fff;
  }

  .two {
    background-color: #2979ff;
  }

  .three {
    background-color: #FFFF00;
  }

  .four {
    background-color: #00e676;
  }

  .el-button {
    font-size: 12px;
    float: left;
  }

  .el-select {
    width: 100px;
  }

  .tabs {
    margin-top: 15px;
  }

  .separator {
    position: relative;
    left: 260px;
    top: 100px;
    float: left;
  }

  .legend-white{
    background: #fff!important;
    border:1px solid #ccc;
  }
  .legend-blue {
    background: #2979ff!important;
    border:1px solid #ccc;
  }
  .legend-yellow {
    background: #FFFF00!important;
    border:1px solid #ccc;
  }
  .legend-green {
    background: #00e676!important;
    border:1px solid #ccc;
  }

  #crumbs {
    margin-top: 5px;
  }

  #crumbs ul li {
    position: relative;
    display: inline-block;
    height: 30px;
    line-height: 30px;
    margin-top: 1px;
    margin-left: 2px;
    float: left;
    padding: 0 3px;
  }
  #crumbs ul li:last-child{
    float: right;
  }

  #crumbs ul li a {
    display: block;
    float: left;
    min-width: 95px;
    height: 30px;
    line-height: 30px;
    background: #4c72a4;
    text-align: center;
    position: relative;
    padding: 0 20px 0 40px;
    text-decoration: none;
    color: #fff;
    font-size: 12px;
    box-sizing: border-box;
  }
  #crumbs ul li .active.back-yellow {
    background: yellow;
  }

  #crumbs ul li .active {
    position: absolute;
    width: 14px;
    height: 14px;
    background: #fff;
    top: 50%;
    left: 40px;
    transform: translate(-18px, -50%);
    z-index: 4;
    border-radius: 50%;
  }

  #crumbs ul li:not(:last-child) a:after {
    content: "";
    border-top: 15px solid transparent;
    border-bottom: 15px solid transparent;
    border-left: 15px solid #4c72a4;
    position: absolute;
    right: -15px;
    top: 0;
    z-index: 5;
  }

  #crumbs ul li:not(:last-child) a:before {
    content: "";
    border-top: 15px solid transparent;
    border-bottom: 15px solid transparent;
    border-left: 15px solid #fff;
    position: absolute;
    left: 0;
    top: 0;
  }
  #crumbs ul li:last-child a:after {
    content: "";
    border-top: 15px solid transparent;
    border-bottom: 15px solid transparent;
    border-right: 15px solid #4c72a4;
    position: absolute;
    left: -15px;
    top: 0;
    z-index: 5;
  }

  #crumbs ul li:last-child a:before {
    content: "";
    border-top: 15px solid transparent;
    border-bottom: 15px solid transparent;
    border-right: 15px solid #fff;
    position: absolute;
    left: 0;
    top: 0;
  }
  #crumbs ul li:first-child a:before {
    display: none;
  }

  #crumbs ul li:not(:last-child) a:hover {
    background: #f1a118;
  }

  #crumbs ul li:not(:last-child) a:hover:after {
    border-left-color: #f1a118;
  }
  #crumbs ul li:last-child a:hover {
    background: #f1a118;
  }

  #crumbs ul li:last-child a:hover:after {
    border-right-color: #f1a118;
  }


  #crumbs ul li:last-child a:before {
    display: none;
  }
  #tabss .readonlyBorder .el-input__inner {
    border: none;
  }

  .indentity-title {
    color: #000;
    text-align: left;
    font-weight: 400;
    box-sizing: border-box;
    border-bottom: 2px solid #F4F6F9;
    width: 100%;
    height: 36px;
    line-height: 36px;
    border-bottom: 2px solid #F4F6F9;
    box-sizing: border-box;
    /*position: relative;*/
    top: 7px;
  }

  .indentity-title .btn {
    display: inline-block;
    float: right;
    padding-right: 10px;
    cursor: pointer;
    font-size: 12px;
    font-weight: 400;
  }

  .version {
    display: block;
    float: right;
  }

  #tt {
    font-size: 15px;
    font-weight: normal;
    border-bottom: 2px solid rgb(68, 120, 232);
    line-height: 25px;
    height: 30px;
    color: #000;
    text-align: left;
    position: relative;
    bottom: -3px;
  }

  .apply {
    background: #f1a118 !important;

  }

  .apply:after{
    border-left: 15px solid #f1a118 !important;
  }
  .apply_ {
    background: #f1a118 !important;
  }
  .apply_:after{
    border-right: 15px solid #f1a118 !important;
  }
  #priceContext .formatClass{
    display: table-cell;
    text-align: center;
    float: right;
  }
</style>
