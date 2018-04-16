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
        label="草稿类型"
        width="120">
          <template slot-scope="scope">
             {{scope.row.type | draftTypeFilter}}
          </template>
      </el-table-column>
      <el-table-column
        prop="content"
        label="草稿内容">
            <template slot-scope="scope">
              <el-button @click="handleClick(scope.row.id)" type="text" size="small">{{scope.row.content}}</el-button>
            </template>
      </el-table-column>
      <el-table-column
        prop="time"
        label="保存时间"
        width="200">
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
  name: "Draft",
  data() {
    return {
      currentPage: 1,
      tableData: [
        {
          id: "20",
          type: 1,
          content: "环渤海区域天津公司天津威尔四期",
          time: "2018-10-23"
        },
        {
          id: "20",
          type: 2,
          content: "环渤海区域天津公司天津威尔四期",
          time: "2018-10-23"
        },
        {
          id: "20",
          type: 1,
          content: "环渤海区域天津公司天津威尔四期",
          time: "2018-10-23"
        }
      ]
    };
  },
  methods: {
    handleClick(id) {
//      console.log(id);
    },
    handleSizeChange() {},
    handleCurrentChange() {}
  },
  filters: {
    draftTypeFilter(type) {
//      console.log(type)
      const typeConfig = ["", "项目", "分期"];
      return typeConfig[type] || " ";
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
</style>
