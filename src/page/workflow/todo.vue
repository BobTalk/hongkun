<template>
  <div class="workflow">
    <el-table
      :data="tableData"
      border
      style="width: 100%">
      <el-table-column
        prop="flowtypeid"
        label="编号"
        width="100">
        <template slot-scope="scope">
          {{scope.$index + 1}}
        </template>
      </el-table-column>
      <el-table-column
        prop="flowtypename"
        label="审批类型"
        width="300">
      </el-table-column>
      <el-table-column
        prop="worktitle"
        label="审批内容">
            <template slot-scope="scope">
              <el-button @click="handleClick(scope.row.RUNTRECORDID, scope.row.ENTIID)" type="text" size="small">{{scope.row.worktitle}}</el-button>
            </template>
      </el-table-column>
      <el-table-column
        prop="SubmitUserName"
        label="提交人"
        width="200">
      </el-table-column>  
      <el-table-column
        prop="runduration"
        label="审批时间"
        width="200">    
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
    name: "Todo",
    data() {
      return {
        currentPage: 1,
        pageSize: 10,
        tableData: [],
        totalItems: 0
      };
    },
    methods: {
      handleClick(dataKey, entiId) {
        this.$router.push({name: 'approval', query: {dataKey, entiId, buttonState: 1}})
      },
      handleCurrentChange(page){
        this.currentPage = page;
        this.getInitData();
      },
      getInitData(){
        const userId = JSON.parse(localStorage.getItem('userInfo'))['userId'];
        fetchUtils.post(`/MyTodo/IGetMytodo/?page=${this.currentPage}&size=${this.pageSize}&userId=${userId}`)
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
    created(){
      this.getInitData()
    }
  };
</script>

<style>
  .workflow .el-table th {
    background-color: #eef1f6; 
  }
  .workflow .el-table td {
    padding: 2px 0
  }
  .workflow .page-container {
    display: flex;
    margin-top: 10px;
    justify-content: flex-end;
  }
</style>
