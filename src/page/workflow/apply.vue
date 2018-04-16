<template>
  <div class="workflow">
    <el-table
      :data="tableData"
      border
      style="width: 100%">
      <el-table-column
        prop="id"
        label="序号"
        width="100">
      </el-table-column>
      <el-table-column
        prop="type"
        label="审批类型"
        width="200">
      </el-table-column>
      <el-table-column
        prop="content"
        label="审批内容">
            <template slot-scope="scope">
              <el-button @click="handleClick(scope.row.id)" type="text" size="small">{{scope.row.content}}</el-button>
            </template>
      </el-table-column>
      <el-table-column
        prop="time"
        label="提交时间"
        width="150">
      </el-table-column>
      <el-table-column
        prop="approval_type"
        label="审批状态"
        width="150">
          <template slot-scope="scope">
            <div v-if="scope.row.approval_type === 1"><i class="el-icon-success apply-success"></i><span>&ensp;审批通过</span></div>
            <div v-else-if="scope.row.approval_type === 2"><i class="el-icon-info apply-on"></i><span>&ensp;审批中</span></div>
            <div v-else><i class="el-icon-error apply-reject"></i><span>&ensp;审批失败</span></div>
          </template>
      </el-table-column>
      <el-table-column
        prop="now_point"
        label="当前节点"
        width="100">
      </el-table-column>
      <el-table-column
        prop="name"
        label="当前审批人"
        width="100">
      </el-table-column>
    </el-table>
    <div class="page-container">
      <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        layout="total, prev, pager, next, jumper"
        :total="400">
      </el-pagination>
    </div>
  </div>
</template>

<script>
  export default {
    name: "Apply",
    data() {
      return {
        currentPage: 1,
        tableData: [
          {
            id: "20",
            type: "xsdsad-d重要文件",
            content: "环渤海区域天津公司天津威尔四期",
            name: "王小虎",
            time: "2018-10-23",
            approval_type: 1,
            now_point: "节点1",
            name: "张三"
          },
          {
            id: "20",
            type: "xsdsad-d重要文件",
            content: "环渤海区域天津公司天津威尔四期",
            name: "王小虎",
            time: "2018-10-23",
            approval_type: 2,
            now_point: "节点1",
            name: "张三"
          },
          {
            id: "20",
            type: "xsdsad-d重要文件",
            content: "环渤海区域天津公司天津威尔四期",
            name: "王小虎",
            time: "2018-10-23",
            approval_type: 3,
            now_point: "节点1",
            name: "张三"
          },
        ]
      };
    },
    methods: {
      handleClick(id) {
//        console.log(id);
      },
      handleSizeChange(){

      },
      handleCurrentChange(){

      }
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
  .workflow .apply-success {
    color: #67C23A;
    font-size: 14px;
  }
  .workflow .apply-reject {
    color: #F56C6C;
    font-size: 14px;
  }
  .workflow .apply-on {
    color: #E6A23C;
    font-size: 14px;
  }
</style>
