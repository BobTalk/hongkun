<template>
  <div class="flow">
    <el-tabs v-model="currentActive" type="card" @tab-click="handleCardClick" size="mini">
      <el-tab-pane name="first">
        <span slot="label" class="spanCard">流程审批</span>
        <div class="currentTitle">
          <span class="currentFlowName">审批流程</span>
          <span v-text="currentTitle"></span>
        </div>
        <div class="currentText">
          <div class="bz">
            备注
          </div>
          <div class="nr">
            <el-input type="textarea"  placeholder="请输入备注内容" :rows="4" resize="none">
            </el-input>
          </div>
        </div>
        <div class="currentText2">
          <div class="lcsp2">
            审批流程
          </div>
          <div class="nr2">
            发起人【魏德勇】-> 项目负责人【魏德勇】
          </div>
        </div>
        <div class="btn">
          <el-button type="primary" size="mini">提交</el-button>
          <el-button type="primary" size="mini" @click="returnRoute">取消</el-button>
        </div>
        <div class="tabs">
          <el-table :data="tableData" style="width: 100%" stripe border>
            <el-table-column
              prop="date"
              label="节点"
              width="180">
            </el-table-column>
            <el-table-column
              prop="name"
              label="意见"
              width="180">
            </el-table-column>
            <el-table-column
              prop="address"
              label="操作人">
            </el-table-column>
            <el-table-column
              prop="address"
              label="操作时间">
            </el-table-column>
            <el-table-column
              prop="address"
              label="操作">
            </el-table-column>
          </el-table>
        </div>
      </el-tab-pane>
      <el-tab-pane name="second">
        <span slot="label" class="spanCard">面积管理</span>
        <div class="tabsShow">
          <el-table :data="buildingInfoData.areadataInfo" stripe border height="510" style="width: 100%"  align="center">
            <div v-for="title in buildingInfoData.titleInfo" :key="title.name" class="tabTitle">
              <div v-if="title.name == '业态/楼栋'">
                <el-table-column fixed="left" :prop="title.field" :label="title.name" width="150">
                </el-table-column>
              </div>
              <div v-else>
                <el-table-column v-if="!title.children"  :prop="title.field" :label="title.name" width="150">
                </el-table-column>
                <el-table-column :label="title.name"  v-else >
                  <el-table-column :prop="subTitle.field" :label="subTitle.name"  :width="subTitle.width" v-for="subTitle in title.children" :key="subTitle.name" width="150"></el-table-column>
                </el-table-column>
              </div>
            </div>
          </el-table>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
  import {mapState, mapGetters, mapActions} from 'vuex';
    export default {
        name: "to-examine",
        data() {
          return {
            currentActive: 'first',
            currentTitle: '环渤海区域石家庄公司zrt-报表先项目再分期一期价格审批',
            tableData: [{
              date: '节点',
              name: '意见',
              address: '操作人'
            }],
            tableData: [{
              date: '2016-05-02',
              name: '王小虎',
              address: '上海市普陀区金沙江路 1518 弄'
            }, {
              date: '2016-05-04',
              name: '王小虎',
              address: '上海市普陀区金沙江路 1517 弄'
            }, {
              date: '2016-05-01',
              name: '王小虎',
              address: '上海市普陀区金沙江路 1519 弄'
            }, {
              date: '2016-05-03',
              name: '王小虎',
              address: '上海市普陀区金沙江路 1516 弄'
            }]
          };
        },
        computed: {
          ...mapGetters([
            'buildingInfoData',
          ]),
        },
        methods: {
          ...mapActions(['getBuilding']),
          handleCardClick () {
              if (this.currentActive == 'second') {
//                this.getBuilding()
              }
          },
          returnRoute () {
            this.$router.push(localStorage.getItem('router'))
          }
        },
    }
</script>

<style scoped>
.currentTitle {
  height: 30px;
  border-bottom: 1px solid #000;
}
  .currentTitle span {
    display: inline-block;
    height: 30px;
    line-height: 30px;
    font-size: 14px;
    float: left;
    margin-right: 10px;
  }
  .currentFlowName {
    font-size: 16px;
    font-weight: 700;
    border-bottom: 2px solid #000;
  }
  .currentText {
    height: 95px;
    margin-top: 5px;
  }
.currentText .bz {
  display: inline-block;
  float: left;
  line-height: 95px;
  width: 150px;
  text-align: center;
  font-size: 12px;
  color: #5b5b5b;
  background-color: #f5f5f5;
  border: 1px solid #ddd;
}
.currentText .nr {
  display: inline-block;
  float: left;
  width: 800px;
  height: 95px;
  border: 1px solid #ddd;
}
currentText2 {
  height: 38px;
}
.currentText2 .lcsp2 {
  margin-top: 20px;
  display: inline-block;
  float: left;
  line-height: 38px;
  width: 150px;
  text-align: center;
  font-size: 12px;
  color: #5b5b5b;
  background-color: #f5f5f5;
  border: 1px solid #ddd;
}
.currentText2 .nr2 {
  margin-top: 20px;
  display: inline-block;
  float: left;
  width: 790px;
  height: 38px;
  border: 1px solid #ddd;
  border-radius: 0;
  line-height: 38px;
  text-align: left;
  padding-left: 11px;
}
  .btn .el-button{
    margin-top: 30px;
    background-color: #0b4082;
    color: #ffffff;
  }
.btn .el-button:hover {
   background-color: #f1a118;
  }
.tabs {
  width: 950px;
  margin-top: 20px;
  text-align: center;
}
.flow {
  padding-top: 10px;
}
.spanCard {
  font-size: 12px;
}
.tabsShow {
  width: 100%;
  margin-top: 20px;
}
</style>
