<template>
  <div class="workflow-approval">
    <el-menu :default-active="activeIndex" class="approval-el-menu" mode="horizontal" @select="handleSelect">
      <el-menu-item index="1">流程审批</el-menu-item>
      <el-menu-item index="2">{{$route.query.entiId | pathFilter }}</el-menu-item>
    </el-menu>
    <div class="approval-operate">
      <p>流程审批&emsp;&emsp;{{approvalTitle}}</p>
      <table class="approval-table">
        <tr>
          <td class="table-title">审批流程</td>
          <td class="table-content" v-html="approvalContent"></td>
        </tr>
        <tr>
          <td class="table-title">备注</td>
          <td class="table-content">
            <el-input
              type="textarea"
              :rows="3"
              :autosize="{minRows: 3, maxRows: 3}"
              placeholder="请输入内容"
              v-model="textarea">
            </el-input>
          </td>
        </tr>
      </table>
      <div class="btn-container" v-show="btnState && $route.query.buttonState === 1">
        <el-button type="success" size="small" style="margin-right: 30px;" @click="operate(0)">通过</el-button>
        <el-button type="warning" size="small" @click="operate(1)">驳回</el-button>
      </div>
      <div class="btn-container" v-show="readState && $route.query.buttonState === 1">
        <el-button type="primary" size="small" @click="readNode">已阅读</el-button>
      </div>
      <el-table
        :data="tableData"
        border
        style="width: 100%"
        class="aproval_table">
        <el-table-column
          prop="FLOWNAME"
          label="节点"
          width="200">
        </el-table-column>
        <el-table-column
          prop="PROCESSCOMMENT"
          label="意见">
        </el-table-column>
         <el-table-column
          prop="EVENTUSERNAME"
          label="操作人"
          width="100">
        </el-table-column>
        <el-table-column
          prop="EVENTDATE"
          label="操作时间"
          width="200">
        </el-table-column>
        <el-table-column
          prop="TRACKINGEVENTTEXT"
          label="操作"
          width="100">
        </el-table-column>
      </el-table>
    </div>
    <Back></Back>
  </div>
</template>

<script>
  //审批流程 >> 审批
  import Back from '@/page/flowsub/public-component/back';
  import { fetchXml, message } from '@/utils';
  import fetchUtils from '../../utils/fetch-utils';
  export default {
    name: "Approval",
    data() {
      return {
        activeIndex: '1',
        activeIndex2: '1',
        approvalTitle: "",
        approvalContent: "",
        textarea: "",
        tableData:[],
        pathConfig: {
          "10102": "applicationUpVersion",
          "10103": "instalmentUpVersion",
          "10104": "priceUpVersion",
          "10105": "areaUpVersion",
          "10106": "costUpVersion",
          "10107": "supplyUpVersion",
          "10108": "signUpVersion",
          "10109": "returnMoneyUpVersion"
        },
        btnState: false,        //通过 驳回按钮显示状态
        readState: false,       //已阅按钮显示状态
        nowStateNode: "",
        hasRuning: false         //是否有running节点
      };
    },
    methods: {
      handleSelect(key) {
        if( key === '1') return;
        const query = this.$route.query
        const entiId = this.$route.query.entiId;
        const path = entiId && this.pathConfig[entiId];
        if( !path ) return;
        this.$router.push({name: path, query});
      },
      operate(id){
        const operateConfig = [{type: "success", title: "通过"}, {type: "warning", title: "驳回"}];
        this.$confirm(`是否确认${operateConfig[id].title}`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: operateConfig[id].type
        }).then(() => {
          const { entiId, dataKey } = this.$route.query;
          const data = {
            entiId,
            dataKey,
            delegateUserId: "0",
            comment: this.textarea
          }
          if( id === 0 ){
            return this.operatePass(data);
          }else{
            return this.operateReject(data)
          }
        }).then( res => {
          if( res.d.Message.indexOf("成功") === -1){
            return Promise.reject(res.d.Message);
          }
          this.$store.dispatch("commonSetWorkNumber");
          this.$message({
            type: 'success',//operateConfig[id].type,
            message: `${operateConfig[id].title}成功!`
          });
          setTimeout( () => {
            this.$router.go(-1);
          }, 500)
        }).catch( err => {
          if( err === "cancel") return;
          message.error( err );
        })
      },
      operatePass(data){
        //通过
        data = {
          ...data,
          userId: JSON.parse(localStorage.getItem('userInfo'))['userId'],
          files: []
        }
        return fetchXml.post('/iWorkflow/Workflow/api/WFServices.asmx/RunWorkflow2', data);
      },
      operateReject(data){
        //驳回
        data = {
          ...data,
          currentRuntFlowId: this.nowStateNode,   //当前节点
          backToRuntFlowId: "0",    //退回节点ID
          eventUserId: JSON.parse(localStorage.getItem('userInfo'))['userId'],          //用户操作ID
        };
        return fetchXml.post('/iWorkflow/Workflow/api/WFServices.asmx/BackToFlow', data)
      },
      getInitData(){
        const { entiId, dataKey } = this.$route.query;
        const allPromise = [
          fetchXml.post('/iWorkflow/Workflow/api/WFServices.asmx/LoadNodes', {entiId, dataKey})
            .then( res => {
              return res.d;
            }),
          fetchXml.post('/iWorkflow/Workflow/api/WFServices.asmx/GetFlowLog', {entiId, dataKey})
            .then( res => {
              return JSON.parse(res.d.Data);
            }),
          fetchUtils.post('/Common/IGetFlowWorkTitle', {entiId, dataKey})
            .then( res => {
              return res.rows;
            })
        ];
        fetchXml.all(allPromise)
          .then( ([approvalData, nodeData, title]) => {
            this.tableData = nodeData.Rows;
            let _html = "";
            const len = approvalData.length - 1;
            approvalData.forEach( (item, index) => {
              if( item.FlowStatus === "Running" ){
                _html += `<span class="current-node">${item.FlowName}【${item.Participants}】</span> -> `
                this.nowStateNode = item.FlowId;
                this.btnState = true;
              }else{
                if( !this.btnState && index===len ){
                  this.readState = true;
                  _html += `<span class="current-node">${item.FlowName}【${item.Participants}】</span> -> `
                }else{
                  _html += `${item.FlowName}【${item.Participants}】 -> `
                }
              }
            })
            this.approvalTitle = title;
            this.approvalContent = _html.slice(0, _html.length-3);
          })
      },
      readNode(){
        //已阅操作
        const { entiId, dataKey } = this.$route.query;
        const userId = JSON.parse(localStorage.getItem('userInfo'))['userId'];
        fetchXml.post('/iWorkflow/Workflow/api/WFServices.asmx/HaveRead',  {entiId, dataKey, userId})
          .then( res => {
            this.$store.dispatch("commonSetWorkNumber");  //重新获取顶部数据
            message.success("操作成功！");
            setTimeout( () => {
              this.$router.go(-1);
            }, 500)
          }).catch( err => {
            message.error( err );
          })
      },
    },
    filters: {
      pathFilter(type){
        const typeConfig = {
          "10101": "综合信息",
          "10102": "项目信息升级版本",
          "10103": "分期信息升级版本",
          "10104": "价格升级版本",
          "10105": "面积升级版本",
          "10106": "成本升级版本",
          "10107": "供货升级版本",
          "10108": "签约升级版本",
          "10109": "回款升级版本"
        }
        return typeConfig[type] || "";
      }
    },
    components: {
      Back
    },
    created(){
      this.getInitData();
    }
  }
</script>

<style lang="less" rel="stylesheet/less">
  .workflow-approval .el-menu-item {
    line-height: 30px;
    height: 30px;
  }
  .workflow-approval .approval-el-menu {
    border-bottom: 1px solid #e6e6e6 !important;
  }
  .workflow-approval .approval-operate > p {
    text-align: left;
    font-size: 14px;
    margin: 10px 0;
  }
  .workflow-approval .approval-table {
    width: 100%;
    td {
      padding: 10px;
      border: 1px solid #e6e6e6;
    }
    .table-title {
      background-color: #eef1f6;
      width: 150px;
    }
    .table-content {
      text-align: left;
    }
  }
  .workflow-approval .btn-container {
    margin: 10px;
    display: flex;
    justify-content: center;
  }
  .workflow-approval .el-table th {
    background-color: #eef1f6;
  }
  .current-node {
    color: #409EFF;
    cursor: pointer;
  }
  .aproval_table {
    margin-top: 30px;
  }
</style>
