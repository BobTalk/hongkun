<template>
  <el-table
    :data="Other"
    border
    style="width: 98%;white-space:nowrap;text-align:left;border:solid 1px #ebeef5;">
    <el-table-column
      prop="dicname"
      label="科目"
      align="left"  
      >
    </el-table-column>
    <el-table-column
      prop="startEdition"
      label="启动会版"
      >
      <template slot-scope="scope">
        <el-input-number class="month-pay"  size="mini" :min="0" :max="999999999" :controls="iscontrols"
 v-model="scope.row.startEdition" ></el-input-number>
      </template>
    </el-table-column>
    <el-table-column
      prop="lastBudgetary"
      
      label="最新预算版">
      <template slot-scope="scope">
        <el-input-number class="month-pay"  size="mini" :min="0" :max="999999999" :controls="iscontrols"
 v-model="scope.row.lastBudgetary"></el-input-number>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
import './cost.less'
    export default {
        name: "cost-other",
        props: ['Other'],
        data(){
          return {
            iscontrols:false
          }
        },
        mounted(){
        }
    }
</script>

<style scoped>
.month-pay{
  border: 1px solid #dcdfe6;
}
.el-table th, .el-table tr {
  padding: 10px 8px;
}
el-input-number{
  width: 100%;
  height: 100%;
  border:none;
  font-size:14px;
}
.el-input--mini>input{
  border:transparent !important;
}
.el-input input:focus {
    border: none !important;

}
.el-input.is-active .el-input__inner, .el-input__inner:focus {
    border-color: #fff !important;
    outline: 0;
}

</style>
