<template>
  <div class="workflow">
    <el-table
      :data="tableData"
      border
      style="width: 100%">
      <el-table-column
        prop=""
        label="序号"
        width="80">
        <template slot-scope="scope">
          {{scope.$index + 1}}
        </template>
      </el-table-column>
      <el-table-column
        prop="entiname"
        label="审批类型"
        width="150">
      </el-table-column>
      <el-table-column
        prop="workflowtitle"
        label="审批内容">
            <template slot-scope="scope">
              <el-button @click="handleClick(scope.row.runtrecordid, scope.row.entiid)" type="text" size="small">{{scope.row.workflowtitle}}</el-button>
            </template>
      </el-table-column>  
      <el-table-column
        prop="submitusername"
        label="提交人"
        width="120">
      </el-table-column>
      <el-table-column
        prop="submitdatetime"
        label="提交时间"
        width="180">    
      </el-table-column> 
      <el-table-column
        prop="ApprovedDateTime"
        label="审批时间"
        width="180">    
      </el-table-column>  
      <el-table-column
        prop="runstate"
        label="审批状态"
        width="120">    
          <template slot-scope="scope">
            <div v-if="scope.row.runstate === 'Completed'"><i class="el-icon-success apply-success"></i><span>&ensp;审批通过</span></div>
            <div v-else-if="scope.row.runstate === 'Running'"><i class="el-icon-info apply-on"></i><span>&ensp;审批中</span></div>
            <div v-else><i class="el-icon-error apply-reject"></i><span>&ensp;已驳回</span></div>
          </template>
      </el-table-column>  
    </el-table>
    <div class="page-container">
      <el-pagination
        background
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        layout="total, prev, pager, next, jumper"
        :total="totalItems">
      </el-pagination>
    </div>
  </div>
</template>

<script>
import { fetchUtils, message } from '@/utils';
export default {
  name: "History",
  data() {
    return {
      currentPage: 1,
      totalItems: 0,
      pageSize: 10,
      tableData: []
    };
  },
  methods: {
      handleClick(dataKey, entiId) {
        this.$router.push({name: 'approval', query: {dataKey, entiId, buttonState: 2}})
      },
      handleCurrentChange(page){
        this.currentPage = page;
        this.getInitData();
      },
      getInitData(){
        const userId = JSON.parse(localStorage.getItem('userInfo'))['userId'];
        fetchUtils.post(`/MyTodo/IGetmyGetTaskDone?page=${this.currentPage}&size=${this.pageSize}&userId=${userId}`)
          .then( res => {
              this.tableData = res.rows.Items;
              this.currentPage = res.rows.CurrentPage;
              this.totalItems = res.rows.TotalItems;
          }).catch( err => {
            message.error(err);
          });
        //this.$store.dispatch("commonSetWorkNumber");
      }
  },
  filters: {
    draftTypeFilter(type) {
      console.log(type);
      const typeConfig = ["", "项目", "分期"];
      return typeConfig[type] || " ";
    }
  },
  created(){
    this.getInitData();
  }
};
</script>

<style>
.workflow .el-table th {
  background-color: #eef1f6;
}
.workflow .el-table td {
  padding: 2px 0;
}
.workflow .page-container {
  display: flex;
  margin-top: 10px;
  justify-content: flex-end;
}
.workflow .apply-success {
  color: #67c23a;
  font-size: 14px;
}
.workflow .apply-reject {
  color: #f56c6c;
  font-size: 14px;
}
.workflow .apply-on {
  color: #e6a23c;
  font-size: 14px;
}
</style>
